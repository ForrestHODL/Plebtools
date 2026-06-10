(function () {
  'use strict';

  var all = [];
  var filtered = [];
  var activeVoteSlug = null;
  var voteModule = null;

  function slugify(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function clampScore(n) {
    var v = Number(n);
    if (!isFinite(v)) return 0;
    return Math.max(0, Math.min(10, Math.round(v)));
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) {
      return w[0].toUpperCase();
    }).join('');
  }

  function mapInfluencers(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(function (p) {
      var name = String(p.name || '');
      return {
        slug: String(p.id || slugify(name)),
        name: name,
        who: String(p.who || ''),
        does: String(p.does || ''),
        tags: Array.isArray(p.tags) ? p.tags : [],
        trustworthiness: clampScore(p.trustworthiness),
        trackRecord: clampScore(p.trackRecord != null ? p.trackRecord : p.trackrecord)
      };
    }).filter(function (p) { return p.name; });
  }

  function communityStats(slug) {
    if (!voteModule) return null;
    return voteModule.communityStats(slug);
  }

  function formatSats(sats) {
    if (voteModule) return voteModule.formatSats(sats);
    var n = Math.round(Number(sats) || 0);
    if (n <= 0) return '0 sats';
    return n.toLocaleString('en-US') + ' sats';
  }

  function likedScore(person) {
    var comm = communityStats(person.slug);
    if (comm && comm.count) return (comm.trust + comm.track) / 2;
    return (person.trustworthiness + person.trackRecord) / 2;
  }

  function voteCount(slug) {
    var comm = communityStats(slug);
    return comm ? comm.count : 0;
  }

  function zapSats(slug) {
    var comm = communityStats(slug);
    return comm ? comm.totalSats : 0;
  }

  function parseViewOrder() {
    var sel = document.getElementById('viewOrder');
    if (!sel) return { metric: 'liked', dir: 'desc', label: 'Highest rated → lowest' };
    var raw = sel.value || 'liked:desc';
    var parts = raw.split(':');
    var metric = parts[0] || 'liked';
    var dir = parts[1] || 'desc';
    var label = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : raw;
    return { metric: metric, dir: dir, label: label };
  }

  function sortValueFor(person, metric) {
    if (metric === 'liked') return likedScore(person);
    if (metric === 'trust') return person.trustworthiness;
    if (metric === 'track') return person.trackRecord;
    if (metric === 'votes') return voteCount(person.slug);
    if (metric === 'sats') return zapSats(person.slug);
    return 0;
  }

  function sortValueDisplay(person, metric) {
    if (metric === 'name') return '';
    if (metric === 'liked') return likedScore(person).toFixed(1);
    if (metric === 'sats') return formatSats(zapSats(person.slug));
    return String(sortValueFor(person, metric));
  }

  function scoreBar(label, value, cls) {
    var v = clampScore(value);
    return '<div class="pr-score">' +
      '<div class="pr-score-top"><span>' + label + '</span><strong>' + v + '/10</strong></div>' +
      '<div class="pr-bar"><span class="pr-fill ' + cls + '" style="width:' + (v * 10) + '%"></span></div>' +
      '</div>';
  }

  function cardHtml(person, rank) {
    var tags = (person.tags || []).map(function (t) {
      return '<span class="pr-tag">' + esc(t) + '</span>';
    }).join('');
    var comm = communityStats(person.slug);
    var liked = likedScore(person).toFixed(1);

    return '<article class="pr-card" id="card-' + person.slug + '" data-slug="' + esc(person.slug) + '">' +
      '<header class="pr-card-head">' +
      '<div class="pr-avatar">' + initials(person.name) + '</div>' +
      '<div class="pr-title">' +
      '<h2><span class="pr-rank-badge">#' + rank + '</span>' + esc(person.name) + '</h2>' +
      '<p class="pr-liked">♥ ' + liked + ' · Trust ' + person.trustworthiness + ' · Track ' + person.trackRecord + '</p>' +
      '</div></header>' +
      (tags ? '<div class="pr-tags">' + tags + '</div>' : '') +
      '<p class="pr-bio"><strong>Who</strong> ' + esc(person.who) + '</p>' +
      '<p class="pr-bio"><strong>Does</strong> ' + esc(person.does) + '</p>' +
      '<div class="pr-scores">' + scoreBar('Trust', person.trustworthiness, 'trust') + scoreBar('Track', person.trackRecord, 'track') + '</div>' +
      (comm ? '<p class="pr-community">Community (' + comm.count + ' votes): trust ' + comm.trust + ', track ' + comm.track + ' · ' + formatSats(comm.totalSats) + ' zapped</p>' : '') +
      '<button type="button" class="pr-vote-btn" data-slug="' + esc(person.slug) + '" data-name="' + esc(person.name) + '">⚡ Vote · ' + esc(person.name) + '</button>' +
      '</article>';
  }

  function sortList(list, metric, dir) {
    var copy = list.slice();
    var mul = dir === 'asc' ? 1 : -1;
    copy.sort(function (a, b) {
      var diff = 0;
      if (metric === 'name') {
        diff = a.name.localeCompare(b.name);
      } else {
        diff = sortValueFor(a, metric) - sortValueFor(b, metric);
      }
      if (diff !== 0) return diff * mul;
      return a.name.localeCompare(b.name);
    });
    return copy;
  }

  function nameIndexHtml(list, metric) {
    return list.map(function (p, i) {
      var val = sortValueDisplay(p, metric);
      var valHtml = val
        ? '<span class="pr-name-val" title="Sort value">' + esc(val) + '</span>'
        : '';
      return '<button type="button" class="pr-name-chip" data-jump-slug="' + esc(p.slug) + '" title="Jump to ' + esc(p.name) + '">' +
        '<span class="pr-name-rank">' + (i + 1) + '</span> ' +
        esc(p.name) + valHtml +
        '</button>';
    }).join('');
  }

  function renderNameIndex(list, metric, viewLabel) {
    var el = document.getElementById('nameIndex');
    var heading = document.getElementById('namesHeading');
    if (heading) {
      heading.textContent = list.length ? 'Names · ' + viewLabel : 'Names';
    }
    if (!el) return;
    el.innerHTML = list.length ? nameIndexHtml(list, metric) : '<span class="pr-name-empty">No matches</span>';
    el.querySelectorAll('[data-jump-slug]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slug = btn.getAttribute('data-jump-slug');
        var card = document.getElementById('card-' + slug) || document.querySelector('[data-slug="' + slug + '"]');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          card.classList.add('pr-card-focus');
          setTimeout(function () { card.classList.remove('pr-card-focus'); }, 2000);
        }
      });
    });
  }

  function render() {
    var grid = document.getElementById('rankingGrid');
    var meta = document.getElementById('resultsMeta');
    var view = parseViewOrder();
    if (!grid) return;

    if (!filtered.length) {
      grid.innerHTML = '<p class="pr-empty">No matches. Clear search to see everyone.</p>';
      meta.textContent = '0 of ' + all.length;
      renderNameIndex([], view.metric, view.label);
      return;
    }

    renderNameIndex(filtered, view.metric, view.label);
    grid.innerHTML = filtered.map(function (p, i) { return cardHtml(p, i + 1); }).join('');
    meta.textContent = filtered.length + ' of ' + all.length + ' · ' + view.label;

    grid.querySelectorAll('.pr-vote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openVoteModal(btn.getAttribute('data-slug'), btn.getAttribute('data-name'));
      });
    });
  }

  function applyFilters() {
    var q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
    var view = parseViewOrder();

    filtered = all.filter(function (p) {
      if (!q) return true;
      var hay = (p.name + ' ' + p.who + ' ' + p.does + ' ' + p.tags.join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    filtered = sortList(filtered, view.metric, view.dir);
    render();
  }

  function loadInfluencers() {
    var raw = window.PLEB_RANKING_DATA;
    if (!Array.isArray(raw) || !raw.length) {
      document.getElementById('rankingGrid').innerHTML = '<p class="pr-empty">Could not load influencer data.</p>';
      return;
    }
    all = mapInfluencers(raw);
    filtered = sortList(all, 'liked', 'desc');
    applyFilters();
  }

  function loadVotesLater() {
    import('./pleb-ranking-vote.js').then(function (m) {
      voteModule = m;
      return m.fetchZapVotes();
    }).then(function () {
      applyFilters();
    }).catch(function () {});
  }

  function openVoteModal(slug, name) {
    activeVoteSlug = slug;
    document.getElementById('voteModalTitle').textContent = 'Vote: ' + name;
    document.getElementById('voteModalSubtitle').textContent = 'Lightning zap = one trust + track vote for this person';
    document.getElementById('voteModalBackdrop').classList.add('open');
    document.getElementById('voteModalBackdrop').setAttribute('aria-hidden', 'false');
  }

  function closeVoteModal() {
    document.getElementById('voteModalBackdrop').classList.remove('open');
    document.getElementById('voteModalBackdrop').setAttribute('aria-hidden', 'true');
    activeVoteSlug = null;
  }

  function init() {
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    var viewEl = document.getElementById('viewOrder');
    if (viewEl) {
      viewEl.addEventListener('change', applyFilters);
    }
    document.getElementById('voteCancel').addEventListener('click', closeVoteModal);
    document.getElementById('voteModalBackdrop').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeVoteModal();
    });
    document.getElementById('voteTrust').addEventListener('input', function () {
      document.getElementById('trustVal').textContent = this.value;
    });
    document.getElementById('voteTrack').addEventListener('input', function () {
      document.getElementById('trackVal').textContent = this.value;
    });

    document.getElementById('voteSubmit').addEventListener('click', function () {
      if (!activeVoteSlug) return;
      var status = document.getElementById('voteStatus');
      status.textContent = 'Loading voting…';
      import('./pleb-ranking-vote.js').then(function (m) {
        voteModule = m;
        return m.castLightningVote({
          slug: activeVoteSlug,
          trust: Number(document.getElementById('voteTrust').value),
          track: Number(document.getElementById('voteTrack').value),
          note: document.getElementById('voteNote').value,
          sats: Number(document.getElementById('voteSats').value)
        });
      }).then(function (result) {
        if (result.paid) {
          status.textContent = 'Paid! Refresh in ~30s for scores to update.';
          setTimeout(function () {
            voteModule.fetchZapVotes().then(applyFilters);
            closeVoteModal();
          }, 3000);
        } else {
          status.textContent = 'Pay the invoice in your wallet.';
          document.getElementById('invoiceBox').style.display = 'block';
          document.getElementById('invoiceBox').textContent = result.pr;
        }
      }).catch(function (err) {
        status.textContent = (err && err.message) ? err.message : 'Vote unavailable on this connection.';
      });
    });

    loadInfluencers();
    setTimeout(loadVotesLater, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
