# Data for The Great Intersection

To have **The Great Intersection** page use auto-updating Strategy data:

1. Add a file here named `strategy-purchases.json`.
2. Format: a JSON array of `[date, totalBtc]` pairs, e.g.  
   `[["2020-08-11", 21454], ["2020-09-14", 38250], ...]`  
   Dates are `YYYY-MM-DD`; values are Strategy’s **cumulative** BTC holdings on that date (same as [Strategy.com Purchases](https://www.strategy.com/purchases)).
3. Update this file daily (e.g. copy the latest row from strategy.com, or run a script/cron that fetches or scrapes and overwrites the file).

The page will load this file when present and show a note that Strategy data is from `data/strategy-purchases.json`. Strategy’s “average BTC/day” is always computed from the **last 24 data points** (or half the series), so as you add new dates the average updates automatically.

**Left to mine** is already live: on each load the page fetches the current block height from Blockstream and computes remaining supply from the standard halving schedule (21M cap minus cumulative mined).
