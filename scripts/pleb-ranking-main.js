import {
  slugify,
  loadVoteConfig,
  fetchZapVotes,
  castLightningVote,
  communityStats,
  formatSats
} from './pleb-ranking-vote.js';
import { PLEB_RANKING_INFLUENCERS } from './pleb-ranking-influencers.js';

(function () {
  const saved = localStorage.getItem('plebRankingTheme');
  if (saved === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-ranking');
  }
})();

let allInfluencers = [];
let filtered = [];
let activeVoteSlug = null;

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function clampScore(n) {
  const v = Number(n);
  if (!isFinite(v)) return 0;
  return Math.max(0, Math.min(10, Math.round(v)));
}

function esc(s) {
  return String(s).replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function scoreBarHtml(label, value, cssClass, suffix) {
  const v = clampScore(value);
  const pct = (v / 10) * 100;
  return '<div class="score-row">' +
    '<span class="score-label">' + label + (suffix || '') + '</span>' +
    '<span class="score-value">' + v + '/10</span>' +
    '<div class="score-bar"><div class="score-fill ' + cssClass + '" style="width:' + pct + '%"></div></div>' +
    '</div>';
}

function notesHtml(slug) {
  const comm = communityStats(slug);
  if (!comm || !comm.notes.length) return '';
  const items = comm.notes.map((n) => {
    const d = new Date(n.at * 1000);
    return '<p class="vote-note">' + esc(n.text) + '<time>' + d.toLocaleDateString() + '</time></p>';
  }).join('');
  return '<div class="vote-notes"><h4>Recent zap notes</h4>' + items + '</div>';
}

function zapTotalHtml(slug) {
  const comm = communityStats(slug);
  const totalSats = comm ? comm.totalSats : 0;
  const count = comm ? comm.count : 0;
  const satsLabel = formatSats(totalSats);
  const voteWord = count === 1 ? 'vote' : 'votes';
  const emptyClass = count === 0 ? ' zap-total-empty' : '';
  return '<p class="zap-total' + emptyClass + '" title="Total Lightning paid on ranking votes for this person">' +
    '⚡ <strong>' + esc(satsLabel) + '</strong> zapped · ' + count + ' ' + voteWord +
    '</p>';
}

function cardHtml(person) {
  const tags = (person.tags || []).map((t) => '<span class="tag">' + esc(t) + '</span>').join('');
  const comm = communityStats(person.slug);
  const commLabel = comm ? ' (' + comm.count + ' zap' + (comm.count === 1 ? '' : 's') + ')' : '';

  return '<article class="influencer-card" data-slug="' + esc(person.slug) + '">' +
    '<div class="card-head">' +
    '<div class="avatar" aria-hidden="true">' + initials(person.name) + '</div>' +
    '<h2>' + esc(person.name) + '</h2>' +
    '</div>' +
    (tags ? '<div class="tags">' + tags + '</div>' : '') +
    zapTotalHtml(person.slug) +
    '<dl class="bio-block"><dt>Who they are</dt><dd>' + esc(person.who) + '</dd></dl>' +
    '<dl class="bio-block"><dt>What they do</dt><dd>' + esc(person.does) + '</dd></dl>' +
    '<div class="scores">' +
    '<p class="score-section-title">Editorial</p>' +
    scoreBarHtml('Trustworthiness', person.trustworthiness, 'trust') +
    scoreBarHtml('Track record', person.trackRecord, 'track') +
    (comm
      ? '<p class="score-section-title">Community' + commLabel + '</p>' +
        scoreBarHtml('Trustworthiness', comm.trust, 'community', ' (avg)') +
        scoreBarHtml('Track record', comm.track, 'community', ' (avg)')
      : '') +
    '</div>' +
    notesHtml(person.slug) +
    '<button type="button" class="vote-btn" data-vote-slug="' + esc(person.slug) + '" data-vote-name="' + esc(person.name) + '">⚡ Vote with Lightning</button>' +
    '</article>';
}

function voteCount(slug) {
  const comm = communityStats(slug);
  return comm ? comm.count : 0;
}

function zapSats(slug) {
  const comm = communityStats(slug);
  return comm ? comm.totalSats : 0;
}

/** Combined trust + track; uses community averages when zaps exist. */
function likedScore(slug, person) {
  const comm = communityStats(slug);
  if (comm && comm.count) return (comm.trust + comm.track) / 2;
  return (person.trustworthiness + person.trackRecord) / 2;
}

function getSortOptions() {
  return {
    metric: document.getElementById('sortMetric').value,
    dir: document.getElementById('sortDir').value
  };
}

function sortList(list, metric, dir) {
  const copy = list.slice();
  const mul = dir === 'asc' ? 1 : -1;
  copy.sort((a, b) => {
    let diff = 0;
    if (metric === 'liked') diff = likedScore(a.slug, a) - likedScore(b.slug, b);
    else if (metric === 'votes') diff = voteCount(a.slug) - voteCount(b.slug);
    else if (metric === 'sats') diff = zapSats(a.slug) - zapSats(b.slug);
    else if (metric === 'trust') diff = clampScore(a.trustworthiness) - clampScore(b.trustworthiness);
    else if (metric === 'track') diff = clampScore(a.trackRecord) - clampScore(b.trackRecord);
    else diff = String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' });
    if (diff !== 0) return diff * mul;
    return String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' });
  });
  return copy;
}

function rosterRowHtml(person, rank) {
  const liked = likedScore(person.slug, person);
  const votes = voteCount(person.slug);
  const sats = formatSats(zapSats(person.slug));
  return '<li><button type="button" class="roster-item" data-roster-slug="' + esc(person.slug) + '">' +
    '<span class="roster-rank">' + rank + '</span>' +
    '<span class="roster-name">' + esc(person.name) + '</span>' +
    '<span class="roster-stats">' +
    '<span class="roster-stat-liked" title="Liked score (avg trust + track)">♥ ' + liked.toFixed(1) + '</span>' +
    '<span class="roster-stat-votes" title="Vote count">' + votes + ' votes</span>' +
    '<span class="roster-stat-sats" title="Total sats zapped">' + esc(sats) + '</span>' +
    '</span></button></li>';
}

function renderRoster(list) {
  const roster = document.getElementById('influencerRoster');
  const title = document.getElementById('rosterTitle');
  const q = (document.getElementById('searchInput').value || '').trim();
  title.textContent = q ? 'Matching influencers' : 'All influencers (' + list.length + ')';
  roster.innerHTML = list.map((p, i) => rosterRowHtml(p, i + 1)).join('');
  roster.querySelectorAll('[data-roster-slug]').forEach((btn) => {
    btn.addEventListener('click', () => scrollToInfluencer(btn.getAttribute('data-roster-slug')));
  });
}

function scrollToInfluencer(slug) {
  const search = document.getElementById('searchInput');
  const roster = document.getElementById('influencerRoster');
  if ((search.value || '').trim()) {
    search.value = '';
    applyFilters();
    setTimeout(() => scrollToInfluencer(slug), 50);
    return;
  }
  const card = document.querySelector('.influencer-card[data-slug="' + CSS.escape(slug) + '"]');
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('card-highlight');
  roster.querySelectorAll('.roster-item').forEach((el) => el.classList.remove('roster-active'));
  const activeBtn = roster.querySelector('[data-roster-slug="' + slug + '"]');
  if (activeBtn) activeBtn.classList.add('roster-active');
  setTimeout(() => card.classList.remove('card-highlight'), 2200);
}

function applyFilters() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const { metric, dir } = getSortOptions();
  const showAllBtn = document.getElementById('showAllBtn');
  showAllBtn.hidden = !q;
  filtered = allInfluencers.filter((p) => {
    if (!q) return true;
    const hay = (p.name + ' ' + p.slug + ' ' + (p.who || '') + ' ' + (p.does || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  filtered = sortList(filtered, metric, dir);
  renderRoster(filtered);
  render();
}

function render() {
  const grid = document.getElementById('rankingGrid');
  const meta = document.getElementById('resultsMeta');
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No matches. Try another name or clear the search.</p></div>';
    meta.textContent = 'Showing 0 of ' + allInfluencers.length;
    return;
  }
  grid.innerHTML = filtered.map(cardHtml).join('');
  meta.textContent = 'Showing ' + filtered.length + ' of ' + allInfluencers.length;
  grid.querySelectorAll('[data-vote-slug]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openVoteModal(btn.getAttribute('data-vote-slug'), btn.getAttribute('data-vote-name'));
    });
  });
}

