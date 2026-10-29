import ChangePassword from '@pages/Auth/ChangePassword';
import ProtectedRoute from '@features/utils/ProtectedRoute';

export function meta() {
  return [{ title: 'Immo Tonn' }, { name: 'robots', content: 'noindex, nofollow' }];
}

export default function Route() {
  return (
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  );
}
