import { test, expect } from '@playwright/test';
import 'dotenv/config';

test('erfolgreiche Erstellung einer Veranstaltung', async ({ page }) => {
  
  // PRÜFUNG DER UMGEBUNGSVARIABLEN
  
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  const baseUrl = process.env.TEST_URL;
  
  if (!email || !password || !baseUrl) {
    throw new Error(
      'Fehlende Umgebungsvariablen. Bitte überprüfe die .env-Datei:\n' +
      '- TEST_URL\n' +
      '- TEST_EMAIL\n' +
      '- TEST_PASSWORD'
    );
  }
  
  // ANMELDUNG
  
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button:has-text("Войти")');
  await expect(page).toHaveURL(/\/clients|\/dashboard|\//, { timeout: 10000 });
  
  // ZUR ERSTELLUNG NAVIGIEREN
  
  await page.click('.btn.btn_wauto', { timeout: 10000 });
  
  // 1. SAAL
  const saalPlaceholder = page.locator('#react-select-room_id-placeholder');
  await saalPlaceholder.waitFor({ state: 'visible', timeout: 5000 });
  await saalPlaceholder.click();
  await page.waitForSelector('.react-select__menu', { timeout: 5000 });
  await page.locator('.react-select__option').first().click();
  
  // 2. DATUM
  await page.click('text="Дата"');
  await page.locator('input[type="text"]').first().click();
  const modal = page.locator('.sm-modal-wrap:visible').first();
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const verfuegbareTage = modal.locator('.react-datepicker__day:not(.partiallyRed):not(.disabled)');
  await verfuegbareTage.first().click();
  
  // 3. BEGINN
  await page.fill('[name="start_time"]', '12:00');
  await page.fill('[name="end_time"]', '14:00');
  
  // 4. ANZAHL ERWACHSENE
  await page.fill('[name="adult_count"]', '15');
  
  // 5. VERANSTALTUNGSTYP
  await page.click('text="Тип мероприятия"');
  await page.waitForSelector('.react-select__menu');
  await page.locator('.react-select__option').first().click();
  
  // 6. QUELLE
  await page.click('text="Откуда"');
  await page.waitForSelector('.react-select__menu');
  await page.locator('.react-select__option').first().click();
  
  // 7. NAME
  const eventName = `Playwright-Test ${Date.now()}`;
  await page.fill('#__next input[type="name"]', eventName);
  
  // 8. TELEFON
  const randomPhone = '7' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  const telefonFeld = page.locator('input[msg="Поле должно быть заполнено!"]');
  await telefonFeld.waitFor({ state: 'visible', timeout: 5000 });
  await telefonFeld.fill(randomPhone);
  
  // ABSENDEN UND PRÜFEN
  
  await page.click('text="Рассчитать мероприятие"');
  await expect(page).toHaveURL(/\/event\//, { timeout: 10000 });
  await expect(page.locator(`text="${eventName}"`)).toBeVisible({ timeout: 10000 });
});