function openVoteModal(slug, name) {
  activeVoteSlug = slug;
  document.getElementById('voteModalSubtitle').textContent = 'One Lightning zap = one vote for ' + name;
  document.getElementById('voteTrust').value = '5';
  document.getElementById('voteTrack').value = '5';
  document.getElementById('trustVal').textContent = '5';
  document.getElementById('trackVal').textContent = '5';
  document.getElementById('voteNote').value = '';
  document.getElementById('voteStatus').textContent = '';
  document.getElementById('invoiceBox').style.display = 'none';
  document.getElementById('voteModalBackdrop').classList.add('open');
  document.getElementById('voteModalBackdrop').setAttribute('aria-hidden', 'false');
}

function closeVoteModal() {
  document.getElementById('voteModalBackdrop').classList.remove('open');
  document.getElementById('voteModalBackdrop').setAttribute('aria-hidden', 'true');
  activeVoteSlug = null;
}

function mapInfluencers(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const name = String(p.name || '');
    return {
      slug: String(p.id || slugify(name)),
      name,
      who: String(p.who || ''),
      does: String(p.does || ''),
      tags: Array.isArray(p.tags) ? p.tags : [],
      trustworthiness: clampScore(p.trustworthiness),
      trackRecord: clampScore(p.trackRecord != null ? p.trackRecord : p.trackrecord)
    };
  }).filter((p) => p.name);
}

