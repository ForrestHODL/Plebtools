/**
 * Live market data for DCA Bitcoin vs SPY.
 * BTC: CoinGecko (direct, CORS-enabled).
 * SPY: Yahoo Finance via local Vite proxy + parallel live CORS relays.
 * No static/cached fallbacks — every point comes from a live API response.
 */

export const START_SUNDAY = '2021-11-07';
const PERIOD_START = '2021-11-01T00:00:00Z';
const REQUEST_TIMEOUT_MS = 25000;
const MAX_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function fetchJson(url, options) {
  const res = await fetchWithTimeout(url, options, REQUEST_TIMEOUT_MS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function yahooTargetUrl(symbol, interval, period1, period2) {
  const p1 = period1 ?? Math.floor(new Date(PERIOD_START).getTime() / 1000);
  const p2 = period2 ?? Math.floor(Date.now() / 1000) + 86400;
  return (
    'https://query1.finance.yahoo.com/v8/finance/chart/' +
    encodeURIComponent(symbol) +
    `?period1=${p1}&period2=${p2}&interval=${interval}`
  );
}

function parseYahooChart(data, label) {
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo returned no ${label} chart data`);
  const quotes = result.indicators?.quote?.[0];
  if (!quotes?.close) throw new Error(`Yahoo ${label} chart missing closes`);

  const rows = [];
  for (let i = 0; i < result.timestamp.length; i++) {
    const close = quotes.close[i];
    if (close == null) continue;
    rows.push({
      ts: result.timestamp[i] * 1000,
      date: new Date(result.timestamp[i] * 1000).toISOString().slice(0, 10),
      close,
    });
  }
  if (!rows.length) throw new Error(`Yahoo ${label} chart has no valid closes`);
  rows.sort((a, b) => a.ts - b.ts);

  return {
    rows,
    livePrice: result.meta?.regularMarketPrice ?? rows[rows.length - 1].close,
  };
}

/** Build request URLs — local Vite proxy first, then live CORS relays. */
function yahooTransportUrls(targetUrl) {
  const pathAndQuery = targetUrl.replace('https://query1.finance.yahoo.com', '');
  return [
    `/api/yahoo${pathAndQuery}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
  ];
}

async function fetchYahooOnce(url) {
  const data = await fetchJson(url, {
    headers: { Accept: 'application/json' },
  });
  return data;
}

async function fetchYahooChart(symbol, interval, period1, period2) {
  const targetUrl = yahooTargetUrl(symbol, interval, period1, period2);
  const transportUrls = yahooTransportUrls(targetUrl);
  const errors = [];

  // Race all transports in parallel — first live response wins.
  const attempts = transportUrls.map(async (url) => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const data = await fetchYahooOnce(url);
        const parsed = parseYahooChart(data, symbol);
        return { ...parsed, source: url.startsWith('/api/yahoo') ? 'yahoo-local' : 'yahoo-relay' };
      } catch (err) {
        errors.push(`${url} (${attempt}): ${err.message || err}`);
        if (attempt < MAX_ATTEMPTS) await sleep(400 * attempt);
      }
    }
    throw new Error('exhausted');
  });

  try {
    return await Promise.any(attempts);
  } catch {
    throw new Error(`All Yahoo transports failed for ${symbol}:\n${errors.slice(-6).join('\n')}`);
  }
}

async function fetchYahooChartChunked(symbol, interval) {
  const start = Math.floor(new Date(PERIOD_START).getTime() / 1000);
  const end = Math.floor(Date.now() / 1000) + 86400;
  const chunkSeconds = interval === '1d' ? 400 * 86400 : 900 * 86400;
  const chunks = [];

  for (let p1 = start; p1 < end; p1 += chunkSeconds) {
    const p2 = Math.min(p1 + chunkSeconds, end);
    chunks.push([p1, p2]);
  }

  const parts = await Promise.all(
    chunks.map(([p1, p2]) => fetchYahooChart(symbol, interval, p1, p2))
  );

  const byTs = new Map();
  for (const part of parts) {
    for (const row of part.rows) byTs.set(row.ts, row);
  }
  const rows = [...byTs.values()].sort((a, b) => a.ts - b.ts);
  const livePrice = parts[parts.length - 1].livePrice;

  return { rows, livePrice, source: parts.map((p) => p.source).join('+') };
}

