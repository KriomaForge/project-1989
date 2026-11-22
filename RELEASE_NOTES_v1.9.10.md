# Project 1989 — v1.9.10 Match Engine & Historical Balance Beta

## What changed

- Individual goalscorer attribution now weights a player's rating and playing position, with modest, subjective 1989-style finishing profiles for selected historically noteworthy scorers. Skill affects *who scores*, not merely team goal expectancy.
- Reclassified John Barnes as a midfielder in the 1989 Liverpool dataset, allowing Peter Beardsley and Ian Rush to start together in the default 4-4-2. Beardsley is no longer unfairly omitted from automatic team selection.
- Historically informed game-balancing estimates refined for Gary Lineker, Paul Gascoigne, Alan Smith, David Rocastle, Bryan Robson, Mark Hughes, and Aston Villa core players. These are game design opinions, not historical facts.
- Reduced raw goal expectancy slightly and compressed the effect of extreme rating gaps. This lowers inflated goal totals and prevents Liverpool winning almost every simulated league title.
- Preserved all four modes, same save schema (`version: 3`), historic import workflow and notebook presentation. Existing careers keep the players already saved; match-engine adjustments apply immediately to new matches. New player-rating adjustments apply to newly created careers only.

## Monte Carlo comparisons

Actual engine, automated 1989–90 seasons with fixed reproducible seeds. Base v1.9.9 = 60 historical, 20 opening and 25 generated. New v1.9.10 = 60 historical, 20 opening and 25 generated.

| Metric | Before | After |
|---|---:|---:|
| Division 1 goals / league match (historical full season) | 2.863 | 2.658 |
| League goals / match (all divisions; historical) | 2.839 | 2.616 |
| Liverpool title frequency (60 seasons) | 95% | 70% |
| Liverpool average points | 91.0 | 80.4 |
| Liverpool average goals | 88.9 | 72.5 |
| Aston Villa average position | 5.4 | 5.0 |
| Aston Villa average points | 69.1 | 68.5 |
| Gary Lineker avg league goals | 12.1 | 27.2 |
| John Barnes avg league goals | 16.1 | 22.9 |
| Ian Rush avg league goals | 17.0 | 17.2 |
| David Platt avg league goals | 8.5 | 19.2 |
| Peter Beardsley average apps | 2.0 | 36.0 |

Real 1989–90 reference values (single observed season; not simulation quotas): First Division 986 goals in 380 matches (2.595/match); Lineker 24, Barnes 22, Rush 18, Platt 19 league goals. Historical source links are documented in the previous Monte Carlo report.

Post-change historical-opening: 2.650 Division 1 goals per match (20 runs). Generated-player mode: 2.759 Division 1 goals per match (25 runs).

## Known limitations

- A handful of named historic scoring profiles are subjective calibration settings. They must be reviewed alongside club-strength estimates; this is not a player ability database extracted from contemporary scouting.
- Villa still usually finishes below second and historical club-strength differences need further calibration; one observed actual table should not be a deterministic target.
- The historical full-season roster still permits a real player to appear simultaneously on multiple clubs where transferred during 1989–90. Opening-day registration remains partially unverified.
- Future season results are generated, not reconstructed. There is no 1989 transfer scheduling.
- Automated engine and JavaScript tests passed; browser visual/manual testing was not available in this environment.
- Source-derived historical dataset should not be publicly redistributed without confirming source licensing/permission.
