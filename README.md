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
