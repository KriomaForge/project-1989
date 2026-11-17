# Project 1989 for Python developers

The runtime is JavaScript because it runs directly in any browser, with no Streamlit deployment or Python backend. Most functions map directly onto familiar Python patterns:

- `newGame()` constructs a mutable dictionary-like game state (`object` in JS).
- `advanceRound(game)` mutates the game state once each week, like a Python `advance_round(game)`.
- `simulateMatch(home, away, seed)` is a deterministic, mostly pure match simulator, analogous to a seeded `random.Random(seed)`.
- `standings(game, division)` produces a sorted array of league table rows.
- `transferCandidates(game)` and `transact(game, playerId, action, targetClubId)` manage transfer listings and deals.
- `updateManager(game)`, `acceptJob(game, clubId)` and `applyForJob(game, clubId)` implement career logic.
- Browser UI handlers live in `js/app.js`, not the engine. The interface calls the engine and then saves JSON state to browser localStorage.

Run automated tests: `npm test`. Run game locally: `py -m http.server 8000`. The source can later be ported to Python or a simulation-backed API, but for simple offline gameplay client-side JS avoids hosting costs.
