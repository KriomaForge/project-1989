# Project 1989 v1.8.4 Beta 1 — Transfers & Youth Intake Fix

## Why this release exists

A player valued at £18,000 could appear disabled even when the transfer budget was £70,541. The transfer screen previously checked both the allocated transfer budget and raw cash, without explaining the second test. A permitted overdraft applied to staff but not player transfers. Separately, the old youth intake introduced only 24 uncontracted young players across all 92 clubs, so youth could be hard to find.

## Changes

- Signings now use **both** the transfer budget and the chairman-approved cash/overdraft limit. The available signing headroom is shown in the scouting notebook and Transfer Office. Buying reduces both club cash and transfer funds. A £0 signing does not need a cash transfer fee; player wages remain a weekly expense.
- Shortlists prioritise feasible options, show young free agents more reliably, and include at least one club-listed player when a suitable affordable option exists. Cached lists use a new key so old invalid recommendations do not persist into the new build.
- On a **new career**, each of the 92 clubs releases **five young free agents aged 16–18** for the 1989 season: 460 young players. Each season rollover adds another 460.
- Starting youth ability reflects their former club's squad quality and division. Hidden potential is generated separately, so any division can produce a high-potential future star. These young players are *unattached* and cost no transfer fee, but they have wages.
- Existing career saves remain on version 3. Their next season rollover generates the larger intake. Past seasons are not rewritten, and existing cash/budgets are not modified.
- Tests added for the exact £70,541 / £18,000 overdraft case, 92-club five-player youth intakes, ability/potential and free signings.

## Limitations

- Historical 1989–90 squads are not included. Youth is fictional and should not be confused with actual historical club academies.
- Free agent pools grow as seasons advance; a later release should introduce AI signings, contracts, releases and pruning.
- Staff, transfer, and youth finances remain a deliberately simplified retro game economy rather than researched historical club accounts.
- Browser visual QA must still be completed locally.
