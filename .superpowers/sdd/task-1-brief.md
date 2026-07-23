### Task 1: R1 — Local Checkout Proof and Student Content Contract

**Files:**

- Modify: `AGENTS.md`
- Modify: `templates/task-template.md`
- Modify: `docs/task-validation-policy.md`
- Modify: `docs/requirements.xml`
- Modify: `docs/technology.xml`
- Modify: `docs/development-plan.xml`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/operational-packets.xml`
- Track: Beads issues `frontend-livecoding-tasks-kln-student-r1-contract` through `frontend-livecoding-tasks-kln-student-r8-rendered-audit`

**Interfaces:**

- Consumes: approved spec `docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md`; current modules `M-GOVERNANCE`, `M-TASK-TEMPLATE`, `M-TASK-VALIDATION`, `M-TASK-LIBRARY`, `M-CATALOG`.
- Produces: exact `StudentTaskCard`, `CollectionEntry`, `CardMigrationEvidence`, editor-profile map, pending `Phase-8`–`Phase-15`, and serialized Beads dependency chain.

- [ ] **Step 1: Re-run the local checkout preflight**

Run the commands from `Mandatory Local Handoff Before Task 1`.

Expected: every local-checkout, branch, clean-state, ancestry and divergence assertion passes. Record the exact commit SHA in the R1 notes after R1 is created.

- [ ] **Step 2: Create the eight deterministic Beads units**

Each unit is resume-safe. Before each create, reuse the exact ID when it already
exists; if an existing issue has another parent, spec, scope or acceptance
contract, stop instead of overwriting it. Run:

```bash
bd show frontend-livecoding-tasks-kln-student-r1-contract >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r1-contract \
  --title "Define the student redesign contract" \
  --description "Update authoring, template, validation and GRACE planning contracts for the approved student experience redesign." \
  --acceptance "Root local checkout and story branch are proven; editor profiles, two card modes, preservation ledger, Phase-8 and Gate-Phase-8 are consistent; XML, GRACE lint and Markdown checks pass." \
  --type task --priority 1 \
  --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r2-collections >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r2-collections \
  --title "Create student collection pages" \
  --description "Create ten final thematic collection pages and three unlinked interview shells without changing the root README." \
  --acceptance "Exactly thirteen collection README files exist; thematic titles, descriptions, order, links and times are final; interview pages contain only the common contract; root README is unchanged." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r3-javascript >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r3-javascript \
  --title "Migrate JavaScript and DOM task cards" \
  --description "Migrate eight JavaScript and DOM cards to the approved student contract and inline the stale-search fixture." \
  --acceptance "All eight cards pass preservation, structure, copy-run, target-editor and content checks; stale-search-response fixture is removed only after replacement PASS." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r4-typescript >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r4-typescript \
  --title "Migrate TypeScript task cards" \
  --description "Migrate four TypeScript cards to the approved student contract and verify them in TypeScript Playground." \
  --acceptance "All four cards pass preservation, exact TypeScript 5.9 behavior, structure, target-editor and content checks." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r5-html-css >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r5-html-css \
  --title "Migrate HTML CSS and accessibility task cards" \
  --description "Migrate four HTML/CSS/accessibility cards and inline two text fixtures." \
  --acceptance "All four cards pass preservation, CodePen/browser and manual visual checks; accessible-keyboard-tabs and modal-focus-lifecycle fixtures are removed only after replacement PASS." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r6-react >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r6-react \
  --title "Migrate React task cards" \
  --description "Migrate four React TypeScript cards to complete src/App.tsx exercises and verify them in vite.new/react-ts." \
  --acceptance "All four cards pass preservation, React 19.2 behavior, copy-run, browser and content checks." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r7-cutover >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r7-cutover \
  --title "Publish interviews and cut over the student hub" \
  --description "Populate three interviews, synchronize all derived artifacts and atomically replace the root catalog with the student hub." \
  --acceptance "All thirteen collections and twenty cards are synchronized; root README has exactly four student blocks and no old catalog or agent prose; Phase-14 gate passes." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md

