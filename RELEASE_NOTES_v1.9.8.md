# Project 1989 v1.9.8 Beta 1 — Historical ability differentiation

Fixes the v1.9.7 issue where Liverpool players with blank season-statistics fields all received an identical 63 skill. Missing Apps/Subs/Goals are now treated as unknown, rather than zero. Manual 1989 ability/potential estimates are provided for the Liverpool and Aston Villa research cohorts (original game-design judgments, not historical measurements). All remaining researched players use a deterministic differentiated fallback based on club level, playing position, date-of-birth age where known, appearance usage where available, and a stable name-based variation. Mixed research positions such as DF/MF now import.

For a *new* historical career the corrected ratings are automatic. For a v1.9.7 historical save **still at 1989 week 0**, use Team Selection → FIX HISTORICAL PLAYER RATINGS (v1.9.7 SAVES). Back up via Save / Load first. The repair leaves player names, ages, historical registrations, squad membership, fixtures and completed match results untouched. It is intentionally disabled after the first match to avoid overwriting accumulated player development.

All skill and potential numbers are subjective simulation ratings. The historical squad research remains incomplete. Historical and generated club modes remain compatible with version-3 browser saves.

Tests: `npm test` (110/110), `node --check js/engine.js`, `node --check js/app.js`.
