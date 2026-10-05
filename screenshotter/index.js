const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
app.use(cors());
app.use(express.json());

let browser = null;

async function getBrowser() {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

app.post('/screenshot', async (req, res) => {
  try {
    const { url, viewport = 'desktop', component = null, selector = null } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await getBrowser();
    const context = await browser.newContext({
      viewport: viewport === 'mobile' ? { width: 375, height: 667 } :
                viewport === 'tablet' ? { width: 768, height: 1024 } :
                { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    let screenshot;
    if (component && selector) {
      const element = await page.$(selector);
      if (element) {
        screenshot = await element.screenshot({ type: 'png' });
      } else {
        screenshot = await page.screenshot({ type: 'png', fullPage: true });
      }
    } else {
      screenshot = await page.screenshot({ type: 'png', fullPage: true });
    }
    
    await context.close();
    
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Screenshotter listening on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});