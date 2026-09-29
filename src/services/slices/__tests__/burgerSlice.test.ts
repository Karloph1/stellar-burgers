import burgerReducer, {
  getBurgerConstructor,
  clearBurgerConstructor,
  addIngredient,
  deleteIngredient,
  moveIngredientDown,
  moveIngredientUp,
  closeOrder,
  clearOrder,
  createOrder
} from '../burgerSlice';
import { TConstructorIngredient, TOrder } from '../../../utils/types';

const initialIngredients: TConstructorIngredient[] = [
  {
    id: '0',
    _id: 'auqwktn',
    name: 'Соус',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'sauce-04.png',
    image_large: 'sauce-04-large.png',
    image_mobile: 'sauce-04-mobile.png'
  },
  {
    id: '1',
    _id: 'hkqmwllga',
    name: 'Мясо',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'meat-03.png',
    image_large: 'meat-03-large.png',
    image_mobile: 'meat-03-mobile.png'
  }
];

const initialBun: TConstructorIngredient = {
  id: '2',
  _id: 'pkjk3mwq',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun-02.png',
  image_large: 'bun-02-large.png',
  image_mobile: 'bun-02-mobile.png'
};

const initialOrder: TOrder = {
  _id: '0',
  status: 'ready',
  name: 'order',
  createdAt: '20-09-2026',
  updatedAt: '24-09-2026',
  number: 1,
  ingredients: ['pkjk3mwq', 'auqwktn', 'hkqmwllga', 'pkjk3mwq']
};

const initialOrderModalData = {
  _id: '0',
  status: 'ready',
  name: 'order',
  createdAt: '20-09-2026',
  updatedAt: '24-09-2026',
  number: 1,
  ingredients: ['pkjk3mwq', 'auqwktn', 'hkqmwllga', 'pkjk3mwq']
};

jest.mock('../../../utils/cookie', () => ({
  getCookie: jest.fn(() => 'test-access-token')
}));

describe('BurgerSlice tests', () => {
  test('get burger constructor', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };

    const action = getBurgerConstructor({
      ingredients: initialIngredients,
      bun: initialBun,
      order: initialOrder
    });
    const result = burgerReducer(initialBurgerConstructorState, action);
    expect(result.data).toEqual({
      ingredients: initialIngredients,
      bun: initialBun,
      order: initialOrder
    });
    expect(result.error).toBeNull();
  });

  test('clear burger constructor', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };

    const newState = burgerReducer(
      initialBurgerConstructorState,
      clearBurgerConstructor()
    );

    expect(newState).toEqual({
      data: null,
      orderRequest: false,
      orderModalData: null,
      loading: false,
      error: null
    });
  });

  test('add ingredient to burger constructor', () => {
    const initialBurgerConstructorState = {
      data: { ingredients: [], bun: null, order: initialOrder },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const ingredient = initialIngredients[0];
    const action = addIngredient(ingredient);
    const result = burgerReducer(initialBurgerConstructorState, action);
    const { id: resultId, ...resultIngredient } = result.data!.ingredients[0];
    const { id: expectedId, ...expectedIngredient } = ingredient;

    expect(result.data?.ingredients).toHaveLength(1);
    expect(resultIngredient).toEqual(expectedIngredient);
    expect(resultId).toEqual(expect.any(String));
    expect(result.error).toBeNull();
  });

  test('add bun to burger constructor', () => {
    const initialBurgerConstructorState = {
      data: { ingredients: [], bun: null, order: initialOrder },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const bun = initialBun;
    const action = addIngredient(bun);
    const result = burgerReducer(initialBurgerConstructorState, action);
    const { id: resultId, ...resultIngredient } = result.data!.bun!;
    const { id: expectedId, ...expectedIngredient } = bun;

    expect(result.data?.bun).not.toBeNull();
    expect(resultIngredient).toEqual(expectedIngredient);
    expect(resultId).toEqual(expect.any(String));
    expect(result.error).toBeNull();
  });

  test('delete ingredient', () => {
    const ingredientToDelete = initialIngredients[0];
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients.map((ingredient, index) => ({
          ...ingredient,
          id: `${index}`
        })),
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const ingredientWithId = { ...ingredientToDelete, id: '0' };
    const action = deleteIngredient(ingredientWithId);
    const result = burgerReducer(initialBurgerConstructorState, action);
    expect(result.data?.ingredients).toHaveLength(
      initialIngredients.length - 1
    );
    expect(
      result.data?.ingredients.some((item) => item.id === ingredientWithId.id)
    ).toBe(false);
    expect(result.error).toBeNull();
  });

  test('move ingredient down', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const ingredientToMove = initialBurgerConstructorState.data.ingredients[0];
    const action = moveIngredientDown(ingredientToMove);
    const result = burgerReducer(initialBurgerConstructorState, action);
    expect(result.data?.ingredients[0]).toEqual(
      initialBurgerConstructorState.data.ingredients[1]
    );
    expect(result.data?.ingredients[1]).toEqual(
      initialBurgerConstructorState.data.ingredients[0]
    );
    expect(result.error).toBeNull();
  });

  test('move ingredient up', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const ingredientToMove = initialBurgerConstructorState.data.ingredients[1];
    const action = moveIngredientUp(ingredientToMove);
    const result = burgerReducer(initialBurgerConstructorState, action);
    expect(result.data?.ingredients[0]).toEqual(
      initialBurgerConstructorState.data.ingredients[1]
    );
    expect(result.data?.ingredients[1]).toEqual(
      initialBurgerConstructorState.data.ingredients[0]
    );
    expect(result.error).toBeNull();
  });

  test('close order', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: true,
      orderModalData: initialOrderModalData,
      loading: true,
      error: 'Ошибка'
    };

    const result = burgerReducer(initialBurgerConstructorState, closeOrder());
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBeNull();
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  test('clear order', () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };
    const result = burgerReducer(initialBurgerConstructorState, clearOrder());
    expect(result.data).toBeNull();
  });

  test('create order fulfilled', () => {
    const initialState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: true,
      orderModalData: null,
      loading: true,
      error: null
    };

    const ingredients = ['ingredient1', 'ingredient2'];

    const orderPayload = {
      _id: '0',
      status: 'ready',
      name: 'order',
      createdAt: '20-09-2026',
      updatedAt: '24-09-2026',
      number: 1,
      ingredients
    };

    const action = createOrder.fulfilled(
      orderPayload,
      'test-request-id',
      ingredients
    );
    const result = burgerReducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBeNull();
    expect(result.orderModalData).toEqual(orderPayload);
  });

  test('create order rejected', () => {
    const initialState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: true,
      orderModalData: null,
      loading: true,
      error: null
    };

    const ingredients = ['ingredient1', 'ingredient2'];

    const action = createOrder.rejected(
      null,
      'test-request-id',
      ingredients,
      undefined
    );
    const result = burgerReducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.orderRequest).toBe(false);
    expect(result.error).not.toBeNull();
  });

  test('create order pending', async () => {
    const initialBurgerConstructorState = {
      data: {
        ingredients: initialIngredients,
        bun: initialBun,
        order: initialOrder
      },
      orderRequest: false,
      orderModalData: initialOrderModalData,
      loading: false,
      error: null
    };

    const ingredients = ['ingredient1', 'ingredient2'];
    const action = createOrder.pending('test-request-id', ingredients);
    const result = burgerReducer(initialBurgerConstructorState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('undefined state', () => {
    const result = burgerReducer(undefined, { type: '@@INIT' });

    expect(result).toEqual({
      data: null,
      error: null,
      loading: false,
      orderModalData: null,
      orderRequest: false
    });
  });
});
