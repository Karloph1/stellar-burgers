import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrdersData, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearCurrentOrder,
  getOrderByNumber
} from '../../services//slices/ordersSlice';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const { data: orders } = useSelector((state) => state.feeds);
  const ingredients: TIngredient[] | null = useSelector(
    (state) => state.ingredients.data
  );
  const currentOrder = useSelector((state) => state.orders.currentOrder);

  const { number } = useParams<{ number: string }>();

  useEffect(
    () => () => {
      dispatch(clearCurrentOrder());
    },
    [dispatch]
  );

  useEffect(() => {
    if (!orders) {
      dispatch(fetchFeeds());
    }

    if (!ingredients) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, orders, ingredients]);

  const orderFromFeed = orders?.orders?.find(
    (x) => x.number.toString() === number
  );

  const order = orderFromFeed || currentOrder;

  useEffect(() => {
    if (!order) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number, order]);

  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = {
    createdAt: order ? order.createdAt : '',
    ingredients: order ? order.ingredients : [],
    _id: order ? order._id : '',
    status: order ? order.status : '',
    name: order ? order.name : '',
    updatedAt: order ? order.updatedAt : '',
    number: orders ? orders.totalToday : 0
  };

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients?.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
