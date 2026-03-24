import { test, expect } from '@playwright/test';
import 'dotenv/config';

test('успешное создание мероприятия', async ({ page }) => {
  
  // ============================================
  // ПРОВЕРКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
  // ============================================
  
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  const baseUrl = process.env.TEST_URL;
  
  if (!email || !password || !baseUrl) {
    throw new Error(
      'Missing environment variables. Please check your .env file:\n' +
      '- TEST_URL\n' +
      '- TEST_EMAIL\n' +
      '- TEST_PASSWORD'
    );
  }
  
  // ============================================
  // АВТОРИЗАЦИЯ
  // ============================================
  
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button:has-text("Войти")');
  await expect(page).toHaveURL(/\/clients|\/dashboard|\//, { timeout: 10000 });
  
  // ============================================
  // ПЕРЕХОД К СОЗДАНИЮ
  // ============================================
  
  await page.click('.btn.btn_wauto', { timeout: 10000 });
  
  // 1. ЗАЛ
  const zalPlaceholder = page.locator('#react-select-room_id-placeholder');
  await zalPlaceholder.waitFor({ state: 'visible', timeout: 5000 });
  await zalPlaceholder.click();
  await page.waitForSelector('.react-select__menu', { timeout: 5000 });
  await page.locator('.react-select__option').first().click();
  
  // 2. ДАТА
  const dateLabel = page.locator('text="Дата"');
  await dateLabel.locator('..').locator('input[type="text"]').click();
  const modal = page.locator('.sm-modal-wrap:visible').first();
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const availableDays = modal.locator('.react-datepicker__day:not(.partiallyRed):not(.disabled)');
  await availableDays.first().click();
  
  // 3. ВРЕМЯ
  await page.fill('[name="start_time"]', '12:00');
  await page.fill('[name="end_time"]', '14:00');
  
  // 4. КОЛИЧЕСТВО ВЗРОСЛЫХ
  await page.fill('[name="adult_count"]', '15');
  
  // 5. ТИП МЕРОПРИЯТИЯ
  await page.click('text="Тип мероприятия"');
  await page.waitForSelector('.react-select__menu');
  await page.locator('.react-select__option').first().click();
  
  // 6. ОТКУДА
  await page.click('text="Откуда"');
  await page.waitForSelector('.react-select__menu');
  await page.locator('.react-select__option').first().click();
  
  // 7. ИМЯ
  const eventName = `Playwright-Тест ${Date.now()}`;
  await page.fill('#__next input[type="name"]', eventName);
  
  // 8. ТЕЛЕФОН
  const randomPhone = '7' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  const phoneField = page.locator('input[msg="Поле должно быть заполнено!"]');
  await phoneField.waitFor({ state: 'visible', timeout: 5000 });
  await phoneField.fill(randomPhone);
  
  // ============================================
  // ОТПРАВКА И ПРОВЕРКА
  // ============================================
  
  await page.click('text="Рассчитать мероприятие"');
  await expect(page).toHaveURL(/\/event\//, { timeout: 10000 });
  await expect(page.locator(`text="${eventName}"`)).toBeVisible({ timeout: 10000 });
});