# Education Content Model

Date: August 14, 2026
Decision: finite, contextual, brand-neutral app education—not an in-app Creighton course

## 1. Direct answer

The shipping lesson source should be Well Within's reviewed product copy and deterministic presentation contracts, not prose copied from Creighton/FertilityCare materials and not generated content.

The feature may be compatible with the method's observational model while remaining brand-neutral. It must not imply affiliation, certification, formal instruction, or that the app can replace a qualified educator. Public method-owner material is useful evidence for review boundaries; it is not a content license.

## 2. Source hierarchy

| Tier | Source | Permitted use | Approval before shipping |
| --- | --- | --- | --- |
| 1 | Existing engine-owned education and current product contracts: `observationEducationCopy.ts`, `currentCycleSummary.ts`, `CalendarGrid`, `calendarDayPresentation`, `TodayEntryCard`, and current Help destinations | Reuse or shorten without changing meaning; explain how Well Within records and displays data | Product/design plus regression review against source copy |
| 2 | Versioned internal references: `docs/CREIGHTON.md`, `RULES_ENGINE_SPEC.md`, current-cycle matrices, claim review, and rule-provenance records | Identify concepts, boundaries, unsupported contexts, and where expert review is needed | Product owner; no unsupported public claim may be derived from repository notes alone |
| 3 | Official method-owner/public institutional sources and peer-reviewed primary research | Check factual alignment and identify what requires trained instruction; cite internally | Qualified current fertility-awareness/Creighton reviewer for method-level wording |
| 4 | Qualified reviewer decisions against exact lesson copy and fixtures | Approve, reject, or narrow new method-level lessons | Named reviewer and dated decision record |
| Prohibited | AI-generated medical instruction, scraped articles, competitor copy, community anecdotes as fact, or live network-fetched tips | None | Never a shipping source |

Authoritative external references already registered by the project include:

