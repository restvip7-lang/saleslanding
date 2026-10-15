// Сборка: PROPERTY=sales1 [SITE_ORIGIN=https://sales1.example.ru] node build.mjs  ->  dist/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, renderPrivacy } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const id = process.env.PROPERTY || 'sales1';
const dir = join(root, 'properties', id);
if (!existsSync(join(dir, 'property.json'))) {
  console.error(`Не найден properties/${id}/property.json`);
  process.exit(1);
}
const p = JSON.parse(readFileSync(join(dir, 'property.json'), 'utf8'));
const origin = (process.env.SITE_ORIGIN || `https://${p.domain}`).replace(/\/$/, '');

const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });

writeFileSync(join(out, 'index.html'), render(p, { origin }));
writeFileSync(join(out, 'privacy.html'), renderPrivacy(p, { origin }));
for (const f of ['styles.css', 'tracking.js', 'app.js']) cpSync(join(root, 'src', f), join(out, 'assets', f));
if (existsSync(join(dir, 'video'))) cpSync(join(dir, 'video'), join(out, 'video'), { recursive: true });
if (existsSync(join(dir, 'assets'))) cpSync(join(dir, 'assets'), join(out, 'img'), { recursive: true });
if (existsSync(join(dir, 'photos'))) cpSync(join(dir, 'photos'), join(out, 'photos'), { recursive: true });

writeFileSync(
  join(out, 'robots.txt'),
  p.noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`,
);
console.log(`Собрано: ${id} -> dist/ (origin ${origin}, noindex=${!!p.noindex})`);
