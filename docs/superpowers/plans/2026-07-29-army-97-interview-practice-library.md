# ARMY-97 Interview Practice Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 21-card catalog with the complete, independently authored ARMY-97 interview-practice library, with immutable hidden task IDs, one thematic membership per card, and 30 static interview simulations.

**Architecture:** Treat the supplied 118-section inventory as execution input, not published repository content. First freeze neutral Beads candidate records, prove only exact duplicates, assign global `task-XXXX` IDs and a thematic registry, then publish complete cards in serialized 8–10-card waves. Rebuild all collections and static simulations only after every replacement card is accepted; GRACE XML, the Markdown-only policy, and Beads are synchronized evidence surfaces rather than generators or runtime code.

**Tech Stack:** GitHub-flavored Markdown, repository-local shell checks (`find`, `rg`, `sort`, `uniq`, `comm`), XML validated by `xmllint`, GRACE CLI resolved from `PATH` then `$HOME/.bun/bin/grace`, and Beads (`bd`) for durable work and evidence. No package manager, browser, sandbox, runtime application, or generated task site is added.

## Global Constraints

- Work only on `feature/army-97` in its existing linked worktree; fetch `origin` before edits, never commit, push, or merge on `main`, and never reset, stash, force-push, or destructively clean history.
- The missing local source is the user-supplied 118-section candidate inventory. Stop before the candidate audit if its full text is unavailable to the executor; do not invent, reduce, or silently substitute candidates.
- Create one neutral Beads record for each of the 118 input sections. Collapse only groups with the same central action, starter behaviour, and expected result; ambiguous similarity remains distinct.
- Assign IDs only after that audit: `tasks/task-0001/README.md`, `tasks/task-0002/README.md`, and so on. IDs never encode topic, never appear in student-facing text, and are never reused or renumbered.
- A published card has the exact order: title, exact sandbox line, `## Условие`, complete minimal starter with all requirements in leading comments, exactly three closed hints, closed `Решение`, and closed five-field `О задаче`.
- Use the exact sandbox sentence `Песочница для выполнения — [Название](URL).`; choose Programiz, CodePen, TypeScript Playground, or React TypeScript only from the technology profile. Do not include transfer, wait, browser-version, or replacement-file instructions in that line.
- Every requirement belongs only in the starter comments. Do not publish full HTML document wrappers, student-visible IDs, author/source/video/migration provenance, external-editor evidence, a runtime generator, Junior/Middle/Senior labels, or a task harness.
- Each card has exactly one thematic collection reference. A confirmed React real-work card additionally appears once in `collections/real-work/README.md`; interview membership is optional and never substitutes for thematic membership.
- Every change under `tasks/` or `collections/` runs the complete ARMY-97 catalog regression, never a changed-files-only substitute. CSS and visual behaviour are reviewed from Markdown and manual-check wording, not automated CSS assertions.
- The final catalog has exactly 30 sequential `collections/interviews/simulation-XXX/README.md` pages. Every simulation is 30–120 minutes, has at least two cards from at least two thematic collections, has no repeated card, and does not reuse a card in any three consecutive simulations.
- Remove the tracked and working-tree `.superpowers/` directory, add `.superpowers/` to `.gitignore`, and keep `docs/superpowers/` tracked. Store approved durable preferences only through the approved memory-extension mechanism, never in student-facing files or ad-hoc repository notes.
- Use Beads for the story, candidate decisions, waves, simulations, manual-realism evidence, failures, and final audit. `targetEditorExpectedResult` and `targetEditorActualResult` remain `NOT_RUN: Markdown-only delivery`; browser and external sandbox availability never block publication.

---

## Planned File Structure

