# Project 1989 — v1.8.2 Beta 1

## Staff personalities and notebook pagination

- **Assistant Manager personality:** Five styles (balanced, attack-minded, fitness-first, morale-minded, experienced campaigner). Assistant Manager Pick now uses the staff member's weighting preferences for ability, fitness, morale, form and experience. Auto Pick Best XI still picks ability only.
- **Scout specialty:** Four styles (bargain hunter, experienced-player specialist, youth talent spotter, first-team specialist). The scout specialty now contributes to ranking recommendations, alongside squad needs and affordability. The existing six-player weekly shortlist is preserved.
- **Plain-English assessments:** The original Coach & Scout spread now describes the assistant and scout's working styles. Team & Tactics also explains the assistant's approach. No additional numerical staff stats are shown.
- **Notebook pagination:** Every notebook spread uses numbered headings: Coach/Scout 01–02, Chairman 03–04, Match Day 05–06, Record Book 07–08, Postbag 09–10, Press 11–12, Dressing Room 13–14 and Manager's Log 15–16.
- **Compatibility:** Saves retain schema v3 and the same localStorage key. Older careers are assigned deterministic staff profiles on load. Existing shortlist selections may remain cached until the next matchweek; the new scouting preference is applied when a fresh shortlist is generated.
- **Testing:** 52 automated tests pass, including staff save compatibility, selection differences, scout preference differences and page numbering. Full graphical browser testing remains to be completed locally.

This is a local beta only. No public GitHub deployment is performed.
