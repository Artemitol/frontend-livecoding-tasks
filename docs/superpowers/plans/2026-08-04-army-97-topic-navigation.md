# ARMY-97 Topic Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four broad ARMY-97 technology task lists with four master indexes and twenty-three topic drills, while exposing immutable task IDs, simplifying student wording, and expanding every simulation to three topics.

**Architecture:** Preserve all `tasks/task-XXXX/README.md` paths and treat each card's plain-text `Подборка` metadata as its single master/topic ownership declaration. Make the checked-in validator, its fixtures, the live Beads validator, and GRACE documents understand the same frozen 23-topic registry; then perform one catalog commit that changes cards, collections, simulations, and old broad pages together. The exact-HEAD receipt flow is executed only after that coherent commit, because the design commit intentionally invalidated older receipts.

**Tech Stack:** GitHub-flavored Markdown, Node.js built-ins and `node:test`, Bash 3+, `rg`, `sed`, `find`, `sort`, `xmllint`, the resolved GRACE CLI, Git, and Beads. No browser, external editor, generated site, package manager, API, or CSS automation is added.

## Global Constraints

- Work in the existing linked worktree on `feature/army-97`; fetch `origin` before edits, preserve unrelated state, never reset, stash, force-push, or create a compatibility stub.
- The frozen source of truth is `docs/superpowers/specs/2026-08-04-army-97-topic-navigation-design.md`, including all 118 task-to-topic assignments and all thirty third-simulation-task assignments.
- Keep immutable card paths `tasks/task-0001/README.md` through `tasks/task-0118/README.md`; each card is in exactly one topic page and carries exactly one plain-text `Подборка: Master → Topic` value.
- Master pages list topic pages only; topic pages contain the append-only ordered task rows. The old four `*/interview-practice/README.md` pages and every inbound link to them disappear in the same cutover.
- A task H1 and every task link use exact `task-XXXX — Title` identity. A card has no breadcrumb or fallback link; master and topic pages do have the specified breadcrumb.
- Retain all card semantics while removing only forbidden environment-negation wording and all forms of `fixture` / `fixtures` / Russian inflections from `tasks/**`.
- Each final simulation has exactly three task rows, at least three topic pages, 30–120 minutes, an exact card-duration sum, a substantive `Реализм:` line, and no task repeated in any three consecutive simulations.
- Do not count master indexes, real-work, interview indexes, or simulation pages as thematic membership. The final gate must print exactly `tasks=118 covered=118 orphans=0 thematicErrors=0`.
- Update `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, and only the contradictory parts of `docs/operational-packets.xml` in the same implementation change.
- Keep `CardMigrationEvidence` shape unchanged and record both target-editor fields as `NOT_RUN: Markdown-only delivery`; use local Markdown/XML/Node/Bash/Git/Beads evidence only.
- Stop and replan on a conflicting card classification, metadata/page disagreement, semantic wording loss, invalid simulation assignment, stale exact-HEAD receipt, or any final-gate count other than the required summary.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `docs/scripts/validate-army-97-catalog.sh` | Final deterministic topic-registry, card identity, student-wording, master-page, topic-row, and three-topic simulation gate. |
| `docs/scripts/validate-army-97-catalog.test.mjs` | Controlled fixtures proving the new Bash failures and success path. |
| `docs/scripts/validate-army-97-beads.mjs` | Reads all registered topic pages and proves frozen Beads mapping, card facts, and current exact-HEAD receipts agree. |
| `docs/scripts/validate-army-97-beads.test.mjs` | Regression probes for topic registry, metadata drift, and final-mode receipt selection. |
| `docs/scripts/run-army-97-catalog-gate.mjs` and `.test.mjs` | Keeps the exact-commit runner aligned with `final` after the new catalog cutover. |
| `README.md` | Student hub: links four master indexes, real-work, interview index, and approved sandboxes only. |
| `collections/{javascript,typescript,react,html-css}/README.md` | Master index breadcrumb and registered topic list with factual counts. |
| `collections/<master>/<topic>/README.md` | The twenty-three sole thematic ownership pages. |
| `collections/real-work/README.md`, `collections/interviews/README.md`, `collections/interviews/simulation-{001..030}/README.md` | Task-ID link identity, retained real-work projection, and three-task simulations. |
| `tasks/task-{0001..0118}/README.md` | Exact H1 identity, master/topic metadata, and wording cleanup without behavior changes. |
| `docs/{requirements,technology,development-plan,verification-plan,knowledge-graph,operational-packets}.xml` | GRACE contracts, flows, verification surfaces, paths, and failure handoff consistent with topic navigation. |

The topic-page inventory is exact: JavaScript has `event-loop`, `promises-and-async`, `prototypes-inheritance-and-this`, `functions-closures-and-scope`, `objects-and-collections`, `dom-and-events`, `dates-and-time-intervals`, `arrays-search-and-sorting`, `strings`, `trees-and-recursion`, `graphs`, `linked-lists-and-stack`, and `numbers-types-and-operators`; TypeScript has `generics-and-object-keys`, `mapped-and-conditional-types`, `recursive-types`, and `integration-typing`; React has `state-and-event-handlers`, `effects-timers-and-cleanup`, `rendering-and-memoization`, `async-data-and-ui-states`, and `component-composition-and-state-management`; HTML/CSS has `cascade-and-selectors`. Their Russian labels and all task IDs come verbatim from the approved spec table.

### Task 1: Make the deterministic validation surfaces topic-aware

**Files:**

- Modify: `docs/scripts/validate-army-97-catalog.sh`
- Modify: `docs/scripts/validate-army-97-catalog.test.mjs`
- Modify: `docs/scripts/validate-army-97-beads.mjs`
- Modify: `docs/scripts/validate-army-97-beads.test.mjs`
- Modify: `docs/scripts/run-army-97-catalog-gate.test.mjs`
- Modify: `docs/task-validation-policy.md`

**Interfaces:**

- Consumes: the spec's exact `masterSlug`, `masterName`, `topicSlug`, `topicName`, `Подборка` value, initial task ID list, and frozen third-task simulation projection.
- Produces: a final-mode gate that reads 23 topic files; `loadPublishedCatalogState()` with `thematicByTaskId` derived from all topic paths; and `validatePublicationRegistry()` rejection messages for topic, H1, wording, master, and simulation drift.

- [ ] **Step 1: Add failing final-catalog regression tests**

  In `validate-army-97-catalog.test.mjs`, replace the four broad `controlledCollections` fixture records with the exact 23-topic registry and make each synthetic card use `# task-NNNN — Task NNNN` plus `- Подборка: <master> → <topic>`. Add named tests that fail against the old gate:

  ```js
  test('rejects a card whose visible task ID differs from its immutable path', () => {
    const root = createCompleteTopicCatalogFixture();
    replaceFile(root, 'tasks/task-0015/README.md', '# task-0016 — Task 0015');
    assertCatalogFails(root, 'task H1 must use its immutable task ID');
  });

  test('rejects a simulation with three cards from fewer than three topics', () => {
    const root = createCompleteTopicCatalogFixture();
    writeSimulation(root, 1, ['task-0001', 'task-0005', 'task-0014']);
    assertCatalogFails(root, 'at least three topic collections');
  });
  ```

  Cover master topic-count drift, a topic row with non-ascending initial IDs, a broad-page link, forbidden `fixture` vocabulary, each forbidden environment pattern, and a mismatched metadata `Подборка`. Keep the existing pure/browser TypeScript routing probes unchanged.

