// Segwit data from archived Bitcoin Wiki (2017)
// BIP-110 positions researched from public sources, June 2026

const INFLUENCERS = [
  {
    name: "Adam Back",
    handle: "@adam3us",
    bip110: "no",
    notes: "Blockstream CEO; calls BIP-110 a 'literal downgrade' and 'lynch mob attempt'",
    source: { label: "CoinTelegraph", url: "https://cointelegraph.com/news/adam-back-opposes-bip110-fixing-arbitrary-data-spam" }
  },
  {
    name: "Alex Thorn",
    handle: "@intangiblecoins",
    bip110: "no",
    notes: "Galaxy Digital head of research; called BIP-110 'an attack on Bitcoin' and 'incredibly stupid'",
    source: { label: "X post (Oct 2025)", url: "https://coinlaw.io/bip-444-bitcoin-soft-fork-debate/" }
  },
  {
    name: "Beautyon",
    handle: "@Beautyon_",
    bip110: "prefer",
    notes: "Bitcoin maximalist author; celebrated BIP-110 as excising 'cancer' from the chain",
    source: { label: "X post", url: "https://x.com/Beautyon_/status/2016800435286180005" }
  },
  {
    name: "Ben Kaufman",
    handle: "@_benkaufman",
    bip110: "no",
    notes: "Bitcoin Keeper developer; called coercive BIP-110 language 'the most clear case of an attack on Bitcoin'",
    source: { label: "X post (Oct 2025)", url: "https://coinlaw.io/bip-444-bitcoin-soft-fork-debate/" }
  },
  {
    name: "Bitcoin Mechanic",
    handle: "@GrassFedBitcoin",
    bip110: "prefer",
    notes: "Vocal proponent; Knots community leader; reviewed BIP on GitHub",
    source: { label: "BIPs PR #2017", url: "https://github.com/bitcoin/bips/issues/2017" }
  },
  {
    name: "Charlie Spears",
    handle: "Blockspace",
    bip110: "evaluating",
    notes: "Blockspace co-founder; reported BIP-110 activation client test failures; skeptical spam can be stopped at consensus",
    source: { label: "Blockspace", url: "https://blockspace.media/insight/dathon-ohm-releases-bip-110-client-for-uasf-softfork/" }
  },
  {
    name: "Chris Guida",
    handle: "@cguida",
    bip110: "prefer",
    notes: "Lightning dev; built Garbageman mempool filters; argues spam filtration is essential to Bitcoin as money",
    source: { label: "Blockworks Supply Shock", url: "https://blockworks.co/podcast/supplyshock/6036b02e-311c-11f0-a694-1b75b1aa9f9b" }
  },
  {
    name: "Danny Knowles",
    handle: "@_DannyKnowles",
    bip110: "unknown",
    notes: "Hosted 'Why BIP-110 Won't Change Bitcoin' with Wicked and Mr Hodl",
    source: { label: "What Bitcoin Did", url: "https://podcast.app/what-bitcoin-did-p855085" }
  },
  {
    name: "David Bailey",
    handle: "@DavidFBailey",
    bip110: "no",
    notes: "BTC Inc / Bitcoin Conference CEO; said he 'adamantly disagree[s]' with BIP-110 supporters",
    source: { label: "X post (Apr 2026)", url: "https://moneycheck.com/michael-saylor-says-bitcoin-cycle-is-dead-as-bip-110-debate-splits-the-community/" }
  },
  {
    name: "Giacomo Zucco",
    handle: "@giacomozucco",
    bip110: "no",
    notes: "Anti-spam but officially opposes BIP-110; predicts it will fail and hurt credibility",
    source: { label: "Bitcoin Infinity Show", url: "https://www.bitcoininfinityshow.com/why-bip-110-will-fail-giacomo-zucco-bitcoin-infinity-show-194/" }
  },
  {
    name: "Hodlonaut",
    handle: "@hodlonaut",
    bip110: "prefer",
    notes: "Re-endorsed BIP-110: 'Bitcoin is money, not data storage'; briefly withdrew support on Infinity Show then returned",
    source: { label: "Nostr/X posts", url: "https://vanlett.com/hodlonaut" }
  },
  {
    name: "Jameson Lopp",
    handle: "@lopp",
    bip110: "no",
    notes: "Published 'A Layman's Guide to BIP-110' calling it reckless; warns of chain split",
    source: { label: "Lopp blog", url: "https://blog.lopp.net/a-laymans-guide-to-bip-110/" }
  },
  {
    name: "Jimmy Song",
    handle: "@jimmysong",
    bip110: "evaluating",
    notes: "Not opposed to soft forks in principle; skeptical of BIP-110 urgency; frames debate as governance stress test",
    source: { label: "Walker podcast", url: "https://www.youtube.com/watch?v=qB36atXNM2k" }
  },
  {
    name: "Knut Svanholm",
    handle: "@knutsvanholm",
    bip110: "evaluating",
    notes: "Bitcoin Infinity Show host; platforms both pro- and anti-BIP-110 guests without fixed endorsement",
    source: { label: "Bitcoin Infinity Show", url: "https://www.bitcoininfinityshow.com/" }
  },
  {
    name: "Marty Bent",
    handle: "@MartyBent",
    bip110: "deficient",
    notes: "Says 'no consensus' on OP_RETURN issue; cautious on contentious fork path",
    source: { label: "studyknots guide", url: "https://github.com/studyknots/studyknots.github.io/blob/main/docs/guides/op-return-controversy.md" }
  },
  {
    name: "Matthew Kratter",
    handle: "@mattkratter",
    bip110: "prefer",
    notes: "Bitcoin University; defends BIP-110 against critics; argues activation is not rushed",
    source: { label: "YouTube", url: "https://www.youtube.com/watch?v=FiP4ErcBbNM" }
  },
  {
    name: "Michael Saylor",
    handle: "@saylor",
    bip110: "unknown",
    notes: "Apr 2026 X post warned of 'iatrogenic protocol changes' generally — did not name BIP-110; media inferred a link",
    source: { label: "X post (Apr 4, 2026)", url: "https://x.com/saylor/status/2040438683380146574" }
  },
  {
    name: "MrHodl",
    handle: "@MrHodl",
    bip110: "no",
    notes: "BIP110 = still born altcoin.",
    source: { label: "Nostr/X posts", url: "https://x.com/MrHodl/status/2063540844905353281" }
  },
  {
    name: "Parman (Arman The Parman)",
    handle: "@Parmanodyssey",
    bip110: "prefer",
    notes: "Published Parmanode BIP-110 install guide; promotes running signaling nodes",
    source: { label: "YouTube", url: "https://www.youtube.com/watch?v=JpvNDL9Opns" }
  },
  {
    name: "Peter McCormack",
    handle: "@_PeterMcCormack",
    bip110: "evaluating",
    notes: "Former What Bitcoin Did host (passed show to Danny Knowles); no fixed public BIP-110 endorsement found",
    source: { label: "X announcement", url: "https://stacker.news/items/664876" }
  },
  {
    name: "Pierre Rochard",
    handle: "@BitcoinPierre",
    bip110: "prefer",
    notes: "Says BIP-110 is 'too moderate'; wants OP_RETURN removed entirely at consensus, not just capped",
    source: { label: "X post", url: "https://x.com/BitcoinPierre/status/2017222460131717340" }
  },
  {
    name: "Samson Mow",
    handle: "@Excellion",
    bip110: "evaluating",
    notes: "Urged users off Core v30 onto Knots; criticized Core devs but no explicit BIP-110 endorsement found",
    source: { label: "studyknots guide", url: "https://github.com/studyknots/studyknots.github.io/blob/main/docs/guides/op-return-controversy.md" }
  },
  {
    name: "Stephan Livera",
    handle: "@stephanlivera",
    bip110: "deficient",
    notes: "SLP host; anti-spam but sees 'genuine risks and problems with BIP-110' including chain-split danger",
    source: { label: "SLP729", url: "https://stephanlivera.com/episode/729/" }
  },
  {
    name: "Super Testnet",
    handle: "@supertestnet",
    bip110: "no",
    notes: "Built URSF-110 to reject BIP-110 signaling blocks; dislikes proposal despite aligning with anti-spam goals",
    source: { label: "URSF-110 repo", url: "https://github.com/supertestnet/ursf-110" }
  },
  {
    name: "Tone Vays",
    handle: "@ToneVays",
    bip110: "no",
    notes: "Long debate with Jimmy Song on Knots vs Core v30 and BIP-110 governance",
    source: { label: "Simon Dixon blog", url: "https://www.simondixon.com/blog/knots-vs-core-bitcoins-next-governance-war" }
  },
  {
    name: "Vortex",
    handle: "@theonevortex",
    bip110: "no",
    notes: "Argues BIP-110 adds subjective content filtering to consensus; valid fee-paying txs should not be blocked",
    source: { label: "X thread", url: "https://stacker.news/items/1430460" }
  },
  {
    name: "Walker",
    handle: "@WalkerAmerica",
    bip110: "evaluating",
    notes: "THE Bitcoin Podcast host; does not run BIP-110; hosts debates on both sides (e.g. Zucco)",
    source: { label: "Walker Substack", url: "https://walkeramerica.substack.com/p/giacomo-zucco-spam-is-bad-so-is-bip" }
  },
  {
    name: "Wicked",
    handle: "@w_s_bitcoin",
    bip110: "no",
    notes: "Smart Wicked Bitcoin node tracker; argues BIP-110 won't activate and compares unfavorably to Segwit",
    source: { label: "Lopp blog (cited tweet)", url: "https://blog.lopp.net/a-laymans-guide-to-bip-110/" }
  },
  {
    name: "Erik Aronesty",
    handle: "@earonesty",
    bip110: "no",
    notes: "Guest on 'The Case Against BIP-110' — Bitcoin Infinity Show #201",
    source: { label: "Bitcoin Infinity Show", url: "https://www.podscan.fm/podcasts/the-bitcoin-infinity-show" }
  },
  {
    name: "Melvin Carvalho",
    handle: "@melvincarvalho",
    bip110: "acceptable",
    notes: "Published game-theory and code audit arguing activation mechanism is well-designed",
    source: { label: "Code audit", url: "https://melvin.me/public/articles/bip110.html" }
  }
];

