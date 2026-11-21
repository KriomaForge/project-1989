# Project 1989 v1.8.3 Beta 1 — Club Finances & Backroom Staff

**Local test release; do not overwrite the published GitHub version until tested.**

### What is new

- More plausible fictional club finances: home match receipts scale by division, club rating and recent form, alongside weekly club/commercial income and player wages.
- Extra receipts from cup matches and cup victories. An end-of-season distribution varies by division and finishing position.
- Club finance screen includes predicted income/outgoings and a new ledger of future postings.
- Backroom Staff screen is reached through the Chairman's notebook or the Finance screen. The chairman can approve a new assistant manager, scout or physiotherapist. Staff have qualitative specialisms, wage costs and severance payments.
- Physio specialism influences recovery time for injuries. (This is deliberately a simple, game-oriented approximation.)

### Important considerations

- Financial figures are fictional gameplay balancing, **not** historical ticket prices or accounts.
- Old saves remain in version 3; previously played weeks are not recalculated and no retrospective ledger is generated.
- Existing negative bank balances remain negative; the chairman may approve staff changes within a division-scaled overdraft allowance.
- Club financial projections exclude uncertain future cup results and final league position.
- The existing notebook layout remains unchanged. Stadium/ticket management is not added.
- 58 automated tests pass. Browser launch was attempted but blocked by the test environment, so visual checking is required.

### Local installation

Export a save backup. Extract the ZIP, navigate into `project-1989`, then run `py -m http.server 8000`. Browse to `http://localhost:8000` and press Ctrl+F5. If port 8000 is in use, stop the earlier local server first.
