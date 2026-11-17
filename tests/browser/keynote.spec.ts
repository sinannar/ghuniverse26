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

test('Security presents sourced trends and real delayed-trigger incidents before announcements', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./#scene=section-security');
  await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', /^4\. Security/);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#scene=security-cve-growth$/);
  let slide = page.locator('#stage-slide > div:not([data-exiting])');
  await expect(slide.getByRole('heading', { name: 'Vulnerability disclosures are surging.' })).toBeVisible();
  const cves = slide.getByRole('list', { name: 'CVE records published by year' });
  await expect(cves.locator('li')).toHaveCount(5);
  for (const [year, value] of [['2022', '26,431'], ['2023', '30,949'], ['2024', '40,704'], ['2025', '49,972'], ['2026', '101,000']]) {
    await expect(cves.locator(`[data-cve-year="${year}"]`)).toContainText(value);
  }
  await expect(cves.locator('[data-cve-year="2026"]')).toContainText('YTD');
  await expect(slide).toContainText('records later rejected');
  await expect(slide).toContainText('not proof of exploitation');
  await expect(slide).toContainText('454,600+');
  await expect(slide.getByRole('link', { name: /NVD via Christensen/ })).toHaveAttribute('href', 'https://danielchristensen.no/en/tools/cve-statistics');
  await expect(slide.getByRole('link', { name: /Sonatype 2026/ })).toHaveAttribute('href', 'https://www.sonatype.com/state-of-the-software-supply-chain/2026/open-source-malware');
  const cveBars = await cves.locator('[data-chart-bar]').evaluateAll((bars) => bars.map((bar) => bar.getBoundingClientRect().height));
  expect(cveBars[0] / cveBars[4]).toBeCloseTo(26_431 / 101_000, 2);
  await expect(page.locator('#stage-slide [data-exiting]')).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('security-cve-growth.png') });

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#scene=security-supply-chain$/);
  slide = page.locator('#stage-slide > div:not([data-exiting])');
  const breaches = slide.getByRole('list', { name: 'Third-party involvement in analyzed breaches' });
  await expect(breaches.locator('li')).toHaveCount(3);
  for (const [edition, value] of [['2024', '~15%'], ['2025', '30%'], ['2026', '48%']]) {
    await expect(breaches.locator(`[data-dbir-edition="${edition}"]`)).toContainText(value);
  }
  const breachBars = await breaches.locator('[data-chart-bar]').evaluateAll((bars) => bars.map((bar) => bar.getBoundingClientRect().height));
  expect(breachBars[1] / breachBars[2]).toBeCloseTo(30 / 48, 2);
  const incidents = slide.getByRole('region', { name: 'Recent supply-chain incidents' });
  await expect(incidents).toContainText('500+ compromised npm packages removed');
  await expect(incidents).toContainText('5,561 repositories received poisoned workflow commits');
  await expect(incidents).toContainText('waited for an on-demand trigger');
  await expect(incidents).toContainText('ran when the library was imported, not installed');
  await expect(slide).toContainText('broader than a software supply-chain attack');
  await expect(slide.getByRole('link', { name: /Verizon 2026 DBIR/ })).toHaveAttribute('href', 'https://www.verizon.com/business/resources/Tc48/reports/2026-dbir-data-breach-investigations-report.pdf');
  await expect(incidents.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/');
  await expect(incidents.getByRole('link', { name: /SafeDep/ })).toHaveAttribute('href', 'https://safedep.io/blog/megalodon-mass-github-repo-backdooring-ci-workflows');
  await expect(incidents.getByRole('link', { name: /StepSecurity/ })).toHaveAttribute('href', 'https://www.stepsecurity.io/blog/compromised-next-branch-pushes-malicious-asyncapi-generator-generator-helpers-and-generator-components-to-npm');
  await expect(page.locator('#stage-slide [data-exiting]')).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('security-supply-chain.png') });

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#scene=ai-scan-reveal$/);
  await page.keyboard.press('g');
  await page.getByLabel('Search the keynote').fill('time bomb');
  await expect(page.getByRole('dialog', { name: 'Map' }).getByRole('button', { name: /Supply-chain attacks: the time bomb/ })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#scene=security-supply-chain$/);
  await page.reload();
  await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', /^Supply-chain attacks: the time bomb/);
  await page.keyboard.press('g');
  await page.getByLabel('Search the keynote').fill('CVE disclosures');
  await expect(page.getByRole('dialog', { name: 'Map' }).getByRole('button', { name: /CVE disclosures are rising/ })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#scene=security-cve-growth$/);
  expect(errors).toEqual([]);
});

test('the Security context slides fit projector viewports and work in presenter view', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
    await page.setViewportSize(viewport);
    for (const id of ['security-cve-growth', 'security-supply-chain']) {
      await page.goto(`./?fit=${viewport.width}-${id}#scene=${id}`);
      await expect(page).toHaveURL(new RegExp(`#scene=${id}$`));
      await expect(page.locator('#stage-slide')).toHaveAttribute('aria-label', id === 'security-cve-growth'
        ? /^CVE disclosures are rising/
        : /^Supply-chain attacks: the time bomb/);
      const current = page.locator('#stage-slide > div:not([data-exiting])');
      await expect(current.locator('figure')).toBeVisible();
      const bounds = await current.evaluate((element) => {
        const slide = element.getBoundingClientRect();
        return [...element.querySelectorAll('h2, figure, section[aria-label], p.absolute')].map((item) => {
          const box = item.getBoundingClientRect();
          return {
            left: box.left - slide.left,
            top: box.top - slide.top,
            right: box.right - slide.right,
            bottom: box.bottom - slide.bottom,
          };
        });
      });
      for (const box of bounds) {
        expect(box.left).toBeGreaterThanOrEqual(-1);
        expect(box.top).toBeGreaterThanOrEqual(-1);
        expect(box.right).toBeLessThanOrEqual(1);
        expect(box.bottom).toBeLessThanOrEqual(1);
      }
      if (viewport.width === 1280) {
        await expect(page.locator('#stage-slide [data-exiting]')).toHaveCount(0);
        await page.screenshot({ path: test.info().outputPath(`${id}-projector.png`) });
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const [presenter] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('p')]);
  await expect(presenter.getByRole('heading', { name: 'Supply-chain attacks: the time bomb' })).toBeVisible();
  await expect(presenter.getByText(/A targeted workflow variant could be triggered on demand/)).toBeVisible();
  await presenter.getByRole('toolbar', { name: 'Remote controls' }).getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/#scene=ai-scan-reveal$/);
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
