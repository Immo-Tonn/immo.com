# Перед публикацией PR #4 (merge в `dev` = публикация на production)

Состояние на 2026-11-05. Новых улучшений в код не вносится; здесь — проверка, порядок и запасные процедуры.

## 1. Визуальная проверка (Preview, защита Vercel включена — вход вашей учёткой)

Ссылка и SHA актуального Preview — в последнем сообщении по PR (меняются при каждом push). Страницы:

| Страница | На что смотреть |
|---|---|
| `/` | hero, Header (Anrufen, адрес, **e-mail под адресом**, язык), блоки, Footer (два телефона) |
| `/wertermittlung`, `/verkaufssupport`, `/recht-und-rat`, `/objectstyling` | hero в едином оформлении, текст внизу, без «пропавших» блоков при прокрутке |
| `/immobilien` и две карточки (`/immobilien/689de19cb584c92052d81afb` активный, `/immobilien/686aad4ea6b565fce8cf8539` проданный) | галерея открывается, фото грузятся, у проданного «Verkauft» |
| `/finanzierung`, `/rechner` | расчёт (500 000 / 100 000 → кредит 440.178,50), «Export als PDF» |
| `/kontakt` | форма, капча видна; `/kontakt/danke` — служебная |
| `/en`, `/ru` и `/en/kontakt`, `/ru/wertermittlung` | переключатель DE→EN→RU→DE остаётся на странице; выпадающий список мышью и клавиатурой |
| `/zzz` | настоящая 404 (страница «Seite nicht gefunden») |
| Мобильная ширина (≈390 px) | бургер, язык в меню, кнопка-иконка телефона |
| Hover/Tab на адресе и e-mail в Header | мягкое голубое свечение, без сдвига |

## 2. Одна реальная отправка формы (с вашего согласия)

Установлено по сборке: форма на Preview отправляет запрос на **боевой backend `immo-tonn.de`** (значение `VITE_HOST` в Vercel
Preview скрыто как sensitive, адрес прочитан из собранного JS) — письмо уйдёт настоящему получателю (`EMAIL_ADMIN`).
Предложение: тестовый текст «ТЕСТ Preview PR #4 — можно удалить».

1. Вы открываете Preview `/kontakt` в Chrome (расширение с доступом к этому домену уже есть).
2. Я заполняю поля тестовыми данными (имя «QA Test», e-mail по вашему выбору — **укажите свой**, чтобы видеть копию/ответ) и **не** нажимаю отправку.
3. Вы решаете капчу и нажимаете «Absenden».
4. Я читаю ответ запроса (`POST …/api/email`: код, тело) и открытую страницу `/kontakt/danke`.
5. Результат: что пришло в почту, фиксируется отдельно. Проверено «с настоящей капчей» будет только это одно действие; всё остальное по форме — тестовый ключ Google и перехват (`qa/`).

## 3. Что нужно для сквозной проверки автопересборки (в тестовой среде)

Сделано: 21 тест на mock-серверах и 24 проверки в изолированной среде (mock вместо Vercel). Не сделано — прогон с **настоящим Vercel**.
Есть на этом Mac: `mongod`, `cloudflared`, Vercel CLI с вашим входом. Нужны ваши разрешения на изменения настроек проекта Vercel
(это не production, но настройки проекта):

1. Создать Deploy Hook на ветку `test/vercel-e2e` (сейчас хуков нет; лимит 5 на проект, 60 запусков/час).
2. Создать Preview-переменные только для ветки `test/vercel-e2e`: `API_BASE_URL`, `VITE_API_BASE_URL`, `VITE_HOST` = адрес временного туннеля
   (иначе тестовая сборка читает боевой API). После проверки удалить переменные и хук.
3. Я поднимаю временную Mongo + backend + публичный туннель (`cloudflared`), создаю/меняю/удаляю **тестовые** объекты только в этой базе; компьютер не должен спать 20–30 минут.
4. Ограничение: Preview закрыт авторизацией, поэтому сверку (чтение `build-info.json`) backend на Preview выполнить не сможет. Событийный путь (хук) проверяется полностью;
   сверка — только на production после публикации (с включением хука на `dev` отдельным решением).

Подробный план: [VERCEL-E2E-PLAN.md](VERCEL-E2E-PLAN.md). Автопересборка **не считается готовой**, пока этот прогон не выполнен.

## 4. Запасной порядок ручной пересборки (если автоматика не включена или не сработала)

Когда нужна: после добавления, изменения цены/описания/фото/статуса и удаления объекта (сайт показывает объекты на момент сборки; до пересборки
новый объект — 404, удалённый — ещё 200, изменённый — со старым HTML).

1. Проверить, нужна ли пересборка (сравнение отпечатков; скрипт ниже) — «УСТАРЕЛО» или `build-info.json` отсутствует.
2. Пересобрать **любым** из способов (все читают API заново при сборке):
   - Vercel → проект `immo` → Deployments → последний Production → «⋯» → **Redeploy**;
   - CLI: `vercel redeploy https://<адрес-текущего-production-деплоя>.vercel.app --target production` (из любой папки проекта);
   - `git commit --allow-empty -m "Пересборка: обновление объектов" && git push origin dev` (только если merge/push в `dev` вами разрешён).
