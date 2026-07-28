# Concise Task Cards and Real-Work Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the verbose twenty-card student experience with concise focused cards, add one React/DummyJSON real-work card and its cross-cutting collection, then prove the complete 21-card catalog with repository-local Markdown, collection, XML, and Beads checks.

**Architecture:** Keep the existing `M-GOVERNANCE`, `M-TASK-TEMPLATE`, `M-TASK-VALIDATION`, `M-TASK-LIBRARY`, and `M-CATALOG` ownership boundaries. Add a time-bounded migration compatibility state in the governance artifacts so legacy cards remain an explicitly known intermediate state, then remove it only in the final catalog cutover. Serialize three card waves (`8 + 8 + 5`) because every card changes shared catalog, graph, verification, and Beads facts; the new real-work card enters the last wave with the root and collection cutover.

**Tech Stack:** GitHub Flavored Markdown, XML GRACE artifacts, Beads (`bd`), Git, `rg`, `find`, `awk`, and `xmllint`. Student-facing editor links and the DummyJSON contract remain card content, not execution dependencies of this plan.

## Global Constraints

- Work only on `feature/frontend-livecoding-tasks-kln` in its existing linked worktree; fetch `origin` before work and never commit or push to `main`.
- Preserve the user decision: the top-level story and `frontend-livecoding-tasks-kln-final-acceptance` stay open until a new complete local catalog audit and explicit human acceptance.
- Do not add a package manager, runnable repository application, permanent harness, CSS/visual unit test, rewritten published history, or a fixed line-count limit.
- A focused task has one central action and normally takes 10–30 minutes; a real-work task may have related product requirements and normally takes 45–60 minutes.
- Every target card is title → editor instruction → `Условие` → minimal starter → exactly three closed hints → closed `Решение` → closed five-field `О задаче`; it has no back/fallback navigation, learning-goal framing, `Готово, когда`, `Самопроверка`, tutorial text for `<details>`, harness, diagnostic flags, inflated fixtures, or complete starter duplication in the solution.
- JavaScript cards use a JavaScript block by default and never use a complete HTML document, `<style>`, `<script>`, or HTML script imports; a DOM task may precede JavaScript with only the semantically necessary HTML fragment.
- The permitted format values are `Написать код`, `Исправить код`, `Разобрать код`, `Предсказать результат`, and `Приближённая к реальной работе`; the last value is used only for the new cross-cutting class.
- Every task belongs to exactly one thematic collection; a real-work task also appears in `collections/real-work/README.md` and in zero or one interview collection.
- Do not open or operate Programiz, CodePen, TypeScript Playground, Vite, a browser, or a GitHub-rendered page for validation. Their availability never determines `PASS` or `BLOCKED`.
- Each migrated card records complete `CardMigrationEvidence`, including source learning goal, prerequisite, runtime assumption, destinations, editor instruction, collection synchronization, and remaining risk. Preserve the legacy `targetEditorExpectedResult` and `targetEditorActualResult` fields as the explicit value `NOT_RUN: Markdown-only delivery`; derive `verdict` only from local deterministic checks.
- Do not silently change `users-api-list` slug, duration, editor, or thematic collection: a duplicate or collection-capacity conflict is a product decision and stops the wave.

---

## File Structure and Ownership

| Area | Paths | Responsibility in this redesign |
| --- | --- | --- |
| Governance and target card contract | `AGENTS.md`, `templates/task-template.md`, `docs/task-validation-policy.md` | Define concise-card structure, real-work exception, editor/code boundaries, evidence, and migration compatibility. |
| Student cards | `tasks/*/README.md`, new `tasks/users-api-list/README.md` | Keep each focused card locally complete; add the only real-work card. |
| Catalog | `README.md`, `collections/**/README.md`, new `collections/real-work/README.md` | Project the 21 cards into ten thematic, three interview, and one real-work collection without membership drift. |
| GRACE architecture | `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml` | Record pending and implemented redesign phases, exact module contracts, verification surfaces, and catalog inventory. |
| Durable delivery evidence | Beads records under `frontend-livecoding-tasks-kln-card-simplification-spec` | Store candidate decisions, per-card migration evidence, wave dependencies, reports, and final audit status; do not create a parallel Markdown task tracker. |

## Wave Assignment

| Wave | Beads work units | Card slugs | Shared catalog scope |
| --- | --- | --- | --- |
| A — console and TypeScript | 8 cards | `immutable-category-totals`, `stable-product-sort`, `loop-closure-bindings`, `browser-event-loop-order`, `discriminated-load-state`, `typed-object-property`, `response-union-narrowing`, `validate-unknown-profile` | JavaScript and TypeScript thematic pages; any affected interview rows; their graph and verification facts. |
| B — browser and HTML/CSS | 8 cards | `this-callback-binding`, `stale-search-response`, `delegated-dynamic-list`, `idempotent-event-listeners`, `accessible-keyboard-tabs`, `modal-focus-lifecycle`, `flex-long-text-overflow`, `container-responsive-grid` | JavaScript browser, HTML/CSS, and accessibility thematic pages; any affected interview rows; their graph and verification facts. |
| C — React and real work | 5 cards | `react-derived-list`, `react-batched-counter`, `react-effect-subscription`, `react-strictmode-cleanup`, `users-api-list` | React thematic pages, new real-work page, root hub, any affected interview rows, and final catalog/graph/verification facts. |