| Path | Responsibility |
| --- | --- |
| `.gitignore` | Ignore the whole removed `.superpowers/` runtime-artifact directory while retaining `docs/superpowers/`. |
| `AGENTS.md` | Replace superseded 21-card cutover rules with ARMY-97 identity, card, collection, simulation, Beads, branch, and local-verification rules. |
| `templates/task-template.md` | Canonical comment-driven `task-XXXX` card shape, exact sandbox line, hints, solution boundary, and five metadata fields. |
| `docs/task-validation-policy.md` | Executable local policy for ARMY-97 card structure, IDs, provenance exclusion, full catalog coverage, simulations, links, XML, Grace, and diff checks. |
| `docs/requirements.xml`, `docs/technology.xml` | Replace old 21-card requirements and technology mappings with the ARMY-97 inventory, immutable identity, Markdown-only and static-simulation decisions. |
| `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml` | Update contracts, modules, flows, mapping registry, verification references, execution packets, and phase gates to ARMY-97. |
| `tasks/task-XXXX/README.md` | One complete accepted card per frozen distinct candidate; the final `XXXX` range is contiguous from `0001` through the audited distinct-card count. |
| `collections/javascript/**/README.md`, `collections/typescript/**/README.md`, `collections/react/**/README.md`, `collections/html-css/**/README.md` | The frozen thematic registry and its student-facing rows, each linking to task cards only. |
| `collections/real-work/README.md` | Cross-cutting list of accepted React cards with format `Приближённая к реальной работе`. |
| `collections/interviews/README.md`, `collections/interviews/simulation-XXX/README.md` | One index and exactly thirty static, recurrence-safe, mixed interview compositions. |
| `README.md` | Four-section student hub linking thematic navigation, real-work collection, and the interview index. |
| `.superpowers/` | Deleted in full; no replacement directory is created. |

## Durable Beads Model

The implementation first creates these explicit children of `frontend-livecoding-tasks-army-97`; create each issue with `--id`, then add the separate `parent-child` edge because this Beads version does not accept `--id` together with `--parent`:

```text
frontend-livecoding-tasks-army-97-governance
frontend-livecoding-tasks-army-97-candidate-audit
frontend-livecoding-tasks-army-97-card-waves
frontend-livecoding-tasks-army-97-cutover
frontend-livecoding-tasks-army-97-simulations
frontend-livecoding-tasks-army-97-final-audit
```

`candidate-audit` depends on `governance`; `card-waves` depends on `candidate-audit`; `cutover` depends on `card-waves`; `simulations` depends on `cutover`; and `final-audit` depends on both `cutover` and `simulations`. After the audit, create one child `frontend-livecoding-tasks-army-97-wave-NNN` per actual 8–10-card wave, one `frontend-livecoding-tasks-army-97-card-XXXX` child per accepted immutable task, and one `frontend-livecoding-tasks-army-97-simulation-NNN` child per simulation. Each of those child issues records only neutral target-card or composition evidence, never provenance.

The candidate record contract is a Beads description or notes block with these exact labels:

```text
candidateId
centralAction
starterBehavior
expectedResult
decision
decisionReason
duplicateTarget
targetTaskId
thematicCollection
waveId
evidenceType
observedResult
remainingRisk
```

`decision` is `accepted`, `duplicate`, or `rejected`; a candidate requiring reconstruction stays open with `decision: needs-rewrite` until a complete card can be validated. Every accepted card's Beads issue additionally contains the exact ten-field `CardMigrationEvidence`: `slug`, `mode`, `editorProfile`, `sourceLearningGoal`, `sourcePrerequisite`, `sourceRuntimeAssumption`, `destinationLocations`, `targetEditorExpectedResult`, `targetEditorActualResult`, and `verdict`.

### Task 1: Establish the ARMY-97 governance and deterministic verification contract

**Files:**

- Modify: `.gitignore`, `AGENTS.md`, `templates/task-template.md`, `docs/task-validation-policy.md`
- Modify: `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`
- Delete: `.superpowers/`
- Beads: create and claim `frontend-livecoding-tasks-army-97-governance`

**Interfaces:**

- Consumes: approved ARMY-97 specification and the existing project GRACE artifacts.
- Produces: `Army97CandidateRecord`, `CardMigrationEvidence`, the `task-XXXX` student-card contract, `DF-ARMY97-CANDIDATE-TO-CARD`, `DF-ARMY97-CARD-TO-CATALOG`, `DF-ARMY97-SIMULATION`, and matching `V-M-*` verification entries.

