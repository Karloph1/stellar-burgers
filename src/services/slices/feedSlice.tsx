import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

interface FeedsState {
  data: TOrdersData | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  data: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    getFeeds: (state, action: PayloadAction<TOrdersData>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearFeeds: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Произошла ошибка';
      });
  }
});

export const { getFeeds, clearFeeds } = feedsSlice.actions;

export default feedsSlice.reducer;
