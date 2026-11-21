# Project 1989 v1.8.8 Beta 1 — Accountant & Fixture Calendar Fix

## Fixes

- Corrected a round-robin orientation error that could generate 19 straight away games and 19 straight home games for certain First Division clubs (or 23/23 in other divisions). Newly generated seasons now alternate home and away matches much more sensibly, with no runs longer than three games in the test sample.
- Existing midseason saves retain their already scheduled fixtures, preventing results, recorded transfers and match history from being invalidated. The corrected schedule takes effect at the next newly generated season. Existing historical account entries remain intact.
- The finance ledger now describes **home league gate**, **away league fixture — no home gate**, and **no league fixture**, rather than showing an unexplained `Match income £0` every time.
- Margaret Ellis now gives actionable financial guidance: overdraft headroom, indicative wage reductions when needed, fixture-calendar cash flow and transfer budget versus available cash.
- Added estimated average league gate income per calendar week to the financial overview. This is a *forecast* and is not double-posted as cash. Cup revenue and year-end payments remain additional.
- Added shortcuts from Margaret's advice to transfers, backroom staff and fixtures.

## Technical checks

- 81 Node test cases passing, including new schedule, ledger and finance-advice checks.
- JavaScript syntax validated.
- Save schema and prior game results preserved.

## Limitations

The club finances remain fictional period-inspired balancing rather than historical accounts. Away clubs do not receive home gate receipts. Already-played weeks and their cash postings are **not retroactively adjusted**. Mid-season calendars created before this fix retain their original orientation until the next season. Full graphical browser testing is still recommended.