- [ ] **Step 1: Create the persistent implementation issue graph before changing repository files.**

  Run the following exact commands from the linked `feature/army-97` worktree. Give every issue a description, acceptance criterion, and `docs/superpowers/specs/2026-07-29-army-97-interview-practice-library-design.md` as `--spec-id`; then add the stated parent and blocking edges and run `bd graph check --json`.

  ```bash
  bd create --id frontend-livecoding-tasks-army-97-governance --title 'Align ARMY-97 governance and verification' --type task --priority 1
  bd create --id frontend-livecoding-tasks-army-97-candidate-audit --title 'Freeze and audit ARMY-97 candidate inventory' --type task --priority 1
  bd create --id frontend-livecoding-tasks-army-97-card-waves --title 'Publish accepted ARMY-97 card waves' --type epic --priority 1
  bd create --id frontend-livecoding-tasks-army-97-cutover --title 'Cut over ARMY-97 task catalog' --type task --priority 1
  bd create --id frontend-livecoding-tasks-army-97-simulations --title 'Publish ARMY-97 interview simulations' --type task --priority 1
  bd create --id frontend-livecoding-tasks-army-97-final-audit --title 'Run ARMY-97 final catalog audit' --type task --priority 1
  ```

- [ ] **Step 2: Replace the superseded governance rules and remove transient Superpowers artifacts.**

  Update `.gitignore` to contain the single root rule `.superpowers/`, remove the old narrower `.superpowers/brainstorm/...` rules, and delete the complete `.superpowers/` directory. Update `AGENTS.md` and `templates/task-template.md` so their published-card contract exactly matches the Global Constraints: hidden immutable `task-XXXX` identity, universal sandbox sentence, requirements only in starter comments, three closed progressive hints, closed solution, five exact metadata labels, no provenance, and static simulations. Keep `docs/superpowers/` explicitly outside the deletion and ignore rule.

- [ ] **Step 3: Replace the old 21-card validation policy with the ARMY-97 local gate.**

  In `docs/task-validation-policy.md`, remove fixed `21`, `14`, three-interview, legacy-slug, and external-rendered assumptions. Add one documented command block that performs all of these checks in order: valid `tasks/task-[0-9]{4}/README.md` paths; unique IDs; exact sandbox-line syntax; the exact section and details order; starter requirement comments; exactly three exact hint summaries; closed solution and metadata details; five controlled metadata fields; no forbidden provenance/migration/full-document markers; all local relative links; complete thematic coverage; correct real-work membership; exactly 30 sequential simulations; simulation links, duration sums, two-collection composition, three-simulation recurrence, and recorded realism evidence; `xmllint`; Grace lint; and `git diff --check`.

- [ ] **Step 4: Re-plan GRACE artifacts around the replacement library.**

  Update each XML file with unique ID tags, not generic `ID` attributes. Retire the old 21-card and Phase 19 facts, add the immutable-ID and static-simulation contracts, and retain the existing module names where their responsibility is unchanged. `M-TASK-VALIDATION` owns candidate decisions and full-catalog checks; `M-TASK-LIBRARY` owns `tasks/task-XXXX`; `M-CATALOG` owns thematic, real-work, and interview projections; `M-GOVERNANCE` owns branch, cleanup, and stop conditions. Add the three named data flows and verification entries that point to concrete commands in `docs/task-validation-policy.md`; update `docs/operational-packets.xml` with an ARMY-97 candidate record, wave report, simulation review record, and failure handoff packet.

- [ ] **Step 5: Verify the governance contract before candidate work starts.**

  Run the exact checks below. The policy's catalog command may not pass until cards exist; at this point validate its shell syntax and defer its passing run to the first accepted card wave. All XML and Grace checks must pass now.

  ```bash
  xmllint --noout docs/*.xml
  GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
  test -x "$GRACE_BIN"
  "$GRACE_BIN" lint --fail-on errors --path "$PWD"
  test ! -e .superpowers
  rg -n '^\.superpowers/$' .gitignore
  git diff --check
  bd graph check --json
  ```

