import { expect, test } from '@playwright/test';

test('the development server renders and navigates the keynote', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Announcements/ }).click();
  await expect(page).toHaveURL(/#scene=agenda$/);
  expect(errors).toEqual([]);
});