bd show frontend-livecoding-tasks-kln-student-r8-rendered-audit >/dev/null 2>&1 || \
bd create --id frontend-livecoding-tasks-kln-student-r8-rendered-audit \
  --title "Audit the rendered student experience" \
  --description "Push the final branch, audit every published page and complete deep GitHub-rendered student flows before requesting final user acceptance." \
  --acceptance "URL inventory covers root, thirteen collections and twenty cards; deep flow covers every technology, interview, card mode, editor profile and former fixture card; all results and remaining risks are recorded." \
  --type task --priority 1 --parent frontend-livecoding-tasks-kln \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md
```

Inspect the resulting records before wiring dependencies:

```bash
for id in \
  frontend-livecoding-tasks-kln-student-r1-contract \
  frontend-livecoding-tasks-kln-student-r2-collections \
  frontend-livecoding-tasks-kln-student-r3-javascript \
  frontend-livecoding-tasks-kln-student-r4-typescript \
  frontend-livecoding-tasks-kln-student-r5-html-css \
  frontend-livecoding-tasks-kln-student-r6-react \
  frontend-livecoding-tasks-kln-student-r7-cutover \
  frontend-livecoding-tasks-kln-student-r8-rendered-audit
do
  bd show "$id" --json
done
```

Expected: each issue is a child of `frontend-livecoding-tasks-kln`, references
the current student-experience spec and matches the title/scope/acceptance above.

Wire the chain:

```bash
bd dep list frontend-livecoding-tasks-kln-student-r2-collections --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r1-contract"' || bd dep add frontend-livecoding-tasks-kln-student-r2-collections frontend-livecoding-tasks-kln-student-r1-contract
bd dep list frontend-livecoding-tasks-kln-student-r3-javascript --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r2-collections"' || bd dep add frontend-livecoding-tasks-kln-student-r3-javascript frontend-livecoding-tasks-kln-student-r2-collections
bd dep list frontend-livecoding-tasks-kln-student-r4-typescript --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r3-javascript"' || bd dep add frontend-livecoding-tasks-kln-student-r4-typescript frontend-livecoding-tasks-kln-student-r3-javascript
bd dep list frontend-livecoding-tasks-kln-student-r5-html-css --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r4-typescript"' || bd dep add frontend-livecoding-tasks-kln-student-r5-html-css frontend-livecoding-tasks-kln-student-r4-typescript
bd dep list frontend-livecoding-tasks-kln-student-r6-react --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r5-html-css"' || bd dep add frontend-livecoding-tasks-kln-student-r6-react frontend-livecoding-tasks-kln-student-r5-html-css
bd dep list frontend-livecoding-tasks-kln-student-r7-cutover --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r6-react"' || bd dep add frontend-livecoding-tasks-kln-student-r7-cutover frontend-livecoding-tasks-kln-student-r6-react
bd dep list frontend-livecoding-tasks-kln-student-r8-rendered-audit --json | rg -q '"id": "frontend-livecoding-tasks-kln-student-r7-cutover"' || bd dep add frontend-livecoding-tasks-kln-student-r8-rendered-audit frontend-livecoding-tasks-kln-student-r7-cutover
bd update frontend-livecoding-tasks-kln-student-r1-contract --claim
```

Expected: eight child issues exist; only R1 is ready and `in_progress`.

- [ ] **Step 3: Replace the authoring and template contract**

Update `AGENTS.md`, `templates/task-template.md` and `docs/task-validation-policy.md` with these exact decisions:

1. Keep the general Git and branch policy unchanged.
2. Replace the old eight-field task-publication metadata contract with the five fields from `Global Constraints`.
3. Define the exact code-first and complex card order from `StudentTaskCard`.
4. Require one complete copy-ready starter block unless multiple real files are necessary.
5. Require `FILE:` in every starter and solution block when several files exist.
6. Define editor profiles and exact URLs:
   - Programiz: `https://www.programiz.com/javascript/online-compiler/`;
   - CodePen: `https://pen.new`;
   - TypeScript Playground: `https://www.typescriptlang.org/play/`;
   - React TypeScript: `https://vite.new/react-ts`.