- [ ] **Step 6: Commit the verified governance slice.**

  ```bash
  git add .gitignore AGENTS.md templates/task-template.md docs
  git commit -m "docs: define army-97 task library governance"
  ```

### Task 2: Freeze the candidate inventory and thematic registry

**Files:**

- Modify: `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`
- Beads: claim `frontend-livecoding-tasks-army-97-candidate-audit`; create `frontend-livecoding-tasks-army-97-candidate-001` through `frontend-livecoding-tasks-army-97-candidate-118`

**Interfaces:**

- Consumes: the complete user-supplied 118-section inventory and Task 1's candidate record contract.
- Produces: a frozen 118-record Beads register; a proved exact-duplicate map; contiguous immutable `task-XXXX` assignment; a controlled broad-topic registry; and a `task-XXXX → thematic collection` mapping stored in GRACE artifacts.

- [ ] **Step 1: Confirm the sole required execution input before creating candidate records.**

  Read all 118 supplied sections in their entirety and enumerate them once in order. If any section is absent, contradictory, or unavailable, add a Beads note to `frontend-livecoding-tasks-army-97-candidate-audit` naming the missing section count, leave that issue in progress, and stop. Do not create replacement tasks from the current 21-card library.

- [ ] **Step 2: Create and freeze neutral candidate records.**

  Create 118 Beads children with stable IDs `frontend-livecoding-tasks-army-97-candidate-001` through `frontend-livecoding-tasks-army-97-candidate-118`, each parented to `candidate-audit`. Populate the candidate record labels with an independently worded central action, starter behaviour, and expected result; omit authors, links, videos, imported-text claims, and source URLs. Record the frozen register size as `118` in the audit issue and the GRACE candidate-register annotation.

- [ ] **Step 3: Prove duplicate decisions before assigning task IDs.**

  Compare every candidate against every earlier candidate on exactly three axes: central action, starter behaviour, and expected result. Mark a record `duplicate` only if all three are equal and put the earliest surviving candidate in `duplicateTarget`; retain every variation in input, control flow, output order, edge condition, or implementation constraint. Rewrite a broken/incomplete/contradictory section into the most likely complete interview exercise and keep it `needs-rewrite` until its resulting card passes the card contract.

- [ ] **Step 4: Assign immutable IDs and group the distinct records.**

  Sort surviving records by frozen input order, assign contiguous IDs beginning at `task-0001`, and write each `targetTaskId` back to Beads. Freeze one broad-topic registry, create the needed JavaScript, TypeScript, React, and HTML/CSS collection paths, and assign every target task to exactly one of those paths. Record the final distinct-card count as `118 - exactDuplicateGroupCount`; derive waves as consecutive groups of ten, except that the final group contains 8–10 cards. If fewer than eight remain for the final group, move enough preceding cards into it so both final groups remain 8–10.

- [ ] **Step 5: Materialize the Beads wave graph and GRACE mapping.**

  Create `frontend-livecoding-tasks-army-97-wave-NNN` for every derived wave and make each wave depend on the preceding wave. Create one card child under its wave for every accepted `task-XXXX`; include the target task ID, chosen editor profile, format, target collection, and expected local Markdown evidence. Add the complete candidate-to-task and task-to-collection mapping to `docs/development-plan.xml`, mirror the expected card count and per-collection membership expectations in `docs/verification-plan.xml`, and expose only public mapping facts in `docs/knowledge-graph.xml`.

- [ ] **Step 6: Verify the audit is safe to publish.**

  ```bash
  bd show frontend-livecoding-tasks-army-97-candidate-audit --json
  bd graph check --json
  rg -n 'candidate-register-size|task-0001|thematic' docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml
  xmllint --noout docs/*.xml
  git diff --check
  ```

  Stop if the Beads register is not exactly 118 records, any record lacks a terminal decision or a declared `needs-rewrite` correction path, an ID is missing or duplicated, the mapping lacks a target task, or a task has zero or multiple thematic collections.

- [ ] **Step 7: Commit the frozen audit and mapping.**

  ```bash
  git add docs
  git commit -m "docs: freeze army-97 candidate registry"
  ```

