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

  test('fetch ingredients fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: initialIngredients
          })
      })
    ) as jest.Mock;

    const dispatch = jest.fn();
    const result = await fetchIngredients()(dispatch, jest.fn(), undefined);

    expect(result.type).toBe('ingredients/fetchIngredients/fulfilled');
    expect(result.payload).toEqual(initialIngredients);
  });

  test('fetch ingredients rejected', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            data: []
          })
      })
    ) as jest.Mock;

    const dispatch = jest.fn();
    const result = await fetchIngredients()(dispatch, jest.fn(), undefined);

    expect(result.type).toBe('ingredients/fetchIngredients/rejected');
    expect(result.payload).toBe('Ошибка загрузки ингредиентов');
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
});
