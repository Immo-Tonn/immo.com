# Прототип: prerender + языковые URL (React Router framework mode)

Ветка `feat/seo-prerender-prototype`. Цель — проверить, что текущий проект можно
перевести на prerender с языковыми URL без смены стека (Vite + React Router 7).
Это прототип, не готовая миграция. Откат — см. [ROLLBACK.md](ROLLBACK.md).

## Что сделано

- `FE/react-router.config.ts` — `ssr: false` + `prerender()`: статические страницы × 3 языка
  и все объекты из API (`/api/objects`). Если API недоступен — **сборка падает**
  (прежний деплой остаётся живым).
- `FE/src/routes.ts` — маршруты с необязательным языковым сегментом `:lang?`
  (`/` = DE, `/en/...`, `/ru/...`; `/de/...` и прочее — 404).
- `FE/src/root.tsx`, `entry.client.tsx` — html-оболочка (бывший `index.html`: Usercentrics,
  GA, JSON-LD RealEstateAgent и WebSite, OG-/geo-теги перенесены без изменений).
- `FE/src/lang-layout.tsx` — язык задаётся URL (а не `localStorage`).
- `FE/src/routes/*` — маршруты с `meta` (title, description, canonical, hreflang, OG)
  для Home, списка объектов, карточки объекта, Wertermittlung. Данные объекта и списка
  попадают в HTML через loader'ы (`shared/api/propertyLoaders.ts`).
- `FE/scripts/postbuild.mjs` — `404.html` (копия SPA-fallback) и `sitemap.xml` с hreflang.
- `FE/vercel.json` — `outputDirectory: build/client`, rewrites только для админ-маршрутов.
- `LanguageSwitcher` — ссылки на ту же страницу с другим префиксом.

## Что проверено (локально, статический сервер)

- Без JS: H1, текст и ссылки есть в HTML на DE/EN/RU и на странице объекта (+5 фото).
- Title, canonical, hreflang (de/en/ru/x-default) уникальны на страницу и язык.
- Гидратация без ошибок; переключение DE→EN→RU→DE сохраняет страницу (`/immobilien`).
- Неизвестный URL, `/de/...`, несуществующий объект — HTTP 404 (при `404.html`).
- Новый объект, которого нет в prerender: HTTP 404 для краулера, но у пользователя
  страница открывается (SPA загружает данные из API) до ближайшей пересборки.
- `tsc -b`: 0 ошибок. `npm run build` проходит (48 URL в sitemap).

## Найденные проблемы и решения

| Проблема | Решение в прототипе |
|---|---|
| `leaflet` обращается к `window` при импорте → сборка падает | карта подключается лениво после монтирования |
| `@react-router/dev` конфликтует по peer-зависимостям с `react-router@7.7.1` | `FE/.npmrc`: `legacy-peer-deps=true` (иначе `npm ci` падает на Vercel) |
| `@react-router/node` должен быть в `dependencies`, а не в `devDependencies` | перенесён |
| при `ssr:false` export `loader` вырезается из клиентской сборки | `clientLoader` не ссылается на `loader` |
| prerender передаёт путь со слэшем (`/immobilien/`) | нормализация в переключателе языка |
| в API невалидный ID объекта даёт 500, а не 404 | не исправлено (backend); loader считает это ошибкой |

## Не сделано / открыто

- `meta` есть не на всех страницах (остальные ~10 без title/description/canonical) —
  нужны тексты на 3 языках.
- Внутренние ссылки (≈44) не несут языковой префикс: на `/en/...` меню ведёт на DE-страницы.
- Тексты EN/RU для Home — временные (из существующих переводов), нужна правка редактора.
- Объекты на EN/RU показывают немецкое описание (в API нет переводов) — решение по
  индексации EN/RU-объектов не принято.
- Не проверено на Vercel: раздача `404.html` с кодом 404, `.data`-файлов, rewrites,
  автосборка по Deploy Hook (хук и вызов из backend не реализованы).
- Старый `src/app/App.tsx`, `main.tsx`, `index.html`, `Seo.tsx` оставлены (не используются).
- Редизайн Home (ветка `feat/home-redesign-sapphire`) в прототип не включён.
