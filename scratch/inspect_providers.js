const puppeteer = require('puppeteer');

async function testAll() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  console.log('--- TEST 1: insta-stories-viewer.com ---');
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('stories') || u.includes('highlights') || u.includes('api')) {
      console.log('[ISV Response]', u);
    }
  });

  await page.goto('https://insta-stories-viewer.com/en/sivanfarmann/', { waitUntil: 'networkidle2', timeout: 30000 });

  const isvData = await page.evaluate(() => {
    const stories = Array.from(document.querySelectorAll('.profile__stories-item, .stories__item, .story-item, a[href*="cdn.iqsaved.com"]')).map(el => el.outerHTML.substring(0, 100));
    const tabs = Array.from(document.querySelectorAll('.profile__nav-item, .tabs-item, [role="tab"]')).map(t => t.textContent.trim());
    return { title: document.title, storiesCount: stories.length, tabs, sample: stories.slice(0, 3) };
  });
  console.log('ISV Data:', isvData);

  console.log('--- TEST 2: storiesig.info ---');
  let sStories = 0;
  let sHighlights = 0;
  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('/api/v1/instagram/stories')) {
      const json = await res.json().catch(() => null);
      sStories = json?.result?.length || json?.data?.length || 0;
      console.log('[storiesig] Got stories API response:', sStories);
    }
    if (u.includes('/api/v1/instagram/highlights')) {
      const json = await res.json().catch(() => null);
      sHighlights = json?.result?.length || json?.data?.length || 0;
      console.log('[storiesig] Got highlights API response:', sHighlights);
    }
  });

  await page.goto('https://storiesig.info/en7jr/', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForSelector('input', { timeout: 10000 });
  await page.click('input');
  await page.type('input', 'sivanfarmann', { delay: 30 });
  await page.keyboard.press('Enter');
  await page.evaluate(() => {
    const btn = document.querySelector('.search-form__button, button[type="submit"]');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  // Click stories tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tabs-component__button'));
    const btn = btns.find(b => (b.textContent || '').trim().toLowerCase() === 'stories');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  // Click highlights tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tabs-component__button'));
    const btn = btns.find(b => (b.textContent || '').trim().toLowerCase() === 'highlights');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  console.log('Storiesig Final: Stories =', sStories, 'Highlights =', sHighlights);

  await browser.close();
}

testAll().catch(console.error);
