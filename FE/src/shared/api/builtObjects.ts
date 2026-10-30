// Объекты, попавшие в текущую сборку (build/client/built-objects.json, пишет postbuild).
// Сайт показывает только их: новый объект появляется после успешной пересборки,
// иначе URL отвечал бы HTTP 404, а страница показывала бы карточку.
// Если манифеста нет (dev-сервер) или он не загрузился — ограничение не применяется.
let cache: Promise<Set<string> | null> | undefined;

export const getBuiltObjectIds = (): Promise<Set<string> | null> => {
  cache ??= fetch('/built-objects.json', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : null))
    .then(ids => (Array.isArray(ids) ? new Set<string>(ids) : null))
    .catch(() => null);
  return cache;
};
