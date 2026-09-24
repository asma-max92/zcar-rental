import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login page
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });
});
