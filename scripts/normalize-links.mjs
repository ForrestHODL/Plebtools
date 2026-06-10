import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const skip = new Set(['bip-110-economic-support.html', 'index.html']);

const slugs = readdirSync('.')
  .filter((f) => f.endsWith('.html') && !skip.has(f))
  .map((f) => f.replace(/\.html$/, ''))
  .sort((a, b) => b.length - a.length);

for (const file of readdirSync('.').filter((f) => f.endsWith('.html') && !skip.has(f))) {
  let html = readFileSync(join('.', file), 'utf8');
  const original = html;

  for (const slug of slugs) {
    html = html.replace(
      new RegExp(`href="${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      `href="${slug}.html"`
    );
  }

  if (html !== original) {
    writeFileSync(join('.', file), html);
    console.log('Normalized links:', file);
  }
}

console.log('Done.');