### Task 1: Recover the approved design and create durable work boundaries

**Files:**
- Modify: Beads records only.
- Read: `docs/superpowers/specs/2026-07-23-task-card-simplification-design.md`, `AGENTS.md`, `docs/task-validation-policy.md`, current cards and collections.

**Interfaces:**
- Consumes: approved design issue `frontend-livecoding-tasks-kln-card-simplification-spec` and the frozen set of twenty existing stable slugs.
- Produces: one claimed parent issue, three serialized wave issues, twenty-one card issues, explicit dependencies, and an evidence format used by every later task.

- [ ] **Step 1: Reconfirm the isolated baseline and remote base**

Run:

```bash
git fetch origin
git status --short --branch
git rev-list --left-right --count origin/main...HEAD
git merge-base --is-ancestor origin/main HEAD
```

Expected: a clean `feature/frontend-livecoding-tasks-kln` worktree; `origin/main` is an ancestor of `HEAD`; record the divergence before edits.

- [ ] **Step 2: Inspect the design issue and current candidate inventory before mutating Beads**

Run:

```bash
bd prime
bd show frontend-livecoding-tasks-kln-card-simplification-spec
find tasks -mindepth 2 -maxdepth 2 -name README.md | sort | wc -l
find collections -mindepth 3 -maxdepth 3 -name README.md | sort | wc -l
```

Expected: the issue points to the approved design; the baseline is exactly 20 cards and 13 collection pages.

- [ ] **Step 3: Claim the approved redesign and create the wave hierarchy**

Run the following commands. The variables make the returned durable IDs, rather than invented prose placeholders, the inputs to the dependency graph:

```bash
bd update frontend-livecoding-tasks-kln-card-simplification-spec --claim
contractIssueId="$(bd create --silent --parent frontend-livecoding-tasks-kln-card-simplification-spec --type task --priority 1 --title 'Prepare concise-card contract and migration gates' --acceptance 'Target template, compatibility state, GRACE phases, and validation commands are explicit without marking future card facts implemented.')"
waveAId="$(bd create --silent --parent frontend-livecoding-tasks-kln-card-simplification-spec --type task --priority 1 --title 'Publish concise-card wave A' --acceptance 'All eight named JavaScript and TypeScript cards have local deterministic PASS evidence, synchronized projections, a focused pushed commit, and a wave report; any failed local gate keeps the wave open.')"
waveBId="$(bd create --silent --parent frontend-livecoding-tasks-kln-card-simplification-spec --type task --priority 1 --title 'Publish concise-card wave B' --acceptance 'All eight named browser and HTML/CSS cards have local deterministic PASS evidence, synchronized projections, a focused pushed commit, and a wave report; any failed local gate keeps the wave open.')"
waveCId="$(bd create --silent --parent frontend-livecoding-tasks-kln-card-simplification-spec --type task --priority 1 --title 'Publish concise-card wave C and catalog cutover' --acceptance 'Four React cards and users-api-list have local deterministic PASS evidence; fourteen collections, all GRACE projections, the root hub, final local audit, and final-review handoff are internally consistent; any failed local gate keeps the wave open.')"
printf '%s\n' "$contractIssueId" "$waveAId" "$waveBId" "$waveCId"
```

- [ ] **Step 4: Create every card issue and wire the graph with the returned IDs**

Run this complete command block. It creates one independently reviewable work unit for every stable slug, makes it depend on contract preparation, and makes its enclosing wave wait for it:

```bash
createCardIssue() {
  waveId="$1"
  cardTitle="$2"
  cardId="$(bd create --silent --parent "$waveId" --type task --priority 1 --title "$cardTitle" --acceptance 'Card has the concise structure, retained one central action, complete Markdown-only CardMigrationEvidence, exactly one thematic projection, allowed optional memberships, graph/verification synchronization, and no unsupported boilerplate.')"
  bd dep add "$cardId" "$contractIssueId"
  bd dep add "$waveId" "$cardId"
}
createCardIssue "$waveAId" 'Simplify immutable-category-totals'
createCardIssue "$waveAId" 'Simplify stable-product-sort'
createCardIssue "$waveAId" 'Simplify loop-closure-bindings'
createCardIssue "$waveAId" 'Simplify browser-event-loop-order'
createCardIssue "$waveAId" 'Simplify discriminated-load-state'
createCardIssue "$waveAId" 'Simplify typed-object-property'
createCardIssue "$waveAId" 'Simplify response-union-narrowing'
createCardIssue "$waveAId" 'Simplify validate-unknown-profile'
createCardIssue "$waveBId" 'Simplify this-callback-binding'
createCardIssue "$waveBId" 'Simplify stale-search-response'
createCardIssue "$waveBId" 'Simplify delegated-dynamic-list'
createCardIssue "$waveBId" 'Simplify idempotent-event-listeners'
createCardIssue "$waveBId" 'Simplify accessible-keyboard-tabs'
createCardIssue "$waveBId" 'Simplify modal-focus-lifecycle'
createCardIssue "$waveBId" 'Simplify flex-long-text-overflow'
createCardIssue "$waveBId" 'Simplify container-responsive-grid'
createCardIssue "$waveCId" 'Simplify react-derived-list'
createCardIssue "$waveCId" 'Simplify react-batched-counter'
createCardIssue "$waveCId" 'Simplify react-effect-subscription'
createCardIssue "$waveCId" 'Simplify react-strictmode-cleanup'
createCardIssue "$waveCId" 'Add users-api-list real-work task'
bd dep add "$waveBId" "$waveAId"
bd dep add "$waveCId" "$waveBId"
bd graph check --json
```

Expected: no cycles, every card has an independently reviewable issue, and waves cannot close out of order.

- [ ] **Step 5: Persist the Beads graph without staging a passive export blindly**

```bash
bd graph check --json
bd dolt status
bd dolt push
git status --short
```

Expected: Beads reports a clean graph and a successful configured Dolt push. A Beads-only update is not a reason to create an empty Git commit; stage a changed `.beads` export only when `git status` actually lists it. If the configured remote is unavailable, record `BLOCKED` evidence and do not represent the graph as synchronized.

### Task 2: Stage the concise-card contract without falsifying the current catalog

**Files:**
- Modify: `AGENTS.md`, `templates/task-template.md`, `docs/task-validation-policy.md`, `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`.

**Interfaces:**
- Consumes: design sections 4–8 and 11–14; Task 1 issue IDs.
- Produces: a target `ConciseStudentTaskCard` migration contract, phases and gates marked `planned`/`in_progress` only, and deterministic checks that distinguish legacy cards during the temporary migration state from completed concise cards.

- [ ] **Step 1: Demonstrate why a temporary migration state is needed**

Run:

```bash
rg -l 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?' tasks/*/README.md | wc -l
find collections -mindepth 3 -maxdepth 3 -name README.md | sort | wc -l
```

Expected: all twenty baseline cards still contain legacy card-contract material and there are 13 collections; this is a known intermediate condition, not a failure to hide.

- [ ] **Step 2: Replace the template with the exact target shapes**

In `templates/task-template.md`, retain only:

```text
# <title>

Откройте <target editor>, <exact transfer and runtime instruction>.

## Условие

<one complete minimal starter block or the minimum required HTML fragment plus JavaScript>

<three independent closed hints>
<closed Решение with only changed code, explanation, expected result, and manual check>
<closed five-field О задаче>
```

Add a separate real-work variant with sequential visible requirements and the same disclosure/metadata order. Do not restore legacy navigation, readiness, self-check, theory, or harness sections.

- [ ] **Step 3: Make validation precise and transitional**

Update `docs/task-validation-policy.md` and `AGENTS.md` to define `ConciseStudentTaskCard`, the five format values, JavaScript/minimal-markup rules, real-work membership, 14-page catalog target, and the target 21-card inventory. Define a compatibility list containing exactly the twenty pre-existing slugs while phases 16–19 are incomplete; it permits legacy structure only for those named cards and must be removed by Task 6. Add deterministic commands that reject legacy markers, a fourth hint, an `open` attribute, full JavaScript HTML documents, invalid metadata, duplicate thematic membership, and an unsupported real-work membership after cutover.

- [ ] **Step 4: Add pending GRACE architecture and verification records**

Update the six XML artifacts with unique tags for new pending phases and gates:

```xml
<Phase-16 name="ConciseContractPreparation" status="planned">...</Phase-16>
<Phase-17 name="ConciseWaveA" status="planned">...</Phase-17>
<Phase-18 name="ConciseWaveB" status="planned">...</Phase-18>
<Phase-19 name="ConciseWaveCAndCatalogCutover" status="planned">...</Phase-19>
<Phase-20 name="ConciseLocalAudit" status="planned">...</Phase-20>
```

Give each phase a matching `Gate-Phase-*`, an observable goal, exact artifact checks, `BLOCKED` stop conditions, and links to `M-GOVERNANCE`, `M-TASK-TEMPLATE`, `M-TASK-VALIDATION`, `M-TASK-LIBRARY`, and `M-CATALOG`. Update existing module contracts rather than inventing a parallel runtime module; every new public fact needs matching development-plan, verification-plan, knowledge-graph, and operational-packet text.

- [ ] **Step 5: Validate the staged contract before card edits**

Run:

```bash
xmllint --noout docs/requirements.xml docs/technology.xml docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
rg -n '[T]ODO|[T]BD|implement[[:space:]]later|fill[[:space:]]in[[:space:]]details' AGENTS.md templates/task-template.md docs/*.xml docs/task-validation-policy.md
git diff --check
```

Expected: valid XML, no placeholder match, and no whitespace error. The legacy-marker command from Step 1 still finds baseline cards because the compatibility state is explicit.

- [ ] **Step 6: Commit the staged governance contract**

```bash
git add AGENTS.md templates/task-template.md docs/task-validation-policy.md docs/requirements.xml docs/technology.xml docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
git commit -m "docs: stage concise task card contract"
```

### Task 3: Execute Wave A as eight independently evidenced concise migrations

**Files:**
- Modify: `tasks/immutable-category-totals/README.md`, `tasks/stable-product-sort/README.md`, `tasks/loop-closure-bindings/README.md`, `tasks/browser-event-loop-order/README.md`, `tasks/discriminated-load-state/README.md`, `tasks/typed-object-property/README.md`, `tasks/response-union-narrowing/README.md`, `tasks/validate-unknown-profile/README.md`.
- Modify when source facts change: `collections/javascript/arrays-and-objects/README.md`, `collections/javascript/this-and-closures/README.md`, `collections/javascript/event-loop-and-async/README.md`, `collections/typescript/type-modeling/README.md`, `collections/typescript/narrowing-and-validation/README.md`, affected `collections/interviews/*/README.md`, `docs/knowledge-graph.xml`, `docs/verification-plan.xml`, and Wave A Beads records.

**Interfaces:**
- Consumes: Task 2 concise-card contract, fixed editor profile map, and one claimed Beads issue per slug.
- Produces: eight focused cards and eight complete evidence records; each keeps its source title, central action, profile, thematic ownership, and current duration unless a review-backed product decision says otherwise.

- [ ] **Step 1: Capture each source contract before shortening it**

For every Wave A card, record its source learning goal, prerequisite, runtime assumption, title, duration, profile, thematic and interview memberships in its Beads issue. Use these target central actions:

| Slug | Preserve as the one visible action | Target editor |
| --- | --- | --- |
| `immutable-category-totals` | calculate category totals without mutating the input | Programiz |
| `stable-product-sort` | repair stable two-key product sorting | Programiz |
| `loop-closure-bindings` | predict closures created inside a loop | Programiz |
| `browser-event-loop-order` | predict browser synchronous, microtask, and timer order | CodePen classic script |
| `discriminated-load-state` | model mutually exclusive loading states with a discriminated union | TypeScript Playground |
| `typed-object-property` | retain the exact value type for a generic object key | TypeScript Playground |
| `response-union-narrowing` | safely narrow a success/error response union | TypeScript Playground |
| `validate-unknown-profile` | validate unknown JSON into a typed profile without assertion | TypeScript Playground |

- [ ] **Step 2: Rewrite one card at a time and stop on a non-focused finding**

For each claimed card issue, complete this serial microcycle before claiming the next: write a single visible `Условие`; keep only minimal copy-ready starter context; write three distinct closed hints; show only the changed code in `Решение`; keep the exact five metadata fields; run local deterministic Markdown checks; then update its collection, `export-<slug>`, verification fact, and `CardMigrationEvidence`. Record both target-editor result fields as `NOT_RUN: Markdown-only delivery`. A fresh reviewer must accept that one card's local evidence before the next card changes shared files. If a card cannot be reduced to the listed action without changing its meaning, mark its Beads issue `BLOCKED` and do not substitute a new goal.

- [ ] **Step 3: Run local structural and content evidence for each card**

For each claimed slug, review the `Условие`, starter, solution, expected result, and manual check for internal consistency, record external execution as `NOT_RUN: Markdown-only delivery`, then run:

```bash
for cardFile in tasks/{immutable-category-totals,stable-product-sort,loop-closure-bindings,browser-event-loop-order,discriminated-load-state,typed-object-property,response-union-narrowing,validate-unknown-profile}/README.md; do
  test "$(rg -c '<summary>Подсказка [123] —' "$cardFile")" -eq 3
  ! rg -q 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?|<details open' "$cardFile"
done
```

Expected: all eight cards pass the concise structure check. Only a failed or contradictory local gate prevents the wave from closing; editor/browser availability is out of scope.

- [ ] **Step 4: Synchronize projections without changing unrelated memberships**

Update a collection row only when title, exact duration, or membership changes; retain every unaffected interview row. For each card, update its `export-<slug>` graph annotation and its verification fact in the same change, then verify:

```bash
for slug in immutable-category-totals stable-product-sort loop-closure-bindings browser-event-loop-order discriminated-load-state typed-object-property response-union-narrowing validate-unknown-profile; do
  test "$(rg -l "tasks/$slug/README\.md" collections | wc -l | tr -d ' ')" -ge 1
  test "$(rg -c "export-$slug" docs/knowledge-graph.xml)" -eq 1
done
```

