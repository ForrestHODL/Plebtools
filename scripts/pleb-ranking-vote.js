/**
 * Pleb Ranking — NIP-57 Lightning zap votes (client-side).
 * One paid zap = one vote (trust 1–10, track 1–10, optional note in zap content).
 */
import { SimplePool } from 'https://esm.sh/nostr-tools@2.10.4/pool';
import { nip57 } from 'https://esm.sh/nostr-tools@2.10.4/nip57';
import { verifyEvent } from 'https://esm.sh/nostr-tools@2.10.4/pure';

const VOTING_CONFIG_URL = 'data/pleb-ranking-voting.json';

let voteConfig = null;
let zapPool = null;
/** @type {Record<string, { count: number, trustSum: number, trackSum: number, satsSum: number, notes: Array<{text:string, at:number}> }>} */
export let voteAggregates = {};

export function formatSats(sats) {
  const n = Math.round(Number(sats) || 0);
  if (n <= 0) return '0 sats';
  if (n >= 100000000) return (n / 1e8).toFixed(4).replace(/\.?0+$/, '') + ' BTC';
  if (n >= 1000000) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M sats';
  return n.toLocaleString('en-US') + ' sats';
}

export function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getConfigUrl() {
  const base = window.location.href.replace(/[^/]*$/, '');
  return new URL(VOTING_CONFIG_URL + '?t=' + Date.now(), base).toString();
}

export async function loadVoteConfig() {
  if (voteConfig) return voteConfig;
  try {
    const r = await fetch(getConfigUrl(), { cache: 'no-store' });
    if (!r.ok) throw new Error('config fetch failed');
    voteConfig = await r.json();
  } catch (_) {
    voteConfig = {
      recipientNpubHex: '72bdbc57bdd6dfc4e62685051de8041d148c3c68fe42bf301f71aa6cf53e52fb',
      lnurlCallback: 'https://coinos.io/api/lnurl/df7a75b4-9012-45e4-b9c9-cdc822d99892',
      relays: ['wss://relay.damus.io', 'wss://nos.lol'],
      minVoteSats: 21,
      defaultVoteSats: 21,
      zapLookbackDays: 120
    };
  }
  return voteConfig;
}

export function buildVotePayload(slug, trust, track, note) {
  return JSON.stringify({
    v: 1,
    app: 'pleb-ranking',
    id: slug,
    t: Math.max(1, Math.min(10, Math.round(trust))),
    r: Math.max(1, Math.min(10, Math.round(track))),
    n: String(note || '').slice(0, 400)
  });
}

export function parseVotePayload(content) {
  if (!content || typeof content !== 'string') return null;
  const trimmed = content.trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    const o = JSON.parse(trimmed);
    if (o.v !== 1 || o.app !== 'pleb-ranking' || !o.id) return null;
    return {
      slug: String(o.id),
      trust: Math.max(1, Math.min(10, Math.round(Number(o.t)))),
      track: Math.max(1, Math.min(10, Math.round(Number(o.r)))),
      note: String(o.n || '').trim()
    };
  } catch (_) {
    return null;
  }
}

function tagFirst(event, name) {
  const t = event.tags.find((x) => x[0] === name);
  return t ? t[1] : null;
}

export async function fetchZapVotes() {
  const cfg = await loadVoteConfig();
  const recipient = cfg.recipientNpubHex;
  const relays = cfg.relays || [];
  const since = Math.floor(Date.now() / 1000) - (cfg.zapLookbackDays || 120) * 86400;
  const minSats = cfg.minVoteSats || 21;

  voteAggregates = {};
  if (!recipient || !relays.length) return voteAggregates;

  if (!zapPool) zapPool = new SimplePool();

  let events = [];
  try {
    events = await zapPool.querySync(relays, {
      kinds: [9735],
      '#p': [recipient],
      since
    });
  } catch (_) {
    return voteAggregates;
  }

  for (const ev of events) {
    if (!verifyEvent(ev)) continue;
    const desc = tagFirst(ev, 'description');
    if (!desc) continue;
    const err = nip57.validateZapRequest(desc);
    if (err) continue;

    let zapReq;
    try {
      zapReq = JSON.parse(desc);
    } catch (_) {
      continue;
    }

    const bolt11 = tagFirst(ev, 'bolt11');
    let satsPaid = bolt11 ? nip57.getSatoshisAmountFromBolt11(bolt11) : 0;
    if (!satsPaid && Array.isArray(zapReq.tags)) {
      const amountTag = zapReq.tags.find((t) => t[0] === 'amount' && t[1]);
      if (amountTag) satsPaid = Math.round(Number(amountTag[1]) / 1000);
    }
    if (satsPaid > 0 && satsPaid < minSats) continue;

    const vote = parseVotePayload(zapReq.content);
    if (!vote) continue;

    if (!voteAggregates[vote.slug]) {
      voteAggregates[vote.slug] = { count: 0, trustSum: 0, trackSum: 0, satsSum: 0, notes: [] };
    }
    const agg = voteAggregates[vote.slug];
    agg.count += 1;
    agg.trustSum += vote.trust;
    agg.trackSum += vote.track;
    if (satsPaid > 0) agg.satsSum += satsPaid;
    if (vote.note) {
      agg.notes.push({ text: vote.note, at: ev.created_at });
    }
  }

  for (const slug of Object.keys(voteAggregates)) {
    voteAggregates[slug].notes.sort((a, b) => b.at - a.at);
    voteAggregates[slug].notes = voteAggregates[slug].notes.slice(0, 8);
  }

  return voteAggregates;
}

export async function castLightningVote({ slug, trust, track, note, sats }) {
  const cfg = await loadVoteConfig();
  if (!window.nostr || !window.nostr.signEvent) {
    throw new Error('Nostr extension required (Alby, nos2x, Primal, etc.) to sign zap votes.');
  }

  const msats = Math.max((cfg.minVoteSats || 21), Number(sats) || cfg.defaultVoteSats || 21) * 1000;
  const comment = buildVotePayload(slug, trust, track, note);
  const relays = cfg.relays || ['wss://relay.damus.io'];

  const template = nip57.makeZapRequest({
    pubkey: cfg.recipientNpubHex,
    amount: msats,
    comment,
    relays
  });

  const signed = await window.nostr.signEvent(template);
  const callback = cfg.lnurlCallback;
  if (!callback) throw new Error('Lightning callback not configured.');

  const sep = callback.includes('?') ? '&' : '?';
  const invoiceUrl = callback + sep + 'amount=' + msats + '&nostr=' + encodeURIComponent(JSON.stringify(signed));
  const res = await fetch(invoiceUrl);
  if (!res.ok) throw new Error('Could not create Lightning invoice (' + res.status + ').');
  const body = await res.json();
  if (!body.pr) throw new Error('No payment request returned from wallet.');

  if (window.webln) {
    try {
      await window.webln.enable();
      await window.webln.sendPayment(body.pr);
      return { paid: true, method: 'webln' };
    } catch (e) {
      if (e && e.message && /user rejected|cancel/i.test(e.message)) throw e;
    }
  }

  return { paid: false, pr: body.pr, method: 'invoice' };
}

export function communityStats(slug) {
  const agg = voteAggregates[slug];
  if (!agg || !agg.count) return null;
  return {
    count: agg.count,
    trust: Math.round((agg.trustSum / agg.count) * 10) / 10,
    track: Math.round((agg.trackSum / agg.count) * 10) / 10,
    totalSats: agg.satsSum || 0,
    notes: agg.notes || []
  };
}
