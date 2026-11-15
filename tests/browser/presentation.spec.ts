import { expect, test } from '@playwright/test';
import { topics } from '../../src/data/topics';

test('opens on real report evidence, not a title or a recap landing page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('[data-slide]:visible')).toHaveCount(1);
  await expect(page.locator('#chart-1')).toBeVisible();
  for (const value of ['5.2B', '6.7B', '17.9B']) await expect(page.locator('#chart-1')).toContainText(value);
  await expect(page.locator('.category-tab')).toHaveText(['Octoverse', 'Platform', 'Copilot']);
  await expect(page.getByRole('button', { name: 'Previous slide', exact: true })).toBeDisabled();
  await page.screenshot({ path: test.info().outputPath('opening-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath('opening-mobile.png') });
  expect(errors).toEqual([]);
});

test('keys traverse slides, cross topics, preserve hashes, and return to the chooser', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#chart-2$/);
  await expect(page.locator('#chart-2')).toBeVisible();
  await page.reload();
  await expect(page.locator('#chart-2')).toBeVisible();
  await page.keyboard.press('End');
  await expect(page.locator('#discussion')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#chart-2')).toBeVisible();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/octoverse\/global-growth\/$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/octoverse\/momentum\/#discussion$/);
  await expect(page.locator('#discussion')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/octoverse\/$/);
  await expect(page.locator('.topic-door')).toHaveCount(7);
  await expect(page.locator('form')).toHaveCount(0);
});

test('demo pauses are opt-in and Fusion uses the actual creation story', async ({ page }) => {
  await page.goto('./platform/stacked-pull-requests/');
  await page.keyboard.press('End');
  await expect(page.locator('[data-slide-count]')).toHaveText('2 / 2');
  await expect(page.getByRole('button', { name: /Next topic:/ })).toBeVisible();
  await page.getByRole('link', { name: 'Optional demo' }).click();
  await expect(page.locator('#demo')).toBeVisible();
  await expect(page.locator('[data-slide-count]')).toHaveText('3 / 3');
  await page.reload();
  await expect(page.locator('#demo')).toBeVisible();
  await page.locator('[data-slide-select]').selectOption('discussion');
  await expect(page.locator('[data-slide-count]')).toHaveText('2 / 2');
  await page.locator('#discussion h2').click();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/platform\/cli-attachments\/$/);
  await expect(page.locator('#idea')).toBeVisible();
  await page.goto('./copilot/fusion/#creation');
  await expect(page.locator('#creation')).toBeVisible();
  await expect(page.locator('#creation')).toContainText('initial creation');
  await expect(page.locator('#creation')).toContainText('GitHub Copilot app');
  await page.screenshot({ path: test.info().outputPath('fusion-creation.png') });
  await page.getByRole('link', { name: /Conversation, plan, and session story/ }).click();
  await expect(page).toHaveURL(/\/making-of\/$/);
  await expect(page.getByRole('heading', { name: 'Session context' })).toBeVisible();
  await expect(page.locator('.creation-record')).toContainText('Universe demo showcase');
  await expect(page.locator('.creation-record')).toContainText('iteration 01');
  await expect(page.getByRole('heading', { name: 'How the website works' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('making-of-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath('making-of-mobile.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByText('Read the discovery conversation', { exact: true }).click();
  await expect(page.locator('.creation-record')).toContainText('I want to start presenting with report data');
  await page.getByRole('link', { name: 'Return to the Fusion slide' }).click();
  await expect(page.locator('#creation')).toBeVisible();
  await page.goto('./copilot/projects/');
  await expect(page.locator('[data-optional]')).toHaveCount(0);
});

test('source and interactive controls own their keys; end-of-talk does not loop', async ({ page }) => {
  await page.goto('./copilot/automations/');
  await page.locator('.source-popover summary').click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#idea')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.source-popover')).not.toHaveAttribute('open');
  await page.locator('[data-slide-select]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#idea')).toBeVisible();
  await page.locator('#idea h2').click();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'End of presentation' })).toBeDisabled();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#discussion')).toBeVisible();
  await expect(page).toHaveURL(/\/copilot\/automations\/#discussion$/);
});

test('all regular slides fit projector viewports and stay horizontally readable on mobile', async ({ page }) => {
  const defects: string[] = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const topic of topics) {
      await page.goto(`./${topic.category}/${topic.id}/`);
      for (const option of await page.locator('[data-slide-select] option').all()) {
        const id = await option.getAttribute('value');
        if (!id) continue;
        await page.locator('[data-slide-select]').selectOption(id);
        const dimensions = await page.locator(`[id="${id}"]`).evaluate((slide) => ({
          horizontal: document.documentElement.scrollWidth - innerWidth,
          bodyVertical: document.documentElement.scrollHeight - innerHeight,
          slideVertical: slide.scrollHeight - slide.clientHeight,
          visibleSlides: [...document.querySelectorAll<HTMLElement>('[data-slide]')].filter((item) => !item.hidden).length,
        }));
        const prefix = `${viewport.width}×${viewport.height} ${topic.id}#${id}`;
        if (dimensions.horizontal > 1) defects.push(`${prefix}: horizontal overflow ${dimensions.horizontal}`);
        if (dimensions.visibleSlides !== 1) defects.push(`${prefix}: multiple slides visible`);
        if (viewport.width >= 1280 && (dimensions.bodyVertical > 1 || dimensions.slideVertical > 1)) defects.push(`${prefix}: vertical overflow ${JSON.stringify(dimensions)}`);
      }
    }
  }
  expect(defects).toEqual([]);
});

test('without JavaScript, the report and ordinary topic links remain readable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('#chart-1')).toBeVisible();
  await expect(page.locator('#chart-2')).toBeVisible();
  await expect(page.locator('[data-next-topic]')).toBeVisible();
  await context.close();
});
