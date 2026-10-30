// Адрес API. По умолчанию — прежний боевой; для тестового окружения (сквозные тесты
// автопересборки) переопределяется переменной окружения при сборке.
export const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ?? 'https://immo-tonn.de/api';
