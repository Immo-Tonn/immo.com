// Отпечаток списка объектов: меняется при любом изменении данных, которые попадают на
// сайт при сборке. ВАЖНО: тот же алгоритм (канонический JSON → sha256) реализован в
// BE/src/utils/fingerprint.ts; совпадение проверяет BE/test/rebuild-reconcile.test.mjs.
import { createHash } from 'node:crypto';

const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map(k => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
};

export const objectsFingerprint = objects =>
  createHash('sha256')
    .update(canonical([...objects].sort((a, b) => String(a._id).localeCompare(String(b._id)))))
    .digest('hex');
