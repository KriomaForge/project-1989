# Project 1989 — v1.8.6 Beta 1

## Transfer fees, releases, youth and club finances

- **Free means free.** The scout and Transfer Office label unattached youth as **FREE AGENT**, with their former academy noted as context, not as the selling club. Unattached older players also have a £0 *transfer fee*, even when they have a player valuation. Wages still apply.
- **Youth intake remains annual.** Exactly five fictional 16–18-year-old youngsters per one of the 92 clubs appear only when a new career starts or at season rollover. They enter the unattached player market. Their original academy's strength influences initial ability, not their independent long-term potential.
- **Release a player.** The squad-sales table now has **RELEASE** alongside **SELL**. Releasing makes a player unattached immediately, charges a settlement equal to ten weeks' player wages, generates no fee, and records the transaction and cash expense. The chairman can decline if it exceeds the overdraft allowance; the squad must retain at least 16 players. This is a simplified retro-game convention, *not* a claim about historic contract law or contract duration.
- **Not everyone has a buyer.** The sales screen now sometimes displays **No offers**; such players cannot be sold that week but may be released. This is an intentionally lightweight fictional expression-of-interest system, rather than a full negotiation engine.
- **Improved period-inspired economy.** First Division gate receipts and commercial baseline rise meaningfully; income scales down by division and still responds to club quality/form. End-of-season league payments have also been adjusted. All these amounts are balancing assumptions, not reconstructed 1989–90 accounts. Stadiums and ticket prices are not managed.
- **Finance forecasts align.** The 'estimated next home match income' figure is now derived from the same game-economy calculation used at the next scheduled home league fixture.

## Compatibility
- Save version remains **3**, compatible with existing v1.8.x browser careers.
- Previous matchweeks, cash balances, wages, and transfer history are **not** retroactively modified. The new economics applies when advancing future weeks and seasons.
- New careers still start with the same pre-season youth intake mechanics.
- Always export a career backup before replacing project files. Keep the live GitHub beta unchanged until local testing is satisfactory.

## Testing
- All 75 automated tests pass, including seven new regression tests for releases, free transfer fees, youth timing, financial assumptions, and interface hooks.
- JavaScript syntax checks pass. Browser automation was attempted but navigation to localhost was blocked by the environment; manual Chrome testing is required before publishing.

## Suggested manual checks
1. Load an existing career and examine Transfers: academy origin must not be mistaken for a transfer-selling club.
2. Release an unneeded player and confirm exactly ten weeks' wages are deducted; confirm cash ledger and free-agent pool.
3. Inspect players with **No offers**: Sell disabled, Release separately available.
4. Sign an older free agent and confirm £0 transfer fee in the transaction ledger.
5. Play several weeks with a First Division club and compare home vs away cash flow; confirm next-home-income forecast.
6. Begin a new season and confirm the annual youth intake; there should be no midseason influx.
