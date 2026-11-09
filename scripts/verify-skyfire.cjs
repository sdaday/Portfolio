const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('C:/Users/sday1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve('index.html')).href);
    await page.locator('[data-language="zh"]').click();
    const open = () => page.locator('[data-project-id="ue5-environment-systems"]').click();
    await open();
    const homeY = await page.evaluate(() => scrollY);
    assert.equal(await page.locator('[data-plan-heading]').count(), 31);
    assert.equal(await page.locator('.plan-nav-link').count(), 31);
    assert.equal(await page.locator('.plan-document img').count(), 24);
    assert.equal(await page.locator('.plan-document table').count(), 2);
    assert.equal(await page.locator('.plan-introduction a').getAttribute('href'), 'https://github.com/sdaday/GEDD_Level3');
    assert.equal(await page.locator('.plan-introduction a').getAttribute('target'), '_blank');
    assert.deepEqual(await page.locator('.plan-introduction').evaluate(el => Array.from(el.children, child => child.tagName)), ['H2', 'TABLE', 'FIGURE']);
    assert.equal(await page.locator('.project-info-table tr').count(), 7);
    assert.equal(await page.locator('.project-info-table th').count(), 0);
    assert(await page.locator('.project-info-table tr').evaluateAll(rows => rows.every(row => row.cells.length === 2 && [...row.cells].every(cell => cell.tagName === 'TD'))));
    assert.deepEqual(await page.locator('.project-info-table td:first-child').allTextContents(), ['游戏名称', '游戏类型', '游戏简介', '面向平台', '工具', '项目开发周期', '项目链接']);
    assert.deepEqual((await page.locator('.project-info-table td:nth-child(2)').allTextContents()).slice(0, 6), ['Skyfire Uprising', 'FPS、TPS', '本游戏共七个关卡，玩家将作为人类反抗力量的一员，逐步突破外星敌人的封锁，最终阻止外星势力的入侵。', 'PC', 'Unreal Engine 5', '约4周']);
    assert.equal(await page.locator('.plan-cover img').getAttribute('src'), 'assets/images/skyfire/gameplay-21.png');
    assert.equal(await page.locator('.plan-cover figcaption').textContent(), '第三关海战实机画面');
    assert.equal(await page.locator('.plan-document').evaluate(el => el.firstElementChild.id), 'skyfire-section-1');
    assert.equal(await page.locator('.plan-scroll').getByText('从港口出发，驾驶武装船只前往岛屿，与外星敌机进行海上战斗。', { exact: true }).count(), 0);
    assert.equal(await page.locator('.plan-document').getByText('团队项目个人职责与实现说明', { exact: true }).count(), 0);
    assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollTop), 0);
    fs.mkdirSync('artifacts/skyfire-qa', { recursive: true });
    await page.screenshot({ path: 'artifacts/skyfire-qa/desktop.png' });
    await page.locator('.plan-document img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
    await page.waitForFunction(() => [...document.querySelectorAll('.plan-document img')].every(image => image.complete && image.naturalWidth));
    const ids = await page.locator('.plan-nav-link').evaluateAll(links => links.map(link => link.dataset.section));
    for (const id of ids) {
      await page.locator(`[data-section="${id}"]`).click();
      await page.waitForTimeout(35);
      const position = await page.locator(`#${id}`).evaluate(el => {
        const root = el.closest('.plan-scroll').getBoundingClientRect();
        const box = el.getBoundingClientRect();
        return { top: box.top - root.top, bottom: box.bottom - root.top, height: root.height };
      });
      assert(position.top >= -2 && position.bottom <= position.height + 2, `Navigation missed ${id}: ${JSON.stringify(position)}`);
      assert.equal(await page.evaluate(() => scrollY), homeY);
    }
    await page.locator('.plan-scroll').evaluate(root => {
      const h = root.querySelector('#skyfire-section-3-3-1');
      root.scrollTop += h.getBoundingClientRect().top - root.getBoundingClientRect().top - 24;
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.plan-nav-link[aria-current]').getAttribute('data-section'), 'skyfire-section-3-3-1');
    assert.equal(await page.locator('.plan-tree-toggle, .plan-toc [aria-expanded], .plan-toc .is-collapsed').count(), 0);
    assert(await page.locator('.plan-nav-link').evaluateAll(links => links.every(link => link.getClientRects().length)));
    const captions = await page.locator('.plan-document .plan-caption').allTextContents();
    assert.equal(captions[0], '图1 课件中的游戏要求');
    assert.equal(captions[1], '图2 课件中的游戏要求');
    const numbers = captions.map(caption => Number(caption.match(/^图\s*(\d+)/)[1]));
    assert.deepEqual([...numbers].sort((a, b) => a - b), Array.from({ length: 24 }, (_, i) => i + 1));
    await page.locator('.plan-scroll').evaluate(el => el.scrollTop = 0);
    await page.locator('.plan-cover .plan-image').click();
    assert(await page.locator('.plan-lightbox').isVisible());
    await page.locator('[data-image-size]').click();
    assert(await page.locator('.plan-lightbox').evaluate(el => el.classList.contains('is-original-size')));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.plan-lightbox').count(), 0);
    assert(await page.locator('#project-modal').evaluate(el => el.classList.contains('is-open')));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => scrollY), homeY);
    await open();
    assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollTop), 0);
    await page.locator('#modal-close').click();
    for (const id of ['ue5-individual-game', 'directx12-graphics', 'advanced-graphics', 'games-engineering', 'programming-algorithms']) {
      await page.locator(`[data-project-id="${id}"]`).click();
      assert.equal(await page.locator('.plan-workspace:visible').count(), id === 'ue5-individual-game' ? 1 : 0);
      assert.equal(await page.locator('.modal-grid:visible').count(), id === 'ue5-individual-game' ? 0 : 1);
      if (id === 'ue5-individual-game') {
        await page.locator('[data-video-src]').click();
        assert(await page.locator('#video-modal').evaluate(el => el.classList.contains('is-open')));
        await page.locator('#video-close').click();
        assert.equal(await page.locator('#gameplay-video').evaluate(el => el.currentTime), 0);
      }
      await page.locator('#modal-close').click();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await open();
    assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
    await page.screenshot({ path: 'artifacts/skyfire-qa/mobile-intro.png' });
    await page.locator('.plan-toc-button').click();
    await page.locator('[data-section="skyfire-section-3-3-1"]').click();
    assert.equal(await page.locator('.plan-toc-button').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
    await page.screenshot({ path: 'artifacts/skyfire-qa/mobile.png' });
    await page.locator('.plan-toc-button').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.plan-toc-button').getAttribute('aria-expanded'), 'false');
    assert(await page.locator('#project-modal').evaluate(el => el.classList.contains('is-open')));
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log('PASS: 31 always-expanded navigation targets, scroll tracking, 24 figure captions, 24 images, 2 tables, lightbox, reopening, five original projects, video, mobile drawer, and no JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
