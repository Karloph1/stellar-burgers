import { test, expect } from '@playwright/test';

test.describe('Список ингридиентов с HAR', () => {
  test.beforeEach(async ({ context, page }) => {
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

    await page.routeFromHAR('./tests/hars/order/order.har', {
      url: '**/orders'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem(
        'RefreshToken',
        '9ad6def6eb7ce7040ee58499bee3670a2d7b0b97388330880eb7d1abb3f5db65100243629c6dbb3f'
      );
    });
  });

  test('должен записать HAR-файл списка ингридиентов', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const response = await responsePromise;
    const body = await response.json();

    const ingredientId = body.data[1]._id;

    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId(`constructor-ingredient-${ingredientId}`)
    ).toBeVisible();
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const response = await responsePromise;
    const body = await response.json();

    const ingredientId = body.data[0]._id;

    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('bun-top')).toBeVisible();
    await expect(page.getByTestId('bun-bottom')).toBeVisible();

    const bunTop = page.getByTestId('bun-top');
    const textTop = await bunTop.textContent();
    const bunBottom = page.getByTestId('bun-bottom');
    const textBottom = await bunBottom.textContent();
    const testTop = body.data[0].name + ' (верх)' + String(body.data[0].price);
    const testBottom =
      body.data[0].name + ' (низ)' + String(body.data[0].price);

    expect(testTop).toBe(textTop);
    expect(testBottom).toBe(textBottom);
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const responseGetPromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const responseGet = await responseGetPromise;
    const bodyGet = await responseGet.json();

    const bunId = bodyGet.data[0]._id;
    const bun = page.getByTestId(`ingredient-${bunId}`);
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredientId = bodyGet.data[1]._id;
    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('bun-top')).toBeVisible();
    await expect(page.getByTestId('bun-bottom')).toBeVisible();
    await expect(
      page.getByTestId(`constructor-ingredient-${ingredientId}`)
    ).toBeVisible();
  });

  test('открытие модального окна', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const response = await responsePromise;
    const body = await response.json();

    const { _id, name, calories, proteins, fat, carbohydrates, image_large } =
      body.data[0];

    const ingredient = page.getByTestId(`ingredient-${_id}`);

    await ingredient.click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await expect(page.getByTestId('ingredient-detail-name')).toHaveText(name);
    await expect(page.getByTestId('ingredient-detail-calories')).toHaveText(
      String(calories)
    );
    await expect(page.getByTestId('ingredient-detail-proteins')).toHaveText(
      String(proteins)
    );
    await expect(page.getByTestId('ingredient-detail-fat')).toHaveText(
      String(fat)
    );
    await expect(
      page.getByTestId('ingredient-detail-carbohydrates')
    ).toHaveText(String(carbohydrates));
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const response = await responsePromise;
    const body = await response.json();

    const ingredientId = body.data[0]._id;

    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const response = await responsePromise;
    const body = await response.json();

    const ingredientId = body.data[0]._id;

    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);

    await ingredient.click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('должен записать HAR-файл данных пользователя', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('должен записать HAR-файл данных созданного заказа', async ({
    page
  }) => {
    const responseGetPromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const responseGet = await responseGetPromise;
    const bodyGet = await responseGet.json();

    const bunId = bodyGet.data[0]._id;
    const bun = page.getByTestId(`ingredient-${bunId}`);
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredientId = bodyGet.data[1]._id;
    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    const responsePostPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/orders') &&
        response.request().method() === 'POST'
    );

    await page.getByTestId('create-order').click();

    const responsePost = await responsePostPromise;
    expect(responsePost.status()).toBe(200);

    const bodyPost = await responsePost.json();

    expect(bodyPost.success).toBe(true);
  });

  test('открытие модального окна оформление заказа', async ({ page }) => {
    const responseGetPromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const responseGet = await responseGetPromise;
    const bodyGet = await responseGet.json();

    const bunId = bodyGet.data[0]._id;
    const bun = page.getByTestId(`ingredient-${bunId}`);
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredientId = bodyGet.data[1]._id;
    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    const [responsePost] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/orders') && r.request().method() === 'POST'
      ),
      page.getByTestId('create-order').click()
    ]);

    const bodyPost = await responsePost.json();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(
      String(bodyPost.order.number)
    );
  });

  test('закрытие модального окна после оформления заказа', async ({ page }) => {
    const responseGetPromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const responseGet = await responseGetPromise;
    const bodyGet = await responseGet.json();

    const bunId = bodyGet.data[0]._id;
    const bun = page.getByTestId(`ingredient-${bunId}`);
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredientId = bodyGet.data[1]._id;
    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/orders') && r.request().method() === 'POST'
      ),
      page.getByTestId('create-order').click()
    ]);

    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('очистка конструктора бургера после оформления заказа', async ({
    page
  }) => {
    const responseGetPromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/ingredients') &&
        response.request().method() === 'GET'
    );

    await page.goto('/');

    const responseGet = await responseGetPromise;
    const bodyGet = await responseGet.json();

    const bunId = bodyGet.data[0]._id;
    const bun = page.getByTestId(`ingredient-${bunId}`);
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredientId = bodyGet.data[1]._id;
    const ingredient = page.getByTestId(`ingredient-${ingredientId}`);
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/orders') && r.request().method() === 'POST'
      ),
      page.getByTestId('create-order').click()
    ]);

    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('bun-top-empty')).toBeVisible();
    await expect(page.getByTestId('ingredient-main-empty')).toBeVisible();
    await expect(page.getByTestId('bun-bottom-empty')).toBeVisible();
  });
});
