import { Request, Response } from 'express';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import ImagesModel from '../models/ImagesModel';
import VideoModel from '../models/VideoModel';
import ApartmentsModel from '../models/ApartmentsModel';
import ResidentialHousesModel from '../models/ResidentialHousesModel';
import LandPlotsModel from '../models/LandPlotsModel';
import CommercialNonResidentialBuildingsModel from '../models/Commercial_NonResidentialBuildingsModel';
import { deleteFromBunny } from '../utils/deleteImages';
import { deleteFromBunnyVideo } from '../utils/deleteBunnyVideo';
import { requestFrontendRebuild } from '../utils/rebuildHook';

export const getAllObjects = async (req: Request, res: Response) => {
  try {
    const objects = await RealEstateObjectsModel.find()
      .populate('apartments')
      .populate('commercial_NonResidentialBuildings')
      .populate('landPlots')
      .populate('residentialHouses');
    if (!objects) {
      res.status(404).json({ message: 'Keine Objekte gefunden' });
      return;
    }
    res.status(200).json(objects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Objekte', error });
  }
};

export const getObjectById = async (req: Request, res: Response) => {
  try {
    const object = await RealEstateObjectsModel.findById(req.params.id)
      .populate('apartments')
      .populate('commercial_NonResidentialBuildings')
      .populate('landPlots')
      .populate('residentialHouses');
    if (!object) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }
    res.json(object);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Objekte', error });
  }
};

export const createObject = async (req: Request, res: Response) => {
  try {
    const newObject = new RealEstateObjectsModel(req.body);
    const saved = await newObject.save();
    res.status(201).json(saved);
    // после успешного сохранения и ответа: пересборка публичного сайта (не влияет на ответ)
    requestFrontendRebuild('object:create');
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Fehler beim Erstellen des Objekts', error });
  }
};

export const updateObject = async (req: Request, res: Response) => {
  try {
    console.log('🔄 КОНТРОЛЛЕР: Получен запрос на обновление объекта');
    console.log('📋 ID объекта:', req.params.id);
    console.log('📋 Тело запроса:', JSON.stringify(req.body, null, 2));

    // check current object's state before update
    const currentObject = await RealEstateObjectsModel.findById(req.params.id);
    console.log('📊 Текущий объект до обновления:', {
      id: currentObject?._id,
      images: currentObject?.images,
      title: currentObject?.title,
    });

    const updated = await RealEstateObjectsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      console.error('❌ Объект не найден для обновления');
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    console.log('📊 Объект после обновления:', {
      id: updated._id,
      images: updated.images,
      title: updated.title,
    });

    // Special handling for updating image order
    if (req.body.images) {
      console.log('🔄 Обнаружено обновление порядка изображений');
      console.log('📋 Новый порядок изображений из запроса:', req.body.images);
      console.log(
        '📋 Порядок изображений в сохраненном объекте:',
        updated.images,
      );

      // Force saving changes
      const saveResult = await updated.save();
      console.log('📊 Результат принудительного сохранения:', {
        id: saveResult._id,
        images: saveResult.images,
      });

      // Additional verification via direct query to the database
      const verification = await RealEstateObjectsModel.findById(
        req.params.id,
      ).lean();
      console.log('🔍 Верификация через прямой запрос к БД:', {
        id: verification?._id,
        images: verification?.images,
      });

      // Let's check that the changes were actually saved
      const expectedOrder = req.body.images;
      const actualOrder = verification?.images || [];

      if (JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)) {
        console.log('✅ Порядок изображений успешно сохранен в БД');
      } else {
        console.error('❌ Порядок изображений НЕ сохранился в БД!');
        console.error('Ожидаемый:', expectedOrder);
        console.error('Фактический:', actualOrder);

        res.status(500).json({
          message: 'Ошибка сохранения порядка изображений',
          expected: expectedOrder,
          actual: actualOrder,
        });
        return;
      }
    }

    // Add headlines to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Last-Modified': new Date().toUTCString(),
    });
    
    // console.log('✅ КОНТРОЛЛЕР: Объект успешно обновлен');
    res.json(updated);
    requestFrontendRebuild('object:update');
  } catch (error) {
    console.error('❌ КОНТРОЛЛЕР: Ошибка при обновлении объекта:', error);
    console.error('❌ Стек ошибки:', (error as Error).stack);
    res.status(400).json({
      message: 'Fehler beim Aktualisieren des Objekts',
      error: (error as Error).message,
      stack:
        process.env.NODE_ENV === 'development'
          ? (error as Error).stack
          : undefined,
    });
  }
};

