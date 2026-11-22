# Project 1989 — The Manager's Desk
## v1.13.1 — The Three Voices of Football

**YOUR CLUB. YOUR DECISIONS. YOUR LEGACY.**

This beta expands the existing Season Review newspaper into three complementary editorial voices, using the same recorded results:

1. **The Football League Gazette** — neutral season review and statistics.
2. **The Supporters' Voice** — emotional, one-club fanzine. Celebrates titles and promotions; criticises poor seasons; can print calls for a managerial change. Such comments are press opinion, not a board action.
3. **Regional Football Herald** — reports the managed club and neighbouring teams even where they have *no existing rivalry*. Aston Villa's regional coverage includes Walsall, Wolverhampton Wanderers, West Bromwich Albion, Birmingham City, Coventry City and more.

Use the buttons in **Season Review** to switch newspapers. Completed editions are stored in the season archive and also appear as distinct cuttings in the Manager's Scrapbook. Old saves without these perspectives continue to show their original Gazette editions.

### New rivalries that develop during play

Repeated competitive meetings can create a **Growing regional rivalry** even between clubs that had no traditional derby. Strong clubs repeatedly fighting for the title can also develop a **New title rivalry** even without geographical proximity. These are earned from league results: multiple seasons of meetings, close finishes and competitive stakes, rather than created automatically because clubs share an area.

The rivalry tracker is stored in the career save and becomes usable by the existing pre-match rivalry system. Historical derbies remain unchanged. PES-style clubs use their game's club names.

### Scope and limitations

- Newspaper reports are deterministic, written locally from recorded game facts; no runtime AI service or network call is needed.
- Editorial statements are deliberately subjective and never presented as actual board decisions.
- Regional groupings are broad editorial catchments, **not** a claim that all listed neighbours are derbies; individual club geography remains researchable.
- Rivalries only accrue from seasons played with this new tracking logic; old save results cannot be fully reconstructed if absent.
- Supporter confidence, ground development and revenue interactions remain planned future features, not part of this beta.
- No changes to the match engine, historic ratings or transfer logic.

### Testing

141/141 automated tests passed, including all 92 club regional coverage, Walsall included in Villa regional reporting, three-edition archive, multi-season save/load, generated-mode support and emerging rivalry threshold. JavaScript syntax and ZIP integrity also checked. Full visual browser testing remains outstanding.

### Local test

Extract the full ZIP, open a terminal in `project-1989`, run `py -m http.server 8000` and visit `http://localhost:8000`. Finish a season and select **Season Review** to switch between editions. Existing saved careers remain supported; new paper perspectives appear for newly completed seasons.
