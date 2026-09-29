import ingredientsReducer, {
  getIngredients,
  clearIngredients,
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('IngredientsSlice tests', () => {
  const initialIngredients: TIngredient[] = [
    {
      _id: '1',
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
    },
    {
      _id: '2',
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

  const emptyIngredients = null;

  test('clear ingredients', () => {
    const initialIngredientsState = {
      data: initialIngredients,
      loading: false,
      error: null
    };

    const newState = ingredientsReducer(
      initialIngredientsState,
      clearIngredients()
    );

    expect(newState).toEqual({
      data: emptyIngredients,
      loading: false,
      error: null
    });
  });

  test('get ingredients', () => {
    const initialIngredientsState = {
      data: [],
      loading: false,
      error: null
    };

    const action = getIngredients(initialIngredients);
    const result = ingredientsReducer(initialIngredientsState, action);
    expect(result.data).toEqual(initialIngredients);
    expect(result.error).toBeNull();
  });

  test('fetch ingredients fulfilled', () => {
    const initialState = {
      data: [],
      loading: true,
      error: null
    };

    const action = fetchIngredients.fulfilled(
      initialIngredients,
      'test-request-id'
    );
    const result = ingredientsReducer(initialState, action);

    expect(result.data).toEqual(initialIngredients);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  test('fetch ingredients rejected', () => {
    const initialState = {
      data: [],
      loading: true,
      error: null
    };

    const action = fetchIngredients.rejected(
      null,
      'test-request-id',
      undefined,
      'Ошибка загрузки ингредиентов'
    );
    const result = ingredientsReducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки ингредиентов');
    expect(result.data).toEqual([]);
  });

  test('fetch ingredients pending', () => {
    const initialIngredientsState = {
      loading: false,
      data: initialIngredients,
      error: 'Ошибка загрузки ингредиентов'
    };

    const action = fetchIngredients.pending('test-request-id', undefined);

    const result = ingredientsReducer(initialIngredientsState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('undefined state', () => {
    const result = ingredientsReducer(undefined, { type: '@@INIT' });

    expect(result).toEqual({
      data: null,
      loading: false,
      error: null
    });
  });
});
