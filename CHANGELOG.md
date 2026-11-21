## v1.9.2 — Football worlds research preview
- Three separate new-career modes; historic data caveats explicitly visible.
- Original generative fictional English club league option.
- Selected researched season players from Aston Villa and Exeter City; others remain fictional.
- Save version unchanged.

## v1.9.0-beta.1 — Club Colours & Academy Intake
- Home colour swatches for all 92 initial clubs; away teams deliberately white in match views.
- Pixel incident replay uses home colours, with two-tone shirts where appropriate.
- Two academy players automatically join each club, three enter the free-agent market each season.
- Existing save format retained; historical squads remain under research.

# v1.8.8 Beta 1 — Finance and fixtures hotfix

- Fixed long consecutive away/home fixture stretches in newly generated league calendars.
- Added practical accountant advice, season-average gate forecast, and clearer away-game ledger labels.
- Kept existing played fixtures and historical ledger entries unchanged.
- 81 automated tests passing.

## v1.8.5 Beta 1 — Career Records, Accountant & Staff Navigation (21 November 2026)

- Manager’s Office now includes a results ledger by club (played, won, drawn, lost, goals for/against), honours, record transfer purchase/sale and appointment history.
- New managerial results are recorded at match time and achievements at season finish; no duplicate match accounting on First Division rest weeks.
- Older saved careers retain all data and show available historical club-season tables separately, clearly marked as club statistics rather than certified managerial performance. Missing historical managerial results are not invented.
- Added Margaret Ellis, the permanently named club accountant, with contextual plain-language assessment of liquidity, revenue, wages, cash trends and advice. She is not recruitable or variable-skill staff.
- Made Backroom Staff easier to find from the Manager’s Office and Finances, alongside existing Chairman’s notebook link. Existing assistant/scout/physio appointment mechanics, salaries and severance remain unchanged.
- Kept v3 save compatibility. Added five automated tests (68/68 passing).
- Visual UI testing remains to be done in Chrome and on a phone.

## v1.8.4 Beta 1 — Transfer Affordability & Youth Free Agents

- Fixed transfer budget/cash overdraft discrepancy and explained signing headroom in both scouting screens.
- Added five released 16–18-year-old youth free agents per club every new season (460 league-wide), including at game creation.
- Youth starting skill reflects origin club strength; hidden potential is independent of division.
- Updated scouting to show viable free youth recruits and rotate affordable club-listed options.
- Retained version 3 saves; added five new tests (63 passing total).

## v1.8.3 Beta 1 — Club Finances & Backroom Staff (21 November 2026)

- Replaced the generic weekly cash adjustment with simplified club finances: division/club-size commercial receipts, home match income influenced by club form, player wages and backroom wages.
- Added FA Cup and League Cup prize payments plus home cup receipts, and season-end revenue distributions influenced by division and final league position.
- Added a recent club finance ledger and forward-looking cash estimates. Existing financial history is not retroactively reconstructed.
- Added a Chairman-approved Backroom Staff screen. Replace the assistant manager, scout or physiotherapist, paying four weeks of outgoing salary as compensation and a weekly wage for the new staff member.
- The chairman allows a limited division-based overdraft for staffing, but refuses appointments beyond the limit. Hiring is not free.
- Added physio specialisms affecting the speed of recovery from injuries. Existing staff personality effects on team selection and scouting remain.
- Kept v3 save format and existing notebook design; new finance fields are optional on older careers.
- 58 automated tests pass. Full end-to-end browser testing could not be completed due to browser network restrictions.

## v1.8.2-beta.1 — Staff personalities and notebook page numbers
- Scout and Assistant Manager now have distinct, persistent working styles described in plain English, affecting recommendations and team selection.
- Every notebook section has consistent sequential spread page numbers (01–16).
- Existing save v3 retained; 52 automated tests passed.

## v1.8.1 Beta 1 — Assistant Selection & Cup Labels (local testing)

- Added a second squad selection control: **Assistant Manager Pick**. It scores eligible players using positional requirements and ability, fitness, morale, recent form and experience. Players with injuries are excluded. Existing **Auto Pick Best XI** is preserved.
- Cup Competition screens now use descriptive round titles (First Round through Quarter-final, Semi-final and Final). New cup match reports include the round label. Prior saves with match reports that lack round metadata continue to render.
- **No cup bracket or scheduling changes**; existing cup mechanics remain simplified.
- Save format and browser storage key unchanged from v1.8.

# Changelog

## v1.8.0-beta.1 — Player Careers & Scouting
- Age, potential, experience, form and appearances/assists/career histories added to player data.
- Season development and free-fee youth intake added.
- Position-aware scout assessments and reason-labelled, affordable recommendations.
- Weekly scout shortlist stability across budget changes.
- Player ages, form, appearances and assists displayed in the squad interface.
- Match replay clock above score; commentary and pitch presented together at desktop widths.
- Save v3 compatibility retained; 44 automated tests pass.

## v1.7.0-beta.1 — 21 November 2026
- Rebalanced match results around selected position-specific XI strength, fitness and morale.
- Introduced replay scoreboard clock: 0–0 until the relevant goals play, full score at final whistle.
- Prevented Match Centre statistics and incident spoilers before full time during watched replays.
- Expanded fictional first and last names and avoided within-squad full-name duplicates on new careers.
- Added match-balance, name and replay-score regression tests.
- Kept save version 3 for v1.6.1 compatibility.

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

## v1.8.6 Beta 1 — 21 November 2026
- Clarified free-agent versus former academy club labels in scouting and Transfers.
- Fixed transfer-fee logic for unattached senior players: £0 fee, wages remain payable.
- Introduced **Release** action with ten-week wage compensation, chairman credit limit and ledger entry.
- Introduced lightweight interested buyers / No offers feedback in the squad sales table.
- Rebalanced First Division gate receipts, commercial income and end-of-season payments; applied smaller divisional factors.
- Corrected estimated next-home-receipt display to share underlying economic model.
- Confirmed annual, not midseason, youth intakes; existing save version unchanged.

## v1.8.7 Beta 1 — Transfer UI Consistency
- Corrected displayed fees for unattached senior players (no fee; valuation retained separately).
- Show SIGNED status in notebook and transfer office immediately after an acquisition.
- Added player age to squad sale/release table and visible release settlement.
- Added targeted regression tests; preserved save format.

## 1.9.1-beta.1 — Fixture Calendar & Notebook Repair
- Apply the existing retro notebook treatment to Fixtures and Club Accounts.
- Correct First Division board comments, including defending-champion language.
- Offer opt-in in-season legacy fixture rebalancing without changing played results, opponents or matchweeks.
- Add tests for home/away streaks across 20/24-club divisions and legacy calendar repairs.

## v1.9.3 Beta 1 — New Game and Season Review hotfix
- Restored missing cup club-name helper used by Season Review and cup reports.
- Season Review handles incomplete older season records safely.
- Added New Game navigation and a safe new-career setup with mode selection and overwrite confirmation.
- Updated Save / Load instructions, removing obsolete v0.1 notices.
- Existing save format unchanged.

## v1.9.4 Beta 1 — Historical player ages and PES club aliases
- Verified birth dates used for supported 1989–90 Villa and Exeter squad players; missing dates flagged as estimates.
- Curated initial skill and development-potential ratings for 33 researched player names, explicitly subjective, not historical statistics.
- PES-inspired mode maps clubs to documented PES English team aliases where available, with original generated names for others.
- No save-version bump: existing careers remain unchanged, new careers use the updated profile data.