export const deleteObject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const objectId = req.params.id;
    console.log('🗑️ НАЧАЛО каскадного удаления объекта:', objectId);

    // 1. Get the main object with all associated data
    const mainObject = await RealEstateObjectsModel.findById(objectId);
    if (!mainObject) {
      console.log('❌ Объект не найден:', objectId);
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    console.log('📋 Найден объект для удаления:', {
      id: mainObject._id,
      type: mainObject.type,
      title: mainObject.title,
      imagesCount: mainObject.images?.length || 0,
      videosCount: mainObject.videos?.length || 0,
    });

    // 2. DELETING IMAGES
    if (mainObject.images && mainObject.images.length > 0) {
      console.log('🖼️ Удаляем изображения...');

      for (const imageId of mainObject.images) {
        try {
          const image = await ImagesModel.findById(imageId);
          if (image) {
            console.log(`🗑️ Удаляем изображение: ${image._id} (${image.url})`);

            try {
              await deleteFromBunny(image.url);
              console.log(`✅ Файл удален из BunnyCDN: ${image.url}`);
            } catch (cdnError) {
              console.warn(`⚠️ Failed to delete file from BunnyCDN: ${image.url}`, cdnError);
            }

            await ImagesModel.findByIdAndDelete(imageId);
            console.log(`✅ Изображение удалено из БД: ${image._id}`);
          }
        } catch (imageError) {
          console.error(`❌ Error deleting image ${imageId}:`, imageError);
        }
      }
    }

    // 3. REMOVE VIDEO
    if (mainObject.videos && mainObject.videos.length > 0) {
      console.log('🎥 Удаляем видео...');

      for (const videoId of mainObject.videos) {
        try {
          const video = await VideoModel.findById(videoId);
          if (video) {
            console.log(`🗑️ Удаляем видео: ${video._id} (${video.title})`);

            if (video.videoId) {
              try {
                await deleteFromBunnyVideo(video.videoId);
                console.log(`✅ Видео удалено из BunnyCDN: ${video.videoId}`);
              } catch (cdnError) {
                console.warn(`⚠️ Failed to remove video from BunnyCDN: ${video.videoId}`, cdnError);
              }
            }

            await VideoModel.findByIdAndDelete(videoId);
            console.log(`✅ Видео удалено из БД: ${video._id}`);
          }
        } catch (videoError) {
          console.error(`❌ Error deleting video ${videoId}:`, videoError);
        }
      }
    }

    // 4. REMOVE SPECIFIC OBJECT DATA
    console.log('🏠 Удаляем специфические данные объекта...');

    try {
      switch (mainObject.type) {
        case 'Apartments':
          if (mainObject.apartments) {
            await ApartmentsModel.findByIdAndDelete(mainObject.apartments);
            console.log(`✅ Данные квартиры удалены: ${mainObject.apartments}`);
          }
          break;

        case 'Residential Houses':
          if (mainObject.residentialHouses) {
            await ResidentialHousesModel.findByIdAndDelete(
              mainObject.residentialHouses,
            );
            console.log(
              `✅ Данные дома удалены: ${mainObject.residentialHouses}`,
            );
          }
          break;

        case 'Land Plots':
          if (mainObject.landPlots) {
            await LandPlotsModel.findByIdAndDelete(mainObject.landPlots);
            console.log(`✅ Данные участка удалены: ${mainObject.landPlots}`);
          }
          break;

        case 'Commercial/Non-Residential Buildings':
          if (mainObject.commercial_NonResidentialBuildings) {
            await CommercialNonResidentialBuildingsModel.findByIdAndDelete(
              mainObject.commercial_NonResidentialBuildings,
            );
            console.log(
              `✅ Данные коммерческой недвижимости удалены: ${mainObject.commercial_NonResidentialBuildings}`,
            );
          }
          break;

        default:
          console.warn(`⚠️ Неизвестный тип объекта: ${mainObject.type}`);
      }
    } catch (specificError) {
      console.error('❌ Error deleting specific data:', specificError);
    }

    // 5. REMOVE MAIN OBJECT
    console.log('🗑️ Удаляем основной объект...');
    await RealEstateObjectsModel.findByIdAndDelete(objectId);
    console.log(`✅ Основной объект удален: ${objectId}`);

    // 6. FINAL CHECK
    console.log('🔍 Выполняем финальную проверку...');

    // check for orphan images
    const orphanImages = await ImagesModel.find({ realEstateObject: objectId });
    if (orphanImages.length > 0) {
      console.warn(`⚠️ Найдены сиротские изображения: ${orphanImages.length}`);
      for (const orphan of orphanImages) {
        await ImagesModel.findByIdAndDelete(orphan._id);
        console.log(`🧹 Удалено сиротское изображение: ${orphan._id}`);
      }
    }

    // Check for orphan videos
    const orphanVideos = await VideoModel.find({ realEstateObject: objectId });
    if (orphanVideos.length > 0) {
      console.warn(`⚠️ Найдены сиротские видео: ${orphanVideos.length}`);
      for (const orphan of orphanVideos) {
        await VideoModel.findByIdAndDelete(orphan._id);
        console.log(`🧹 Удалено сиротское видео: ${orphan._id}`);
      }
    }

    console.log('✅ Каскадное удаление завершено успешно!');
    console.log('📊 Итоги удаления:', {
      mainObject: '✅ удален',
      specificData: '✅ удален',
      images: mainObject.images?.length || 0,
      videos: mainObject.videos?.length || 0,
      cdnFilesCleanup: '✅ выполнена',
    });

    res.json({
      message:
        'Das Objekt und alle zugehörigen Daten wurden erfolgreich gelöscht.',
      deletedItems: {
        mainObject: 1,
        images: mainObject.images?.length || 0,
        videos: mainObject.videos?.length || 0,
        specificData: 1,
      },
    });
    requestFrontendRebuild('object:delete');
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА при каскадном удалении:', error);
    console.error('❌ Стек ошибки:', (error as Error).stack);

    res.status(500).json({
      message: 'Fehler beim Löschen des Objekts',
      error: (error as Error).message,
      details: 'Some related data may remain in the database. Please contact the administrator.'
    });
  }
};

