# Task 7 report: R7 interview composition and root cutover

## Status

`PASS` — the R7 implementation, Phase-14 cutover gates, focused commit, push,
and Beads closure are complete.

The three interview shells contain the exact fifteen-entry composition, the root
README is the exact four-block student hub, and the named authoring,
validation, and GRACE artifacts describe the current thirteen collections,
twenty migrated cards, implemented Phase 14, and pending Phase 15.

This report is finalized in two stages:

1. implementation and verification evidence before the focused commit;
2. pushed commit, Beads closure, and separate progress-evidence commit after
   both pushes succeed.

R8 and the GitHub-rendered Phase-15 audit were not started.

## Baseline and prerequisites

- Checkout:
  `/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks`.
- Branch: `feature/frontend-livecoding-tasks-kln`.
- Required baseline:
  `3e14073591b8b75300550cd798d235d3245f02f7`.
- Initial worktree: clean and synchronized with
  `origin/feature/frontend-livecoding-tasks-kln` (`0` behind, `0` ahead).
- Fresh `git fetch origin`: PASS.
- `origin/main` is an ancestor of the baseline; initial divergence was `0`
  behind and `33` ahead.
- R7 issue
  `frontend-livecoding-tasks-kln-student-r7-cutover` was already
  `in_progress`; the required idempotent `bd update ... --claim` completed.

Prerequisite commands:

```bash
bd update frontend-livecoding-tasks-kln-student-r7-cutover --claim
test "$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" = "20"
test "$(rg -l '<summary>Подсказка 3 — почти решение</summary>' tasks/*/README.md | wc -l | tr -d ' ')" = "20"
test "$(find collections -type f -name README.md | wc -l | tr -d ' ')" = "13"
```

Result: `PASS` — 20 cards, 20 third hints, and 13 collection pages existed
before the cutover.

## Implemented scope

Student-facing changes:

- retained the exact shared timer paragraph in all three interview pages;
- replaced each interview shell with the exact five linked student titles and
  times from the R7 brief;
- replaced the old root task tables and maintenance prose with the exact four
  student blocks:
  - `Как пользоваться базой`;
  - `Подборки по направлениям`;
  - `Симуляции собеседований`;
  - `Где писать код`.

Synchronized contracts:

- `AGENTS.md` now treats the four-block root hub and exact 10 + 3 collection
  inventory as the current publication contract;
- `docs/task-validation-policy.md` defines the current StudentHub and the
  thematic/interview `CollectionEntry` variants;
- `docs/requirements.xml` makes the live root hub, thirteen collection links,
  four editor links, and root negative checks current acceptance facts;
- `docs/development-plan.xml` records Phases 9 through 14 as completed and
  Phase 15 as pending;
- `docs/verification-plan.xml` records `Gate-Phase-14` as implemented, retains
  older pending states only as explicit phase-history evidence, and leaves
  `Gate-Phase-15` pending;
- `docs/knowledge-graph.xml` records all thirteen collections as available and
  adds one `THEMATIC_COLLECTION` plus zero-or-one `INTERVIEW_COLLECTION`
  membership annotation to every task export;
- `docs/operational-packets.xml` aligns the candidate collection field and adds
  the canonical `StudentHubCutoverEvidence` schema.

The exact changed project scope is:

```text
AGENTS.md
README.md
collections/interviews/interview-01/README.md
collections/interviews/interview-02/README.md
collections/interviews/interview-03/README.md
docs/task-validation-policy.md
docs/requirements.xml
docs/development-plan.xml
docs/verification-plan.xml
docs/knowledge-graph.xml
docs/operational-packets.xml
```

No task card, thematic collection, template, editor profile assignment, asset,
runtime tooling, or R8 artifact changed.

## Complete cutover gate

The R7 gate was run with fail-fast shell behavior and the task-brief body
unchanged:

```bash
test "$(rg -c '^## ' README.md)" = "4"
! rg -n '^\|.*Задача.*\|' README.md
! rg -n 'Beads|GRACE|knowledge graph|metadata|источник истины|поддержка каталога' README.md
test "$(find collections -type f -name README.md | wc -l | tr -d ' ')" = "13"
test "$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" = "20"
test "$(rg --no-filename -o '../../../tasks/[^/]+/README.md' collections/{javascript,typescript,html-css,react}/*/README.md | wc -l | tr -d ' ')" = "20"
test "$(rg --no-filename -o '../../../tasks/[^/]+/README.md' collections/{javascript,typescript,html-css,react}/*/README.md | sort -u | wc -l | tr -d ' ')" = "20"
test "$(rg --no-filename -o '../../../tasks/[^/]+/README.md' collections/interviews/*/README.md | wc -l | tr -d ' ')" = "15"
test "$(rg --no-filename -o '../../../tasks/[^/]+/README.md' collections/interviews/*/README.md | sort -u | wc -l | tr -d ' ')" = "15"
for file in $(find collections -type f -name README.md); do
  for target in $(rg --no-filename -o '../../../tasks/[^)]+/README.md' "$file"); do
    test -f "$(dirname "$file")/$target"
  done
done
for target in $(rg --no-filename -o 'collections/[^)]+/README.md' README.md); do
  test -f "$target"
done
for file in tasks/*/README.md; do
  metadata_block="$(sed -n '/<summary>О задаче<\/summary>/,/<\/details>/p' "$file")"
  test "$(printf '%s\n' "$metadata_block" | rg -c '^- ')" = "5"
  test "$(rg -c '^- Технология:' "$file")" = "1"
  test "$(rg -c '^- Подборка:' "$file")" = "1"
  test "$(rg -c '^- Формат:' "$file")" = "1"
  test "$(rg -c '^- Сложность:' "$file")" = "1"
  test "$(rg -c '^- Примерное время:' "$file")" = "1"
done
! rg -n '^- (Навыки|Предварительные знания|Среда выполнения):' tasks/*/README.md
! rg -n '<details[^>]* open' README.md collections tasks templates
for file in docs/*.xml; do xmllint --noout "$file"; done
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
```

