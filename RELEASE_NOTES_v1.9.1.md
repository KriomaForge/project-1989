# Project 1989 v1.9.1 Beta 1 — Fixture Calendar and Notebook Repair

## Changes
- Fixture Book and Club Accounts use two-page, numbered retro notebook spreads with the existing typewriter typography. The detailed financial ledger remains available below the book.
- The First Division chairman now discusses challenging for the title, relegation, or defending the championship rather than suggesting promotion.
- New fixture calendars use the balanced schedule generator introduced in v1.8.8.
- **Existing careers** can carry older, badly oriented fixture calendars. The Fixture Book now offers **REBALANCE REMAINING FIXTURES**. This edits only future home/away designations, preserving completed results, week numbers, opponent pairs and one home/away meeting against each opponent. It cannot undo an already-played stretch of away matches.
- The schedule repair is opt-in. Export a career before running it; it will not secretly modify your saved matches.

## Known limitations
- A career's historical ledger and completed fixtures are never rewritten. A partially played old schedule may retain uneven home/away patterns forced by the matches already completed.
- Full graphical browser testing could not be completed because local Playwright navigation is blocked by the execution environment. Node syntax checks and automated engine tests passed.
- Club colours are simplified identities and squads remain fictional pending historical squad research.

## Updating
Extract the archive, open the `project-1989` folder and run `py -m http.server 8000`. Refresh `http://localhost:8000` with Ctrl+F5. Your saved career remains on the same local origin; export a backup first.