- [ ] **Step 2: Run the focused tests and confirm the expected failures**

  Run:

  ```bash
  node --test docs/scripts/validate-army-97-catalog.test.mjs
  ```

  Expected: the newly added tests fail because the current fixture and Bash gate still recognize four broad collections, omit topic/H1/wording checks, and allow two-topic simulations.

- [ ] **Step 3: Implement the smallest registry-driven final gate**

  In `validate-army-97-catalog.sh`, replace the hard-coded four `interview-practice` final inventory entries with the 23 exact topic paths and expected IDs from the spec. For every card, parse the exact H1 and metadata collection, then enforce the ownership chain:

  ```bash
  taskId="$(basename "$(dirname "$taskFile")")"
  cardTitle="$(sed -n 's/^# //p' "$taskFile" | head -n 1)"
  expectedPrefix="$taskId — "
  [[ "$cardTitle" == "$expectedPrefix"* ]] ||
    catalogFail "$taskFile H1 must begin with $expectedPrefix"
  ```

  Require topic rows to use `N. [task-XXXX — Title](../../../tasks/task-XXXX/README.md) — Difficulty · N минут — Description.`; require a master breadcrumb and one topic entry per registered path; scan only `tasks/**` for the exact environment and vocabulary patterns from the spec; require exactly three simulation task links and at least three distinct topic pages. Preserve the existing link, duration, real-work, recurrence, provenance, and editor-profile checks.

  In `validate-army-97-beads.mjs`, replace `allowedTargetCollections` and the four-page reader with the same frozen 23-topic path/mapping registry. `loadPublishedCatalogState()` must read title, technology, sandbox, starter code, metadata collection, and the unique topic path for each published card before `validatePublishedCatalogState()` compares them to candidate/card metadata and re-verifies a current `final` receipt.

  Update the test fixtures and the policy prose so `final` explicitly describes master indexes, 23 topic pages, visible IDs, exact row grammar, task-only wording scans, and three-topic simulations.

