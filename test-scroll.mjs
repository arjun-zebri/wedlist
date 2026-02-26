import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const el = document.getElementById('how-it-works');
    if (!el) return null;
    return {
      sectionTop: el.getBoundingClientRect().top + window.scrollY,
      sectionHeight: el.offsetHeight,
      vh: window.innerHeight,
    };
  });
  console.log('Section info:', info);

  // Scroll to where the section just hits the top of viewport (sticky kicks in)
  const stickyStart = info.sectionTop;
  const scrollable = info.sectionHeight - info.vh;
  console.log('Sticky starts at scroll:', stickyStart, 'Scrollable distance:', scrollable);

  const scrollPoints = [
    { name: '01-before', pct: -0.05 },
    { name: '02-sticky-start', pct: 0 },
    { name: '03-10pct', pct: 0.1 },
    { name: '04-25pct', pct: 0.25 },
    { name: '05-40pct', pct: 0.4 },
    { name: '06-55pct', pct: 0.55 },
    { name: '07-70pct', pct: 0.7 },
    { name: '08-85pct', pct: 0.85 },
    { name: '09-100pct', pct: 1.0 },
  ];

  for (const { name, pct } of scrollPoints) {
    const scrollY = stickyStart + pct * scrollable;
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, scrollY));
    await new Promise(r => setTimeout(r, 100));

    // Log the progress value from the component
    const debugInfo = await page.evaluate(() => {
      const el = document.getElementById('how-it-works');
      if (!el) return 'no element';
      const rect = el.getBoundingClientRect();
      return { rectTop: rect.top, scrollY: window.scrollY };
    });
    console.log(`${name}: scroll=${Math.round(scrollY)}, rect.top=${Math.round(debugInfo.rectTop)}, -rect.top=${Math.round(-debugInfo.rectTop)}`);

    await page.screenshot({ path: `.claude/screenshots/${name}.png` });
  }

  await browser.close();
  console.log('Done!');
})();
