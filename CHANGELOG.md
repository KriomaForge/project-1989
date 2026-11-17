## v1.6.1 — Postbag hotfix

- Postbag unread banner now counts only chairman, coach and scout letters, excluding press cuttings and dressing-room conversations.
- Separate unread badges on Press Cuttings and Dressing Room tabs.
- Opening a notebook correspondence page opens the newest unread item and marks it read immediately, persisting to existing browser save.
- Added regression tests for category counts and navigation.
- No save-format or gameplay changes.

# Changelog

## v1.6.0-beta.1 — Retro Presentation Pass (2026-11-17)

- FIX: Match playback no longer appends commentary indefinitely or auto-scrolls the browser away from the pitch. Current incident is fixed in view; scrollable, clickable incident timeline is separate.
- NEW: Manager’s Log notebook page showing matches, transfer movements, decisions, jobs, champions and cup winners; filter by category. No save migration.
- NEW: Longer-running coach and chairman dialogue, more response options and meaningful fitness / morale / board confidence consequences.
- VISUAL: Stronger vidiprinter table, classic cup headers and six new retro pixel-art menu illustrations, with smaller-screen styling.
- TESTS: 30 automated tests pass, including manager log navigation, replay timeline regression and story option behaviour. Browser visual testing remains outstanding.

## v1.2.1 — Startup hotfix (17 November 2026)

- Restore `manager()` and `finances()` screen functions accidentally omitted from v1.2.0.
- Fix blank application screen on loading an existing manager career.
- Add automated existing-save UI startup and navigation test covering all tabs (19 tests total).
- Retain the v3 save key and format; existing careers should remain compatible.
- Full real-browser visual test is still pending.

# Changelog

## 1.2.0-beta.1 — The Manager’s Notebook
- Made a two-page retro notebook the default game landing view.
- Added contextual coach verdicts, injury and fitness assessments, board commentary and next-fixture context.
- Brought the weekly scouting system into view with sign actions directly on the notebook page.
- Kept detailed modern data tables available in the existing squad, league and transfer views.
- Compatible with existing version 1.1 saves; no game schema change.
- All 18 existing engine tests passed; graphical browser verification still recommended.

# Changelog — Project 1989

## v1.1.0-beta.1 — 17 November 2026
- Replaced unrestricted transfer catalogue with a stable six-player weekly scout shortlist, informed by original-game research.
- Player signings now validate against the current shortlist; shortlisted players have a named source club or free-agent status.
- Selling screen sorts existing and newly purchased players consistently: GK, DEF, MID, FWD, then highest ability.
- Added transfer position filter and ability/position/fee/name sorting.
- Added league-table filtering by club and sorting by points, official rank, goal difference, goals scored/conceded, wins/draws/losses, played and name.
- Official table rank remains visible while sorting by other statistics.
- Replaced misleading wandering-ball visual with chronological event-led match highlight cards tied to generated match incidents.
- Kept multi-season, manager careers, cups, reports and existing save slot untouched.
- Added automated regression tests.

## v1.0.0-beta.1
- Added management careers, named club-to-club transfers, expanded commentary, match statistics and report highlights.
- Added Project 1989 visual identity and previous-save migration support.

## v1.3.0 beta.1 — Notebook pages and retro menu
- Preserved the existing Coach/Scout notebook layout and style.
- Added four page tabs: Coach & Scout, Chairman, Match Day and Record Book.
- Chairman page includes board confidence, job security and latest club messages.
- Match Day pages show fixture details, last match result and cup competition status.
- Record Book displays a league snapshot and season archive.
- Added a new optional, touch-friendly, colourful retro menu inspired by 1980s football-game packaging and menu artwork. Existing web tabs remain available.
- Added regression check for new page navigation and maintained the existing save key and game engine.

## v1.4.0-beta.1 — The Living Notebook (17 November 2026)
- Preserves the existing Coach & Scout double-page notebook and blue binding.
- Adds Postbag, Press Cuttings and Dressing Room notebook page tabs.
- Introduces a deterministic, persistent career story engine tied to actual league form, cup results, transfers and job moves.
- Manager responses to board warnings affect confidence; player conversations affect morale. Choices cannot be applied twice.
- Adds unread reports, read state, narrative archive (latest 140 messages), and career-safe save migration with the existing v3 save slot.
- Adds original diverse illustrated staff portraits to the stadium-style retro menu; no tobacco imagery.
- Adds a black-and-green vidiprinter-style league table while keeping modern sort and filters.
- 25 automated tests passed (20 existing plus 5 story tests). Browser navigation was blocked by the test environment and still needs user testing.


## 1.5.0-beta.1 — Retro Match Day
- Added event-driven pixel-art pitch replay to the existing Match Centre; mini-scenes now depict recorded goal, shot, booking and injury events.
- 320×180 internal canvas, integer-scaled for desktop and mobile. No third-party graphic dependencies.
- Replay animation is cosmetic: it does not recalculate results, goals, scorers or outcomes.
- Quick Result, text commentary and notebook pages remain available.
- Slower playback options give the scenes time to complete.
- No changes to the career save schema; this is not a full 22-player football simulation.
