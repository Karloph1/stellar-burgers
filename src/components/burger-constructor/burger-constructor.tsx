import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  closeOrder,
  createOrder,
  clearOrder
} from '../../services/slices/burgerSlice';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { addOrder } from '../../services/slices/ordersSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: burger_constructor } = useSelector(
    (state) => state.burgerConstructor
  );
  const { user } = useSelector((state) => state.user);

  const constructorItems = {
    bun: burger_constructor?.bun
      ? {
          price: burger_constructor.bun.price,
          name: burger_constructor.bun.name,
          image: burger_constructor.bun.image
        }
      : undefined,
    ingredients: burger_constructor
      ? burger_constructor.ingredients.filter((x) => x.type !== 'bun')
      : []
  };

  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const onOrderClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    } else {
      if (burger_constructor) {
        const fullOrder: string[] = [
          burger_constructor.bun?._id,
          ...(burger_constructor.ingredients?.map((x) => x._id) ?? []),
          burger_constructor.bun?._id
        ].filter((item): item is string => item !== undefined);

        try {
          const order = await dispatch(createOrder(fullOrder)).unwrap();
          dispatch(addOrder(order));
          dispatch(clearOrder());
        } catch (error) {
          console.error('Ошибка при оформлении заказа:', error);
        }
      }
    }
  };

  const closeOrderModal = () => {
    dispatch(closeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
