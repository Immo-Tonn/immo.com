import axios from 'axios';
import { objectsFingerprint } from './fingerprint';
import { callDeployHook, clock, hasPendingRebuild, rebuildState } from './rebuildHook';

/**
 * Сверка «данные ↔ опубликованный сайт» — восстановление пропущенных обновлений.
 *
 * Событие (хук после сохранения объекта) может потеряться: перезапуск backend в паузе,
 * сбой хука, падение сборки Vercel, изменение объекта уже после того, как сборка
 * прочитала данные. Поэтому периодически (и при старте) сравниваем отпечаток текущих
 * данных с отпечатком в build-info.json на опубликованном сайте. Не совпало — сайт
 * отстаёт, запускаем сборку. Состояния «принято» и «опубликовано» различаются: сайт
 * считается обновлённым только когда отпечатки совпали.
 *
 * Включается только если заданы FRONTEND_DEPLOY_HOOK_URL и FRONTEND_BUILD_INFO_URL
 * (публичный адрес build-info.json боевого сайта). Без них — не работает.
 * Повторы ограничены: интервал растёт вдвое (cooldown × 2^n), после maxAttempts
 * запусков подряд без сходимости сверка останавливается до изменения данных.
 */
export const reconcileConfig = {
  intervalMs: Number(process.env.REBUILD_RECONCILE_INTERVAL_MS ?? 600_000),
  startupDelayMs: Number(process.env.REBUILD_RECONCILE_STARTUP_DELAY_MS ?? 60_000),
  cooldownMs: Number(process.env.REBUILD_RECONCILE_COOLDOWN_MS ?? 600_000),
  maxAttempts: Number(process.env.REBUILD_RECONCILE_MAX_ATTEMPTS ?? 5),
  maxCooldownFactor: 6,
  timeoutMs: 10_000,
};

export type ReconcileResult =
  | 'disabled'
  | 'api-unavailable'
  | 'site-unavailable'
  | 'in-sync'
  | 'pending-event'
  | 'waiting'
  | 'triggered'
  | 'trigger-failed'
  | 'stalled';

const state = {
  attempts: 0, // запусков по сверке с последней сходимости
  lastFingerprint: '' as string,
  awaitingPublish: false,
  stalledLogged: false,
  running: false,
};

export const __resetReconcilerState = () => {
  state.attempts = 0;
  state.lastFingerprint = '';
  state.awaitingPublish = false;
  state.stalledLogged = false;
  state.running = false;
};

const apiUrl = () =>
  process.env.REBUILD_RECONCILE_API_URL ??
  `http://127.0.0.1:${process.env.PORT || 3000}/api/objects`;

const short = (h: string | null) => (h ? h.slice(0, 8) : 'нет');