Result: `PASS`.

- root second-level blocks: `4`;
- collection README files: `13`;
- task cards: `20`;
- thematic links: `20` total / `20` unique;
- interview links: `15` total / `15` unique;
- all root-to-collection and collection-to-task relative links resolve;
- every card has exactly the five current metadata fields;
- no legacy Skills/Prerequisites/Execution-environment fields remain;
- no open details exist;
- all `docs/*.xml` parse;
- Grace `3.11.0`: `0` errors, `0` warnings;
- `git diff --check`: PASS.

## Focused consistency checks

Exact-text comparisons:

```bash
diff -u <(sed -n '75,118p' .superpowers/sdd/task-7-brief.md) README.md
diff -u <(sed -n '41,45p' .superpowers/sdd/task-7-brief.md) <(sed -n '5,$p' collections/interviews/interview-01/README.md)
diff -u <(sed -n '51,55p' .superpowers/sdd/task-7-brief.md) <(sed -n '5,$p' collections/interviews/interview-02/README.md)
diff -u <(sed -n '61,65p' .superpowers/sdd/task-7-brief.md) <(sed -n '5,$p' collections/interviews/interview-03/README.md)
```

Result: `PASS`; the root and all fifteen list entries are byte-for-byte equal
to the brief excerpts, and every interview retains the exact R2 timer
paragraph.

A focused read-only Node consistency check parsed all cards, collections,
knowledge-graph annotations, and phase facts. Result:

```json
{
  "tasks": 20,
  "collections": 13,
  "thematicLinks": 20,
  "interviewLinks": 15,
  "graphTaskAnnotations": 20,
  "graphInterviewAnnotations": 15,
  "rootCollectionLinks": 13,
  "phase14": "completed/implemented",
  "phase15": "pending"
}
```

For every task it also proved:

- linked title equals the card H1;
- thematic and optional interview time equals `Примерное время`;
- graph thematic/interview membership points to the actual collection file;
- graph editor profile selects the exact URL present once in the card;
- each of the four editor URLs occurs once in the root map.

Focused current-fact scan found no active
`composition-pending`, `Phase-14 pending`, `Gate-Phase-14 pending`,
`planned four-block`, or “current root catalog remains” claim. Older gate
snapshots mention pending states only with explicit
`At Phase N completion` historical wording.

## GRACE lint failure and resolution

The first focused GRACE run after adding task membership edges produced 70
errors because `CrossLink` endpoints are schema-restricted to exact
`M-<UPPER-KEBAB>` module IDs. Task exports and collection annotations are not
modules, and the approved redesign explicitly does not add twenty new modules.

Resolution:

- removed annotation-to-annotation `CrossLink` elements;
- placed exact `THEMATIC_COLLECTION` and optional `INTERVIEW_COLLECTION`
  attributes on the existing twenty task export annotations;
- synchronized the operational packet wording;
- reran `xmllint` and Grace.

Fresh result:

```text
thematic annotations: 20
interview annotations: 15
Issues: 0 (errors: 0, warnings: 0)
No GRACE integrity issues found.
```

This preserves deterministic task-level graph membership without violating the
module-only `CrossLink` contract or introducing new modules.

## Self-review

The complete diff was reviewed against every R7 step and the relevant
student-experience specification sections.

- Scope: only the eleven intended project files changed.
- Root: exact four blocks and no old task table or maintenance prose.
- Interviews: exact order, titles, links, and times; no slug shown as title.
- Synchronization: 20 unique thematic memberships, 15 unique interview
  memberships, matching graph annotations, titles, times, links, and editors.
- Phase state: Phase 14 completed / Gate-Phase-14 implemented; Phase 15 and its
  gate pending.
- Historical wording: old root and pending-shell descriptions are not current
  contracts.
- Verification: full task gate plus focused exact-text, semantic consistency,
  XML, GRACE, and whitespace checks are fresh.
- R8: untouched.

An independent reviewer was dispatched against baseline `3e14073` and the R7
brief. Its findings are recorded below before commit.

## Independent review

The optional pre-commit reviewer was interrupted after it did not return a
conclusion despite two explicit finalize requests. It reported no
Critical/Important finding before interruption. The controller explicitly
authorized proceeding from the complete fresh gates and self-review and will
run the required independent post-commit review.

## Completion and publication

- Focused commit:
  `cefd1fa73426e349ee814f8cc421ad5b9f1e3624`
  (`docs: publish student task library hub`).
- Push:
  `origin/feature/frontend-livecoding-tasks-kln` advanced from `3e14073` to
  `cefd1fa`.
- R7 Beads notes contain the exact PASS summary and pushed commit.
- R7 is closed with reason
  `Student hub cutover and Phase-14 gate verified`.
- R8 is open and unclaimed; no R8 execution or Phase-15 rendered audit was
  started.
- Separate evidence commit
  `b51d763ef467791c9edce00bea8b7988d9b052ef`
  (`chore: record R7 execution evidence`) contains the Beads interaction,
  progress ledger, and full report and is pushed to the feature branch.
