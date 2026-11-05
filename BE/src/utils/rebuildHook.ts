import axios from 'axios';

/**
 * Запуск пересборки frontend (Vercel Deploy Hook) после изменения объекта.
 *
 * - Адрес хука — только в серверной переменной окружения FRONTEND_DEPLOY_HOOK_URL
 *   (секрет: он нигде не логируется и не попадает в ответы API).
 * - Вызов НЕ влияет на запрос: функция вызывается уже после ответа клиенту, ничего
 *   не бросает и не ждёт. Сбой хука не отменяет сохранение объекта.
 * - Несколько изменений подряд (создание → загрузка фото → обновление) сливаются в
 *   один запуск: хук вызывается через REBUILD_DEBOUNCE_MS после последнего изменения,
 *   но не позже REBUILD_MAX_WAIT_MS после первого.
 * - Ограниченные повторы при сбое запуска (REBUILD_RETRY_DELAYS_MS).
 */
const ENV_NAME = 'FRONTEND_DEPLOY_HOOK_URL';

export const rebuildConfig = {
  debounceMs: Number(process.env.REBUILD_DEBOUNCE_MS ?? 30_000),
  maxWaitMs: Number(process.env.REBUILD_MAX_WAIT_MS ?? 300_000),
  retryDelaysMs: [2_000, 10_000], // 3 попытки всего
  timeoutMs: 10_000,
};

/**
 * ВАЖНО: успешный ответ Deploy Hook означает лишь, что Vercel ПРИНЯЛ запуск сборки
 * (job в очереди). Это не значит, что сайт опубликован: сборка может упасть. Что сайт
 * действительно обновлён, видно только по build-info.json на самом сайте (см.
 * rebuildReconciler.ts).
 */
export interface HookResult {
  accepted: boolean;
  jobId?: string;
  attempts: number;
}

/** Часы подменяются в тестах. */
export const clock = { now: () => Date.now() };

export const rebuildState = { lastAcceptedAt: 0, lastJobId: undefined as string | undefined };

let timer: NodeJS.Timeout | null = null;
let firstPendingAt = 0;
let pendingReasons: string[] = [];

const isAllowedUrl = (raw: string): boolean => {
  try {
    const u = new URL(raw);
    if (u.protocol === 'https:') return true;
    // http — только для локальной проверки с mock-сервером
    return (
      u.protocol === 'http:' &&
      (u.hostname === 'localhost' || u.hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Вызывает хук с ограниченными повторами. Не бросает. accepted=true — запуск ПРИНЯТ. */
export const callDeployHook = async (
  url: string,
  reasons: string[],
): Promise<HookResult> => {
  const attempts = rebuildConfig.retryDelaysMs.length + 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await axios.post(url, null, { timeout: rebuildConfig.timeoutMs });
      const jobId = (res.data as { job?: { id?: string } } | undefined)?.job?.id;
      rebuildState.lastAcceptedAt = clock.now();
      rebuildState.lastJobId = jobId;
      console.log(
        `[rebuild] запуск сборки ПРИНЯТ Vercel${jobId ? ` (job ${jobId})` : ''}, попытка ${attempt}; причины: ${reasons.join(', ')}. Это ещё не публикация — сайт обновится после успешной сборки`,
      );
      return { accepted: true, jobId, attempts: attempt };
    } catch (error) {
      // В лог — только статус/код: сообщение axios может содержать адрес хука
      const e = error as { response?: { status?: number }; code?: string };
      console.warn(
        `[rebuild] запуск пересборки не удался (попытка ${attempt}/${attempts}): ${
          e.response?.status ?? e.code ?? 'unknown'
        }`,
      );
      if (attempt < attempts) await sleep(rebuildConfig.retryDelaysMs[attempt - 1]!);
    }
  }
  console.error(
    '[rebuild] пересборка frontend НЕ запущена после всех попыток; изменения объекта сохранены, сайт обновится при следующей сверке/запуске',
  );
  return { accepted: false, attempts };
};

/** Есть ли отложенный запуск (изменения ждут окончания паузы). */
export const hasPendingRebuild = (): boolean => timer !== null;

/** Сообщить, что объект создан/изменён/удалён. Безопасно вызывать после ответа клиенту. */
export const requestFrontendRebuild = (reason: string): void => {
  try {
    const url = process.env[ENV_NAME];
    if (!url) {
      console.warn(`[rebuild] ${ENV_NAME} не задана — пересборка не запускается`);
      return;
    }
    if (!isAllowedUrl(url)) {
      console.error(`[rebuild] ${ENV_NAME} имеет недопустимый формат — пересборка не запускается`);
      return;
    }

    const now = Date.now();
    if (pendingReasons.length === 0) firstPendingAt = now;
    pendingReasons.push(reason);
    if (timer) clearTimeout(timer);

    const wait = Math.max(
      0,
      Math.min(rebuildConfig.debounceMs, firstPendingAt + rebuildConfig.maxWaitMs - now),
    );
    timer = setTimeout(() => {
      const reasons = pendingReasons;
      pendingReasons = [];
      timer = null;
      void callDeployHook(url, reasons);
    }, wait);
  } catch (error) {
    console.error('[rebuild] внутренняя ошибка планировщика пересборки', (error as Error).message);
  }
};

/** Только для тестов: сбросить состояние. */
export const __resetRebuildState = () => {
  if (timer) clearTimeout(timer);
  timer = null;
  pendingReasons = [];
  firstPendingAt = 0;
  rebuildState.lastAcceptedAt = 0;
  rebuildState.lastJobId = undefined;
};