- [ ] **Step 5: Commit and close the Wave A technical gate only after all eight records agree**

```bash
xmllint --noout docs/knowledge-graph.xml docs/verification-plan.xml
git diff --check
git add tasks collections docs/knowledge-graph.xml docs/verification-plan.xml
git commit -m "docs(tasks): simplify wave A cards"
```

Push the focused commit, add the complete local-evidence Wave A report to Beads, run `bd dolt push`, set the wave technical status to `accepted`, and close only card issues whose local verdict is `PASS`.

### Task 4: Execute Wave B as eight independently evidenced browser migrations

**Files:**
- Modify: `tasks/this-callback-binding/README.md`, `tasks/stale-search-response/README.md`, `tasks/delegated-dynamic-list/README.md`, `tasks/idempotent-event-listeners/README.md`, `tasks/accessible-keyboard-tabs/README.md`, `tasks/modal-focus-lifecycle/README.md`, `tasks/flex-long-text-overflow/README.md`, `tasks/container-responsive-grid/README.md`.
- Modify when source facts change: `collections/javascript/this-and-closures/README.md`, `collections/javascript/event-loop-and-async/README.md`, `collections/javascript/dom-and-events/README.md`, `collections/html-css/accessibility/README.md`, `collections/html-css/layout/README.md`, affected interviews, `docs/knowledge-graph.xml`, `docs/verification-plan.xml`, and Wave B Beads records.

**Interfaces:**
- Consumes: Wave A closed with technical `accepted` status, Task 2 contract, and fixed student-facing editor instructions.
- Produces: eight concise browser-oriented cards with local Markdown evidence; no CSS appearance assertion is introduced.

- [ ] **Step 1: Record the eight source contracts and retain only their central behavior**

| Slug | Preserve as the one visible action | Target editor |
| --- | --- | --- |
| `this-callback-binding` | explain the observed `this` values for method, arrow, and detached callback calls | CodePen browser ESM |
| `stale-search-response` | prevent a stale search response from replacing the latest result | CodePen browser ESM |
| `delegated-dynamic-list` | remove dynamically added rows via event delegation | CodePen browser ESM |
| `idempotent-event-listeners` | make repeated initialization avoid duplicate listener effects | CodePen browser ESM |
| `accessible-keyboard-tabs` | add ARIA tab semantics and keyboard navigation | CodePen browser ESM |
| `modal-focus-lifecycle` | retain and restore focus through a dialog lifecycle | CodePen browser ESM |
| `flex-long-text-overflow` | repair long-word behavior in a flex row | CodePen HTML/CSS |
| `container-responsive-grid` | make grid columns respond to container width | CodePen HTML/CSS |

For each claimed card issue, complete this serial microcycle before the next: capture source facts; reduce only the listed central behavior; review the Markdown condition/starter/solution/manual-check contract; record external execution as `NOT_RUN: Markdown-only delivery`; update the exact collection/graph/verification/Beads projections; and obtain a fresh reviewer gate. A requirement that is still essential but makes the card a mini-project stops the card issue for a user decision rather than silently reclassifying it.

- [ ] **Step 2: Apply the minimal-markup rule to each card**

Use a separate minimal HTML fragment only when the DOM itself is necessary input; place JavaScript in a JavaScript block and never include a full document, embedded style/script wrapper, or decorative CSS. For HTML/CSS cards, retain only the element fragment and CSS needed for the stated layout behavior. Keep browser/runtime assumptions next to the editor transfer instruction.

- [ ] **Step 3: Verify the browser-behavior contract locally in Markdown**

Confirm that each event, focus, stale-response, accessibility, or layout flow is fully stated in `Условие`, implemented in the solution, and covered by the written expected result/manual check. Do not run CodePen or a browser. Do not add `getComputedStyle`, stylesheet parsing, media-query, or pixel assertions to repository tests.

- [ ] **Step 4: Run the deterministic concise-card and no-full-document checks**

```bash
for cardFile in tasks/{this-callback-binding,stale-search-response,delegated-dynamic-list,idempotent-event-listeners,accessible-keyboard-tabs,modal-focus-lifecycle,flex-long-text-overflow,container-responsive-grid}/README.md; do
  test "$(rg -c '<summary>Подсказка [123] —' "$cardFile")" -eq 3
  ! rg -q 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?|<!doctype|<html|<head|<body|<script|<style|<details open' "$cardFile"
done
```

Expected: all cards have concise disclosure; the JavaScript/DOM prohibitions are absent. If a CSS card needs a `style` construct as its starter CSS, keep CSS in a CSS code fence rather than an HTML document.

- [ ] **Step 5: Synchronize, publish, and technically close Wave B**

Update only changed collection/interview rows, each matching graph export and verification fact, and all Beads evidence. Then run:

```bash
xmllint --noout docs/knowledge-graph.xml docs/verification-plan.xml
git diff --check
git add tasks collections docs/knowledge-graph.xml docs/verification-plan.xml
git commit -m "docs(tasks): simplify wave B cards"
```

