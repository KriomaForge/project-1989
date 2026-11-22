# v1.16.1 — Ground Improvements & Summer Building Hotfix

## Player-facing improvements

- Removed prominent prototype disclaimers and research commentary from **The Football Ground**, around-the-league ground browsing, supporter capacity, and the miniature picture caption. No more “visual class”, “concept”, or “in-game capacity” labels in the ground notebook.
- Historical caveats remain here in documentation: the exact integer capacities are **gameplay capacities**, not verified August 1989 physical measurements. Ground architecture is stylised. Historical ground research remains a future milestone.
- The existing ground illustration now gets a prominent, visible **MAIN STAND** after a stand is completed. Terrace expansion and shop improvements also change the picture.
- The construction page clearly states that **capacity increases on completion**, not on approval. A new stand increases the game's capacity by **5,700** places after **14 matchweeks** of building.
- Project completions and exact new capacities are retained in saves; existing v1.16 careers and in-progress constructions continue with no changes to their costs or project lengths.

## Choice: build now or in the summer

- **BUILD NOW**: full price, starts immediately, original project duration. Ongoing works reduce accessible capacity and home gate revenue until completion. A stand build temporarily restricts home capacity by **22%**; other projects have smaller restrictions.
- **BUILD IN SUMMER**: pay an **85% price** (15% discount) now, no matchday disruption during the current season; the project is completed as the next season starts. The ground and capacity change at that point. One project at a time is still enforced.
- New stand: **£410,000 now** or **£348,500 in the summer** at level 0. More advanced projects scale their price as in v1.16.
- Weekly upkeep begins when construction has been completed.

## Revenue test

`simulation/v1161-work-impact.mjs` generates `v1161-work-impact.csv`, using ten career seeds each for Liverpool, Aston Villa, West Bromwich Albion, Walsall, Exeter City and Maidstone United. The script compares the same home-match week and squad before/after approving building work, avoiding confounding fixture results.

The simplified gate model reduces expected match receipts by 22% during stand construction. Summer projects leave the current season's gate income unchanged. This release does not retroactively charge lost receipts for an earlier version's project.

## Future work

- Revisit newspaper and supporter-story variety.
- Perform genuine historical stadium architecture/capacity research before describing these figures as authentic.
- v1.17: ground snapshots in the scrapbook and venue-aware highlights.
