import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const deployDir = 'deploy';
const exclude = new Set([
  'node_modules',
  '.git',
  'dist',
  'deploy',
  'src',
  '.github',
  '.env',
  '.cursor',
]);

execSync('npm run build', { stdio: 'inherit' });

if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true });
}
mkdirSync(deployDir, { recursive: true });

for (const entry of readdirSync('.')) {
  if (exclude.has(entry)) continue;
  cpSync(entry, `${deployDir}/${entry}`, { recursive: true });
}

mkdirSync(`${deployDir}/assets`, { recursive: true });
cpSync('dist/portfolio-monte-carlo.html', `${deployDir}/portfolio-monte-carlo.html`);
cpSync('dist/assets', `${deployDir}/assets`, { recursive: true });

console.log(`Deploy bundle ready in ${deployDir}/`);
