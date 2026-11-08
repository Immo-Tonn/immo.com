import CreateObject from '@pages/AdminObject/CreateObject/CreateObject';
import ProtectedRoute from '@features/utils/ProtectedRoute';

export function meta() {
  return [{ title: 'Immo Tonn' }];
}

export default function Route() {
  return (
    <ProtectedRoute>
      <CreateObject />
    </ProtectedRoute>
  );
}