- [ ] **Step 4: Run focused regression tests and the existing suite**

  Run:

  ```bash
  node --test docs/scripts/validate-army-97-catalog.test.mjs \
    docs/scripts/validate-army-97-beads.test.mjs \
    docs/scripts/run-army-97-catalog-gate.test.mjs
  ```

  Expected: all existing editor/evidence probes pass; each new probe rejects exactly its malformed topic-navigation fact. Running `bash docs/scripts/validate-army-97-catalog.sh --mode final` against the uncut-over worktree is expected to fail until Task 3.

- [ ] **Step 5: Commit the validator contract**

  ```bash
  git add docs/scripts/validate-army-97-catalog.sh \
    docs/scripts/validate-army-97-catalog.test.mjs \
    docs/scripts/validate-army-97-beads.mjs \
    docs/scripts/validate-army-97-beads.test.mjs \
    docs/scripts/run-army-97-catalog-gate.test.mjs \
    docs/task-validation-policy.md
  git commit -m "test: define army-97 topic catalog gate"
  ```

### Task 2: Prepare the atomic card and collection projection

**Files:**

- Modify: `README.md`
- Create: the 23 exact topic-page paths listed in File Structure
- Modify: `collections/javascript/README.md`, `collections/typescript/README.md`, `collections/react/README.md`, `collections/html-css/README.md`
- Delete: `collections/javascript/interview-practice/README.md`, `collections/typescript/interview-practice/README.md`, `collections/react/interview-practice/README.md`, `collections/html-css/interview-practice/README.md`
- Modify: `tasks/task-0001/README.md` through `tasks/task-0118/README.md`
- Modify: `collections/real-work/README.md`, `collections/interviews/README.md`, and `collections/interviews/simulation-001/README.md` through `collections/interviews/simulation-030/README.md`

**Interfaces:**

- Consumes: Task 1's final gate and the spec's frozen master/topic and simulation tables.
- Produces: the complete student navigation tree and a final-mode filesystem that satisfies one topic membership, exact task-link identity, and three-topic simulation rules.

- [ ] **Step 1: Build the four masters and twenty-three topic pages**

  Root `README.md` retains its four prescribed `##` sections and links only to `collections/javascript/README.md`, `collections/typescript/README.md`, `collections/react/README.md`, `collections/html-css/README.md`, `collections/real-work/README.md`, `collections/interviews/README.md`, and the four approved sandboxes. Each master uses:

  ```markdown
  [Главная](../../README.md) → JavaScript

  - [Event loop и очереди задач](event-loop/README.md) — 7 задач — Порядок синхронного кода, microtask и timer.
  ```

  Each topic page uses its registered Russian title, relative breadcrumb, and spec-order task IDs. Write each row with exact card facts:

  ```markdown
  [Главная](../../../README.md) → [JavaScript](../README.md) → Event loop и очереди задач

  1. [task-0015 — Три timer после Promise](../../../tasks/task-0015/README.md) — Средняя · 15 минут — Определите порядок синхронного кода, microtask и timer.
  ```

  Keep existing rows sorted by numeric ID; do not manufacture a pedagogical reorder. Delete the four broad pages only after every topic page exists.

