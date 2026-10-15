// Рендер рекламных картинок в PNG: PROPERTY=sales1 node tools/render-promo.mjs
// Нужен Playwright + Chromium (локально или в среде разработки). Результат: properties/<id>/promo/*.png и promo-all.zip
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { promoPages } from '../src/render-promo.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.env.PROPERTY || 'sales1';
const dir = join(root, 'properties', id);
const p = JSON.parse(readFileSync(join(dir, 'property.json'), 'utf8'));
const outDir = join(dir, 'promo');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const tmp = join(tmpdir(), `promo-${id}`);
mkdirSync(tmp, { recursive: true });
const browser = await chromium.launch();
for (const pg of promoPages(p, dir)) {
  const htmlPath = join(tmp, pg.file.replace('.png', '.html'));
  writeFileSync(htmlPath, pg.html);
  const page = await browser.newPage({ viewport: { width: pg.w, height: pg.h }, deviceScaleFactor: 1 });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, pg.file), type: 'png' });
  await page.close();
  console.log('ok', pg.file, pg.w + 'x' + pg.h);
}
await browser.close();
try {
  execFileSync('zip', ['-j', '-q', join(outDir, `${id}-promo.zip`), ...promoPages(p, dir).map((x) => join(outDir, x.file))]);
  console.log('zip ok');
} catch { console.log('zip не создан (нет утилиты zip)'); }
