# Project 1989 — The Club and The Crowd

**Identity:** YOUR CLUB. YOUR DECISIONS. YOUR LEGACY.

**Design guardrail:** Fewer boxes, fewer clicks, more atmosphere. No live AI dependency, no micro-management, no breaking saves.

| Release | Scope | Source of truth | Safety/compatibility |
|---|---|---|---|
| v1.13 Manager’s Scrapbook | Honours, seasons, rivalries, famous matches, great players, transfers and managerial chapters | Existing career record, season editions, rivalry and transfer archives | Reuse current saved data; no new game calculations |
| v1.14 The Football Ground | Ground name and verified 1989 attributes; capacity, terracing, stand styles, floodlights, generic period layouts where research is incomplete | New optional `groundProfile` by club ID, versioned historical source provenance | Research each of 92 clubs; mark estimates as estimates; avoid automatically publishing third-party photos |
| v1.15 The Club and the Crowd | Supporter mood (one visible status), capacity-limited attendance, pricing tiers, gate receipts, supporter headlines | Club finances, results, rivalry records, ground attributes | Small bounded morale effects; never double-count existing gate money |
| v1.16 Ground Development | Covered terraces, seated stand extension, floodlights, pitch/drainage, matchday facilities | Ground upgrade state, cashflow, build progress | Construction consumes funds and time; no retroactive changes to past highlights |
| v1.17 The Visual Archive | Bank of original period-inspired art with different stadium archetypes, day/night/weather, highlights tied to venue | Saved stadium snapshots and match event records | Pre-generated licensed/original assets; no on-demand AI calls from browser |

## Minimal initial data model (future)
```js
club.groundProfile = { groundName, capacity, standingCapacity, seatedCapacity, roofStyle, floodlights, pitchCondition, researchStatus, sourceNotes };
club.supporters = { mood: 60, ticketBand: 'standard' };
club.groundProjects = [{ type, startedSeason, readyWeek, cost, effects }];
match.venueSnapshot = { groundId, profileVersion, upgrades, weather, illustrationId };
```

## Gameplay rules
- Attendance responds to demand (form, club size, derby, prices) but never exceeds safe ground capacity.
- Gate receipts and facilities revenue are **accounted once** through the existing finance ledger.
- Supporter mood responds to results, expectations, derbies, pricing and ground state; feeds board opinion and only a small bounded team morale modifier.
- Ground changes modify capacity, matchday revenue and the look/feel of the venue, not player ability.
- Stories arise from **persisted events**; no fabricated past matches, scorers, attendance figures or real 1989 details.
- Period developments (including Taylor Report-era ground reforms) must be historically verified, respectfully presented and handled by division and season.

## Art plan
1. Original Subbuteo-inspired generic stadium artwork: small terrace, compact four-stand, large historic bowl, night floodlights, winter weather.
2. Club-specific verified stadium geometry and colour details as historical research becomes available.
3. Versioned stadium states so 1990 scrapbook scenes do not show a stand constructed in 1998.
4. Highlights reuse the same original visual system; no need for generative AI running inside GitHub Pages.


## v1.14 progress — The Football Ground (built)
- 92 deterministic, club-colour-aware, period-inspired miniature ground visualisations; four broad division-scale categories plus roof/terrace/floodlight variants.
- Research-candidate venue names are marked PROVISIONAL; others are explicitly pending. Capacity bands and all graphics are illustrative estimates, not 1989 ground facts.
- Ring-bound notebook Ground File and 92-club browsing directory.
- Scrapbook now includes a present-day-at-career-time illustrative stadium panel. Historical stadium snapshots and precise venue art remain on the roadmap.
- No economy, save-schema, match engine or construction changes.

## Editorial depth backlog (after v1.14)
- Longer season features with distinctive national, partisan fanzine and local-paper editorial voices.
- More varied story structures, match context, local club coverage, rival manager quotations and multi-season continuity.
- Adaptive tone based on supporter expectations, derby history, league strength, club trajectory, and honours.
- Repetition controls, story factual validation, and clearer separation between match facts and attributed opinion.
- Regional stories should cover nearby non-rivals as well as emerging rivalries (e.g., Walsall–Villa).
- Feature variety should be configurable without flooding weekly gameplay with text.

## v1.15 follow-up notes
Supporters/attendance beta implemented. Construction and facilities remain v1.16. Editorial diversity remains scheduled for a separate writing pass. Tune ticket elasticity and cash accumulation using further simulations before production.

## Delivered v1.16 — Ground Improvements
- 6 ground improvement projects with board cash checks, construction times, maintenance, capacity, hospitality/retail income and visual changes.
- In-game capacity exact, persistent integers. Historical 1989 certified capacities remain a research task; do not represent model values as archival stadium counts.
- 92 historical venue names supplied without noisy provisional status banners. Period validation continues separately.
- Expanded editorial variation and bespoke ground reconstruction remain on backlog.

## After v1.17
- **Historical programme detail**: broader creative editorial writing, multiple cover archetypes and club-specific programme typography.
- **v1.18 — Under the Floodlights**: venue-informed match replay atmosphere and saved ground imagery across seasons.
- **Regional press depth**: much wider local football news, rivalry escalation and editorial voices.
- **Historical stadium research**: verified period names, dates, stand layouts and capacities for all 92 clubs before replacing illustration-only attributes.
- **Cup programmes**: finals, semis and special commemorative issues without inventing fixture dates.