Push, record one local-evidence Wave B report, run `bd dolt push`, and close only `PASS` card issues and the Wave B issue after every local technical gate passes.

### Task 5: Execute Wave C and add the single real-work card

**Files:**
- Modify: `README.md`, `tasks/react-derived-list/README.md`, `tasks/react-batched-counter/README.md`, `tasks/react-effect-subscription/README.md`, `tasks/react-strictmode-cleanup/README.md`, `collections/react/state-and-derived-data/README.md`, `collections/react/effects-and-lifecycle/README.md`, affected interviews, `docs/knowledge-graph.xml`, `docs/verification-plan.xml`, and Wave C Beads records.
- Create: `tasks/users-api-list/README.md`, `collections/real-work/README.md`.

**Interfaces:**
- Consumes: Wave B technical acceptance; React TypeScript profile; the explicit DummyJSON contract from design section 9.
- Produces: four concise focused React cards plus one 60-minute `Приближённая к реальной работе` React card with a fixed 10-item page size, deliberate search submit, and complete Markdown coverage of all required request states.

- [ ] **Step 1: Reduce the four existing React cards to their independent central action**

| Slug | Preserve as the one visible action |
| --- | --- |
| `react-derived-list` | derive a filtered list instead of storing a duplicate |
| `react-batched-counter` | repair updates that depend on previous state |
| `react-effect-subscription` | synchronize a subscription with its selected channel and cleanup |
| `react-strictmode-cleanup` | make cleanup safe for root StrictMode's extra cycle |

Use one complete `src/App.tsx` starter block for each. Preserve React version/runtime assumptions next to the Vite transfer instruction; do not add separate files merely to show architecture.

For each claimed existing React card, complete the same serial microcycle as Wave A: source-fact capture, concise rewrite, local Markdown evidence, projection/evidence synchronization, then a fresh reviewer gate before the next shared-file edit.

- [ ] **Step 2: Perform duplicate and collection-capacity review before creating `users-api-list`**

Run:

```bash
rg -n -i 'fetch\(|axios|pagination|пагинац|search|поиск|stale|устарев' tasks collections
test ! -e tasks/users-api-list/README.md
test ! -e collections/real-work/README.md
```

Expected: no existing card duplicates the combined React remote-resource workflow; the two target paths do not yet exist. If a duplicate or ambiguous primary collection is found, record the evidence in the card issue and stop for a product decision.

- [ ] **Step 3: Author the real-work card with its fixed public contract**

Create `tasks/users-api-list/README.md` with title `Список пользователей из API`, a `React/TypeScript` / `Приближённая к реальной работе` / `Продвинутая` / `60 минут` metadata block, and an editor instruction for `https://vite.new/react-ts`. Its one minimal `src/App.tsx` starter must not contain CSS, tests, a fetch hook, or a solution architecture.

Its visible sequential requirements must require exactly:

```text
GET /users?limit=10&skip=<offset>
GET /users/search?q=<query>&limit=10&skip=<offset>
response: users, total, skip, limit
```

They must require name/email/avatar rendering, bounded previous/next pagination from `total`, `limit`, and `skip`, form-submitted search, first-page reset on a new submitted query, separate loading/error/empty states, and no prior-query data presented as the new result. Link the official DummyJSON users documentation; do not copy its whole documentation into the card.

- [ ] **Step 4: Validate the React and DummyJSON contract in repository Markdown**

For all five cards, compare visible requirements, starter, solution, expected result, and manual check without opening Vite, a browser, or the live API. For `users-api-list`, verify that the Markdown contract locally covers list display, next/previous boundaries, submitted search, page reset, no-result, loading, error, and delayed/stale-response states. Record external execution as `NOT_RUN: Markdown-only delivery` and do not add diagnostic endpoint substitution to the published starter.

- [ ] **Step 5: Add and synchronize the real-work catalog entry**

Create `collections/real-work/README.md` with only confirmed real-work entries, initially the linked `Список пользователей из API` and exact `60 минут`. Add the same card exactly once to `collections/react/effects-and-lifecycle/README.md`; do not add it to an interview collection without a separate decision. In the same commit, append the real-work link as the final item under root `Подборки по направлениям`, describe it as a separate practical format rather than an eleventh thematic direction, and preserve the root's four headings, ten thematic links, three interview links, and four editor links. Add one graph export with `THEMATIC_COLLECTION="collection-effects-and-lifecycle"` and `REAL_WORK_COLLECTION="collection-real-work"`, plus matching verification facts and Beads evidence.

- [ ] **Step 6: Commit Wave C only after all five cards and the new collection agree**

```bash
xmllint --noout docs/knowledge-graph.xml docs/verification-plan.xml
test "$(find tasks -mindepth 2 -maxdepth 2 -name README.md | wc -l | tr -d ' ')" -eq 21
test "$(find collections -mindepth 3 -maxdepth 3 -name README.md | wc -l | tr -d ' ')" -eq 14
git diff --check
git add README.md tasks collections docs/knowledge-graph.xml docs/verification-plan.xml
git commit -m "docs(tasks): simplify wave C and add real-work task"
```

