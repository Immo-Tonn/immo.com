import type { Image, Video } from '@shared/types/propertyTypes';
import type {
  PropertyBundle,
  PropertyListBundle,
} from '@shared/api/usePropertyData';

// Загрузчики данных для route loader'ов: работают и в Node (prerender при
// сборке), и в браузере (clientLoader). Хост API тот же, что в usePropertyData.
const API = 'https://immo-tonn.de/api';

const getJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (res.status === 404) throw new Response(null, { status: 404 });
  if (!res.ok) throw new Error(`API ${url} → ${res.status}`);
  return (await res.json()) as T;
};

const optional = async <T>(url: string): Promise<T[]> => {
  try {
    return await getJson<T[]>(url);
  } catch {
    return [];
  }
};

export const loadObjectBundle = async (id: string): Promise<PropertyBundle> => {
  // 404 объекта → настоящая 404-страница; сетевая ошибка → ошибка (не 404)
  const object = await getJson<PropertyBundle['object']>(`${API}/objects/${id}`);
  const [images, videos] = await Promise.all([
    optional<Image>(`${API}/images/by-object?objectId=${object._id}`),
    optional<Video>(`${API}/videos/by-object?objectId=${object._id}`),
  ]);
  return { object, images, videos, fetchedAt: Date.now() };
};

export const loadObjectList = async (): Promise<PropertyListBundle> => {
  const [objects, images] = await Promise.all([
    getJson<PropertyListBundle['objects']>(`${API}/objects/`).catch(e => {
      if (e instanceof Response && e.status === 404) return [];
      throw e;
    }),
    optional<Image>(`${API}/images/`),
  ]);
  return { objects, images, fetchedAt: Date.now() };
};