- [Saint Paul VI Institute public chart/IP sample](https://saintpaulvi.com/PDF/CrMS_App_Copyright.pdf), which defines basic chart terms, identifies protected materials, and warns that the system should not be learned without adequate instruction and follow-up.
- [FertilityCare Centers of America — learning the system](https://www.fertilitycare.org/creighton-model-system/), which describes an introductory session followed by individualized practitioner follow-ups.
- [Creighton Model background](https://creightonmodel.com/background/), which publicly describes observed mucus progression and retrospective Peak terminology but does not license figures or validate Well Within.
- [Comparison of woman-, expert-, and computer-picked Peak Day](https://pubmed.ncbi.nlm.nih.gov/32101336/), which is a useful warning against presenting an app-picked marker as equivalent to expert or user judgment.

## 3. Surface ownership and non-duplication

| Surface | User question it answers | Content owner | Must not do |
| --- | --- | --- | --- |
| Current summary card | `What does my chart say right now, what limits it, and what should I do next?` | Existing engine output and `StatusBanner` | Teach a general curriculum or track lesson progress |
| Contextual lesson | `How does this part of Well Within work, and how should I read what I entered?` | Versioned lesson catalog using approved source copy | Repeat the summary headline, status line, guidance, limitation, or action in different words |
| Understanding Your Chart | `Where can I browse or revisit the full reference?` | Existing Help architecture plus approved lesson archive | Interrupt daily charting or pretend to be individualized instruction |
| Milestone acknowledgement | `Did my action save, and what durable value did it create?` | UI-only presentation state | Imply clinical progress, fertility quality, or a streak |

### Testable duplicate rule

Each lesson has a stable `topicId`. Each summary explanation target maps to one or more topic IDs. If the current `StatusBanner` already exposes an action for the same topic, the new lesson slot must select a different eligible lesson or remain hidden.

A lesson also fails review if its title/body restates any of the active summary's:

- headline;
- status line;
- supporting context or limitation;
- guidance/next action;
- explanation action label.

## 4. Recommended version-one lesson set

Version one should remain a small app-literacy set. These topics explain the product and use already reviewed concepts; they do not teach the full method.

| ID | User value | Earliest eligible moment | Existing source | Relationship to summary |
| --- | --- | --- | --- | --- |
| `observation-on-calendar` | See exactly what changed after a save | First qualifying save | Calendar presentation + color guide | Independent of current interpretation |
| `dry-not-observed-open` | Understand why Dry, Not observed, and no entry are not interchangeable | After a Dry or Not observed entry exists | Current Help/status/missing contracts | Suppress while summary is actively explaining a missing/incomplete state |
| `sensation-and-appearance` | Understand that feeling and appearance describe different parts of one observation | After the first non-Dry mucus observation | `HELP_SENSATION_APPEARANCE_BODY` | Durable input skill, not a current-cycle conclusion |
| `multiple-observations` | Understand that the app retains every observation and charts the strongest recorded sign | After multiple observations are saved on one date | Entry form and current education copy | Independent unless the current status is explicitly about an incomplete observation |
| `completed-chart-review` | Know where to inspect one completed chart and what is retrospective | First completed cycle supplied by existing history | Cycle Detail/History copy and current limitation | Does not restate the current Calendar summary |

### Phase-two candidates—not automatic version-one scope

External evidence and current product structure suggest several likely confusion areas:

- Peak-type sign versus retrospectively marked Peak Day;
- Peak Day versus confirmation of ovulation;
- P+1–P+3 markers;
- spotting/brown layered with a dry or mucus observation;
- incomplete versus Not observed versus an untouched date;
- why comparison waits for enough eligible completed charts;
- special contexts where the app cannot safely interpret the chart.

These are good research candidates, not permission to ship a larger curriculum. Prioritize them only after direct Well Within usability evidence identifies confusion, then obtain the required method/clinical review. Status-specific explanations that already exist should normally stay in the summary-to-Help path rather than become duplicate lesson cards.

## 5. Selection and sequencing

1. Build the eligible set from existing presentation state only; do not derive new fertility meaning.
2. Remove lessons already viewed or dismissed for the current content version.
3. Remove any topic duplicated by the active summary or another higher-priority surface.
4. Select the highest-priority lesson whose trigger has just become meaningful.
5. Show at most one lesson.
6. Do not replace it immediately after dismissal. Wait for a later session or a different meaningful trigger.
7. If no eligible unseen lesson exists, show no lesson surface.

Lessons do not need to appear in a fixed course order. Relevance wins over chronology, but foundational product mechanics take priority over advanced chart reading.

## 6. What happens after every lesson is seen

Do not automatically recycle the library each cycle. Repetition would create banner blindness, make the experience feel promotional, and imply that reading the same copy is progress.

When the finite library is exhausted:

- remove the contextual lesson surface from Calendar;
- keep the current summary, full calendar, Today's Observation, and existing Help entry exactly as they work today;
- make every lesson available for deliberate review inside `Understanding Your Chart > Chart tips`;
- do not reset viewed state at the start of a new cycle;
- resurface a lesson only if its content changes materially and product explicitly marks the new version eligible, or the user chooses to review it.

## 7. User control

The lesson row includes a trailing `More` action with:

- `Not relevant to me` — dismiss this lesson for its current content version;
- `Hide chart tips` — suppress all future contextual lessons;
- `Cancel`.

`Hide chart tips` must not hide the current summary, existing status explanations, safety limitations, Catch Up, or Help. Add `Show chart tips on Calendar` under `Understanding Your Chart > Chart tips` so the choice is reversible.

Local presentation preferences may store only:

- `chartTipsEnabled`;
- viewed lesson IDs and content versions;
- dismissed lesson IDs and content versions.

They must not copy observation values or create a new health-data record.

## 8. Content acceptance checklist

- The lesson answers a durable app-use or chart-reading question.
- The lesson is useful without reading the current summary card.
- The current summary remains complete without opening the lesson.
- The lesson does not repeat the active summary topic.
- Every factual sentence maps to an approved source and version.
- Exact copy, illustration, and trigger have the required reviewer sign-off.
- The language is observational, brand-neutral, and does not imply formal method instruction.
- A user can dismiss one lesson, hide all contextual lessons, and find the material later.
- Exhausted content disappears instead of looping.
