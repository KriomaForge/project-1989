# Project 1989 — The Manager's Desk
## v1.11.2 — Rivalry Files & Managerial Memory (local beta)

**YOUR CLUB. YOUR DECISIONS. YOUR LEGACY.**

### New
- Persistent, **career-long league derby records**, which survive the end-of-season results reset: meetings, W/D/L, last result and current unbeaten/win/loss sequence.
- **Managerial duels** preserve your personal results against opposition managers, even when your club changes.
- Press Cuttings includes previous encounter scores, revenge angles, streaks, and manager-to-manager records, based on outcomes actually simulated.
- The **League Records notebook page** now includes a retro **Rivalry File** with head-to-head summaries and opposition manager names.
- Real-club modes use recognised English football derby identities. Fictional/PES-world modes use fictional names and rivalry pairings.
- Existing save games can be loaded and begin collecting their cross-season rivalry archive from the current season onward.

### Deliberate historical boundaries
- These are **in-game simulated career records**, not historical 1980s head-to-head results. No earlier meetings are invented or backfilled.
- All AI manager names and attributed dialogue are **game-generated**, not verified historical appointments or real quotations. The in-game newspaper does not call them fictional.
- The full football database carries the research limitations in previous release notes; verify third-party reuse rights before publishing.

### Compatibility and validation
- Built on v1.11.1. Keeps the established Manager's Desk / ring-bound notebook, balanced match engine, all four career modes and existing saves.
- 130/130 automated Node tests passed (including four new rivalry persistence / report tests).
- Completed 46-week season plus rollover and three weeks of the following season in historical and fictional/PES modes.
- Full browser visual inspection has not been performed.

### Local test
Run `py -m http.server 8000` from the `project-1989` directory, then browse to http://localhost:8000. Play a derby, read Press Cuttings, open Notebook → Record Book, then complete a season and check the same derby's history in the following season.
