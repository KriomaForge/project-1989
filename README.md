> **Current local beta: v1.8.8** — corrected home/away scheduling for new seasons, practical accountant guidance and clearer finance ledger entries. Existing saves retain their fixtures and history.

### v1.8.5 — Career records and financial advice

The Manager's Office now tracks actual match results by club, manager achievements, and record purchases and sales. Tracking starts with this version for older saves; older completed club league tables are shown separately when available and not falsely labelled as a personal managerial record. The Finances screen includes Margaret Ellis, the permanent accountant, whose reports derive from club income, expenses, overdraft and recent operating results. Appoint or replace the assistant manager, scout, or physiotherapist through Manager's Office → Backroom Staff (also via Finances or Chairman's Notebook). The accountant is not recruitable.

# Latest local test build: v1.8.3 Beta 1

See [release notes](RELEASE_NOTES_v1.8.3.md) for the new club finance, staff hiring and physio systems.

# Project 1989 — v1.8.0 Beta 1

**Player Careers, Better Scouting & Match Layout** · Local testing release · November 2026

## Changes since v1.7

- Players now have ages, hidden potential, experience and form, plus appearances, goals and assists. Simple stats are shown in team selection without creating a modern Football Manager-style database.
- Played league matches influence form and morale; player age and experience have a small effect on match strength. Player morale still responds to the existing Living Notebook choices.
- Every new season ages players and adjusts their skills according to a simple development curve: prospects may grow, older veterans may decline. Career totals persist even when season totals reset.
- A cohort of fictional 17–20-year-old youngsters is available **without a transfer fee** at new career creation and a fresh cohort enters at the start of each new season. Weekly wages still apply.
- The scout evaluates the user's weakest position, low morale, poor form, veterans and inexperienced lineups. The weekly shortlist prioritises improvement, potential and affordability, and explains each player's recommendation.
- The scouting shortlist is stable for a matchweek, including when reviewing finances or transferring a player. Recommendations update after matchweeks.
- Match Centre now places the in-game clock **above the main scoreboard**, and the pixel pitch **beside the current commentary** on desktop. Small screens stack those panels.

**Not included yet:** AI clubs do not actively negotiate transfers with one another; historical 1989–90 squads are not included; and there is not yet a multi-year contract model. Youth availability is simplified (free fee, not free wages).

## Save compatibility

The existing **version 3 save format and browser storage key** are preserved. Old players receive deterministic ages and developmental fields when a saved career opens. Existing names, squads, transfers, results and managerial history are unchanged. New youth intakes appear when the next season begins; an existing save does not gain new youth players immediately.

The new simulation affects future matches only. Export your save from the existing game before switching folders. Running on the same `localhost:8000` browser origin will reuse the existing career.

## Testing

All 44 Node engine/interface regression tests passed. Chromium's headless launch could not be completed here, so full interactive desktop/mobile browser verification remains outstanding.

## Run locally

Unzip the package, open a terminal in the `project-1989` folder, run `py -m http.server 8000` on Windows or `python3 -m http.server 8000`, then visit http://localhost:8000/.

To run regression tests: `npm test`. The project is static HTML/CSS/JS: there are no runtime npm dependencies.

## Publishing on GitHub Pages

Upload the **contents** of `project-1989` to the repository root (where `index.html` lives), then publish `main` → `/ (root)` under Settings → Pages. Check that all asset directories are intact.

## Save safety

Before uploading, use Save / Load → Export Career to back up your game. After publishing, test using a new browser profile if you want a new career without replacing your existing local save.

---

**v1.6.1 hotfix:** Postbag unread counting fixed. Save format unchanged. Back up/export your existing career before replacing files.

> **v1.2.1 hotfix:** This build restores two missing screen functions that caused v1.2.0 to display a blank screen when loading an existing career. Your existing browser save should remain compatible. Keep a backup and run a hard reload (Ctrl+F5) after replacing files.

# Project 1989 — Retro Football Manager

**Version:** 1.2.0-beta.1 · browser-based single-player management game

An original football management game inspired by the simplicity of late-1980s classics. The 1989–90 club structure is historical; player names, attributes, budgets, transfers and match results are fictional.

## Play locally (Windows)
Unzip the release, open a terminal in the `project-1989` folder and run:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Alternatively deploy the contents of this folder on GitHub Pages.

## Version 1.2 updates
- **Manager’s Notebook** is now the default career screen, using two facing retro-styled pages, inspired by a coach's ring-bound report book.
- The left page gives contextual, save-derived coach comments: fitness, attack/defence, injuries, chairman's concerns and next opponents.
- The right page prominently displays **four of the six weekly scout recommendations**, including club, position, ability, fee and a direct signing control. See all six under Transfers.
- Coach's Notebook is the first navigation tab. An obvious button on Club Office also links directly to it.
- Previous 1.1 career saves remain in the same local browser storage slot; back up before updating.
- The notebook interface is original and does not reproduce the copyrighted pixel art or portraits from the 1989 original.

## Earlier Version 1.1 updates
- The scout now shows **six possible transfers per matchweek**, refreshing after you play/advance a week. Buying is only possible from that shortlist.
- Players you sign appear **in position order** on the squad-for-sale screen, followed by ability ranking.
- Both league tables and the scout shortlist have sort/filter controls.
- Match highlights use **actual match events** and radio-style cards, rather than a randomly roaming ball.
- Your existing v1.0 save uses the same browser storage slot and should remain available. Export a backup before updating.

## Save backup
Open Save / Load and export a JSON backup. Browser saves belong to their specific web origin (for example `localhost:8000` or GitHub Pages), and can be cleared by the browser.

## Quality and limitations
Automated engine tests: run `npm test` (Node.js required). The interface should be browser-tested before a stable release. Cup formats, transfer negotiations and historical multi-year league-size changes remain simplified. The match highlights are event presentations rather than a real-time 2D game animation.

## Credits
Original Project 1989 game software and branding. The original Kenny Dalglish title and its artwork are not included. Historical research found that the 1989 game used a scout to present available players; the six-player weekly shortlist is our own adaptation of that mechanic.

### v1.3 notebook and mobile menu
Open **Manager's Notebook** and use its four tabs to switch between Coach & Scout (unchanged), Chairman, Match Day and Record Book. The **Retro Menu** top tab opens a colourful tiled destination selector designed for phone-sized screens. The existing top navigation remains intact, and all new pages use your existing career data rather than a separate save. No browser storage reset is required.

## What's new in v1.4 — The Living Notebook
The existing Coach & Scout pages are retained. Additional notebook tabs contain:

- **Postbag:** chairman correspondence, coaching notes and scouting announcements.
- **Press Cuttings:** fictional newspaper headlines that react to matches and cup runs.
- **Dressing Room:** player conversations; your response can affect player morale.

The story grows when you progress a matchweek, sign or sell players, or change managerial jobs. Some board responses alter job security. Reports are saved with the same browser career save format (v3), and previous saves migrate automatically: existing results, players and budgets remain untouched. The new narrative history begins on your first v1.4 matchweek if you are continuing an older save.

The **Retro Menu** now features original illustrated fictional staff portraits, and league tables use a retro vidiprinter presentation. All footballers and reports are fictional simulation content, not contemporary reconstructions.

### Updating from v1.3
1. Export a backup of your current career in Save / Load.
2. Copy the new extracted project files over your old folder (including the new `js/story.js` and new portrait SVGs).
3. Open the game from the same browser address as before, and hard-refresh (Ctrl+F5).
4. Your current save is still in `project1989-save-v3`. Do not clear your browser storage.

### Developer tests
Run `npm test` (Node.js required only for tests) to check the football simulation, notebook startup and narrative system. The project itself remains a static browser app; Python `py -m http.server 8000` is sufficient to play. Automated Chromium navigation could not reach localhost in the build environment (`ERR_BLOCKED_BY_ADMINISTRATOR`); desktop/mobile visuals have not been confirmed with an end-to-end browser test.


### v1.5: Retro Match Day
After advancing a matchweek, visit Match Centre and select **WATCH HIGHLIGHTS** or **NEXT EVENT**.
A little pixel-art football scene animates each recorded incident and the commentary is displayed below.
The pitch is an illustrative replay, not an independent second simulation or full tactical movement engine.
You can still skip matches, review text and export saves as before.


## Version 1.6: Retro Presentation Pass

- **Stable match commentary:** The incident replay now displays one current incident beside the pixel pitch. The full incident clock is in an independent scrollable list, and clicking an incident replays that moment. Playback will not scroll the browser page. Full commentary is available on demand in the fixed commentary panel.
- **Manager’s Log:** Open *Manager’s Notebook → Manager’s Log* to review recorded match reports, transfer moves, recorded decisions, job changes, and honours. Filter by category. Entries are reconstructed from existing career data; older match reports that do not contain a season label may be attributed to the current season.
- **Richer story decisions:** The coach can discuss training intensity and the chairman can ask about priorities. New dialogue options carry changes to fitness, morale or board confidence. Choices are one-time and stored in the existing save.
- **Retro presentation:** Reworked vidiprinter league tables, period cup headers, and original pixel-style menu icon artwork for Match Day, League, Cups, Fixtures, Practice and Save. Existing character portraits remain, with an improved stadium menu backdrop.
- **Mobile:** Compact match incident grid and smaller touch-friendly retro menu art.

### Save compatibility
The v1.5 `project1989-save-v3` slot and JSON saves remain supported. Export a backup before updating. Avoid clearing the browser's site data.

### Testing
Run `npm test` (requires Node.js). The 30 automated checks pass. The headless Chromium visual smoke test could not finish in the provided environment, so check desktop and mobile appearance before publishing broadly.

### Known limitations
Match highlights remain stylised replays of events rather than a continuous tactical match simulation. Manager log records depend on what the existing saved career retained. 1989–90 cup regulations are not yet fully modelled. Match incidents and story dialogue use fictional match data and characters.


### v1.8.1 local beta

Team & Tactics has two quick selection modes: **Auto Pick Best XI** (ability only) and **Assistant Manager Pick** (a weighted mix of skill, fitness, morale, form and experience). Cup Competition stages use friendly round titles; this does not yet reproduce historical replay or two-leg rules.


### v1.8.2 local beta
The Coach & Scout notebook includes staff personalities. Assistant Manager Pick follows your assistant's approach; scout shortlists reflect the scout's specialty. All notebook spreads are numbered 01–16. See `RELEASE_NOTES_v1.8.2.md`.

### v1.8.4 transfer money and youth intake
Transfer funds are a separate allocation from club cash; a purchase must fit both the allocation and the chairman-approved cash/overdraft headroom. The scout now displays both limits. An existing save receives a new five-per-club youth cohort at the *next* new season, not retroactively.


## v1.8.6 free transfers, releases and finances

See [v1.8.6 release notes](RELEASE_NOTES_v1.8.6.md). Unattached players are fee-free (but require wages), releases cost ten weeks of salary, and the fictional club-economy model has been rebalanced. These changes apply to future actions and matchweeks; existing savings are not recalculated.

### Old-save fixture repair (v1.9.1)
If your existing career inherited a long run of away games, open **Fixtures → REBALANCE REMAINING FIXTURES**. Export a save first. This only reverses remaining home/away pairings where both meetings are unplayed and never changes opponents or already played matches. New careers have a balanced fixture generator.


## v1.9.5 research status
The 92-club evidence register is in `research/`; full dated historical player registrations remain in progress. See `HISTORICAL_RESEARCH_STATUS.md`.
