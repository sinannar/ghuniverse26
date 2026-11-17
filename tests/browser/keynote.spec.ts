import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('the supplied keynote opens and navigates with its controls and keyboard', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && new URL(response.url()).origin === new URL(page.url()).origin) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toBeVisible();
  await expect(page.getByText('Every announcement. Simulated demos. One keynote.')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Keynote navigation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toHaveCSS('filter', 'blur(0px)');
  await page.screenshot({ path: test.info().outputPath('keynote-desktop.png') });

  await page.getByRole('button', { name: /^Announcements/ }).click();
  await expect(page).toHaveURL(/#scene=agenda$/);
  await expect(page.getByRole('heading', { name: /Five sections, 41 announcements/ })).toBeVisible();
  await page.keyboard.press('1');
  await expect(page).toHaveURL(/#scene=section-copilot$/);
  await page.reload();
  await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', /^1\. Copilot & agents/);
  await page.keyboard.press('g');
  await expect(page.getByRole('dialog', { name: 'Map' })).toBeVisible();
  await page.getByLabel('Search the keynote').fill('Copilot Fusion');
  await expect(page.getByRole('dialog', { name: 'Map' })).toContainText('Copilot Fusion');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Map' })).toBeHidden();
  expect(errors).toEqual([]);
});

test('deep-linked demos load for each section and identify simulations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const scenes = [
    ['copilot-fusion-demo', 'Copilot Fusion'],
    ['stacked-prs-demo', 'Stacked pull requests'],
    ['copilot-automations-demo', 'Copilot Automations'],
    ['ai-scan-demo', 'AI Scan'],
    ['enterprise-copilot', 'Copilot included with GitHub Enterprise'],
  ];

  for (const [id, title] of scenes) {
    await page.goto(`./?scene-test=${id}#scene=${id}`);
    await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', new RegExp(title, 'i'));
    await expect(page).toHaveURL(new RegExp(`#scene=${id}$`));
    await expect(page.locator('#stage-slide > div:not([data-exiting])').getByText(/Simulated demo/)).toBeVisible();
    await expect(page.locator('#stage-slide .kn-shimmer')).toHaveCount(0);
  }

  await page.goto('./?scene-test=data#scene=octoverse-2026-growth');
  await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', /Octoverse 2026: more of everything/i);
  await expect(page.locator('#stage-slide .kn-shimmer')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Explore search can present a result and return to it', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('o');
  const explore = page.getByRole('region', { name: 'Explore announcements' });
  await expect(explore).toBeVisible();
  await explore.getByLabel('Search announcements').fill('Copilot Fusion');
  await expect(explore).toContainText('3 of 41 announcements');
  await explore.getByRole('button', { name: /Headline Copilot Fusion Choose the effort/ }).click();
  await expect(explore.getByRole('heading', { name: 'Copilot Fusion', exact: true }).first()).toBeVisible();
  await expect(explore.getByRole('button', { name: 'Simulated demo', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await explore.getByRole('button', { name: 'Present this scene' }).click();
  await expect(page).toHaveURL(/#scene=copilot-fusion-demo$/);
  await page.getByRole('button', { name: /Back to Explore/ }).click();
  await expect(explore.getByRole('heading', { name: 'Copilot Fusion', exact: true }).first()).toBeVisible();
});

test('the presenter window follows and controls the audience window', async ({ page }) => {
  await page.goto('./#scene=copilot-fusion-demo');
  await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', /Copilot Fusion: in action/);
  const [presenter] = await Promise.all([
    page.waitForEvent('popup'),
    page.keyboard.press('p'),
  ]);
  await expect(presenter).toHaveURL(/\?presenter=1$/);
  await expect(presenter.getByRole('heading', { name: 'Presenter view' })).toBeVisible();
  await expect(presenter.getByRole('heading', { name: 'Copilot Fusion: in action' })).toBeVisible();
  await presenter.getByRole('toolbar', { name: 'Remote controls' }).getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('img', { name: /Step 2 of .* on this screen/ })).toBeVisible();
  await presenter.getByRole('button', { name: 'Next screen (Shift+Right)' }).click();
  await expect(page).toHaveURL(/#scene=copilot-fusion-impact$/);
  await expect(presenter.getByRole('heading', { name: 'Copilot Fusion: why it matters' })).toBeVisible();
});

test('the mobile keynote links to the preserved presentation and creation story', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toHaveCSS('filter', 'blur(0px)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: test.info().outputPath('keynote-mobile.png') });
  await page.getByRole('button', { name: 'More controls' }).click();
  await page.getByRole('menuitem', { name: 'Explore all announcements' }).click();
  const explore = page.getByRole('region', { name: 'Explore announcements' });
  await explore.getByLabel('Search announcements').fill('Copilot Fusion');
  await expect(explore).toContainText('3 of 41 announcements');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await explore.getByRole('button', { name: /^Home/ }).click();
  await page.getByRole('button', { name: 'More controls' }).click();
  await page.getByRole('menuitem', { name: 'Original presentation' }).click();
  await expect(page.locator('#chart-1')).toBeVisible();
  await page.getByRole('link', { name: 'Universe 2026 presentation home' }).click();
  await expect(page.getByRole('heading', { name: 'Universe 2026', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'More controls' }).click();
  await page.getByRole('menuitem', { name: 'How this was built' }).click();
  await expect(page).toHaveURL(/\/making-of\/$/);
  await expect(page.getByRole('list', { name: 'Creation timeline' })).toBeVisible();
});

test('without JavaScript, the keynote links to the readable original presentation', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('noscript p')).toContainText('The interactive keynote requires JavaScript.');
  await page.getByRole('link', { name: 'Open the original presentation' }).click();
  await expect(page.locator('#chart-1')).toBeVisible();
  await context.close();
});
