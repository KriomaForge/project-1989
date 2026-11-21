# Project 1989 v1.8.7 Beta 1 — Transfer UI Consistency

This focused compatibility update prepares for v1.9 historical squad work without changing the current save schema.

- An unattached player's **market valuation** is no longer displayed as the **transfer fee**. Free agents always cost £0 to sign; wages still apply.
- Already-signed players retained in the current week's cached scout shortlist now show **SIGNED** and cannot be signed again, both in the notebook and the full transfer office. Their career histories are left intact.
- Transfer Office labels differentiate current status / club from transfer fee.
- Squad sale/release section includes player **age** and displays the ten-week wage settlement beside RELEASE. It remains below the shortlist.
- Release logic, affordability, and the existing save format have not been altered.

## Testing

Run `npm test`. Browser visual tests have not been completed. Export a career save before upgrading.

## Next: v1.9

Develop evidence-based historical 1989–90 club squads with provenance and clear date semantics, preserving fictional squads as a separate career mode. Later development should also improve AI transfer activity and transfer market persistence.
