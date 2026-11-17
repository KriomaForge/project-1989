# Developer Notes — v1.1

The core simulation lives in `js/engine.js` and is deterministic for a given game state and seed. The DOM interface lives in `js/app.js`.

## Transfer shortlist
`transferCandidates(game)` uses a matchweek-seeded shuffle; simply opening and sorting the shortlist does not reroll its content. `transact()` enforces membership. Existing transfers are tracked in `game.transferHistory`.

## League statistics
`sortLeagueRows()` returns sorted/filtered copies of league rows, retaining original competition rank as `rank` for clarity. It must never change `standings()` itself.

## Match highlights
`replayStep()` presents each already-generated event and makes no new simulation rolls. This keeps watch and quick-result modes identical.

## Regression checks
- `npm test`
- Test every league sort and filter in Chrome
- Buy a GK; confirm he appears with GKs in sale list
- Advance one week; confirm the scout list changes
- Watch a match, replay and verify event sequence is the same
- Export and import a previous v1.0 career
