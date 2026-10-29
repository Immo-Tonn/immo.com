import ObjectPreview from '@pages/AdminObject/ObjectPrewiew/ObjectPrewiew';
import ProtectedRoute from '@features/utils/ProtectedRoute';

export function meta() {
  return [{ title: 'Immo Tonn' }, { name: 'robots', content: 'noindex, nofollow' }];
}

export default function Route() {
  return (
    <ProtectedRoute>
      <ObjectPreview />
    </ProtectedRoute>
  );
}