### Task 6: Atomically cut over the root, final contract, and GRACE facts

**Files:**
- Modify: `AGENTS.md`, `templates/task-template.md`, `docs/task-validation-policy.md`, `docs/requirements.xml`, `docs/technology.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`, relevant Beads records.

**Interfaces:**
- Consumes: PASS evidence for all 21 cards, synchronized catalog projections, and all three wave reports.
- Produces: the live concise contract, a verified root hub that links 14 collection pages, completed Phase 16–19 facts, a planned Phase 20 audit, and no compatibility exception.

- [ ] **Step 1: Revalidate the root hub included in Wave C**

Keep exactly these headings:

```text
## Как пользоваться базой
## Подборки по направлениям
## Симуляции собеседований
## Где писать код
```

Confirm that the Wave C commit already appended the real-work link as the final item under `Подборки по направлениям` and describes it as a separate practical format, not an eleventh thematic direction. Retain all ten thematic links, three interview links, and four approved editor links; do not add task tables or maintenance prose.

- [ ] **Step 2: Remove only the now-expired migration compatibility clause**

Delete the twenty-slug legacy exception from `AGENTS.md` and `docs/task-validation-policy.md` only after the final structural scan proves every card is concise. Make `ConciseStudentTaskCard` the only live card contract and ensure the new `Приближённая к реальной работе` format, collection inventory 14, and task inventory 21 appear consistently in every shared artifact.

- [ ] **Step 3: Mark only completed GRACE work implemented**

Change Phase/Gate 16 through 19 from `planned` or `in_progress` to `implemented` only when their attached local evidence exists. Leave Phase/Gate 20 pending until Task 7 completes the current local catalog audit. Update `M-TASK-TEMPLATE`, `M-TASK-VALIDATION`, `M-TASK-LIBRARY`, `M-CATALOG`, and `M-GOVERNANCE` contracts, maps, cross-links, operational packets, risks, and verification expectations so they no longer mention removed navigation, readiness, self-check, legacy card count, the old 13-collection inventory, or mandatory external-editor/browser/GitHub-rendered gates.

- [ ] **Step 4: Prove the cutover deterministically**

Run:

```bash
test "$(rg -n '^## ' README.md | wc -l | tr -d ' ')" -eq 4
test "$(rg -c ']\(collections/.*/README\.md\)' README.md)" -eq 14
test "$(rg -c 'https://www\.programiz\.com/javascript/online-compiler/|https://pen\.new|https://www\.typescriptlang\.org/play/|https://vite\.new/react-ts' README.md)" -eq 4
test "$(find tasks -mindepth 2 -maxdepth 2 -name README.md | wc -l | tr -d ' ')" -eq 21
test "$(find collections -mindepth 3 -maxdepth 3 -name README.md | wc -l | tr -d ' ')" -eq 14
test "$(find tasks -mindepth 2 -maxdepth 2 -name README.md -print0 | xargs -0 rg -l 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?|<details open' | wc -l | tr -d ' ')" -eq 0
while IFS= read -r cardFile; do
  slug="${cardFile#tasks/}"
  slug="${slug%/README.md}"
  test "$(rg -c '^- Технология:|^- Подборка:|^- Формат:|^- Сложность:|^- Примерное время:' "$cardFile")" -eq 5
  test "$(rg -l "tasks/$slug/README\.md" collections/javascript collections/typescript collections/html-css collections/react | wc -l | tr -d ' ')" -eq 1
done < <(find tasks -mindepth 2 -maxdepth 2 -name README.md | sort)
test "$(rg -c 'tasks/users-api-list/README\.md' collections/real-work/README.md)" -eq 1
xmllint --noout docs/requirements.xml docs/technology.xml docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
git diff --check
```

Expected: all zero/21/14/4 assertions pass, every card has exactly five metadata rows and one thematic collection, and `users-api-list` appears exactly once in the real-work collection. Any mismatch restores the compatibility state only if needed to report the failure; it does not authorize publishing a mixed contract as complete.

- [ ] **Step 5: Commit the catalog and contract cutover**

```bash
git add AGENTS.md templates/task-template.md docs/task-validation-policy.md docs/requirements.xml docs/technology.xml docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
git commit -m "docs: cut over concise task card catalog"
```

### Task 7: Run the final local catalog and release gate without inferring human acceptance

**Files:**
- Modify: `docs/verification-plan.xml`, `docs/development-plan.xml`, `docs/knowledge-graph.xml`, `docs/operational-packets.xml`, and Beads evidence only if the audit yields new factual results.

**Interfaces:**
- Consumes: Tasks 1–6, pushed focused commits, all Markdown-only evidence records, and the full 21-card/14-collection inventory.
- Produces: a Phase 20 local-audit verdict, current branch divergence, a final-review handoff, and an open final-acceptance decision.

