import { test, expect } from '@playwright/test';

test.describe('Список ингридиентов с HAR', () => {
  test('должен записать HAR-файл списка ингридиентов', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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
    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

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

  test('должен записать HAR-файл данных пользователя', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('ingredients-list')).toBeVisible();
  });

  test('должен записать HAR-файл данных созданного заказа', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

    await page.routeFromHAR('./tests/hars/order/order.har', {
      url: '**/orders',
      update: false
    });

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

  test('открытие модального окна оформление заказа', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

    await page.routeFromHAR('./tests/hars/order/order.har', {
      url: '**/orders'
    });

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
    expect(bodyPost.order.number).toEqual(110756);
  });

  test('закрытие модального окна после оформления заказа', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

    await page.routeFromHAR('./tests/hars/order/order.har', {
      url: '**/orders'
    });

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
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmIzMmY1NmExNzJkMDAxYjk5NjBiOSIsImlhdCI6MTc5MDY2MjI5NywiZXhwIjoxNzkwNjYzNDk3fQ.57EatiksR7QYXhONHH5PGPfxvryk3EKN3lGPUAnF-bo',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
      url: '**/ingredients'
    });

    await page.routeFromHAR('./tests/hars/order/order.har', {
      url: '**/orders'
    });

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
