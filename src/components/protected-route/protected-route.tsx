import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (
    !user &&
    location.pathname !== '/login' &&
    location.pathname !== '/register' &&
    location.pathname !== '/forgot-password'
  ) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
