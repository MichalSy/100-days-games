import { expect, test } from '@playwright/test';

test('gallery loads with theme toggle and prompt affordances', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /100 days of browser games/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /theme/i })).toBeVisible();
  await expect(page.getByText('Prompt appears after generation').first()).toBeVisible();
  await expect(page.locator('.game-card')).toHaveCount(100);
  expect(errors).toEqual([]);
});

test('light theme can be enabled', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
