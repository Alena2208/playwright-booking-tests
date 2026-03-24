import { test, expect } from '@playwright/test';

test('успешный вход на сайт', async ({ page }) => {
  await page.goto('https://new.bbanket.velgir.com/login');
  await page.fill('[name="email"]', 'tepla281340@yandex.ru');
  await page.fill('[name="password"]', 'testtest');
  await page.click('button:has-text("Войти")');
  await expect(page).toHaveURL(/\/clients|\/dashboard|\//);
});