/** Одна сверка. `now` — для тестов. Не бросает. */
export const reconcileOnce = async (now = clock.now()): Promise<ReconcileResult> => {
  const hookUrl = process.env.FRONTEND_DEPLOY_HOOK_URL;
  const buildInfoUrl = process.env.FRONTEND_BUILD_INFO_URL;
  if (!hookUrl || !buildInfoUrl) return 'disabled';
  if (state.running) return 'waiting';
  state.running = true;
  try {
    // 1. текущие данные (тот же эндпоинт, что читает сборка)
    let current: string;
    try {
      const res = await axios.get(apiUrl(), { timeout: reconcileConfig.timeoutMs });
      current = objectsFingerprint(res.data);
    } catch (e) {
      console.warn('[rebuild] сверка: API объектов недоступен, пропускаю', (e as { code?: string }).code ?? '');
      return 'api-unavailable';
    }

    // 2. что опубликовано (404 — build-info ещё не публиковался; сетевая ошибка — неизвестно)
    let published: string | null;
    try {
      const sep = buildInfoUrl.includes('?') ? '&' : '?';
      const res = await axios.get(`${buildInfoUrl}${sep}t=${now}`, {
        timeout: reconcileConfig.timeoutMs,
        validateStatus: s => s === 200 || s === 404,
      });
      published = res.status === 200 ? String(res.data?.fingerprint ?? '') || null : null;
    } catch (e) {
      console.warn('[rebuild] сверка: сайт недоступен, пропускаю', (e as { code?: string }).code ?? '');
      return 'site-unavailable';
    }

    // данные изменились с прошлой сверки — серия повторов начинается заново
    if (state.lastFingerprint && state.lastFingerprint !== current) {
      state.attempts = 0;
      state.stalledLogged = false;
    }
    state.lastFingerprint = current;

    if (published === current) {
      if (state.awaitingPublish) {
        console.log(`[rebuild] ОПУБЛИКОВАНО: отпечаток сайта совпал с данными (${short(current)})`);
      }
      state.awaitingPublish = false;
      state.attempts = 0;
      state.stalledLogged = false;
      return 'in-sync';
    }

    // 3. сайт отстаёт
    if (hasPendingRebuild()) return 'pending-event'; // отложенный запуск сам скоро сработает

    const factor = Math.min(2 ** Math.max(0, state.attempts - 1), reconcileConfig.maxCooldownFactor);
    const required = reconcileConfig.cooldownMs * factor;
    if (rebuildState.lastAcceptedAt && now - rebuildState.lastAcceptedAt < required) {
      return 'waiting'; // сборка, вероятно, ещё идёт: запуск принят, публикации нет
    }
    if (state.attempts >= reconcileConfig.maxAttempts) {
      if (!state.stalledLogged) {
        console.error(
          `[rebuild] СВЕРКА ОСТАНОВЛЕНА: ${state.attempts} запусков подряд, сайт не обновился (опубликовано ${short(published)}, данные ${short(current)}). Проверьте сборки в Vercel; сверка возобновится при изменении данных или перезапуске backend`,
        );
        state.stalledLogged = true;
      }
      return 'stalled';
    }

    console.warn(
      `[rebuild] сайт отстаёт от данных (опубликовано ${short(published)}, данные ${short(current)}) — запускаю сборку (попытка сверки ${state.attempts + 1}/${reconcileConfig.maxAttempts})`,
    );
    const result = await callDeployHook(hookUrl, ['reconcile']);
    if (!result.accepted) return 'trigger-failed';
    state.attempts++;
    state.awaitingPublish = true;
    return 'triggered';
  } catch (e) {
    console.error('[rebuild] внутренняя ошибка сверки', (e as Error).message);
    return 'trigger-failed';
  } finally {
    state.running = false;
  }
};

let intervalTimer: NodeJS.Timeout | null = null;
let startupTimer: NodeJS.Timeout | null = null;

/** Запускает сверку при старте backend и далее периодически. Без настроек — не делает ничего. */
export const startRebuildReconciler = (): void => {
  if (!process.env.FRONTEND_DEPLOY_HOOK_URL || !process.env.FRONTEND_BUILD_INFO_URL) {
    console.log('[rebuild] сверка опубликованного сайта выключена (не заданы FRONTEND_DEPLOY_HOOK_URL / FRONTEND_BUILD_INFO_URL)');
    return;
  }
  const tick = () => {
    void reconcileOnce();
  };
  startupTimer = setTimeout(() => {
    tick(); // восстановление после перезапуска: пропущенное обновление находится сразу
    intervalTimer = setInterval(tick, reconcileConfig.intervalMs);
    intervalTimer.unref();
  }, reconcileConfig.startupDelayMs);
  startupTimer.unref();
  console.log(`[rebuild] сверка опубликованного сайта включена (старт через ${reconcileConfig.startupDelayMs / 1000} с, затем каждые ${reconcileConfig.intervalMs / 1000} с)`);
};

export const stopRebuildReconciler = () => {
  if (startupTimer) clearTimeout(startupTimer);
  if (intervalTimer) clearInterval(intervalTimer);
  startupTimer = intervalTimer = null;
};
