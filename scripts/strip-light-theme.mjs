import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = '.';
const skip = new Set(['bip-110-economic-support.html']);
const themeScript = '<script src="scripts/plebtools-theme.js"></script>';

const htmlFiles = readdirSync(root).filter(
  (f) => f.endsWith('.html') && !skip.has(f)
);

function normalizeBodyTag(html) {
  return html.replace(/<body([^>]*)>/, (_, attrs) => {
    let a = attrs || '';
    if (/class="([^"]*)"/.test(a)) {
      a = a.replace(/class="([^"]*)"/, (_, cls) => {
        const parts = cls.split(/\s+/).filter(Boolean);
        const filtered = parts.filter((c) => c !== 'light-theme' && c !== 'light-ranking');
        if (!filtered.includes('dark-theme')) filtered.unshift('dark-theme');
        if (!filtered.includes('pt-site')) filtered.unshift('pt-site');
        return `class="${[...new Set(filtered)].join(' ')}"`;
      });
    } else {
      a += ' class="pt-site dark-theme"';
    }
    return `<body${a}>`;
  });
}

for (const file of htmlFiles) {
  let html = readFileSync(join(root, file), 'utf8');
  const original = html;

  html = normalizeBodyTag(html);

  const togglePatterns = [
    /\s*<div id="theme-toggle-container" class="nav-theme-wrap"><\/div>\s*/g,
    /\s*<div id="theme-toggle-container"><\/div>\s*/g,
    /\s*<span class="nav-theme-wrap"><button id="themeToggle"[^>]*><\/button><\/span>\s*/g,
    /\s*<button type="button" class="theme-fab" id="themeFab"[^>]*>[\s\S]*?<\/button>\s*/g,
  ];
  for (const pat of togglePatterns) {
    html = html.replace(pat, '\n');
  }

  if (!html.includes('plebtools-theme.js')) {
    html = html.replace('</body>', `${themeScript}\n</body>`);
  }

  if (html !== original) {
    writeFileSync(join(root, file), html);
    console.log('Updated:', file);
  } else {
    console.log('No change:', file);
  }
}

console.log('Done.');
