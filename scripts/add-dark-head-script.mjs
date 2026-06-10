import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = '.';
const skip = new Set(['bip-110-economic-support.html']);
const headScript = "<script>localStorage.setItem('theme','dark');</script>";

const htmlFiles = readdirSync(root).filter(
  (f) => f.endsWith('.html') && !skip.has(f)
);

for (const file of htmlFiles) {
  let html = readFileSync(join(root, file), 'utf8');
  const original = html;

  if (!html.includes("localStorage.setItem('theme','dark')")) {
    html = html.replace(/<\/head>/i, `  ${headScript}\n</head>`);
  }

  if (html !== original) {
    writeFileSync(join(root, file), html);
    console.log('Updated:', file);
  }
}

console.log('Done.');
