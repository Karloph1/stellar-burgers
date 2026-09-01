import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }

  //console.log(!onlyUnAuth && !user);

  if (onlyUnAuth && !user) {
    console.log(1);
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