### Task 3: Publish every accepted card in serialized, reviewable waves

**Files:**

- Create: `tasks/task-XXXX/README.md` for the exact `task-XXXX` IDs assigned in Task 2
- Modify: the one mapped thematic `collections/<technology>/<topic>/README.md` per card
- Modify: `collections/real-work/README.md` only for a confirmed React real-work card
- Modify: `docs/knowledge-graph.xml`, `docs/verification-plan.xml`, `docs/operational-packets.xml`
- Beads: claim one `frontend-livecoding-tasks-army-97-wave-NNN` at a time and its card children

**Interfaces:**

- Consumes: frozen `targetTaskId`, central action, task class, editor profile, metadata, and thematic mapping from Task 2.
- Produces: accepted complete `ConciseStudentTaskCard` documents; exactly one thematic collection row per card; optional real-work row; card-level ten-field evidence; and a wave report with full-catalog results.


- [ ] **Step 1: Start one eligible wave and write its cards before touching legacy paths.**

  Claim only the next unblocked `wave-NNN`. For each of its 8–10 card Beads children, write `tasks/task-XXXX/README.md` with candidate-specific requirements only in the first starter comments. The following complete focused JavaScript card demonstrates the required document shape; replace its central action with the frozen card issue's independently authored action, rather than publishing this demonstration as an extra candidate:

  ````markdown
  # Очередь микрозадач

  Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

  ## Условие

  ```javascript
  // Напиши функцию runNext, которая запускает и удаляет первую функцию из queue.
  // Если очередь пуста, функция возвращает undefined.
  // Проверь, что выполненная функция вызывается ровно один раз.

  const queue = [() => 'first', () => 'second'];

  function runNext(queue) {
    // Напиши решение.
  }
  ```

  <details>
  <summary>Подсказка 1 — куда смотреть</summary>
  Сначала отдели получение первого элемента от его вызова.
  </details>

  <details>
  <summary>Подсказка 2 — с чего начать</summary>
  Метод `shift()` одновременно возвращает первый элемент и удаляет его из массива.
  </details>

  <details>
  <summary>Подсказка 3 — почти решение</summary>
  Сохрани результат `shift()` в переменную и вызывай её только если это функция.
  </details>

  <details>
  <summary>Решение</summary>
  ```javascript
  function runNext(queue) {
    const job = queue.shift();
    return typeof job === 'function' ? job() : undefined;
  }
  ```

  `shift()` удаляет первый обработчик, поэтому следующий вызов переходит к следующей задаче.

  Ожидаемый результат: первый вызов возвращает `first`, второй — `second`, третий — `undefined`.

  Ручная проверка: вызови `runNext(queue)` три раза и выведи все результаты в консоль.
  </details>

  <details>
  <summary>О задаче</summary>
  - Технология: JavaScript
  - Подборка: Массивы и объекты
  - Формат: Написать код
  - Сложность: Базовая
  - Примерное время: 10 минут
  </details>
  ````

  For DOM tasks place only the necessary HTML fragment before the JavaScript block; for real-work React use multiple complete `FILE:` blocks only when the frozen card contract proves genuine file boundaries. Do not copy unchanged fixtures into `Решение`.

- [ ] **Step 2: Synchronize each card immediately with its one thematic collection and evidence.**

  Add a collection row containing only the linked student title, one plain-language sentence, and exact integer time. Add a real-work row only when the card metadata says `Приближённая к реальной работе` and the card is React. Update the corresponding library annotations and verification expectations, then record all ten `CardMigrationEvidence` labels in the card's Beads issue with both target-editor results set exactly to `NOT_RUN: Markdown-only delivery` and a verdict derived solely from local checks.

- [ ] **Step 3: Run card-local structure checks while the source is still in review.**

  For each card, verify the exact sandbox line, `## Условие` placement, comment-owned requirements, complete starter, three distinct summaries, no `<details open>`, solution boundary, five metadata lines, controlled values, no provenance terms, and resolution of its relative collection link. Independently content-review the central action, starter/solution consistency, expected result, manual check, and the strictly increasing usefulness of all three hints. Mark the Beads card issue accepted only after this review passes.

