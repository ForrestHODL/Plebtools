import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const skip = new Set(['bip-110-economic-support.html', 'index.html', 'home.html']);

const dropdownPattern =
  /\s*\/\/ Simple dropdown functionality[\s\S]*?\/\/ Close when clicking outside[\s\S]*?isOpen = false;\s*\}\s*\}\);\s*/g;

const toolsBtnPattern =
  /\s*const toolsBtn = document\.getElementById\(['"]toolsBtn['"]\);[\s\S]*?isOpen = false;\s*\}\s*\}\);\s*/g;

const montePattern =
  /\s*var toolsBtn = document\.getElementById\(['"]toolsBtn['"]\);[\s\S]*?isOpen = false;\s*\}\s*\}\);\s*\}\s*\}\)\(\);\s*/g;

for (const file of readdirSync('.').filter((f) => f.endsWith('.html') && !skip.has(f))) {
  let html = readFileSync(join('.', file), 'utf8');
  const original = html;
  html = html.replace(dropdownPattern, '\n');
  html = html.replace(toolsBtnPattern, '\n');
  html = html.replace(montePattern, '\n');
  if (html !== original) {
    writeFileSync(join('.', file), html);
    console.log('Stripped:', file);
  }
}

console.log('Done.');
