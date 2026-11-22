# Project 1989 — The Manager's Desk v1.17.0
## Matchday Programmes & Ground Memories

**YOUR CLUB. YOUR DECISIONS. YOUR LEGACY.**

### Playable features
- Original old-fashioned matchday programme cover, inspired by British printed football programmes, with club colours, club/visitor names, fixture week, season and home-ground illustration. No reproduced third-party programme artwork is distributed.
- Inside pages: preview from the manager's desk, visitors' manager and leading player, league positions, home supporter mood, attendance forecast and expected starting elevens.
- Current programme appears on matchday ahead of a home league fixture. From Match Centre choose **READ MATCHDAY PROGRAMME**; alternatively visit the notebook's **PROGRAMME** tab or Manager's Desk > Match Day.
- The archive retains notable home programme issues (home opener, recognised derby, promotion/title or relegation pressure, and season run-in). Ordinary home programmes remain available before kick-off but do not all clutter the scrapbook.
- An archived programme is a point-in-time snapshot: league information, venue, teams, score, ground-building status and ground image do not change retroactively in later seasons.
- Programme keepsakes also appear in the **Manager's Scrapbook** under PROGRAMMES, with browsing in the full programme archive.
- Retains all four career modes and previous saved careers. The underlying match simulation and financial formulas are not modified by this feature.

### Simulation audit after build
- 112 full-season runs completed across twelve differently sized clubs; 96 historical career simulations plus 16 PES-style alternative-mode simulations.
- 514 special programmes saved, with **zero** duplicate identifiers, missing stadium snapshots, or incorrect home-team archives.
- 4/112 careers ended with negative season cash change; 66 proposed projects were approved and 6 unaffordable new-stand proposals were rejected; 24 approved capacity-changing projects completed during the season. Summer projects are scheduled for next season rather than falsely counted as completed.
- Average net season cash change **+£739,515** (strongly dependent on club size, distribution funds and project scenario). Average final supporter confidence **67.68/100**.
- For specific club results, cash, supporter mood, ticket-policy variation and construction choices, see `simulation/v117-large-audit.csv` and `simulation/v117-large-audit.json`.
- These are synthetic game simulations and **not historic 1989 financial or attendance records**. No discretionary transfers or human tactics in these batch runs.
- **165/165** automated checks pass, including two-season archive preservation and save/load serialisation.

### Limits / future roadmap
- Programmes are presented as matchweek editions because game fixtures have no verified exact calendar date or kickoff time. Do not invent dates or prices.
- Programme cover artwork is deliberately original SVG/CSS; not historically authentic copies of 1968 Wembley artwork or 1989 clubs' publications.
- Grounds and capacities are game representations, not verified detailed 1989 reconstructions. Sources and qualifications are in `README.md`.
- Cup final programmes, team-by-team historic programme typography, illustrated photo banks, stadium-aware highlights and a richer regional press remain separate planned features.
- Visual browser testing remains to be completed; this is a locally testable beta.
