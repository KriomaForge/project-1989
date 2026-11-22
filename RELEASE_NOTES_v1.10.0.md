# Project 1989 v1.10.0 Beta 1 — The Manager's Desk

**Fewer boxes. Fewer clicks. More atmosphere.**

The stadium-inspired home menu is now organised into **six desks**: Match Day, My Squad, Transfer Desk, League Records, Manager's Office, and Postbag. Select a desk to open its cream-paper drawer, then select the destination. A small persistent quick-navigation bar lets you reach the desk, notebook, match day, team, transfers, tables and saves in one click.

A **Saturday Briefing** introduces the upcoming fixture, league position, board confidence and unread postbag count. The retro green stadium background, coloured tiles, Courier lettering, double-blue-bordered notebook, lined cream pages and ring binding remain. The actual Coach/Scout and other notebook screens are unchanged.

**No changes to the match engine, scoring calibration, 92-club historical squads, finances, transfers or save-file format.** Existing careers should load normally. The desk becomes the default view when a career is opened; a New Game shortcut remains visible, and Save/Load is still one click away.

## Testing

Run `npm test`. Navigation regression coverage includes six menu categories, missing destinations, notebooks, season review and postbag. JavaScript syntax and zip archive integrity checked. Browser rendering and real-user usability still require local Chrome testing.

**Historical data:** This beta incorporates researcher-supplied 1989–90 player records. Opening-day memberships are not all independently verified; abilities/potential are gameplay estimates. Confirm third-party data redistribution permissions before publishing this bundled research on GitHub.
