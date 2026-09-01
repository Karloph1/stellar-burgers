import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';

interface OrdersState {
  data: TOrdersData | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  data: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказов');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getOrders: (state, action: PayloadAction<TOrdersData>) => {
      state.data = action.payload;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<TOrder>) => {
      state.data?.orders.push(action.payload);
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          if (!state.data) {
            state.data = { orders: [], total: 0, totalToday: 0 };
          }
          state.data.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Произошла ошибка';
      });
  }
});

export const { getOrders, addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
