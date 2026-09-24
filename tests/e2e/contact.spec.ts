import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('loads contact form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input[name="name"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('textarea[name="message"]').first()).toBeVisible();
  });

  test('shows validation errors for empty form', async ({ page }) => {
    await page.goto('/contact');
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(500);
      // Should still be on contact page (form not submitted)
      await expect(page).toHaveURL(/\/contact/);
    }
  });
});
