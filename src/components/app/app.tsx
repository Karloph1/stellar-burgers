import { ConstructorPage } from '@pages';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { Modal } from '../../components/modal/modal';
import { OrderInfo } from '../../components/order-info/order-info';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { on } from 'events';
import { useEffect } from 'react';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services//slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();

  const { data: ingredientsList, loading } = useSelector(
    (state) => state.ingredients
  );
  const location = useLocation();

  const locationState = location.state as { background?: Location };
  const background = locationState && locationState.background;

  const { isAuthChecked } = useSelector((state) => state.user);
  useEffect(() => {
    if (!ingredientsList) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsList]);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch]);

  /** TODO: взять переменные из стора */
  const isIngredientsLoading = loading;
  const ingredients = ingredientsList ? ingredientsList : [];
  const error = null;

  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
            <Route
              path='/feed/:number'
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute onlyUnAuth={false}>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
          </Routes>
          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Информация о заказе' onClose={onClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингридиента' onClose={onClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute onlyUnAuth={false}>
                    <Modal title='Информация о заказе' onClose={onClose}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;