- [ ] **Step 4: Run the whole-catalog regression after every collection change.**

  Use the canonical loop from `docs/task-validation-policy.md`; it must enumerate every `tasks/task-XXXX/README.md`, search all `collections/` references, and end with the following shape before the wave can close:

  The command's `tasks` and `covered` values must be equal; `orphans` and `thematicErrors` must both be zero. Before final cutover, that equal count includes the still-present 21 legacy cards plus the accepted ARMY-97 cards. Treat any invalid path, orphan, zero/multiple thematic membership, local-link failure, metadata mismatch, or failed XML/Grace/diff gate as a wave failure; correct the card without weakening the inventory or reusing its ID.

- [ ] **Step 5: Record independent wave review, commit, and publish only the complete wave.**

  Add the complete full-catalog output, card IDs, collection paths, card evidence verdicts, and unresolved risk (or `none`) to the wave Beads issue. Run the full policy command, `xmllint --noout docs/*.xml`, Grace lint, and `git diff --check`; then commit only the wave's complete cards and synchronized artifacts.

  ```bash
  git add tasks collections docs
  git commit -m "docs: publish army-97 wave NNN"
  git push
  ```

  Do not add partial cards to `tasks/`, do not close a wave with a failed card, and do not start the next wave until the current wave's independent content review and full regression pass.

### Task 4: Perform the atomic catalog cutover after the final card wave

**Files:**

- Delete: every legacy `tasks/<old-slug>/README.md` directory and obsolete thematic/interview collection page
- Modify: `README.md`, all final thematic collection pages, `collections/real-work/README.md`
- Create: `collections/interviews/README.md`
- Modify: `docs/task-validation-policy.md`, `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`
- Beads: claim `frontend-livecoding-tasks-army-97-cutover`

**Interfaces:**

- Consumes: all accepted `task-XXXX` cards, frozen thematic registry, final wave reports, and no unfinished card issue.
- Produces: a student hub whose only task navigation targets the new immutable-ID catalog; no legacy-path exception; complete final thematic and real-work projections; and final GRACE counts.

- [ ] **Step 1: Prove final-wave completeness before deleting any legacy card.**

  Query the candidate-audit and all wave issues. Confirm that every frozen candidate has `accepted`, `duplicate`, or `rejected`, no `needs-rewrite` remains, every `accepted` candidate has a complete `task-XXXX` card and one thematic membership, and each final-card Beads issue has all ten `CardMigrationEvidence` fields. If one condition fails, do not delete a legacy directory.

- [ ] **Step 2: Rebuild student navigation from the frozen registry.**

  Rewrite `README.md` to retain exactly these four `##` headings: `Как пользоваться базой`, `Подборки по направлениям`, `Симуляции собеседований`, and `Где писать код`. Link every thematic page, the real-work page, and only `collections/interviews/README.md` from the simulations section. Rebuild thematic pages with grouped, student-visible title/time/one-sentence rows; rebuild real-work from the set of accepted React real-work cards; remove all rows referencing legacy slugs or `interview-01` through `interview-03`.

- [ ] **Step 3: Delete transitional content and exceptions as one coherent change.**

  Remove all 21 old `tasks/<slug>/` directories, the old three interview directories, all transitional legacy-path lists, old fixed catalog-count rules, and stale task-editor mappings. Preserve no redirect, source attribution, or migration explanation for students. Keep the ARMY-97 mapping and expected final count in GRACE artifacts and verification policy instead.

- [ ] **Step 4: Verify cutover before simulations are added.**

  ```bash
  find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | sort
  find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | rg '^tasks/task-[0-9]{4}/README\.md$'
  test "$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" -eq "$(bd list --status=closed --json | rg -c 'frontend-livecoding-tasks-army-97-card-')"
  xmllint --noout docs/*.xml
  git diff --check
  ```

  Then run the complete policy command; its full catalog portion must report zero orphans and zero thematic errors. Commit only when all task paths are new-format paths and no legacy task or collection reference remains.

