import { createHash } from 'crypto';

/**
 * Отпечаток списка объектов (канонический JSON → sha256). Должен совпадать с
 * FE/scripts/fingerprint.mjs: именно его frontend записывает в build-info.json при
 * сборке; совпадение проверяет test/rebuild-reconcile.test.mjs.
 */
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
};

export const objectsFingerprint = (objects: { _id: unknown }[]): string =>
  createHash('sha256')
    .update(
      canonical(
        [...objects].sort((a, b) => String(a._id).localeCompare(String(b._id))),
      ),
    )
    .digest('hex');
