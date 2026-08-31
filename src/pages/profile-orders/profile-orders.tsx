import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { data: ordersData } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!ordersData) {
      dispatch(fetchOrders());
    }
  }, [dispatch, ordersData]);

  const orders: TOrder[] = ordersData?.orders || [];

  return <ProfileOrdersUI orders={orders} />;
};
