import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';

type BurgerConstructorData = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
  order: TOrder;
};

interface BurgerConstructorState {
  data: BurgerConstructorData | null;
  nextId: number;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  data: null,
  nextId: 1,
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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (!state.data) {
        state.data = {
          ingredients: [],
          bun: null,
          order: {} as TOrder
        };
      }

      const newIngredient: TConstructorIngredient = {
        ...action.payload,
        id: state.nextId.toString()
      };

      state.data.ingredients.push(newIngredient);
      state.nextId += 1;
      state.error = null;
    },
    addBun: (state, action: PayloadAction<TIngredient>) => {
      if (!state.data) {
        state.data = {
          ingredients: [],
          bun: {} as TConstructorIngredient,
          order: {} as TOrder
        };
      }

      const newBun: TConstructorIngredient = {
        ...action.payload,
        id: '0'
      };

      state.data.bun = newBun;
      state.error = null;
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
        state.data.ingredients.forEach((x) => {
          if (x.id > ingredient.id) {
            x.id = (Number(x.id) - 1).toString();
          }
        });
        state.nextId -= 1;
        state.error = null;
      }
    },
    moveIngredientDown: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      if (state.data && Number(ingredient.id) + 1 !== state.nextId) {
        [
          state.data.ingredients[Number(ingredient.id) - 1].id,
          state.data.ingredients[Number(ingredient.id)].id
        ] = [
          state.data.ingredients[Number(ingredient.id)].id,
          state.data.ingredients[Number(ingredient.id) - 1].id
        ];

        [
          state.data.ingredients[Number(ingredient.id) - 1],
          state.data.ingredients[Number(ingredient.id)]
        ] = [
          state.data.ingredients[Number(ingredient.id)],
          state.data.ingredients[Number(ingredient.id) - 1]
        ];
      }
    },
    moveIngredientUp: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredient = action.payload;
      if (state.data && ingredient.id !== '1') {
        [
          state.data.ingredients[Number(ingredient.id) - 1].id,
          state.data.ingredients[Number(ingredient.id) - 2].id
        ] = [
          state.data.ingredients[Number(ingredient.id) - 2].id,
          state.data.ingredients[Number(ingredient.id) - 1].id
        ];

        [
          state.data.ingredients[Number(ingredient.id) - 1],
          state.data.ingredients[Number(ingredient.id) - 2]
        ] = [
          state.data.ingredients[Number(ingredient.id) - 2],
          state.data.ingredients[Number(ingredient.id) - 1]
        ];
      }
    },
    closeOrder: (state) => {
      state.data = null;
      state.orderRequest = false;
      state.orderModalData = null;
      state.loading = false;
      state.error = null;
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
  addBun,
  deleteIngredient,
  moveIngredientDown,
  moveIngredientUp,
  closeOrder
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
