# Mobile optimization and layout consistency

## Summary

This PR fixes mobile layout issues across all tool pages: the dark/light theme toggle no longer overlaps content, the fixed header no longer cuts into the first card, and header + toggle placement is consistent site-wide.

## Problems addressed

1. **Theme toggle overlapping** – On mobile, the toggle was often `position: fixed` at `top: 20px; right: 20px`, overlapping the header or the first content card.
2. **Header cutting into first card** – Main content did not always have enough top padding below the fixed header on small viewports.
3. **Inconsistent layout** – Toggle and header placement varied by page (inside cards, fixed to body, different positions).

## Approach

- **Single place for the toggle:** The theme toggle is now part of the header nav (inside `.nav-links`) on every page, so it scrolls with the nav and never overlaps body content.
- **Shared mobile CSS:** `styles.css` defines mobile rules for `main` and for toggles that live in the nav, so behavior is consistent everywhere the stylesheet is used.

## Changes

### Global (`styles.css`)

- **Mobile `main` spacing:** `@media (max-width: 768px)` adds `main { padding-top: 92px; }` so content clears the fixed header.
- **Nav theme toggle:** New rules for `.nav-theme-wrap` and `.nav-links #theme-toggle-container` (flex, alignment) and for buttons inside them (`position: static` so they are in flow, not overlapping).
- **Mobile toggle size:** In the same breakpoint, nav theme toggles are set to 40×40px and 1.2rem font for a consistent tap target.

### Pages updated

| Page | Change |
|------|--------|
| **treasury.html** | Toggle moved from first card into header; `.theme-toggle-btn` no longer absolutely positioned. |
| **btc-buy-tracker.html** | Toggle moved into header; currency toggle in first card given a mobile-friendly wrapper (centered below title on small screens). |
| **financial-planner.html** | Toggle moved from planner-header into header nav. |
| **home.html** | Toggle created in JS and appended to `#theme-toggle-container` in nav; removed absolute positioning. |
| **forrest-portfolio.html** | `#theme-toggle-container` added in nav; JS appends toggle there and uses non-fixed styles. |
| **pleb-release.html** | `#theme-toggle-container` moved from tool-header into nav; JS unchanged (already appends to container). |
| **btc-loan-ltv.html** | `#theme-toggle-container` moved from calculator-header into nav. |
| **step-by-step-to-self-custody.html** | `#theme-toggle-container` added in nav; JS appends toggle there and removes fixed positioning. |
| **the-great-intersection.html** | `#theme-toggle-container` added in nav; JS appends toggle there and removes fixed positioning. |
| **retirement-calculator.html** | `#theme-toggle-container` added in nav; JS appends toggle there and removes fixed positioning. |
| **coveredcall-tracker.html** | `#theme-toggle-container` added in nav; JS appends toggle there and removes fixed positioning. |

**Already correct (no structural change):** interest-arbitrage-calculator.html, invoice-builder.html (toggle already in nav); bitcoin-security.html (toggle in nav); privacy-analyzer.html (no theme toggle).

**Note:** compound-interest-calculator.html has encoding issues in the repo; the same pattern (container in nav + append in JS) can be applied there when the file is fixed.

## Result

- Theme toggle is always in the header and no longer overlaps content on mobile.
- First card no longer sits under the fixed header on small screens.
- Header and toggle layout are consistent across pages that use the shared header and `styles.css`.

## How to test

1. Resize the browser to ~768px width or use DevTools device mode.
2. Check each tool page: toggle should be in the top nav, and the first content card should start below the header with visible spacing.
3. Confirm theme still switches correctly and that no content is covered by the toggle or header.