- [ ] **Step 2: Migrate all card identity, ownership, and safe wording**

  For every task card, derive `Title` from its current H1, then set only the student-facing identity and collection metadata:

  ```markdown
  # task-0015 — Три timer после Promise
  ...
  - Подборка: JavaScript → Event loop и очереди задач
  ```

  Replace every internal linked title in real-work and interview pages with the same visible text. Remove no task behavior. For an intertwined comment, retain its positive requirement while deleting only the absent-environment phrase; for example:

  ```javascript
  // Объясните синхронность executor, очередь microtask и порядок трёх timer с нулевой задержкой.
  ```

  replaces the longer comment that additionally says to use console JavaScript without ESM. Replace prohibited testing vocabulary by its meaning (`пример`, `тестовые данные`, or a domain-specific identifier), including code identifiers, without changing data or expected output.

- [ ] **Step 3: Expand the thirty frozen simulations**

  Preserve each existing first and second row and order. Append the exact third task and recompute `Общее время` from card metadata; for example, `simulation-001` appends `task-0033 — Опечатка во вложенном свойстве` and changes the total to `55 минут`.

  ```markdown
  1. [task-0001 — Модальное окно с актуальными обработчиками](../../../tasks/task-0001/README.md) — 30 минут
  2. [task-0015 — Три timer после Promise](../../../tasks/task-0015/README.md) — 15 минут
  3. [task-0033 — Опечатка во вложенном свойстве](../../../tasks/task-0033/README.md) — 10 минут

  Общее время: 55 минут
  ```

  Use all remaining exact rows and totals from the spec table, retain each substantive `Реализм:` sentence, and do not change simulation numbers or paths.

- [ ] **Step 4: Run local preflight and repair only the first mismatch**

  Run:

  ```bash
  bash docs/scripts/validate-army-97-catalog.sh --mode final
  ```

  Expected: JSON with `catalogGate=PASS`, `gateMode=final`, `tasks=118`, `covered=118`, `orphans=0`, and `thematicErrors=0`. If it fails, repair the first concrete path/title/metadata/row/simulation mismatch and restart the command; do not restore a broad page or relax the validator.

- [ ] **Step 5: Commit the single catalog cutover**

  ```bash
  git add README.md collections tasks
  git commit -m "docs: organize army-97 tasks by topic"
  ```

### Task 3: Synchronize GRACE contracts and frozen Beads mappings

**Files:**