- [ ] **Step 5: Commit the cutover.**

  ```bash
  git add -A tasks collections README.md docs
  git commit -m "docs: cut over to army-97 task catalog"
  git push
  ```

### Task 5: Build and verify the thirty static interview simulations

**Files:**

- Create: `collections/interviews/simulation-001/README.md` through `collections/interviews/simulation-030/README.md`
- Modify: `collections/interviews/README.md`, `README.md`, `docs/task-validation-policy.md`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`
- Beads: claim `frontend-livecoding-tasks-army-97-simulations`; create and close one simulation child per passing page

**Interfaces:**

- Consumes: post-cutover `tasks/task-XXXX` catalog, per-card exact durations, thematic mapping, and the recurrence constraint.
- Produces: exactly 30 static simulation pages, one index, a total-time ledger, recurrence-safe membership, two-topic composition evidence, and a manual-realism record per simulation.

- [ ] **Step 1: Create a deterministic composition ledger before writing pages.**

  Order simulations from `001` to `030`. For each number, choose at least two different task IDs from at least two thematic collections, sum their metadata minutes to 30–120, and exclude every task used in the prior two numbered simulations. Record the ordered task IDs, collection IDs, declared total, calculated total, and manual realism rationale in `frontend-livecoding-tasks-army-97-simulation-NNN` before adding its Markdown page.

- [ ] **Step 2: Write the index and all static simulation pages.**

  `collections/interviews/README.md` lists exactly thirty links named `Симуляция собеседования №N` and each total time. Every `simulation-NNN/README.md` uses the student-facing name, links task titles to `../../../tasks/task-XXXX/README.md`, includes each task's time, and declares the sum. It does not copy a card condition, starter, hint, solution, provenance, or seniority label.

- [ ] **Step 3: Manually review realism before accepting each set.**

  For every simulation record, assess whether its order plausibly begins with a warm-up when appropriate, moves through implementation/debugging/review naturally, and can end with a longer React/real-work task without exceeding the time window. Capture the explicit result `PASS: plausible frontend technical interview` or `FAIL: <specific composition defect>` in the Beads simulation issue. Recompose any failed set before closing its issue.

- [ ] **Step 4: Run structural, recurrence, duration, and link gates.**

  Run the exact 30-page and sliding-three-page commands from `docs/task-validation-policy.md`, then additionally verify each declared total against task metadata, at least two unique thematic membership paths per simulation, and every local link. The recurrence scanner must return no duplicated `tasks/task-XXXX/README.md` ID for all windows `001–003` through `028–030`.

- [ ] **Step 5: Synchronize GRACE and publish the completed simulation set.**

  Update `M-CATALOG`, its simulation flow, expected static counts, and the final simulation verification gate. Record the full 30-row evidence summary in the simulation epic, run `xmllint`, Grace lint, the complete ARMY-97 policy, and `git diff --check`, then commit and push.

  ```bash
  git add collections README.md docs
  git commit -m "docs: add army-97 interview simulations"
  git push
  ```

### Task 6: Run final acceptance-ready audit and deliver the branch

**Files:**

- Modify: `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/development-plan.xml`, `docs/operational-packets.xml` only if the audit exposes stale expected facts
- Create: one approved-memory extension note outside the repository only if the user has explicitly authorized that persistent-memory write
- Beads: claim `frontend-livecoding-tasks-army-97-final-audit`

**Interfaces:**

- Consumes: every closed accepted-card, wave, cutover, and simulation record plus the final catalog state.
- Produces: durable final audit evidence, a branch-divergence report, an updated draft pull request, and a story left open for explicit user acceptance.

- [ ] **Step 1: Run the full final repository gate with no exceptions.**

  Run the full ARMY-97 policy command from `docs/task-validation-policy.md`, `xmllint --noout docs/*.xml`, Grace lint using the documented resolver, `bd graph check --json`, `bd doctor --check=conventions`, `git diff --check`, a scan for `.superpowers` and legacy task paths, and `git status --short`. Re-run the full orphan regression even if no card changed after the last passing wave.

- [ ] **Step 2: Audit Beads decisions and evidence against files.**

  Confirm the frozen candidate-record count is 118; all records are terminal; each duplicate names an earlier target; every accepted record maps to exactly one existing `task-XXXX`; each card issue contains all ten `CardMigrationEvidence` values; every wave has a full regression report; every simulation has passing manual realism evidence; and the final audit issue links these summaries without provenance. Any mismatch keeps `final-audit` open and sends the specific failure back to the owning card, wave, cutover, or simulation issue.

- [ ] **Step 3: Record durable user preferences only with explicit memory-write authority.**

  If the user has explicitly asked for memory persistence during execution, create exactly one small dated note under `/Users/artemiy/.codex/memories/extensions/ad_hoc/notes/` recording: Linear-derived `feature/<linear-issue-id-lowercase>` branch naming; full inventory regression after collection changes; exactly one thematic membership; and the universal sandbox/requirement-comments card rule. If explicit authority is absent, report this requirement as pending rather than writing outside the repository.

- [ ] **Step 4: Fetch, report divergence, and publish the verified branch.**

  ```bash
  git fetch origin
  git rev-list --left-right --count HEAD...origin/main
  git status --short
  git push
  ```

  Do not force-push. Update or open the pull request from `feature/army-97` to `main` with the card count, exact-duplicate result, wave commits, simulation evidence, full local-gate results, and the fact that external editors/browsers were deliberately `NOT_RUN` under the Markdown-only contract.

- [ ] **Step 5: Close only completed technical work and request the required human decision.**

  Close each completed Beads child and `frontend-livecoding-tasks-army-97-final-audit`, leave `frontend-livecoding-tasks-army-97` open, and create or update a human decision record that asks for explicit acceptance of the complete library. The top-level story closes only after that durable user response; no technical PASS implies acceptance.

## Verification Surface Overview

| Surface | Primary proof | Stop or replan condition |
| --- | --- | --- |
| Candidate identity | 118 frozen Beads records; three-axis exact-duplicate comparison | Missing input, ambiguous duplicate treated as collapsed, or no decision path |
| Card contract | Per-card Markdown review plus policy structural scan | Incomplete starter/solution, fourth/missing hint, disallowed metadata, hidden requirement, or provenance |
| Catalog integrity | Full `tasks/` × `collections/` regression after every catalog change | Invalid path, orphan, or thematic membership count other than one |
| GRACE contract | Unique XML tags, `xmllint`, Grace lint, artifact cross-links | Old fixed counts or mapping facts remain, or XML/lint fails |
| Simulations | Sequential pages, duration ledger, local links, recurrence loop, Beads realism review | Missing page, repeated task in a three-page window, less than two topics, duration mismatch, or failed realism review |
| Delivery | Clean diff check, divergence report, non-force push, PR evidence | Uncommitted intended work, diverged base requiring resolution, failed gate, or absent explicit human acceptance |

## Self-Review

- **Spec coverage:** Task 1 covers governance, cleanup, card contract, GRACE, and local verification; Task 2 covers all 118 candidates, exact duplicates, immutable identity, and thematic registry; Task 3 covers complete cards, serialized waves, card evidence, and full regressions; Task 4 covers legacy preservation until atomic removal and the final student hub; Task 5 covers all thirty simulations, duration, recurrence, and realism; Task 6 covers final audit, memory authority, branch delivery, and human acceptance.
- **Scope check:** The work is intentionally one plan because candidate audit assigns the IDs and mappings that all later publishing, cutover, and simulation tasks consume. The plan never introduces a runtime generator or external editor/browser gate.
- **Placeholder scan:** No unresolved implementation placeholder is used. `task-XXXX`, `wave-NNN`, and `simulation-NNN` are specified deterministic identifier families; their exact populated members are derived only from the frozen inventory and its proved duplicate groups.
- **Interface consistency:** `Army97CandidateRecord` produces `targetTaskId` and the thematic mapping; waves consume those facts to produce task cards and `CardMigrationEvidence`; cutover consumes accepted cards; simulations consume their metadata and mapping; the final audit consumes all preceding evidence.
