import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Z Car Rental/);
  });

  test('displays vehicle fleet', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Our Fleet').first()).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Vehicles');
    await expect(page).toHaveURL(/\/vehicles/);
  });
});