function loadData() {
  allInfluencers = mapInfluencers(PLEB_RANKING_INFLUENCERS);
  filtered = sortList(allInfluencers, 'liked', 'desc');
  applyFilters();
  const zapTimeout = new Promise((resolve) => setTimeout(resolve, 8000));
  Promise.race([fetchZapVotes(), zapTimeout])
    .then(() => applyFilters())
    .catch(() => {});
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('sortMetric').addEventListener('change', applyFilters);
document.getElementById('sortDir').addEventListener('change', applyFilters);
document.getElementById('showAllBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  applyFilters();
});
document.getElementById('voteCancel').addEventListener('click', closeVoteModal);
document.getElementById('voteModalBackdrop').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeVoteModal();
});

document.getElementById('voteTrust').addEventListener('input', function () {
  document.getElementById('trustVal').textContent = this.value;
});
document.getElementById('voteTrack').addEventListener('input', function () {
  document.getElementById('trackVal').textContent = this.value;
});

document.getElementById('voteSubmit').addEventListener('click', async () => {
  if (!activeVoteSlug) return;
  const status = document.getElementById('voteStatus');
  const invoiceBox = document.getElementById('invoiceBox');
  status.textContent = 'Creating zap invoice…';
  invoiceBox.style.display = 'none';
  try {
    const result = await castLightningVote({
      slug: activeVoteSlug,
      trust: Number(document.getElementById('voteTrust').value),
      track: Number(document.getElementById('voteTrack').value),
      note: document.getElementById('voteNote').value,
      sats: Number(document.getElementById('voteSats').value)
    });
    if (result.paid) {
      status.textContent = 'Paid! Vote will appear after zap receipt propagates (~30s). Refreshing…';
      setTimeout(async () => {
        await fetchZapVotes();
        applyFilters();
        closeVoteModal();
      }, 4000);
    } else {
      status.textContent = 'Pay this invoice in your Lightning wallet, then refresh the page.';
      invoiceBox.style.display = 'block';
      invoiceBox.textContent = result.pr;
    }
  } catch (err) {
    status.textContent = err && err.message ? err.message : 'Vote failed.';
  }
});

document.getElementById('themeFab').addEventListener('click', function () {
  const isLight = document.body.classList.toggle('light-ranking');
  document.body.classList.toggle('dark-theme', !isLight);
  this.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('plebRankingTheme', isLight ? 'light' : 'dark');
});

(async function init() {
  const cfg = await loadVoteConfig();
  const minSats = cfg.minVoteSats || 21;
  document.getElementById('minSatsLabel').textContent = String(minSats);
  document.getElementById('voteSats').min = String(minSats);
  document.getElementById('voteSats').value = String(cfg.defaultVoteSats || minSats);
  const fab = document.getElementById('themeFab');
  if (document.body.classList.contains('light-ranking')) fab.textContent = '🌙';
  loadData();
})();
