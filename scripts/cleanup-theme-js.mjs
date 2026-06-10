import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const skip = new Set(['bip-110-economic-support.html', 'index.html']);

const patterns = [
  // getElementById themeToggle + applyNavTheme (portfolio, financial planner)
  /\s*\/\/ Theme toggle functionality\s*\n\s*const themeToggle = document\.getElementById\(["']themeToggle["']\);[\s\S]*?themeToggle\.addEventListener\([\s\S]*?\}\);\s*/g,
  // Dynamic nav theme button (retirement, covered calls)
  /\s*\/\/ --- Dropdown Functionality ---\s*\n\/\/ Theme toggle functionality \(in nav\)\s*\n[\s\S]*?if \(themeToggleContainer\) themeToggleContainer\.appendChild\(themeToggle\);\s*/g,
  /\s*\/\/ Theme toggle functionality \(in nav\)\s*\n[\s\S]*?if \(themeToggleContainer\) themeToggleContainer\.appendChild\(themeToggle\);\s*/g,
  // DCA vs S&P 500
  /\s*\/\/ Theme toggle\s*\n\s*var themeToggle = document\.getElementById\(['"]themeToggle['"]\);[\s\S]*?themeToggle\.textContent = '🌙';\s*\n\s*\}\s*/g,
  // Great intersection
  /\s*\/\/ Theme toggle in nav\s*\n[\s\S]*?if \(themeToggleEl\) themeToggleEl\.appendChild\(themeToggle\);\s*/g,
  // Invoice builder
  /\s*let themeToggle;\s*\n\s*const applyTheme = mode => \{[\s\S]*?\};\s*\n\s*const themeToggleContainer = document\.getElementById\(['"]theme-toggle-container['"]\);[\s\S]*?applyTheme\(savedTheme\);\s*\n\s*\}\s*/g,
  // Legacy patterns
  /\s*const themeToggleContainer = document\.getElementById\(['"]theme-toggle-container['"]\);[\s\S]*?if \(themeToggleContainer\) themeToggleContainer\.appendChild\(themeToggle\);\s*/g,
  /\s*var themeToggleEl = document\.getElementById\(['"]theme-toggle-container['"]\);[\s\S]*?if \(themeToggleEl\) themeToggleEl\.appendChild\(themeToggle\);\s*/g,
  /\s*document\.body\.appendChild\(themeToggle\);\s*/g,
];

for (const file of readdirSync('.').filter((f) => f.endsWith('.html') && !skip.has(f))) {
  let html = readFileSync(join('.', file), 'utf8');
  const original = html;
  for (const pat of patterns) {
    html = html.replace(pat, '\n');
  }
  if (html !== original) {
    writeFileSync(join('.', file), html);
    console.log('Cleaned theme JS:', file);
  }
}

console.log('Done.');
