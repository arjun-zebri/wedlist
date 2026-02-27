import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto('http://localhost:3004/super-admin/crm', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.screenshot({ path: '/Users/arjunpunekar/Downloads/wedlist/.claude/screenshots/ss_103_toolbar_fixed.png' });
console.log('Screenshot saved');

// Also take a zoomed-in screenshot of the toolbar area
await page.screenshot({ path: '/Users/arjunpunekar/Downloads/wedlist/.claude/screenshots/ss_104_toolbar_zoom.png', clip: { x: 140, y: 130, width: 750, height: 30 } });
console.log('Toolbar zoom screenshot saved');

await browser.close();
