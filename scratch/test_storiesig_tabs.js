const puppeteer = require('puppeteer');

async function testExactTabs() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  let storiesCount = 0;
  let highlightsCount = 0;

  page.on('response', async (res) => {
    const u = res.url();
    if (u.includes('/api/v1/instagram/stories')) {
      const json = await res.json().catch(() => null);
      storiesCount = json?.result?.length || json?.data?.length || 0;
      console.log('SUCCESS: Captured stories:', storiesCount);
    }
    if (u.includes('/api/v1/instagram/highlights')) {
      const json = await res.json().catch(() => null);
      highlightsCount = json?.result?.length || json?.data?.length || 0;
      console.log('SUCCESS: Captured highlights:', highlightsCount);
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

  // Wait for profile / tabs
  await page.waitForSelector('.tabs-component__tabs, .tabs-component__button', { timeout: 15000 });
  console.log('Tabs component found on page!');

  // Click exact Stories button
  console.log('Clicking exact stories button...');
  const clickedS = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tabs-component__button, [role="tab"] button, [role="tab"]'));
    const btn = btns.find(b => (b.textContent || '').trim().toLowerCase() === 'stories');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Stories button clicked:', clickedS);

  await new Promise(r => setTimeout(r, 3000));

  // Click exact Highlights button
  console.log('Clicking exact highlights button...');
  const clickedH = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tabs-component__button, [role="tab"] button, [role="tab"]'));
    const btn = btns.find(b => (b.textContent || '').trim().toLowerCase() === 'highlights');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Highlights button clicked:', clickedH);

  await new Promise(r => setTimeout(r, 3000));

  console.log('FINAL RESULT: Stories =', storiesCount, ', Highlights =', highlightsCount);

  await browser.close();
}

testExactTabs().catch(console.error);
