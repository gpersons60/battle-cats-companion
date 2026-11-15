import { expect, test } from '@playwright/test';

test('connects account, discovery, planner, tracker and guide navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Battle Cats Companion' })).toBeVisible();
  await page.getByRole('button', { name: 'Set up account' }).click();
  await page.getByLabel('Numeric seed').fill('139026851');
  await page.getByRole('button', { name: 'Save seed' }).click();
  await expect(page.getByText('Canonical seed saved locally.')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /rev 1/ }).click();
  await expect(page.getByLabel('Numeric seed')).toHaveValue('139026851');
  await page.getByRole('button', { name: 'Route Planner' }).click();
  await page.getByLabel('Target unit').selectOption('demo-uber');
  await page.getByLabel('Target copies').fill('1');
  await page.getByLabel('Target priority').selectOption('high');
  await page.getByRole('button', { name: 'Add target' }).click();
  await page.getByRole('button', { name: 'Search bounded options' }).click();
  await expect(page.getByText(/Found \d+ bounded route option/)).toBeVisible();
  await page.getByRole('button', { name: 'Pulling Guide' }).click();
  await expect(page.getByText('Check before acting')).toBeVisible();
});

test('blocked route navigation cannot confirm an action', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Route Planner' }).click();
  await page.getByRole('button', { name: 'Search bounded options' }).click();
  await page.getByRole('button', { name: 'Pulling Guide' }).click();
  await expect(page.getByText('No valid proposal')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Matches' })).toHaveCount(0);
});

test('mismatch pauses the guide and preserves the actual result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Set up account' }).click();
  await page.getByLabel('Numeric seed').fill('139026851');
  await page.getByRole('button', { name: 'Save seed' }).click();
  await page.getByRole('button', { name: 'Route Planner' }).click();
  await page.getByLabel('Target unit').selectOption('demo-uber');
  await page.getByRole('button', { name: 'Add target' }).click();
  await page.getByRole('button', { name: 'Search bounded options' }).click();
  await expect(page.getByText(/Found \d+ bounded route option/)).toBeVisible();
  await page.getByRole('button', { name: 'Pulling Guide' }).click();
  await page.getByLabel('Actual outcomes, comma-separated').fill('demo-uber');
  await page.getByLabel('rareTickets').fill('1');
  await page.getByRole('button', { name: 'Different result' }).click();
  await expect(page.getByText('Mismatch recorded')).toBeVisible();
  await expect(page.getByText('Paused for reconciliation')).toBeVisible();
  await page.getByLabel('Corrected seed').fill('139026852');
  await page.getByLabel('Recovery assumptions').fill('Manual confirmation of the previous pull position.');
  await page.getByRole('button', { name: 'Save corrected seed for review' }).click();
  await page.getByRole('button', { name: 'Route Planner' }).click();
  await page.getByRole('button', { name: 'Search bounded options' }).click();
  await page.getByLabel('Objective').selectOption('mostUbers');
  await page.getByRole('button', { name: 'Search bounded options' }).click();
  await page.getByRole('button', { name: 'Review recovery assumptions and resume planning' }).click();
  await page.getByRole('button', { name: 'Pulling Guide' }).click();
  await expect(page.getByRole('button', { name: 'Matches' })).toBeEnabled();
});
