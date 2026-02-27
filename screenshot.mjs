import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Set viewport to desktop size
await page.setViewportSize({ width: 1440, height: 900 });

// Navigate to the login page
await page.goto('http://localhost:3000/super-admin', { waitUntil: 'networkidle' });

// Wait for page to load
await page.waitForTimeout(500);

// Fill in credentials (using test credentials - these would need to exist)
await page.fill('input[type="email"]', 'test@example.com');
await page.fill('input[type="password"]', 'password123');

// Submit form
await page.click('button[type="submit"]');

// Wait for redirect and navigation
await page.waitForTimeout(2000);

// Navigate directly to CRM page
await page.goto('http://localhost:3000/super-admin/crm', { waitUntil: 'networkidle' });

// Take initial screenshot
await page.screenshot({ path: '/Users/arjunpunekar/Downloads/wedlist/.claude/screenshots/crm-initial.png' });
console.log('Screenshot 1 taken: crm-initial.png');

// Scroll to see more content
await page.evaluate(() => window.scrollBy(0, 600));
await page.waitForTimeout(500);

await page.screenshot({ path: '/Users/arjunpunekar/Downloads/wedlist/.claude/screenshots/crm-scrolled.png' });
console.log('Screenshot 2 taken: crm-scrolled.png');

// Scroll to bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);

await page.screenshot({ path: '/Users/arjunpunekar/Downloads/wedlist/.claude/screenshots/crm-bottom.png' });
console.log('Screenshot 3 taken: crm-bottom.png');

await browser.close();
