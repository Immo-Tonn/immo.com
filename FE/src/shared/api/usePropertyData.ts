import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { RealEstateObject, Image, Video } from '@shared/types/propertyTypes';
import { getBuiltObjectIds } from '@shared/api/builtObjects';
import { API_BASE } from '@shared/api/config';

// Данные loader'а свежее этого порога повторно не запрашиваем (иначе дубли запросов).
// Данные из prerender (время сборки) старше порога — их тихо обновляем после гидратации.
const FRESH_MS = 15_000;
const isFresh = (initial?: { fetchedAt: number }) =>
  !!initial && Date.now() - initial.fetchedAt < FRESH_MS;

export interface PropertyBundle {
  object: RealEstateObject;
  images: Image[];
  videos: Video[];
  fetchedAt: number;
}

// initial — данные, полученные loader'ом при prerender (попадают в готовый HTML)
export const usePropertyData = (id?: string, initial?: PropertyBundle) => {
  const [objectData, setObjectData] = useState<RealEstateObject | null>(
    initial?.object ?? null,
  );
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>(initial?.images ?? []);
  const [loading, setLoading] = useState(!initial);
  const [videos, setVideos] = useState<Video[]>(initial?.videos ?? []);
  const [isDeleted, setIsDeleted] = useState(false);

  // Function for updating data
  const fetchData = useCallback(async () => {
    if (!id) {
      console.warn('usePropertyData: ID is undefined, skipping request');
      setLoading(false);
      return;
    }

    if (isDeleted) {
      console.log(
        'usePropertyData: Объект помечен как удаленный, пропускаем запрос',
      );
      setLoading(false);
      return;
    }

    try {
      console.log('Loading object data:', id);

      const objectRes = await axios.get<RealEstateObject>(
        `${API_BASE}/objects/${id}`,
      );
      const data = objectRes.data;
      setObjectData(data);

      // IMPORTANT: Always re-upload images
      if (data._id) {
        try {
          const imagesRes = await axios.get<Image[]>(
            `${API_BASE}/images/by-object?objectId=${data._id}`,
          );
          console.log('Images uploaded:', imagesRes.data);
          setImages(imagesRes.data);
        } catch (imgError) {
          console.warn('Ошибка при загрузке изображений:', imgError);
          setImages([]);
        }

        // Uploading video
        try {
          const videosRes = await axios.get<Video[]>(
            `${API_BASE}/videos/by-object?objectId=${data._id}`,
          );
          setVideos(videosRes.data);
        } catch (videoError) {
          console.warn('Error loading video:', videoError);
          setVideos([]);
        }
      }

      setErr(null);
      setIsDeleted(false);
    } catch (err: any) {
      console.error('Fehler beim Laden der Daten:', err);
      if (err?.response?.status === 404) {
        console.log(
          'Объект не найден (возможно удален), помечаем как удаленный',
        );
        setIsDeleted(true);
        setObjectData(null);
        setImages([]);
        setVideos([]);
        setErr('Objekt nicht gefunden oder wurde gelöscht');
      } else if (initial) {
        // тихое обновление не удалось (сеть, 5xx): оставляем данные из prerender/loader,
        // а не заменяем готовую страницу сообщением об ошибке
        console.warn('Aktualisierung fehlgeschlagen – zeige vorhandene Daten');
        setErr(null);
      } else {
        setErr(err?.message || 'Unbekannter Fehler');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isDeleted]);

  // Initial data loading (пропускаем, если loader только что загрузил данные)
  const skipInitialFetch = useRef(isFresh(initial));
  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  // Refresh when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id && !isDeleted) {
        console.log('Вкладка активна, обновляем данные');
        fetchData;
        fetchData();
      } else if (!document.hidden && isDeleted) {
        console.log(
          'Вкладка активна, но объект удален - пропускаем обновление',
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, fetchData, isDeleted]);

  const markAsDeleted = useCallback(() => {
    setIsDeleted(true);
    setObjectData(null);
    setImages([]);
    setVideos([]);
    setErr('Object wurde gelöscht');
  }, []);

  return {
    objectData,
    images,
    videos,
    loading,
    err,
    refreshData: fetchData,
    isDeleted,
    markAsDeleted,
  };
};

// Hook for list of objects (without ID)
export interface PropertyListBundle {
  objects: RealEstateObject[];
  images: Image[];
  fetchedAt: number;
}

export const usePropertysData = (initial?: PropertyListBundle) => {
  const [objectData, setObjectData] = useState<RealEstateObject[]>(
    initial?.objects ?? [],
  );
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>(initial?.images ?? []);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    // loader только что загрузил список — повторный запрос не нужен
    if (isFresh(initial)) return;

    const fetchData = async () => {
      try {
        console.log('Loading list of all objects');

        const objectRes = await axios.get<RealEstateObject[]>(
          `${API_BASE}/objects/`,
        );
        // показываем только объекты, попавшие в текущую сборку
        const built = await getBuiltObjectIds();
        const data = built
          ? objectRes.data.filter(o => built.has(o._id))
          : objectRes.data;
        setObjectData(data);

        // Loading all images
        let loadedImages: Image[] = [];
        try {
          const imagesRes = await axios.get<Image[]>(
            `${API_BASE}/images/`,
          );
          loadedImages = imagesRes.data || [];
          setImages(loadedImages);
          console.log('Geladene Bilder:', loadedImages.length);
        } catch (imageError: any) {
          // Processing of the case when there are no images (404)
          if (imageError?.response?.status === 404) {
            console.log(
              'Изображения не найдены (пустая база) - устанавливаем пустой массив',
            );
            setImages([]);
            loadedImages = [];
          } else {
            console.warn('Ошибка при загрузке изображений:', imageError);
            setImages([]);
            loadedImages = [];
          }
        }

        setErr(null);

        // Counting objects with images
        let objectsWithImages = 0;
        if (data && data.length > 0) {
          objectsWithImages = data.filter(obj => {
            // check if the object has images
            if (!obj.images || obj.images.length === 0) {
              return false;
            }
            // check real images in a loaded array
            return obj.images.some((imageId: string) =>
              loadedImages.some(img => img._id === imageId),
            );
          }).length;
        }

        console.log(
          'Geladene Objekte:',
          data.length,
          'Bilder:',
          objectsWithImages,
        );
      } catch (err: any) {
        console.error('Fehler beim Laden der Daten:', err);

        if (err?.response?.status === 404) {
          // If objects not found
          setObjectData([]);
          setImages([]);
          setErr(null);
          console.log('Объекты не найдены - показываем пустое состояние');
        } else {
          // Other errors (network, server, etc.)
          if (initial) {
            // обновление списка не удалось — оставляем данные из prerender/loader
            console.warn('Aktualisierung fehlgeschlagen – zeige vorhandene Daten');
          } else {
            setErr(err?.message || 'Unbekannter Fehler');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { objectData, images, loading, err };
};