7. Require exactly three distinct hints with summaries:
   - `Подсказка 1 — куда смотреть`;
   - `Подсказка 2 — с чего начать`;
   - `Подсказка 3 — почти решение`.
8. Require `CardMigrationEvidence` before a migrated card can pass.
9. Require target-editor evidence; a temporary harness is diagnostic only.
10. Replace old thematic-table synchronization with one thematic collection, zero-or-one interview, graph, verification and Beads synchronization.
11. Preserve the stop conditions in specification section 20.

The template must show both complete modes and use sentinel values only inside the template itself. The ordinary mode starts with editor instruction before `Условие`; the complex mode starts with a short `Условие`, then editor instruction and `Код — вставьте его в редактор`.

Expected: an author can create either mode without consulting an old task card, and no old metadata label is described as mandatory.

- [ ] **Step 4: Add the GRACE redesign planning delta**

Update all six `docs/*.xml` planning artifacts and `docs/operational-packets.xml`:

- add collection-first `UC`/`VF` coverage without removing historical use cases;
- replace current student-facing metadata and catalog descriptions with the approved five-field and collection contracts;
- add the four editor profiles and URLs;
- expand `M-CATALOG` to own `README.md` plus `collections/**`;
- update `M-TASK-TEMPLATE`, `M-TASK-LIBRARY`, `M-TASK-VALIDATION`;
- update `DF-STUDY-TASK`, `DF-ADD-TASK`, `DF-UPDATE-TASK`;
- append `Phase-8` `StudentRedesignContract` through `Phase-15` `StudentRenderedAudit`;
- append matching `Gate-Phase-8` through `Gate-Phase-15`;
- leave `Phase-1`–`Phase-6` completed and `Phase-7` pending;
- mark only R1 facts implemented; R2–R8 facts remain pending;
- add packet fields for mode, editor profile, preservation ledger, target-editor expected/actual/verdict and collection sync.

Expected: no module ID changes, no new module, no forward claim that collection pages or migrated cards already exist.

- [ ] **Step 5: Run R1 verification**

Run:

```bash
for file in docs/*.xml; do xmllint --noout "$file"; done
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
test -x "$GRACE_BIN"
"$GRACE_BIN" --version
"$GRACE_BIN" lint --fail-on errors --path "$PWD"
rg -n "Технологии|Тема|Уровень|Время|Навыки|Предварительные знания|Среда выполнения" templates/task-template.md docs/task-validation-policy.md AGENTS.md
rg -n "Подсказка 1 — куда смотреть|Подсказка 2 — с чего начать|Подсказка 3 — почти решение" templates/task-template.md
rg -n "https://www.programiz.com/javascript/online-compiler/|https://pen.new|https://www.typescriptlang.org/play/|https://vite.new/react-ts" AGENTS.md docs/technology.xml docs/task-validation-policy.md
git diff --check
```

Expected:

- XML and GRACE lint pass with zero errors;
- old labels may occur only in explicit migration/forbidden-label prose, never as the new mandatory template;
- each new hint summary is present;
- all four URLs are present in the synchronized contract;
- `git diff --check` exits 0.

- [ ] **Step 6: Commit, push and close R1**

Run:

```bash
git add AGENTS.md templates/task-template.md docs/task-validation-policy.md docs/*.xml
git commit -m "docs: define student redesign contract"
git push origin feature/frontend-livecoding-tasks-kln
R1_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r1-contract \
  --append-notes "PASS: local root checkout and story branch proven; XML valid; GRACE lint 0 errors; template, validation and editor profiles synchronized. Commit ${R1_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r1-contract --reason "Student redesign contract and Phase-8 gate verified"
```

Expected: focused commit is pushed; R1 is closed; only R2 becomes ready.

---

