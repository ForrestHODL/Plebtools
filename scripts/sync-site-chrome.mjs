import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const skip = new Set(['bip-110-economic-support.html', 'index.html']);
const root = '.';

const HEADER = `  <header>
    <nav>
      <div class="nav-container">
        <a href="home.html" class="logo-link">
          <img src="images/plub tools image.jpeg" alt="Plebtools" class="nav-logo">
          <span class="logo">Plebtools</span>
        </a>
        <div class="nav-links">
          <div class="dropdown" id="toolsDropdown">
            <button class="dropdown-btn" id="toolsBtn" type="button">Tools <span class="dropdown-arrow"></span></button>
            <div class="dropdown-content" id="toolsContent" style="display: none;">
              <a href="treasury.html">Treasury</a>
              <a href="btc-buy-tracker.html">Portfolio</a>
              <a href="coveredcall-tracker.html">Covered Calls</a>
              <a href="compound-interest-calculator.html">Calculator</a>
              <a href="btc-dca-vs-sp500.html">DCA vs S&amp;P 500</a>
              <a href="strc-vs-bitcoin-cagr.html">STRC vs Bitcoin CAGR</a>
              <a href="dividend-clipping-simulator.html">Dividend Clipping</a>
              <a href="portfolio-monte-carlo.html">Monte Carlo</a>
              <a href="retirement-calculator.html">Retirement</a>
              <a href="the-great-intersection.html">The Great Intersection</a>
              <a href="btc-loan-ltv.html">BTC Loans</a>
              <a href="financial-planner.html">Financial Planner</a>
              <a href="bitcoin-security.html">Bitcoin Security</a>
              <a href="pleb-release.html">Pleb Release</a>
              <a href="interest-arbitrage-calculator.html">Yield Arbitrage</a>
              <a href="step-by-step-to-self-custody.html">Self Custody Guide</a>
              <a href="invoice-builder.html">Invoice Builder</a>
              <a href="privacy-analyzer.html">Privacy Analyzer</a>
              <a href="bip-110-economic-support.html">BIP-110 Support</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>`;

const FOOTER = `  <footer>
    <div class="container">
      <div class="pt-footer-wordmark">Plebtools</div>
      <div class="pt-footer-grid">
        <div class="pt-footer-col">
          <h4>Tools</h4>
          <a href="treasury.html">Treasury</a>
          <a href="portfolio-monte-carlo.html">Monte Carlo</a>
          <a href="retirement-calculator.html">Retirement</a>
          <a href="btc-buy-tracker.html">Portfolio</a>
        </div>
        <div class="pt-footer-col">
          <h4>Guides</h4>
          <a href="step-by-step-to-self-custody.html">Self Custody</a>
          <a href="bitcoin-security.html">Security</a>
          <a href="the-great-intersection.html">Great Intersection</a>
        </div>
        <div class="pt-footer-col">
          <h4>Project</h4>
          <a href="https://github.com/ForrestHODL/Plebtools" target="_blank" rel="noopener">GitHub</a>
          <a href="https://coinos.io/plebtools" target="_blank" rel="noopener">Donate</a>
          <a href="home.html">Home</a>
        </div>
      </div>
      <p>&copy; 2025 Plebtools. Open source Bitcoin tools.</p>
    </div>
  </footer>`;

const SCRIPTS = `<script src="scripts/plebtools-nav.js"></script>
<script src="scripts/plebtools-theme.js"></script>`;

function ensureStyles(html) {
  html = html.replace(/href="styles\.css\?v=\d+"/g, 'href="styles.css?v=9"');
  if (!html.includes('styles.css?v=9') && html.includes('styles.css')) {
    html = html.replace(/href="styles\.css[^"]*"/, 'href="styles.css?v=9"');
  }
  if (!html.includes('tool-pages.css')) {
    html = html.replace(
      /<link rel="stylesheet" href="styles\.css\?v=9">/,
      '<link rel="stylesheet" href="styles.css?v=9">\n  <link rel="stylesheet" href="styles/tool-pages.css?v=3">'
    );
  } else {
    html = html.replace(/tool-pages\.css\?v=\d+/, 'tool-pages.css?v=2');
  }
  if (!html.includes("localStorage.setItem('theme','dark')")) {
    html = html.replace(/<\/head>/i, "  <script>localStorage.setItem('theme','dark');</script>\n</head>");
  }
  return html;
}

function fixNavInsideMain(html) {
  return html.replace(
    /(<main[^>]*>)\s*(<header>\s*<nav>[\s\S]*?<\/header>)/i,
    '$2\n\n  $1'
  );
}

function ensureFooter(html) {
  if (html.includes('pt-footer-wordmark')) {
    return html.replace(/<footer[\s\S]*?<\/footer>/i, FOOTER);
  }
  return html.replace('</body>', `${FOOTER}\n</body>`);
}

function ensureScripts(html) {
  html = html.replace(/<script src="scripts\/plebtools-theme\.js"><\/script>\s*/g, '');
  html = html.replace(/<script src="scripts\/plebtools-nav\.js"><\/script>\s*/g, '');
  if (!html.includes('plebtools-nav.js')) {
    html = html.replace('</body>', `${SCRIPTS}\n</body>`);
  }
  return html;
}

function normalizeBody(html, file) {
  return html.replace(/<body([^>]*)>/, (_, attrs) => {
    let a = attrs || '';
    if (/class="([^"]*)"/.test(a)) {
      a = a.replace(/class="([^"]*)"/, (_, cls) => {
        const parts = cls.split(/\s+/).filter(Boolean);
        const filtered = parts.filter((c) => c !== 'light-theme' && c !== 'light-ranking');
        if (!filtered.includes('dark-theme')) filtered.push('dark-theme');
        if (!filtered.includes('pt-site')) filtered.unshift('pt-site');
        if (file === 'home.html' && !filtered.includes('pt-home')) filtered.push('pt-home');
        if (file === 'pleb-ranking.html' && !filtered.includes('pleb-ranking-page')) filtered.push('pleb-ranking-page');
        return `class="${[...new Set(filtered)].join(' ')}"`;
      });
    } else {
      const extra = file === 'home.html' ? ' pt-home' : file === 'pleb-ranking.html' ? ' pleb-ranking-page' : '';
      a += ` class="pt-site dark-theme${extra}"`;
    }
    return `<body${a}>`;
  });
}

for (const file of readdirSync(root).filter((f) => f.endsWith('.html') && !skip.has(f))) {
  let html = readFileSync(join(root, file), 'utf8');
  const original = html;

  html = ensureStyles(html);
  html = normalizeBody(html, file);

  if (file !== 'home.html') {
    // Only replace site nav header — not in-page headers like .pr-hero
    html = html.replace(/<header>\s*<nav>[\s\S]*?<\/header>/i, HEADER);
    html = fixNavInsideMain(html);
    html = ensureFooter(html);
  } else {
    // Home: sync header + footer (home header is canonical source of truth)
    html = html.replace(/<header>\s*<nav>[\s\S]*?<\/header>/i, HEADER);
    html = html.replace(/<footer[\s\S]*?<\/footer>/i, FOOTER);
  }

  // Pleb ranking: remove minimal nav bar (replaced by site header)
  if (file === 'pleb-ranking.html') {
    html = html.replace(/\s*<nav class="pr-plebtools-nav"[\s\S]*?<\/nav>\s*/i, '\n');
  }

  html = ensureScripts(html);

  if (html !== original) {
    writeFileSync(join(root, file), html);
    console.log('Updated:', file);
  }
}

console.log('Done.');
