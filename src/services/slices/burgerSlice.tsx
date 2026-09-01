import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';
import { v4 as uuidv4 } from 'uuid';

type BurgerConstructorData = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
  order: TOrder;
};

interface BurgerConstructorState {
  data: BurgerConstructorData | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  data: null,
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'burger_constructor/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    const { _id, status, name, createdAt, updatedAt, number } = response.order;
    return {
      _id,
      status,
      name,
      createdAt,
      updatedAt,
      number,
      ingredients
    } as TOrder;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burger_constructor',
  initialState,
  reducers: {
    getBurgerConstructor: (
      state,
      action: PayloadAction<BurgerConstructorData>
    ) => {
      state.data = action.payload;
      state.error = null;
    },
    clearBurgerConstructor: (state) => {
      state.data = null;
      state.error = null;
    },
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (!state.data) {
          state.data = {
            ingredients: [],
            bun: null,
            order: {} as TOrder
          };
        }
        if (payload.type === 'bun') {
          state.data.bun = payload;
        } else {
          state.data.ingredients.push(payload);
        }
        state.error = null;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      if (state.data) {
        state.data.ingredients = state.data.ingredients.filter(
          (item) => item.id !== ingredient.id
        );
        state.error = null;
      }
    },
    moveIngredientDown: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      const ingredientIndex =
        state.data?.ingredients.findIndex(
          (item) => item.id === ingredient.id
        ) ?? -1;

      if (state.data && ingredientIndex + 1 !== state.data.ingredients.length) {
        [
          state.data.ingredients[ingredientIndex],
          state.data.ingredients[ingredientIndex + 1]
        ] = [
          state.data.ingredients[ingredientIndex + 1],
          state.data.ingredients[ingredientIndex]
        ];
      }
      state.error = null;
    },
    moveIngredientUp: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      const ingredientIndex =
        state.data?.ingredients.findIndex(
          (item) => item.id === ingredient.id
        ) ?? -1;
      if (state.data && ingredientIndex !== 0) {
        [
          state.data.ingredients[ingredientIndex - 1],
          state.data.ingredients[ingredientIndex]
        ] = [
          state.data.ingredients[ingredientIndex],
          state.data.ingredients[ingredientIndex - 1]
        ];
      }
      state.error = null;
    },
    closeOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.loading = false;
      state.error = null;
    },
    clearOrder: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  getBurgerConstructor,
  clearBurgerConstructor,
  addIngredient,
  deleteIngredient,
  moveIngredientDown,
  moveIngredientUp,
  closeOrder,
  clearOrder
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
