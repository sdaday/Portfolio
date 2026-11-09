const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { chromium } = require('C:/Users/sday1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const dataContext = { window: {} };
  vm.runInNewContext(fs.readFileSync('assets/data/broken-throne-document.js', 'utf8'), dataContext);
  const data = JSON.parse(JSON.stringify(dataContext.window.BROKEN_THRONE_DOCUMENT));
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('file:///C:/Users/sday1/Desktop/Portfolio/index.html');
    await page.locator('[data-language="zh"]').click();
    const trigger = page.locator('[data-project-id="ue5-individual-game"]');
    const card = trigger.locator('xpath=ancestor::article');
    assert.equal(await card.locator('h3').textContent(), 'Broken Throne');
    assert.equal(await card.locator('.contribution-label').textContent(), '核心设计与实现');
    assert.equal(await card.locator('.discipline').textContent(), '完整游戏流程');
    assert.equal(await card.locator('img').getAttribute('src'), 'assets/images/projects/Individual game.png');
    await trigger.click();
    const homeY = await page.evaluate(() => scrollY);
    assert.equal(await page.locator('#modal-title').textContent(), 'Broken Throne 个人动作游戏策划案');
    assert.equal(await page.locator('.project-info-table tr').count(), 8);
    assert(await page.locator('.project-info-table tr').evaluateAll(rows => rows.every(row => row.cells.length === 2)));
    assert.equal(await page.locator('.project-info-table a').getAttribute('href'), 'https://github.com/sdaday/WM9M6Game');
    const lastRows = page.locator('.project-info-table tr');
    assert.equal(await lastRows.nth(6).locator('td').first().textContent(), '项目链接');
    assert.equal(await lastRows.nth(6).locator('[data-video-src]').count(), 0);
    assert.equal(await lastRows.nth(7).locator('td').first().textContent(), '玩法视频');
    assert.equal(await lastRows.nth(7).locator('a').count(), 0);
    assert.equal(await lastRows.nth(7).locator('[data-video-src]').getAttribute('data-video-src'), 'assets/videos/projects/broken-throne-gameplay.mp4');
    assert.equal(await page.locator('.plan-cover img').getAttribute('src'), 'assets/images/projects/Individual game.png');
    assert.equal(await page.locator('.plan-document').evaluate(el => el.firstElementChild.id), 'broken-throne-section-1');
    assert.equal(await page.locator('#broken-throne-section-1').evaluate(el => el.nextElementSibling.id), 'broken-throne-section-1-1');
    assert.equal(await page.locator('.plan-document table').count(), 8);
    assert.equal(await page.locator('.plan-document').getByText('原项目链接', {exact:true}).count(), 0);
    assert(!(await page.locator('.plan-document').textContent()).includes('结构整理版'));
    assert.equal(await page.locator('[data-plan-heading="1"]').count(), 6);
    assert.equal(await page.locator('.plan-nav-link').count(), 34);
    assert.equal(await page.locator('.plan-tree-toggle').count(), 0);
    assert.equal(await page.locator('.plan-document img').count(), 21);
    const actualTables = await page.locator('.plan-document table').evaluateAll(tables => tables.map(table => [...table.rows].map(row => [...row.cells].map(cell => cell.textContent))));
    assert.deepEqual(actualTables, data.tables);
    const figures = await page.locator('.plan-document .plan-caption').allTextContents();
    assert.equal(figures.length, 21);
    assert.deepEqual(figures.map(text => Number(text.match(/图表\s*(\d+)/)[1])), Array.from({length:21}, (_, i) => i + 1));
    fs.mkdirSync('artifacts/broken-throne-qa', { recursive: true });
    await page.screenshot({ path: 'artifacts/broken-throne-qa/desktop.png' });
    await page.locator('.plan-document img').evaluateAll(images => images.forEach(img => img.loading = 'eager'));
    await page.waitForFunction(() => [...document.querySelectorAll('.plan-document img')].every(img => img.complete && img.naturalWidth));
    for (const heading of data.headings) {
      await page.locator(`[data-section="${heading.id}"]`).click();
      await page.waitForTimeout(30);
      assert(await page.locator(`#${heading.id}`).evaluate(el => {
        const box=el.getBoundingClientRect(), root=el.closest('.plan-scroll').getBoundingClientRect();
        return box.top >= root.top - 2 && box.bottom <= root.bottom + 2;
      }), heading.id);
      assert.equal(await page.evaluate(() => scrollY), homeY);
    }
    await page.locator('.plan-scroll').evaluate(root => {
      const h = root.querySelector('#broken-throne-section-4-4');
      root.scrollTop += h.getBoundingClientRect().top - root.getBoundingClientRect().top - 24;
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.plan-nav-link[aria-current]').getAttribute('data-section'), 'broken-throne-section-4-4');
    await page.locator('.plan-scroll').evaluate(el => el.scrollTop=0);
    await page.locator('.plan-cover button').click();
    assert(await page.locator('.plan-lightbox').isVisible());
    await page.keyboard.press('Escape');
    assert(await page.locator('#project-modal').evaluate(el => el.classList.contains('is-open')));
    await page.locator('[data-video-src]').click();
    assert(await page.locator('#video-modal').evaluate(el => el.classList.contains('is-open')));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#gameplay-video').evaluate(el => el.currentTime), 0);
    await page.locator('#modal-close').click();
    await trigger.click();
    assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollTop), 0);
    await page.locator('#modal-close').click();
    await page.locator('[data-language="en"]').click();
    await page.locator('[data-project-id="ue5-environment-systems"]').click();
    const skyfireHTML = await page.locator('#modal-content').innerHTML();
    assert.equal(crypto.createHash('sha256').update(skyfireHTML).digest('hex'), 'cfecd3784ffb2e46e0cf57ce78f533d265f2620b2e803dc2b387bd2bfa32a3c6', 'Skyfire rendered markup changed');
    await page.locator('#modal-close').click();
    await page.locator('[data-language="zh"]').click();
    for (const width of [390, 320]) {
      await page.setViewportSize({width,height:844});
      await trigger.click();
      assert.equal(await page.locator('.plan-scroll').evaluate(el => el.scrollWidth > el.clientWidth+1), false);
      await page.screenshot({path:`artifacts/broken-throne-qa/mobile-${width}.png`});
      await page.locator('.plan-toc-button').click();
      await page.locator('[data-section="broken-throne-section-4-4"]').click();
      assert.equal(await page.locator('.plan-toc-button').getAttribute('aria-expanded'), 'false');
      await page.keyboard.press('Escape');
    }
    assert.deepEqual(errors, []);
    console.log('PASS: eight-row info table with separate GitHub/video rows, no duplicate info table, eight exact source tables, 34 headings, 21 images, navigation, lightbox, video, mobile, and unchanged Skyfire DOM.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
