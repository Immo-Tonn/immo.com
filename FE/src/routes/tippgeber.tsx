import { Navigate, useParams } from 'react-router';
import Tippgeber from '@pages/Tippgeber/Tippgeber';
import { pageMeta } from '../seo/pageMeta';

export const meta = pageMeta('tippgeber', '/tippgeber');

// Страница только на немецком: языковых версий нет. /en/tippgeber и /ru/tippgeber
// не пререндерятся и не отдают немецкий текст под чужим языковым адресом — они
// перенаправляют на /tippgeber (канонический адрес).
// (clientLoader здесь нельзя: у маршрута с clientLoader без loader prerender не рисует страницу)
export default function TippgeberRoute() {
  const { lang } = useParams();
  if (lang) return <Navigate to="/tippgeber" replace />;
  return <Tippgeber />;
}
