// Post-build prerender: renders public routes in headless Chromium and writes
// static HTML to dist/<route>/index.html so crawlers get real content and
// per-page meta tags without executing JS. If Chromium is unavailable the
// script exits 0 and the site falls back to the plain SPA build.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://immo-tonn.com';
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const ROUTES = (process.env.ONLY ? [process.env.ONLY] : [
  '/',
  '/immobilien',
  '/wertermittlung',
  '/finanzierung',
  '/rechner',
  '/verkaufssupport',
  '/kontakt',
  '/recht-und-rat',
  '/objectstyling',
  '/legalnotice',
  '/privacypolicy',
  '/cancellationpolicy',
]);
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.warn('[prerender] playwright not installed — skipping');
  process.exit(0);
}

const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(DIST, urlPath);
  if (urlPath.startsWith('/_vercel/') || urlPath.startsWith('/api/')) {
    res.statusCode = 404; // Vercel-only endpoints don't exist locally
    return res.end();
  }
  try {
    if (!file.startsWith(DIST)) throw new Error('outside dist');
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error('not file');
    res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch {
    // SPA fallback: always the pristine template, never an already prerendered page
    res.setHeader('Content-Type', 'text/html');
    res.end(template);
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  const launchOptions = {};
  if (process.env.VERCEL) {
    // Vercel's build image has no browser/system libs: use the serverless Chromium build.
    // It only unpacks its bundled libs when it believes it runs on AWS Lambda.
    process.env.AWS_EXECUTION_ENV ??= 'AWS_Lambda_nodejs22.x';
    const { default: sparticuz } = await import('@sparticuz/chromium');
    launchOptions.executablePath = await sparticuz.executablePath();
    launchOptions.args = sparticuz.args;
  }
  browser = await chromium.launch(launchOptions);
} catch (e) {
  console.warn(`[prerender] Chromium unavailable (${e.message.split('\n')[0]}) — skipping`);
  server.close();
  process.exit(0);
}

const setCanonical = (html, url) =>
  html
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`);

let failed = 0;
for (const route of ROUTES) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.warn(`[prerender] ${route} page error: ${e.message.slice(0, 160)}`));
  try {
    await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('#root > *', { state: 'attached', timeout: 10000 });
    let html = await page.content();
    const url = SITE_URL + (route === '/' ? '/' : route);
    html = setCanonical(html, url);
    const out = route === '/' ? 'index.html' : path.join(route, 'index.html');
    await fs.mkdir(path.dirname(path.join(DIST, out)), { recursive: true });
    await fs.writeFile(path.join(DIST, out), html);
    console.log(`[prerender] ${route} -> ${out}`);
  } catch (e) {
    failed++;
    console.warn(`[prerender] ${route} failed: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}
await browser.close();
server.close();
if (failed) console.warn(`[prerender] ${failed} route(s) failed, they fall back to SPA`);