3. Дождаться статуса Ready (≈1 мин). Если сборка упала (например, API недоступен), прежний деплой остаётся: повторить позже.
4. Проверить: `node check-fresh.mjs` показывает «АКТУАЛЬНО»; новый объект открывается и есть в `https://immo-tonn.com/sitemap.xml`; удалённый даёт 404.

Скрипт сверки (сохранить как `check-fresh.mjs` рядом с `FE/scripts/fingerprint.mjs`, запуск из `FE/`):

```js
import { objectsFingerprint } from './scripts/fingerprint.mjs';
const SITE = process.argv[2] ?? 'https://immo-tonn.com';
const objs = await (await fetch('https://immo-tonn.de/api/objects')).json();
const r = await fetch(`${SITE}/build-info.json`);
if (!r.ok || !(r.headers.get('content-type') ?? '').includes('json')) { console.log('build-info.json нет — сайт собран старой версией'); process.exit(2); }
const info = await r.json();
console.log(info.fingerprint === objectsFingerprint(objs) ? `АКТУАЛЬНО (объектов ${objs.length}, собрано ${info.builtAt})` : `УСТАРЕЛО: на сайте ${info.objectCount}, в API ${objs.length}`);
```
(Проверено: на локальной сборке — «АКТУАЛЬНО»; на текущем production — «build-info.json нет», так как там ещё старая версия.)

## 5. Итоговый diff относительно `dev` (проверено)

| Область | Изменение | Риск / вывод |
|---|---|---|
| Backend (`BE/src`) | вызов `requestFrontendRebuild` после сохранения/удаления объекта, `startRebuildReconciler()` при старте, два вспомогательных файла, тесты | Без переменных `FRONTEND_DEPLOY_HOOK_URL` и `FRONTEND_BUILD_INFO_URL` ничего не делает (в логе «отключено»). Merge frontend-PR backend **не деплоит** (сервер Hetzner обновляется вручную). Auth и API не менялись |
| `FE/vercel.json` | `buildCommand`, `outputDirectory: build/client`, `trailingSlash:false`, rewrite только для служебных маршрутов, `X-Robots-Tag` для них, `.data`, служебных JSON; **убран** общий rewrite `/(.*) → /index.html` | Неизвестные адреса теперь честная 404 (так и задумано). Проверено на Preview |
| Сборка | `react-router build` + `scripts/postbuild.mjs` (sitemap, 404.html, build-info); сборка **читает `https://immo-tonn.de/api/objects`** и падает, если API недоступен | Если backend лежит в момент деплоя, новый деплой не выйдет, прежний останется. Настройки проекта Vercel не переопределяют команды (`framework: Other`, root `FE`, Node 24.x) — применяется `vercel.json` |
| Переменные окружения | **новых обязательных нет.** Остаются `VITE_HOST`, `VITE_RECAPTCHA_SITE_KEY` (Production/Preview/Development). Необязательные `API_BASE_URL`, `VITE_API_BASE_URL` по умолчанию = боевой API | `VITE_RECAPTCHA_SITE_KEY` нужен при сборке (prerender) — задан для всех окружений |
| Зависимости | `FE/package.json`/lock: `@react-router/*`, `isbot`; `vite-plugin-react-swc` заменён плагином React Router | Preview-сборки на Vercel проходят |
| Прочее | `.gitignore` (+build, +tsbuildinfo), `qa/` и `e2e/` в корне (в сборку не попадают), `docs/` | — |

## 6. Точка восстановления текущего production

Production сейчас: деплой `dpl_CygAqZzj7hvETqcRnE8EfCtGQyhn` (`immo-cyngewhha-natalia-tonns-projects.vercel.app`), коммит `4e855071` (ветка `dev`), домен `immo-tonn.com`.
Предыдущий production-деплой `immo-a0wnkz3gw-…` тоже в статусе Ready. Данные установлены через API Vercel (только чтение) 2026-11-05.
Сохранено в GitHub: ветка `backup/before-seo-migration-2026-10-29` и тег `stable-before-seo-migration-2026-10-29` — оба на `4e855071…`
(совпадает с `dev` и с production). Порядок отката — [ROLLBACK.md](ROLLBACK.md).

## 7. Порядок публикации и проверок после неё

1. Ваша визуальная проверка (раздел 1) и решения из `docs/SEO-AUDIT.md`, раздел 6 (номер телефона, проданные объекты).
2. По желанию — одна реальная отправка формы (раздел 2).
3. Merge PR #4 в `dev` — Vercel собирает production (≈1 мин); в этот момент API должен быть доступен.
4. Проверить на `https://immo-tonn.com`: коды и title/canonical, `/zzz` → 404, `sitemap.xml` (30 URL), `build-info.json`, форма, калькулятор, объект.
5. Search Console: отправить sitemap, выборочно запросить индексацию (`docs/SEO-AUDIT.md`, раздел 8).
6. Если что-то не так — откат (ROLLBACK.md): быстрый способ — Vercel «Instant Rollback» на предыдущий деплой; полный — PR с возвратом дерева.
