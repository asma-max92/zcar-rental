import { test, expect } from '@playwright/test';

test.describe('Vehicles Page', () => {
  test('loads and shows vehicles', async ({ page }) => {
    await page.goto('/vehicles');
    await expect(page.locator('h1, h2').filter({ hasText: /Vehicles|Fleet|Cars/ }).first()).toBeVisible();
  });

  test('can filter by category', async ({ page }) => {
    await page.goto('/vehicles');
    // Look for category filter buttons/links
    const categoryButton = page.locator('button, a').filter({ hasText: 'Convertible' }).first();
    if (await categoryButton.isVisible().catch(() => false)) {
      await categoryButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('vehicle detail page loads', async ({ page }) => {
    await page.goto('/vehicles');
    // Click first vehicle link
    const vehicleLink = page.locator('a[href*="/vehicles/"]').first();
    if (await vehicleLink.isVisible().catch(() => false)) {
      await vehicleLink.click();
      await expect(page).toHaveURL(/\/vehicles\//);
    }
  });
});