const DEVELOPERS = [
  { name: "Karl-Johan Alm", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Bryan Bishop", aff: "", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Edmund Broadley", aff: "Core", segwit: "acceptable", bip141: "acceptable", bip148: "no", bip149: "no", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "฿tcDrak", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "acceptable", bip91: "no", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Ava Chow", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Wang Chun", aff: "F2Pool", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "acceptable", bip91: "acceptable", segwit2x: "accjuly", bip110: "no", source: { label: "X @satofishi", url: "https://www.gate.com/news/detail/f2pool-co-founder-wang-chun-bitcoin-protocol-upgrades-should-not-use-a-20053832" } },
  { name: "Matt Corallo", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "no", bip149: "", bip91: "acceptable", segwit2x: "no", bip110: "no", source: { label: "Public opposition", url: "https://mirror.b10c.me/bitcoin-bitcoin/34930/" } },
  { name: "Johnathan Corgan", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "no", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Luke Dashjr", aff: "Knots", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "no", bip91: "accjuly", segwit2x: "no", bip110: "prefer", source: { label: "Bitcoin Knots PR #238", url: "https://github.com/bitcoinknots/bitcoin/pull/238" } },
  { name: "Christian Decker", aff: "c-lightning", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Samuel Dobson", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Nicolas Dorier", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "acceptable", bip91: "accjuly", segwit2x: "", bip110: "unknown", source: null },
  { name: "Thaddeus Dryja", aff: "lit", segwit: "prefer", bip141: "prefer", bip148: "no", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Mark Erhardt (Murch)", aff: "BIP editor", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "deficient", source: { label: "BIPs PR #2017", url: "https://github.com/bitcoin/bips/pull/2017" } },
  { name: "Mark Friedenbach", aff: "BIP 68/112", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "no", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Pavel Janik", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "no", bip149: "acceptable", bip91: "no", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Thomas Kerin", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "prefer", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Johnson Lau", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Eric Lombrozo", aff: "", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "weak", bip91: "accjuly", segwit2x: "no", bip110: "deficient", source: { label: "Medium — consensus caution", url: "https://medium.com/@elombrozo/latest-thoughts-on-bitcoin-the-good-the-bad-and-the-ugly-598d5346d0d7" } },
  { name: "Greg Maxwell", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "no", source: { label: "bitcoin-dev list", url: "https://gnusha.org/pi/bitcoindev/CAAS2fgTCFx2yvvUu9YWwcm-SSojT530Uwzi0b3sOG0+VZEcaAw@mail.gmail.com/" } },
  { name: "Alex Morcos", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Dathon Ohm", aff: "BIP-110", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "prefer", source: { label: "BIP-110 spec", url: "https://github.com/bitcoin/bips/blob/master/bip-0110.mediawiki" } },
  { name: "nopara73", aff: "TumbleBit", segwit: "weak", bip141: "weak", bip148: "wanting", bip149: "prefer", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: 'Laolu "roasbeef" Osuntokun', aff: "lnd", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: 'Kristofer "rawlzsec" Rawlins', aff: "", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "weak", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Jeremy Rubin", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "no", bip91: "accjuly", segwit2x: "no", bip110: "evaluating", source: { label: "BIPs PR #2017 review", url: "https://github.com/bitcoin/bips/pull/2017" } },
  { name: 'Pavol "stick" Rusnak', aff: "TREZOR", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "acceptable", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Rusty Russell", aff: "c-lightning", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Gregory Sanders", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Jonas Schnelli", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "wanting", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Patrick Strateman", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Paul Sztorc", aff: "", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "wanting", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Amir Taaki", aff: "libbtc", segwit: "acceptable", bip141: "acceptable", bip148: "prefer", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Jorge Timon", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "no", bip149: "prefer", bip91: "deficient", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Peter Todd", aff: "", segwit: "prefer", bip141: "prefer", bip148: "deficient", bip149: "wanting", bip91: "accjuly", segwit2x: "no", bip110: "no", source: { label: "Lopp blog / demo tx", url: "https://blog.lopp.net/a-laymans-guide-to-bip-110/" } },
  { name: "Warren Togami", aff: "Elements", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Wladimir van der Laan", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Thomas Voegtlin", aff: "Electrum", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "acceptable", segwit2x: "no", bip110: "unknown", source: null },
  { name: 'Leo Wandersleb', aff: "Mycelium", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "no", source: { label: "Bitcoin prevents spam with fees. Period.", url: "https://x.com/LeoWandersleb/status/2026816261225947340" } },
  { name: "Pieter Wuille", aff: "Core", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "", segwit2x: "no", bip110: "unknown", source: null }
];

const BUSINESSES = [
  { name: "Abra", aff: "wallet", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Bitcoin India", aff: "exchange/miner", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "BitcoinReminder.com", aff: "service", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Bitfinex", aff: "exchange", segwit: "acceptable", bip141: "acceptable", bip148: "acceptable", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Bitfury", aff: "miner", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Bitmain", aff: "miner", segwit: "accjuly", bip141: "accjuly", bip148: "no", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "no", source: { label: "Fee incentive / 2017 UASF opposition", url: "https://cryptobriefing.com/bip-110-fork-fail-activate-adam-back/" } },
  { name: "Bitonic/BL3P.eu", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "weak", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Bitpay", aff: "wallet", segwit: "prefer", bip141: "prefer", bip148: "no", bip149: "", bip91: "prefer", segwit2x: "prefer", bip110: "unknown", source: null },
  { name: "Bitrated", aff: "reputation", segwit: "acceptable", bip141: "acceptable", bip148: "acceptable", bip149: "prefer", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Bitrefill", aff: "merchant", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Bitsquare", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Bitstamp", aff: "exchange", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Bittylicious", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Blockchain.info", aff: "wallet", segwit: "acceptable", bip141: "acceptable", bip148: "", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Blockstream", aff: "infrastructure", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "no", source: { label: "Adam Back on X", url: "https://cointelegraph.com/news/adam-back-opposes-bip110-fixing-arbitrary-data-spam" } },
  { name: "blockonomics", aff: "", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Barefoot Mining", aff: "solo miner", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "prefer", source: { label: "First signaling block", url: "https://www.coindesk.com/tech/2026/03/02/battle-for-bitcoin-s-soul-opens-as-first-block-supporting-clean-up-proposal-is-mined" } },
  { name: "Bustabit", aff: "gambling", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Bylls", aff: "payments / exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "acceptable", bip91: "accjuly", segwit2x: "no", bip110: "unknown", source: null },
  { name: "Casa", aff: "wallet / security", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "no", source: { label: "Jameson Lopp guide", url: "https://blog.lopp.net/a-laymans-guide-to-bip-110/" } },
  { name: "Ciphrex", aff: "wallet / dev stack", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Coinbase", aff: "wallet", segwit: "acceptable", bip141: "acceptable", bip148: "", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "CoinGate", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "CoinJar", aff: "wallet", segwit: "", bip141: "", bip148: "evaluating", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Coinkite", aff: "", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "coinomi", aff: "wallet", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "DigitalBitbox", aff: "wallet (hardware)", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "prefer", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Échange de Montréal", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "F2Pool", aff: "miner", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "acceptable", bip91: "acceptable", segwit2x: "accjuly", bip110: "no", source: { label: "Wang Chun on X", url: "https://www.gate.com/news/detail/f2pool-co-founder-wang-chun-bitcoin-protocol-upgrades-should-not-use-a-20053832" } },
  { name: "Galaxy Digital", aff: "research / brokerage", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "no", source: { label: "Alex Thorn on X", url: "https://coinlaw.io/bip-444-bitcoin-soft-fork-debate/" } },
  { name: "Jaxx", aff: "", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Kraken", aff: "exchange", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "LightningASIC", aff: "miner", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "MARA Pool", aff: "mining pool", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: { label: "Slipstream launch", url: "https://ir.mara.com/news-events/press-releases/detail/1343/marathon-digital-holdings-launches-slipstream" } },
  { name: "myNode", aff: "node platform", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "acceptable", source: { label: "myNode PR #986", url: "https://github.com/mynodebtc/mynode/pull/986" } },
  { name: "Ocean", aff: "mining pool", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "prefer", source: { label: "First signaling block", url: "https://www.coindesk.com/tech/2026/03/02/battle-for-bitcoin-s-soul-opens-as-first-block-supporting-clean-up-proposal-is-mined" } },
  { name: "OneHash", aff: "betting", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Poloniex", aff: "exchange", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "QUOINE", aff: "exchange", segwit: "evaluating", bip141: "evaluating", bip148: "evaluating", bip149: "evaluating", bip91: "evaluating", segwit2x: "evaluating", bip110: "unknown", source: null },
  { name: "Sazmining", aff: "mining hosting", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "acceptable", source: { label: "Opt-in signaling", url: "https://www.sazmining.com/blog/bip-110-explained-what-it-is-and-how-sazmining-clients-can-signal" } },
  { name: "SimpleFX", aff: "broker", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Slushpool", aff: "miner", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "SpiderPool", aff: "mining pool", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "no", source: { label: "Blockspace Weekly", url: "https://blockspaceweekly.substack.com/p/issue13-is-bip-110-a-legitimate-soft" } },
  { name: "Start9", aff: "node platform", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "acceptable", source: { label: "BIP-110 howto", url: "https://bip110.org/howto" } },
  { name: "Umbrel", aff: "node platform", segwit: "", bip141: "", bip148: "", bip149: "", bip91: "", segwit2x: "", bip110: "acceptable", source: { label: "Umbrel Knots app", url: "https://apps.umbrel.com/app/bitcoin-knots" } },
  { name: "TheRockTrading", aff: "exchange", segwit: "", bip141: "", bip148: "evaluating", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Vaultoro", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "acceptable", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null },
  { name: "Walltime", aff: "exchange", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Woleet", aff: "Timestamping", segwit: "prefer", bip141: "prefer", bip148: "prefer", bip149: "", bip91: "", segwit2x: "", bip110: "unknown", source: null },
  { name: "Xapo", aff: "wallet", segwit: "prefer", bip141: "prefer", bip148: "", bip149: "", bip91: "accjuly", segwit2x: "accjuly", bip110: "unknown", source: null }
];