- [ ] **Step 1: Re-run the full deterministic catalog audit**

Run:

```bash
for cardFile in tasks/*/README.md; do
  test "$(rg -c '<summary>Подсказка [123] —' "$cardFile")" -eq 3
  test "$(rg -c '<summary>Решение</summary>' "$cardFile")" -eq 1
  test "$(rg -c '<summary>О задаче</summary>' "$cardFile")" -eq 1
  test "$(rg -c '^- Технология:|^- Подборка:|^- Формат:|^- Сложность:|^- Примерное время:' "$cardFile")" -eq 5
done
rg -n 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?|<details open' tasks
xmllint --noout docs/*.xml
git diff --check
```

Expected: the first three assertions pass for every card; the `rg` command has no matches; XML and whitespace checks pass.

- [ ] **Step 2: Revalidate local card-content evidence**

For every card, compare `Условие`, starter, hints, solution, expected result, manual check, metadata, and collection projection directly in repository Markdown. For the DummyJSON card, verify the endpoint shapes and all required states against the approved local contract without calling the live API. Record both target-editor result fields as `NOT_RUN: Markdown-only delivery`; only a failed or contradictory local check can block Phase 20.

- [ ] **Step 3: Audit local Markdown student flows**

Inspect the source Markdown for the root hub, all 14 collection pages, and all 21 card pages. Confirm heading and relative-link targets, paired closed `<details>`, language-tagged code fences, the one real-work projection, title/duration consistency, and absence of removed boilerplate. Record each repository path, title, result, and remaining risk in the final audit evidence.

- [ ] **Step 4: Record only factual audit status before publishing it**

If and only if Steps 1–3 have current local `PASS` evidence, change Phase/Gate 20 to `implemented`; otherwise record its exact `BLOCKED` reason and leave it pending. Then commit only the factual audit deltas:

```bash
git add docs/development-plan.xml docs/verification-plan.xml docs/knowledge-graph.xml docs/operational-packets.xml
git commit -m "docs: record concise card audit"
```

- [ ] **Step 5: Publish the reviewed branch and update the draft pull request**

Run:

```bash
git fetch origin
git status --short --branch
git rev-list --left-right --count origin/main...HEAD
git log --oneline origin/main..HEAD
```

Push the active feature branch and update the draft pull request targeting `main`. If any required evidence is `BLOCKED`, preserve Phase 20 as blocked/pending and do not claim a technically complete redesign.

- [ ] **Step 6: Leave human acceptance explicitly open**

Add the reviewed commit, audit evidence location, branch divergence, and known risks to `frontend-livecoding-tasks-kln-final-acceptance`. Do not close it or the top-level story; request the user's explicit final library decision after the audit.

## Plan Self-Review

### Spec coverage

| Design area | Plan coverage |
| --- | --- |
| Status, goal, non-goals | Global Constraints; Tasks 1 and 7 preserve the open final decision and prohibit unsupported tooling/history changes. |
| Focused and real-work classes | Global Constraints; Tasks 2–5 encode the duration, central-action, and cross-cutting collection rules. |
| Concise StudentTaskCard, JavaScript, TypeScript, HTML/CSS, React rules | Task 2 establishes the template/policy; Tasks 3–5 apply and validate them. |
| Progressive hints and solution boundaries | Tasks 2–5 require exactly three closed hints and changed-code-only solutions. |
| Metadata and catalog | Tasks 2, 5, and 6 control values, 21 cards, fourteen collections, and root-hub structure. |
| DummyJSON task | Task 5 fixes identity, API, query semantics, all states, stale-response protection, and complete local Markdown evidence. |
| Existing-card migration | Wave Assignment and Tasks 3–5 name all twenty slugs and their central action. |
| Verification, stop conditions, local audit | Global Constraints and Tasks 2–7 give Markdown, collection, XML, Beads, and `BLOCKED` paths without external-editor or rendered-page gates. |
| GRACE, Beads, branches, release | Tasks 1, 2, 6, and 7 define issue dependencies, artifacts, phase truthfulness, commits, pushes, PR, and final acceptance handoff. |

No spec requirement is intentionally omitted.

### Placeholder scan

Run:

```bash
rg -n -i '[T]ODO|[T]BD|implement[[:space:]]later|fill[[:space:]]in[[:space:]]details|add[[:space:]]appropriate[[:space:]]error[[:space:]]handling|write[[:space:]]tests[[:space:]]for[[:space:]]the[[:space:]]above|similar[[:space:]]to[[:space:]]task' docs/superpowers/plans/2026-07-24-task-card-simplification.md
```

Expected: no matches.

### Interface consistency

`ConciseStudentTaskCard`, `CardMigrationEvidence`, the five card metadata labels, the five permitted format values, the `8 + 8 + 5` wave sizes, the `21` task inventory, the `14` collection inventory, and `users-api-list` appear consistently throughout this plan. Every implementation phase has a matching verification and Beads evidence path.