// Clear all orphan records in the database
export const cleanupOrphanRecords = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('🧹 НАЧАЛО очистки сиротских записей...');

    const existingObjects = await RealEstateObjectsModel.find({}, '_id');
    const existingObjectIds = existingObjects.map((obj: any) =>
      obj._id.toString(),
    );

    console.log(`📊 Найдено активных объектов: ${existingObjectIds.length}`);

    let cleanupStats = {
      orphanImages: 0,
      orphanVideos: 0,
      orphanApartments: 0,
      orphanHouses: 0,
      orphanLandPlots: 0,
      orphanCommercial: 0,
      deletedFiles: 0,
    };

    // 1. CLEANING ORPHAN IMAGES
    console.log('🖼️ Проверка сиротских изображений...');
    const orphanImages = await ImagesModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });

    for (const image of orphanImages) {
      try {
        await deleteFromBunny(image.url);
        cleanupStats.deletedFiles++;
        console.log(`🗑️ Удален файл: ${image.url}`);
      } catch (cdnError) {
        console.warn(`⚠️ Failed to delete file: ${image.url}`);
      }

      await ImagesModel.findByIdAndDelete(image._id);
      cleanupStats.orphanImages++;
    }

    // 2.  CLEANING ORPHAN VIDEO
    console.log('🎥 Проверка сиротских видео...');
    const orphanVideos = await VideoModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });

    for (const video of orphanVideos) {
      try {
        if (video.videoId) {
          await deleteFromBunnyVideo(video.videoId);
          cleanupStats.deletedFiles++;
          console.log(`🗑️ Удалено видео: ${video.videoId}`);
        }
      } catch (cdnError) {
        console.warn(`⚠️ Failed to delete video: ${video.videoId}`);
      }

      await VideoModel.findByIdAndDelete(video._id);
      cleanupStats.orphanVideos++;
    }

    // 3.  CLEANING ORPHAN APARTMENTS
    console.log('🏠 Проверка сиротских квартир...');
    const orphanApartments = await ApartmentsModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });
    for (const apartment of orphanApartments) {
      await ApartmentsModel.findByIdAndDelete(apartment._id);
      cleanupStats.orphanApartments++;
    }

    // 4. CLEANING ORPHAN HAUSES
    console.log('🏘️ Проверка сиротских домов...');
    const orphanHouses = await ResidentialHousesModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });
    for (const house of orphanHouses) {
      await ResidentialHousesModel.findByIdAndDelete(house._id);
      cleanupStats.orphanHouses++;
    }

    // 5. CLEANING ORPHAN PLOTS
    console.log('🌿 Проверка сиротских участков...');
    const orphanLandPlots = await LandPlotsModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });
    for (const plot of orphanLandPlots) {
      await LandPlotsModel.findByIdAndDelete(plot._id);
      cleanupStats.orphanLandPlots++;
    }

    // 6. CLEANING ORPHAN COMMERCIAL REAL ESTATE
    console.log('🏢 Проверка сиротской коммерческой недвижимости...');
    const orphanCommercial = await CommercialNonResidentialBuildingsModel.find({
      realEstateObject: { $nin: existingObjectIds },
    });
    for (const commercial of orphanCommercial) {
      await CommercialNonResidentialBuildingsModel.findByIdAndDelete(
        commercial._id,
      );
      cleanupStats.orphanCommercial++;
    }

    console.log('✅ Очистка сиротских записей завершена!');
    console.log('📊 Статистика очистки:', cleanupStats);

    res.json({
      message: 'Очистка сиротских записей выполнена успешно',
      statistics: cleanupStats,
      totalCleaned: Object.values(cleanupStats).reduce(
        (sum, count) => sum + count,
        0,
      ),
    });
  } catch (error) {
    console.error('❌ Ошибка при очистке сиротских записей:', error);
    res.status(500).json({
      message: 'Error while cleaning orphan records',
      error: (error as Error).message
    });
  }
};

