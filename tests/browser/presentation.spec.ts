import { expect, test } from '@playwright/test';
import { topics } from '../../src/data/topics';

test('opens on real report evidence, not a title or a recap landing page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('[data-slide]:visible')).toHaveCount(1);
  await expect(page.locator('#chart-1')).toBeVisible();
  for (const value of ['5.2B', '6.7B', '17.9B']) await expect(page.locator('#chart-1')).toContainText(value);
  await expect(page.locator('.category-tab')).toHaveText(['Octoverse', 'Platform', 'Badge', 'Copilot', 'Sessions']);
  await expect(page.getByRole('button', { name: 'Previous slide', exact: true })).toBeDisabled();
  await page.screenshot({ path: test.info().outputPath('opening-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: test.info().outputPath('opening-mobile.png') });
  expect(errors).toEqual([]);
});

test('the Platform chapter keeps its four announcement topics', async ({ page }) => {
  await page.goto('./platform/');
  await expect(page.locator('.topic-door')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Universe badge/ })).toHaveCount(0);
});

test('the Badge chapter presents a distinct four-topic journey and build resources', async ({ page }) => {
  await page.goto('./badge/');
  await expect(page.locator('.topic-door h2')).toHaveText([
    'Meet the badge', 'Built to interact', 'Apps for the event', 'Build for the badge',
  ]);
  await page.getByRole('link', { name: /Built to interact/ }).click();
  await expect(page.locator('#idea .slide-lead')).toContainText('sensors and controls');
  await page.getByText('Sources & context', { exact: true }).click();
  await expect(page.locator('.source-popover a[href="https://github.com/badger/home/blob/main/hardware/README.md"]')).toBeVisible();
  await page.goto('./badge/build-for-the-badge/');
  await page.getByText('Sources & context', { exact: true }).click();
  await expect(page.locator('.source-popover a[href="https://badger.github.io/"]')).toBeVisible();
  await expect(page.locator('.source-popover a[href="https://badger.github.io/editor"]')).toBeVisible();
  await expect(page.locator('.source-popover')).toContainText('does not exactly model');
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
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
  await page.getByText('Read the original app session story', { exact: true }).click();
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

test('session slides credit speakers and link back to the related announcement', async ({ page }) => {
  await page.goto('./sessions/');
  await expect(page.locator('.topic-door')).toHaveCount(5);
  await page.goto('./sessions/stacked-prs-in-practice/');
  await expect(page.locator('#chart-1')).toBeVisible();
  await expect(page.locator('#chart-1 .chart-source')).toContainText('Sameen Karim');
  await page.goto('./sessions/stacked-prs-in-practice/#idea');
  await expect(page.locator('#idea .session-byline')).toContainText('Sameen Karim');
  await page.getByText('Sources & context', { exact: true }).click();
  await expect(page.locator('.source-popover')).toContainText('AI-generated session summary');
  await expect(page.locator('.source-popover')).toContainText('Speaker slides (PDF)');
  await expect(page.locator('.source-popover')).not.toContainText('Universe 2026 recap');
  await page.getByText('Sources & context', { exact: true }).click();
  await page.getByRole('link', { name: /Related slide: Stacked pull requests/ }).click();
  await expect(page).toHaveURL(/\/platform\/stacked-pull-requests\/$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./sessions/factory-mindset/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('creation timeline keeps review evidence and records on-page at desktop and mobile sizes', async ({ page }) => {
  await page.goto('./making-of/');
  const timeline = page.getByRole('list', { name: 'Creation timeline' });
  const steps = timeline.locator(':scope > li');
  await expect(steps).toHaveCount(5);
  await expect(timeline.locator(':scope > li > h2')).toHaveText([
    'Copilot app · create the presentation and PR #1',
    'Parallel reviews · PR #1',
    'Copilot app · apply corrections, then Agent Merge',
    'Pages · the post-merge build failed',
    'Cloud agent · fix the test and deploy',
  ]);
  const reviews = steps.nth(1).getByRole('list', { name: 'Parallel reviews' });
  await expect(reviews.locator(':scope > li > h3')).toHaveText([
    'Copilot CLI · review PR #1 on the side',
    'Cloud code review · a second review track',
  ]);
  await expect(timeline).toContainText('share step 02');
  const colors = ['rgb(52, 125, 59)', 'rgb(154, 77, 0)', 'rgb(52, 125, 59)', 'rgb(180, 35, 24)', 'rgb(52, 125, 59)'];
  for (const [index, color] of colors.entries()) {
    await expect(steps.nth(index).locator(':scope > h2')).toHaveCSS('color', color);
    expect(await steps.nth(index).evaluate(element => getComputedStyle(element, '::before').color)).toBe(color);
  }
  for (const heading of await reviews.locator('h3').all()) {
    await expect(heading).toHaveCSS('color', colors[1]);
  }
  for (const type of ['unknown', null]) {
    await steps.first().evaluate((element, value) => {
      if (value === null) element.removeAttribute('data-session-type');
      else element.setAttribute('data-session-type', value);
    }, type);
    await expect(steps.first().locator('h2')).toHaveCSS('color', 'rgb(9, 105, 218)');
    expect(await steps.first().evaluate(element => getComputedStyle(element, '::before').color)).toBe('rgb(9, 105, 218)');
  }
  await steps.first().evaluate(element => element.setAttribute('data-session-type', 'change'));
  const url = page.url();
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const summary of [
      'What the cloud review found',
      'Review corrections and their validation',
      'Why a merged PR still needed a follow-up',
      'The repair and the verified outcome',
      'Read the Copilot CLI side-review record',
      'Read the discovery conversation',
      'Read the implementation plan',
    ]) {
      const control = page.getByText(summary, { exact: true });
      await control.focus();
      await page.keyboard.press('Enter');
      await expect(control.locator('..')).toHaveAttribute('open');
      expect(page.url()).toBe(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.keyboard.press('Enter');
      await expect(control.locator('..')).not.toHaveAttribute('open');
    }
  }
  await page.getByText('Read the Copilot CLI side-review record', { exact: true }).click();
  await expect(page.getByText('The original attachment could not be copied or inspected.', { exact: false })).toBeVisible();
  await expect(page.locator('.creation-record')).toContainText('not the attached transcript');
  await page.getByText('What the cloud review found', { exact: true }).click();
  await expect(timeline.getByRole('link', { name: 'cloud review job', exact: true })).toHaveAttribute('href', 'https://github.com/sinannar/ghuniverse26/actions/runs/43672715559/job/132686090551');
  await page.getByText('The repair and the verified outcome', { exact: true }).click();
  await expect(timeline.getByRole('link', { name: 'cloud repair job', exact: true })).toHaveAttribute('href', 'https://github.com/sinannar/ghuniverse26/actions/runs/43762614333/job/132960560040');
});

test('creation timeline and its disclosures work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}making-of/`);
  const timeline = page.getByRole('list', { name: 'Creation timeline' });
  await expect(timeline.locator(':scope > li')).toHaveCount(5);
  await expect(timeline.getByRole('list', { name: 'Parallel reviews' }).locator(':scope > li')).toHaveCount(2);
  await page.getByText('Read the Copilot CLI side-review record', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Source and availability' })).toBeVisible();
  await page.getByText('The repair and the verified outcome', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'subsequent Pages run' })).toBeVisible();
  await context.close();
});

test('iteration 02 timeline groups reviews and exposes its records', async ({ page, browser, baseURL }) => {
  await page.goto('./making-of/');
  const timeline = page.getByRole('list', { name: 'Iteration 02 timeline' });
  const steps = timeline.locator(':scope > li');
  await expect(steps.locator(':scope > h2')).toHaveText([
    'Skills · prepare the tools',
    'Copilot CLI · plan workflows and open PR #7',
    'Parallel reviews · PR #7',
    'Cloud agent · address review feedback',
  ]);
  const colors = ['rgb(52, 125, 59)', 'rgb(52, 125, 59)', 'rgb(154, 77, 0)', 'rgb(52, 125, 59)'];
  for (const [index, color] of colors.entries()) {
    await expect(steps.nth(index).locator(':scope > h2')).toHaveCSS('color', color);
    expect(await steps.nth(index).evaluate(element => getComputedStyle(element, '::before').color)).toBe(color);
  }
  const reviews = steps.nth(2).getByRole('list', { name: 'Iteration 02 parallel reviews' });
  await expect(reviews.locator(':scope > li > h3')).toHaveText(['Copilot CLI · local review', 'Cloud Code Review · issue labeler review']);
  for (const heading of await reviews.locator('h3').all()) await expect(heading).toHaveCSS('color', colors[2]);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const summary of ['Read the iteration 02 session record', 'Read the iteration 02 local CLI review', 'Read the iteration 02 cloud review', 'Read the iteration 02 discovery conversation', 'Read the iteration 02 implementation plan']) {
      const control = page.getByText(summary, { exact: true });
      await control.focus();
      await page.keyboard.press('Enter');
      await expect(control.locator('..')).toHaveAttribute('open');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.keyboard.press('Enter');
    }
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  await noJsPage.goto(`${baseURL}making-of/`);
  await expect(noJsPage.getByRole('list', { name: 'Iteration 02 timeline' }).locator(':scope > li')).toHaveCount(4);
  await noJsPage.getByText('Read the iteration 02 cloud review', { exact: true }).click();
  await expect(noJsPage.getByRole('heading', { name: 'Copilot Code Review — iteration 02' })).toBeVisible();
  await context.close();
});

test('source and interactive controls own their keys; end-of-talk does not loop', async ({ page }) => {
  await page.goto('./sessions/worth-building/');
  await page.locator('.source-popover summary').click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#idea')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.source-popover')).not.toHaveAttribute('open');
  await page.locator('[data-slide-select]').focus();
  await page.evaluate(() => {
    window.addEventListener('keydown', (event) => {
      (window as Window & { selectorKeyPrevented?: boolean }).selectorKeyPrevented = event.defaultPrevented;
    }, { once: true });
  });
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => (window as Window & { selectorKeyPrevented?: boolean }).selectorKeyPrevented)).toBe(false);
  await expect(page.locator('[data-slide-select]')).toHaveValue('discussion');
  await expect(page.locator('#discussion')).toBeVisible();
  await expect(page).toHaveURL(/\/sessions\/worth-building\/#discussion$/);
  await page.locator('[data-slide-select]').selectOption('idea');
  await expect(page.locator('#idea')).toBeVisible();
  await page.locator('#idea h2').click();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'End of presentation' })).toBeDisabled();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#discussion')).toBeVisible();
  await expect(page).toHaveURL(/\/sessions\/worth-building\/#discussion$/);
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

test('report context remains visible after the charts', async ({ page }) => {
  await page.goto('./octoverse/global-growth/');
  await expect(page.locator('#chart-1')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#idea')).toBeVisible();
  await expect(page.locator('#idea')).toContainText('more than 225 million developers');
  await page.goto('./octoverse/languages/');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#idea')).toBeVisible();
  await expect(page.locator('#idea')).toContainText('TypeScript, Python, and JavaScript retained the top three places');
});

test('fullscreen survives forward, backward, and history topic transitions', async ({ page }) => {
  await page.goto('./platform/stacked-pull-requests/#discussion');
  const documentStart = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole('button', { name: 'Enter fullscreen' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
  await page.locator('#discussion h2').click();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/platform\/cli-attachments\/$/);
  await expect(page.locator('#idea')).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentStart);
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
  await expect(page.getByRole('button', { name: 'Exit fullscreen' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#discussion')).toBeVisible();
  await expect(page).toHaveURL(/\/platform\/stacked-pull-requests\/#discussion$/);
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
  await page.goBack();
  await expect(page).toHaveURL(/\/platform\/cli-attachments\/$/);
  await expect(page.locator('#idea')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#discussion')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#idea')).toBeVisible();
  await page.getByRole('button', { name: 'Exit fullscreen' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
});

test('Escape leaves independent creation-story disclosures alone', async ({ page }) => {
  await page.goto('./making-of/');
  const disclosures = page.locator('.creation-record details');
  await disclosures.nth(0).locator('summary').click();
  await disclosures.nth(1).locator('summary').click();
  await page.keyboard.press('Escape');
  await expect(disclosures.nth(0)).toHaveAttribute('open');
  await expect(disclosures.nth(1)).toHaveAttribute('open');
  await expect(disclosures.nth(1).locator('summary')).toBeFocused();
});

test('print exposes every slide without exposing other hidden controls', async ({ page }) => {
  await page.goto('./platform/stacked-pull-requests/');
  await expect(page.locator('[data-slide]:visible')).toHaveCount(1);
  const slideCount = await page.locator('[data-slide]').count();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('[data-slide]:visible')).toHaveCount(slideCount);
  await expect(page.locator('.site-header')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await expect(page.locator('[data-slide]:visible')).toHaveCount(1);
});

test('short landscape screens can scroll from the beginning to the end of oversized slides', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  for (const [route, slideId] of [['octoverse/global-growth/', 'chart-1'], ['octoverse/industries/#discussion', 'discussion']]) {
    await page.goto(`./${route}`);
    const slide = page.locator(`#${slideId}`);
    await expect(slide).toBeVisible();
    const bounds = await slide.evaluate((element) => {
      element.scrollTop = 0;
      const start = element.firstElementChild!.getBoundingClientRect().top - element.getBoundingClientRect().top;
      element.scrollTop = element.scrollHeight;
      const end = element.lastElementChild!.getBoundingClientRect().bottom - element.getBoundingClientRect().bottom;
      return { start, end };
    });
    expect(bounds.start, `${route}: clipped start`).toBeGreaterThanOrEqual(-1);
    expect(bounds.end, `${route}: clipped end`).toBeLessThanOrEqual(1);
  }
});