- Modify: `docs/requirements.xml`
- Modify: `docs/technology.xml`
- Modify: `docs/development-plan.xml`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/operational-packets.xml`
- Modify: existing candidate and card issues `frontend-livecoding-tasks-army-97-candidate-001..118` and `frontend-livecoding-tasks-army-97-task-0001..0118`

**Interfaces:**

- Consumes: Task 2's committed exact `HEAD`, 23 topic projections, card metadata, and simulation pages.
- Produces: GRACE `M-*`, `V-M-*`, and `DF-ARMY97-*` records that describe topic navigation; Beads mappings whose destinations, titles, and final receipts match the committed catalog.

- [ ] **Step 1: Update GRACE source-of-truth documents before evidence issuance**

  In `requirements.xml`, record visible task-ID H1/link grammar, master/topic ownership, forbidden student wording, and three-topic simulations. In `technology.xml`, retain sandbox detection but state that negative environment wording is absent from cards. In `development-plan.xml` and `knowledge-graph.xml`, replace four broad thematic nodes with four master index modules and 23 topic collection modules, connected by `CrossLink` records from cards to exactly one topic and topic to master. In `verification-plan.xml`, replace the two-topic simulation and broad-page assertions with Task 1's final checks. Update `operational-packets.xml` fields that still list broad paths, hidden IDs, or two-topic simulation evidence.

- [ ] **Step 2: Create current exact-HEAD evidence for all published cards**

  For each `task-0001` through `task-0118`, update its candidate/card frozen mapping to the new master/topic destination and prepare the unchanged ten-field `CardMigrationEvidence` with `NOT_RUN: Markdown-only delivery` for both target-editor fields. Run the tracked runner on the catalog cutover commit:

  ```bash
  catalogCommit="$(git rev-parse HEAD)"
  node docs/scripts/run-army-97-catalog-gate.mjs \
    --mode final \
    --commit "$catalogCommit" \
    --card-evidence-file <one-card-evidence.json>
  ```

  Store only the successful nine-field `FullCatalogGateEvidence` returned for that exact card and commit. Do not copy any receipt from `37b55e8` or the design commit.

- [ ] **Step 3: Replay live Beads validation**

  Run:

  ```bash
  node docs/scripts/validate-army-97-beads.mjs
  bd graph check --json
  ```

  Expected: a current final receipt for every published card, all frozen mappings resolving to one registered topic, and JSON `cycle_count: 0`. On failure, fix the first inconsistent card/page/receipt fact and repeat the exact-HEAD receipt for the new commit; never alter the immutable source-audit decision.

- [ ] **Step 4: Commit GRACE synchronization and record Beads evidence**

  ```bash
  git add docs/requirements.xml docs/technology.xml docs/development-plan.xml \
    docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
  git commit -m "docs: synchronize army-97 topic navigation contracts"
  ```

  If this commit changes any gate-relevant tracked file, regenerate all affected exact-HEAD receipts against its new `HEAD` before the final audit.

### Task 4: Execute the acceptance-ready final audit and handoff

**Files:**

- Modify: Beads notes/evidence on `frontend-livecoding-tasks-army-97-topic-navigation`
- Modify: Beads notes/evidence on `frontend-livecoding-tasks-army-97-final-acceptance`

**Interfaces:**

- Consumes: final current `HEAD`, Task 1 tests, Task 2 catalog, Task 3 GRACE/Beads facts.
- Produces: reproducible final audit output, updated draft PR, and an open human-acceptance decision for the revised commit.

- [ ] **Step 1: Run the complete final verification sequence**

  ```bash
  set -euo pipefail
  test "${BASH_VERSINFO[0]:-0}" -ge 3
  node --test docs/scripts/validate-army-97-catalog.test.mjs \
    docs/scripts/validate-army-97-beads.test.mjs \
    docs/scripts/run-army-97-catalog-gate.test.mjs
  bash docs/scripts/validate-army-97-catalog.sh --mode final
  catalogCommit="$(git rev-parse HEAD)"
  node docs/scripts/run-army-97-catalog-gate.mjs --mode final --commit "$catalogCommit" --verify-only
  node docs/scripts/validate-army-97-beads.mjs
  xmllint --noout docs/*.xml
  GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"; test -x "$GRACE_BIN"; "$GRACE_BIN" lint --fail-on errors --path "$PWD"
  bd graph check --json
  git diff --check
  ```

  Expected: all Node tests pass, the catalog prints exactly `tasks=118 covered=118 orphans=0 thematicErrors=0`, exact-HEAD verification and live Beads replay pass, XML is valid, Grace reports zero errors, Beads reports zero cycles, and `git diff --check` is silent.

- [ ] **Step 2: Check publication readiness and remote divergence**

  Run:

  ```bash
  git fetch origin
  git status --short --branch
  git log --oneline origin/main..HEAD
  ```

  Expected: only intended commits ahead of `origin/main`, no unresolved tracked changes, and no need to rewrite history. If `origin/main` conflicts, stop and request integration direction rather than merging or rebasing autonomously.

- [ ] **Step 3: Push and request revised human acceptance**

  Push `feature/army-97`, update the existing draft pull request with the migration summary and the exact commands/results, and add Beads evidence that the revised final audit is tied to the new commit. Leave both `frontend-livecoding-tasks-army-97-topic-navigation` and the parent ARMY-97 story open until the user explicitly accepts the revised library.

- [ ] **Step 4: Close only the completed planning/execution records**

  Close the plan issue after its plan has been implemented and all gates above pass. Do not close `frontend-livecoding-tasks-army-97-final-acceptance` or the parent feature without the explicit human response.

## Plan Self-Review

**Spec coverage:** Task 1 covers the validator registry, visible identity, wording, master/topic row grammar, and three-topic rules. Task 2 performs the immutable card/collection/simulation atomic migration. Task 3 synchronizes all required GRACE and Beads facts and regenerates receipts. Task 4 runs every mandated gate, refreshes the draft PR, and preserves the human-acceptance boundary.

**Placeholder scan:** This plan contains no deferred implementation markers. The only `<one-card-evidence.json>` reference identifies the existing per-card evidence-file interface; the implementing worker must supply the concrete generated file for the card being receipted, not invent a schema.

**Consistency check:** Every task uses the same `task-XXXX — Title` identity, `Master → Topic` metadata, 23 topic pages, final gate mode, and exact required summary. Receipt regeneration follows the last gate-relevant commit, preventing ancestor evidence from passing.
