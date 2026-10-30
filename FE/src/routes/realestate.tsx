import RealEstate from '@pages/RealEstate/RealEstate';
import { loadObjectList } from '@shared/api/propertyLoaders';
import { getBuiltObjectIds } from '@shared/api/builtObjects';
import { pageMeta } from '../seo/pageMeta';

export const loader = () => loadObjectList();

// В браузере список ограничен объектами из текущей сборки
export const clientLoader = async () => {
  const [list, built] = await Promise.all([loadObjectList(), getBuiltObjectIds()]);
  return built
    ? { ...list, objects: list.objects.filter(o => built.has(o._id)) }
    : list;
};

export const meta = pageMeta('immobilien', '/immobilien');

export default RealEstate;
