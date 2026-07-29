# Final-review cadence synchronization brief

## Authoritative user decisions

1. Approve the proposed candidate register `candidate-001` through `candidate-020`, technologies, and ten primary topics without changes.
2. Remove mandatory user/mentor acceptance from every publication wave.
3. Keep waves as serialized technical publication units that close after candidate recheck, deterministic and hybrid evidence, pushed commit, GitHub-rendered evidence, and a complete wave report.
4. Preserve one explicit user review/acceptance gate for the complete library before the top-level story closes.

## Direct fix map

- `CADENCE-1`: Replace per-wave mentor/user acceptance requirements in governance, design spec, implementation plan, validation policy, shared GRACE artifacts, README wording, and Beads wave schemas with technical wave closure.
- `CADENCE-2`: Keep `waveAcceptanceStatus` only if it is explicitly defined as a technical publication status, not a human approval. Allowed values may stay `not-applicable`, `pending`, `accepted`, `changes-requested` to minimize schema churn.
- `CADENCE-3`: Move the human acceptance invariant to the final complete-library review before story closure. B7 may remain the technical final audit; the top-level story stays open until that final user review passes.
- `CADENCE-4`: Preserve wave sizing, serialization, strict candidate validation, browser BLOCKED semantics, atomic task/catalog/graph updates, and all existing technical gates.
- `CADENCE-5`: Update the implementation plan so Task 6 no longer pauses after each wave. Its report/closure/status steps must run continuously after technical PASS. The final wave marks Phase 5 complete after its technical gates and report. Task 7 prepares the final user-review handoff and does not claim story acceptance itself.
- `CADENCE-6`: Update existing empty-catalog prose that still says the first wave awaits mentor acceptance.
- `CADENCE-7`: Do not freeze or validate candidates in this synchronization task; Task 5 resumes only after the revised artifacts pass review.

## Beads evidence

- Vocabulary decision: `frontend-livecoding-tasks-kln-initial-vocabulary` (closed with user approval).
- Cadence decision: `frontend-livecoding-tasks-kln-final-review-cadence` (closed decision record).
- Synchronization task: `frontend-livecoding-tasks-kln-final-review-cadence-sync`.

## Verification

- `xmllint --noout docs/*.xml`
- Grace 3.11.0 standard lint with zero issues
- `git diff --check`
- focused scans proving no per-wave human acceptance requirement remains outside historical plan/report evidence
- confirm one final user-review gate remains before story closure
- confirm wave technical PASS/push/render/report gates and serialization remain intact

