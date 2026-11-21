# Historical 1989–90 player research — v1.9.5 foundation

**This is not yet a fully verified 92-club historical database.** The game still has a historical research preview (Villa and Exeter), plus fictional replacements where information is missing. Do not label the preview as complete.

## Immediate correction
- Chris Price (Aston Villa): born **30 March 1960** according to 11v11; therefore **29** on 1 August 1989, with no estimated-age tilde. His 1989–90 Aston Villa appearances and club tenure are corroborated by the same source: https://www.11v11.com/players/chris-price-30454/
- Dwight Yorke: 17 on 1 August 1989; 1989–90 season association is not evidence he was registered at Aston Villa on 1 August.

## Research assets included
- `research/CLUB_COVERAGE_1989_90.csv`: all **92** clubs and their research status. Every opening-day registration remains **unverified** until primary or appropriately dated evidence is obtained.
- `research/PLAYER_EVIDENCE_STAGING.csv`: 33 existing game-preview footballers, their current approximate game ratings and current DOB coverage; none is automatically classified opening-day-registered.
- `research/BRENTFORD_1989_90_STAGING.csv`: 23 published season-roster players with dates of birth, including year-only joining information; staged for review but deliberately **not imported into the game as proven opening-day registrations**.

## Why this matters
A season squad list can include players joining in September or later. Opening-day registration requires an earlier dated squad list, documented signing/registration date or independent chronology. Avoid using seasonal appearances as proof of opening-day membership. Correct duplicate/common-name identity carefully.

## Best primary archive lead
The National Football Museum states that its Football League collection includes **player registration books from 1890 to 1992** recording player names, registration dates and matches played for *all Football League clubs*. This could verify August 1989 registration comprehensively, but it may require archive access and permission to reproduce transcribed data. See https://www.nationalfootballmuseum.com/wp-content/uploads/2023/01/NFM-Archive-list.pdf

## Supporting secondary sources
- https://www.11v11.com/teams/aston-villa/tab/players/season/1990/
- https://www.11v11.com/teams/exeter-city/tab/players/season/1990/
- https://en.wikipedia.org/wiki/1989%E2%80%9390_Brentford_F.C._season
- https://www.soccerdbdata.com/?ts=15393&view=xteam
- https://www.historical-lineups.com/

## Data contract for future import
For every player: club at 1989-08-01; name; disambiguating identity or player ID; position; DOB (null if not checked); registration/effective dates; evidence URL and retrieval date; evidence tier; verified vs uncertain flag. Keep **estimated ability and potential separate** from sourced facts. No player should silently receive an invented birth date or club registration.

## Process
1. Verify squad from a dated source for each of 92 teams.
2. Reconcile players joining/leaving before/after the opening date.
3. Independently source DOB and role; if missing, mark missing, not estimated as fact.
4. Assign game-balanced skill/potential, clearly labelled fictional estimates.
5. Add verified clubs incrementally to the historical mode; retain the preview badge until all 92 are complete.
6. Seek permission or appropriate licensing before mass redistributing proprietary compiled datasets.
