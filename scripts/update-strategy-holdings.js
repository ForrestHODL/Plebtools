#!/usr/bin/env node
/**
 * Fetches Strategy (MicroStrategy) 8-K filings from SEC EDGAR, parses Bitcoin
 * holdings, merges with static baseline, and writes data/strategy-purchases.json.
 * Used by GitHub Actions (daily) so the Great Intersection page always has fresh
 * data; the browser only loads the JSON from same origin (no CORS).
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SEC_CIK = '0001050446';
const USER_AGENT = 'Plebtools/1.0 (https://github.com/ForrestHODL/Plebtools; educational Bitcoin treasury tracking)';

const STATIC = [
  ['2020-08-11', 21454], ['2020-09-14', 38250], ['2020-12-04', 40824], ['2020-12-21', 70470],
  ['2021-01-22', 70784], ['2021-02-02', 71079], ['2021-02-24', 90531], ['2021-03-01', 90859],
  ['2021-03-05', 91064], ['2021-03-12', 91326], ['2021-04-05', 91579], ['2021-05-13', 91850],
  ['2021-05-18', 92079], ['2021-06-21', 105085], ['2021-09-13', 114042], ['2021-11-28', 121044],
  ['2021-12-08', 122478], ['2021-12-30', 124391], ['2022-01-31', 125051], ['2022-04-05', 129218],
  ['2022-06-28', 129699], ['2022-09-20', 130000], ['2022-12-21', 132395], ['2022-12-22', 131690],
  ['2022-12-24', 132500], ['2023-04-05', 140000], ['2023-06-27', 152333], ['2023-07-31', 152800],
  ['2023-09-24', 158245], ['2023-11-01', 158400], ['2023-11-30', 174530], ['2023-12-27', 189150],
  ['2024-02-06', 190000], ['2024-02-26', 193000], ['2024-03-11', 205000], ['2024-03-19', 214246],
  ['2024-05-01', 214400], ['2024-06-20', 226331], ['2024-08-01', 226500], ['2024-09-13', 244800],
  ['2024-09-20', 252220], ['2024-11-11', 279420], ['2024-11-18', 331200], ['2024-11-25', 386700],
  ['2024-12-02', 402100], ['2024-12-09', 423650], ['2024-12-16', 439000], ['2024-12-23', 444262],
  ['2024-12-30', 446400], ['2025-01-06', 447470], ['2025-01-13', 450000], ['2025-01-21', 461000],
  ['2025-01-27', 471107], ['2025-02-10', 478740], ['2025-02-24', 499096], ['2025-03-17', 499226],
  ['2025-03-24', 506137], ['2025-03-31', 528185], ['2025-04-14', 531644], ['2025-04-21', 538200],
  ['2025-04-28', 553555], ['2025-05-05', 555450], ['2025-05-12', 568840], ['2025-05-19', 576230],
  ['2025-05-26', 580250], ['2025-06-02', 580955], ['2025-06-16', 592100], ['2025-06-23', 592345],
  ['2025-06-30', 597325], ['2025-07-14', 601550], ['2025-07-21', 607770], ['2025-07-29', 628791],
  ['2025-08-11', 629096], ['2025-08-18', 629376], ['2025-08-25', 632457], ['2025-09-02', 636505],
  ['2025-09-08', 638460], ['2025-09-15', 638985], ['2025-09-22', 639835], ['2025-09-29', 640031],
  ['2025-10-13', 640250], ['2025-10-20', 640418], ['2025-10-27', 640808], ['2025-11-03', 641205],
  ['2025-11-10', 641692], ['2025-11-17', 649870], ['2025-12-01', 650000], ['2025-12-08', 660624],
  ['2025-12-15', 671268], ['2025-12-29', 672497], ['2025-12-31', 672500], ['2026-01-05', 673783],
  ['2026-01-12', 687410], ['2026-01-20', 709715], ['2026-01-26', 712647], ['2026-02-02', 713502],
  ['2026-02-09', 714644], ['2026-02-17', 717131], ['2026-02-23', 717722], ['2026-03-02', 720737],
  ['2026-03-08', 738731], ['2026-03-15', 761068], ['2026-03-22', 762099]
];

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = { headers: { 'User-Agent': USER_AGENT, ...headers } };
    https.get(url, opts, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve(res.statusCode === 200 ? body : null));
    }).on('error', reject);
  });
}

function parse8K(html, filingDate) {
  const text = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const candidates = [];
  const add = (s) => {
    const n = parseInt(String(s).replace(/,/g, ''), 10);
    if (!isNaN(n) && n > 1000 && n < 21e6) candidates.push(n);
  };
  const patterns = [
    /aggregate\s+BTC\s+holdings[\s\S]{0,400}?(\d{1,3}(?:,\d{3})+)/gi,
    /aggregate\s+BTC\s+holdings[:\s]*([\d,]+)/gi,
    /(?:aggregate|total|held|holdings?)\s+(?:of\s+)?(?:approximately\s+)?([\d,]+(?:\.[\d]+)?)\s*bitcoins?/gi,
    /approximately\s+([\d,]+(?:\.[\d]+)?)\s*bitcoins?/gi,
    /(?:held|holdings?|total)\s+(?:of\s+)?([\d,]+(?:\.[\d]+)?)\s*bitcoins?/gi,
    /(?:as\s+of|as\s+of\s+the)[^.]*?([\d,]+(?:\.[\d]+)?)\s*bitcoins?/gi,
    /([\d,]+(?:\.[\d]+)?)\s*bitcoins?\s+(?:as\s+of|held|in\s+aggregate)/gi,
    /([\d,]+(?:\.[\d]+)?)\s*BTC\b/gi,
    /\b([\d,]+(?:\.[\d]+)?)\s*bitcoins?/gi,
    /(\d{1,3}(?:,\d{3})+)\s*(?:bitcoin|BTC)/gi
  ];
  for (const re of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) add(m[1]);
    if (candidates.length > 0) break;
  }
  if (candidates.length === 0) return null;
  return [filingDate, Math.max(...candidates)];
}

function merge(base, secData) {
  const byDate = new Map(base.map(([d, b]) => [d, Number(b)]));
  secData.forEach(([d, b]) => byDate.set(d, Number(b)));
  return [...byDate.entries()].map(([d, b]) => [d, b]).sort((a, b) => a[0].localeCompare(b[0]));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const outPath = path.join(projectRoot, 'data', 'strategy-purchases.json');

  let data = null;
  try {
    const raw = await get('https://data.sec.gov/submissions/CIK' + SEC_CIK + '.json', { Accept: 'application/json' });
    if (raw) data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to fetch SEC submissions:', e.message);
  }

  const recent = data && data.filings && data.filings.recent;
  if (!recent || !Array.isArray(recent.form)) {
    console.log('SEC data unavailable; writing static baseline only.');
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(STATIC, null, 0), 'utf8');
    console.log('Wrote', outPath, 'with', STATIC.length, 'points.');
    process.exit(0);
  }

  const forms = recent.form;
  const accessionNumbers = recent.accessionNumber || [];
  const primaryDocs = recent.primaryDocument || [];
  const filingDates = recent.filingDate || [];
  const indices = [];
  for (let i = 0; i < forms.length; i++) {
    const f = forms[i];
    if (f === '8-K' || f === '8-K/A') indices.push(i);
  }
  indices.sort((a, b) => (filingDates[b] || '').localeCompare(filingDates[a] || ''));

  const results = [];
  const seen = {};
  const maxToFetch = Math.min(12, indices.length);

  for (let k = 0; k < maxToFetch; k++) {
    const idx = indices[k];
    const acc = accessionNumbers[idx];
    const doc = primaryDocs[idx] || '';
    const filingDate = filingDates[idx];
    if (!acc || !doc || !filingDate || seen[filingDate]) continue;

    const accNoDashes = acc.replace(/-/g, '');
    const baseUrl = 'https://www.sec.gov/Archives/edgar/data/' + SEC_CIK + '/' + accNoDashes + '/';
    await sleep(150);

    let parsed = null;
    try {
      let html = await get(baseUrl + doc, { Accept: 'text/html' });
      if (html) parsed = parse8K(html, filingDate);
      if (!parsed && html) {
        const exMatch = html.match(/href="([^"]*ex[-_]?99[^"]*\.(?:htm|html))"/i);
        if (exMatch && exMatch[1]) {
          await sleep(120);
          const exHtml = await get(baseUrl + exMatch[1], { Accept: 'text/html' });
          if (exHtml) parsed = parse8K(exHtml, filingDate);
        }
      }
      if (!parsed && k === 0) {
        let indexHtml = await get(baseUrl + 'index.html', { Accept: 'text/html' }) || await get(baseUrl + 'index.htm', { Accept: 'text/html' });
        if (indexHtml) {
          const exLinks = indexHtml.match(/href="([^"]*ex[-_]?99[^"]*\.(?:htm|html))"/gi);
          if (exLinks) {
            for (let e = 0; e < Math.min(3, exLinks.length); e++) {
              const href = exLinks[e].match(/href="([^"]+)"/);
              if (href && href[1]) {
                await sleep(120);
                const exHtml2 = await get(baseUrl + href[1], { Accept: 'text/html' });
                if (exHtml2) {
                  parsed = parse8K(exHtml2, filingDate);
                  if (parsed) break;
                }
              }
            }
          }
        }
      }
    } catch (_) {}
    if (parsed) {
      results.push(parsed);
      seen[filingDate] = true;
    }
  }

  const merged = results.length > 0 ? merge(STATIC, results) : STATIC;
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 0), 'utf8');
  console.log('Wrote', outPath, 'with', merged.length, 'points.', results.length > 0 ? 'SEC 8-K parsed: ' + results.length : 'No new SEC data.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