// DEBUG FUNCTION
export const debugObjectState = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const objectId = req.params.id;
    console.log('🔍 DEBUG: Проверка состояния объекта:', objectId);
    // Get pbject
    const object = await RealEstateObjectsModel.findById(objectId).lean();
    // Get images
    const images = await ImagesModel.find({
      realEstateObject: objectId,
    }).lean();
    // Get videos
    const videos = await VideoModel.find({ realEstateObject: objectId }).lean();    
    //Get specific data
    let specificData = null;
    if (object) {
      switch (object.type) {
        case 'Apartments':
          if (object.apartments) {
            specificData = await ApartmentsModel.findById(
              object.apartments,
            ).lean();
          }
          break;
        case 'Residential Houses':
          if (object.residentialHouses) {
            specificData = await ResidentialHousesModel.findById(
              object.residentialHouses,
            ).lean();
          }
          break;
        case 'Land Plots':
          if (object.landPlots) {
            specificData = await LandPlotsModel.findById(
              object.landPlots,
            ).lean();
          }
          break;
        case 'Commercial/Non-Residential Buildings':
          if (object.commercial_NonResidentialBuildings) {
            specificData =
              await CommercialNonResidentialBuildingsModel.findById(
                object.commercial_NonResidentialBuildings,
              ).lean();
          }
          break;
      }
    }

    const result = {
      timestamp: new Date().toISOString(),
      object: {
        id: object?._id,
        title: object?.title,
        images: object?.images,
        videos: object?.videos,
        imagesCount: object?.images?.length || 0,
        videosCount: object?.videos?.length || 0,
        specificDataId:
          object?.apartments ||
          object?.residentialHouses ||
          object?.landPlots ||
          object?.commercial_NonResidentialBuildings,
      },
      actualImages: images.map(img => ({
        id: img._id,
        url: img.url,
        type: img.type,
        realEstateObject: img.realEstateObject,
      })),
      actualVideos: videos.map(video => ({
        id: video._id,
        videoId: video.videoId,
        title: video.title,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        realEstateObject: video.realEstateObject,
      })),
      specificData: specificData
        ? {
            id: specificData._id,
            type: (specificData as any).type || 'N/A',
            livingArea: (specificData as any).livingArea,
            plotArea: (specificData as any).plotArea,
            area: (specificData as any).area,
            landPlottype: (specificData as any).landPlottype || null,
            buildingType: (specificData as any).buildingType || null,
          }
        : null,
      actualImagesCount: images.length,
      actualVideosCount: videos.length,
      orderMatch: object?.images?.length === images.length,
      vodeoOrderMatch: object?.videos?.length === videos.length,
      // Additional information for debugging
      imageIdsInObject: object?.images || [],
      imageIdsInCollection: images.map(img => img._id?.toString()),
      videoIdsInObject: object?.videos || [],
      videoIdsInCollection: videos.map(video => video._id?.toString()),
      missingInObject: images
        .map(img => img._id?.toString())
        .filter(
          id => !object?.images?.map(objId => objId.toString()).includes(id),
        ),
      missingInCollection: (object?.images || [])
        .map(objId => objId.toString())
        .filter(id => !images.map(img => img._id?.toString()).includes(id)),
      dataIntegrity: {
        hasMainObject: !!object,
        hasSpecificData: !!specificData,
        imagesConsistent: object?.images?.length === images.length,
        videosConsistent: object?.videos?.length === videos.length,
        noOrphanImages: images.every(
          img => img.realEstateObject.toString() === objectId,
        ),
        noOrphanVideos: videos.every(
          video => video.realEstateObject.toString() === objectId,
        ),
      },
    };

    console.log('📊 DEBUG результат:', JSON.stringify(result, null, 2));

    res.json(result);
  } catch (error: unknown) {
    console.error('❌ DEBUG ошибка:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
