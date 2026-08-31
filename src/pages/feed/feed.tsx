import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services//slices/feedSlice';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const { data: feeds, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    if (!feeds) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feeds]);

  const orders: TOrder[] = feeds !== null ? feeds.orders : [];

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