function parseCoinGeckoRange(data) {
  if (!data?.prices?.length) throw new Error('CoinGecko returned no BTC prices');
  const byDay = new Map();
  for (const [ts, price] of data.prices) {
    const day = new Date(ts).toISOString().slice(0, 10);
    byDay.set(day, { ts, date: day, close: price });
  }
  const rows = [...byDay.values()].sort((a, b) => a.ts - b.ts);
  return rows;
}

async function fetchBtcSeries() {
  const from = Math.floor(new Date(PERIOD_START).getTime() / 1000);
  const to = Math.floor(Date.now() / 1000);
  const cgErrors = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const [history, spot] = await Promise.all([
        fetchJson(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
          { headers: { Accept: 'application/json' } }
        ),
        fetchJson(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          { headers: { Accept: 'application/json' } }
        ),
      ]);

      const rows = parseCoinGeckoRange(history);
      const livePrice = spot?.bitcoin?.usd ?? rows[rows.length - 1].close;
      return { rows, livePrice, source: 'coingecko' };
    } catch (err) {
      cgErrors.push(`attempt ${attempt}: ${err.message || err}`);
      if (attempt < MAX_ATTEMPTS) await sleep(1200 * attempt);
    }
  }

  // CoinGecko rate-limited or unavailable — use Yahoo BTC-USD (still live).
  try {
    const yahoo = await fetchYahooChartChunked('BTC-USD', '1d');
    return { rows: yahoo.rows, livePrice: yahoo.livePrice, source: 'yahoo-' + yahoo.source };
  } catch (yahooErr) {
    throw new Error(
      `BTC fetch failed.\nCoinGecko: ${cgErrors.join('; ')}\nYahoo: ${yahooErr.message || yahooErr}`
    );
  }
}

async function fetchSpySeries() {
  const errors = [];

  // Weekly bars first — smaller payload, faster through relays.
  for (const interval of ['1wk', '1d']) {
    try {
      if (interval === '1wk') {
        return await fetchYahooChart('SPY', '1wk');
      }
      return await fetchYahooChartChunked('SPY', '1d');
    } catch (err) {
      errors.push(`${interval}: ${err.message || err}`);
    }
  }

  throw new Error(`SPY fetch failed:\n${errors.join('\n')}`);
}

export function sundaysFrom(startIso) {
  const out = [];
  const d = new Date(`${startIso}T12:00:00Z`);
  const now = new Date();
  while (d <= now) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return out;
}

export function closeOnOrBefore(targetIso, series) {
  const target = new Date(`${targetIso}T23:59:59Z`).getTime();
  let best = null;
  for (const row of series) {
    if (row.ts <= target) best = row;
    else break;
  }
  return best ? best.close : null;
}

export function buildWeeklyRows(btcDaily, spyDaily, btcLive, spyLive) {
  const sundays = sundaysFrom(START_SUNDAY);
  const rows = [];

  for (const date of sundays) {
    const btcPrice = closeOnOrBefore(date, btcDaily);
    const spyPrice = closeOnOrBefore(date, spyDaily);
    if (btcPrice == null || spyPrice == null) continue;
    rows.push({ week: rows.length + 1, date, btcPrice, spyPrice });
  }

  if (!rows.length) {
    throw new Error('Could not align weekly DCA dates to live market data');
  }

  const last = rows[rows.length - 1];
  if (typeof btcLive === 'number' && btcLive > 0) last.btcPrice = btcLive;
  if (typeof spyLive === 'number' && spyLive > 0) last.spyPrice = spyLive;

  return rows;
}

/**
 * @param {(msg: string) => void} [onProgress]
 */
export async function loadWeeklySeries(onProgress) {
  onProgress?.('Fetching Bitcoin (CoinGecko)…');
  const btc = await fetchBtcSeries();

  onProgress?.('Fetching SPY (Yahoo Finance)…');
  const spy = await fetchSpySeries();

  onProgress?.('Building DCA series…');
  const rows = buildWeeklyRows(btc.rows, spy.rows, btc.livePrice, spy.livePrice);

  return {
    rows,
    btcLive: btc.livePrice,
    spyLive: spy.livePrice,
    sources: { btc: btc.source, spy: spy.source },
  };
}
