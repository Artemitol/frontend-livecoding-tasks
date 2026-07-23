# Task Library Student Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить существующую библиотеку из 20 frontend-задач в короткий GitHub-first ученический путь через тематические и собеседовательные подборки, copy-ready карточки, три последовательные подсказки и проверенные ссылки на онлайн-редакторы.

**Architecture:** Существующие GRACE-модули сохраняются, но получают redesign phases `Phase-8`–`Phase-15` и gates `Gate-Phase-8`–`Gate-Phase-15`. Восемь последовательных Beads units R1–R8 сначала обновляют контракт, затем создают неподключённые collection pages, мигрируют четыре группы карточек, атомарно переключают корневой README и завершаются опубликованным rendered audit. Реализация выполняется только в корневом checkout проекта на существующей story-ветке; `.workspace` не используется.

**Tech Stack:** Markdown, GitHub-rendered HTML `<details>`, JavaScript, TypeScript 5.9, React 19.2, HTML/CSS, Beads (`bd`), GRACE CLI 3.11.0, `rg`, `find`, `xmllint`, Git.

## Global Constraints

- Рабочий путь: `/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks`.
- Рабочая ветка: `feature/frontend-livecoding-tasks-kln`; не создавать новую ветку для R1–R8.
- Выполнение из `.workspace/frontend-livecoding-tasks-kln` и создание нового linked worktree запрещены этой спецификацией.
- Прямые commit и push в `main` запрещены; force-push, rebase и переписывание опубликованной истории запрещены.
- Существующий draft PR story-ветки переиспользуется; новый PR не создаётся.
- Репозиторий остаётся Markdown-only: не добавлять package manager, постоянный runtime, validator, generator, CI, Docusaurus или deployment.
- Сохраняются все 20 существующих task slugs и учебные цели; новые задачи не создаются.
- Создаются ровно 10 thematic и 3 interview README; промежуточные README уровня технологии не создаются.
- Каждая задача входит ровно в одну thematic collection и не более чем в одно interview; 15 interview entries уникальны.
- Каждая карточка содержит ровно три закрытые подсказки, закрытые `Решение`, `Самопроверка` и `О задаче`.
- Metadata содержит ровно `Технология`, `Подборка`, `Формат`, `Сложность`, `Примерное время`.
- Допустимые технологии: `JavaScript`, `TypeScript`, `HTML/CSS`, `HTML/JavaScript`, `HTML/CSS/JavaScript`, `React/TypeScript`.
- Допустимые форматы: `Написать код`, `Исправить код`, `Разобрать код`, `Предсказать результат`.
- Допустимые сложности: `Базовая`, `Средняя`, `Продвинутая`.
- CSS и визуальное поведение проверяются вручную в браузере, а не unit-тестами.
- Недоступное обязательное browser/editor evidence означает `BLOCKED`, а не `PASS`.
- Исторические completed phases не переводятся обратно в pending.
- Пользовательские изменения, untracked-файлы и Beads state не удаляются, не stash-ятся и не переносятся без отдельного решения пользователя.

## Mandatory Local Handoff Before Task 1

Эти действия являются precondition, а не частью содержательной миграции:

1. В Codex выбрать `Hand off to local` для текущей story-ветки.
2. Открыть корневой checkout `/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks`.
3. Не удалять linked worktree shell-командой и не применять `--force`; handoff должен освободить ветку безопасно.
4. Выполнить:

```bash
cd /Users/artemiy/VsCode/mentor/frontend-livecoding-tasks
git rev-parse --show-toplevel
git branch --show-current
git rev-parse --git-dir
git rev-parse --git-common-dir
git status --short
git fetch origin
git merge-base --is-ancestor origin/main HEAD
git rev-list --left-right --count origin/main...HEAD
```

Expected:

- top-level равен `/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks`;
- branch равен `feature/frontend-livecoding-tasks-kln`;
- `--git-dir` и `--git-common-dir` дают один путь, то есть checkout не linked worktree;
- `git status --short` пуст;
- `origin/main` является предком `HEAD`;
- левое число divergence равно `0`.

Если хотя бы одно ожидание не выполнено, остановиться и показать фактический вывод. Не исправлять состояние через `reset`, `stash`, rebase, force-remove или удаление пользовательских файлов.

## File Responsibility Map

| Path | Responsibility | Owning unit |
| --- | --- | --- |
| `AGENTS.md` | Новый student-card, collection, editor-profile и update contract; task-scoped local-checkout exception остаётся в spec/plan, а не становится общей Git-политикой | R1 |
| `templates/task-template.md` | Два режима карточки, copy-ready code, три hints, solution, self-check и compact metadata | R1 |
| `docs/task-validation-policy.md` | Structural, preservation, target-editor, content, synchronization и rendered gates | R1 |
| `docs/requirements.xml` | Collection-first student journeys и acceptance criteria | R1, R7 |
| `docs/technology.xml` | Markdown-only contract, controlled vocabulary и editor profiles | R1 |
| `docs/development-plan.xml` | Обновлённые module contracts, data flows и `Phase-8`–`Phase-15` | R1, R7 |
| `docs/verification-plan.xml` | `Gate-Phase-8`–`Gate-Phase-15`, per-card evidence и final rendered audit | R1, R3–R8 |
| `docs/knowledge-graph.xml` | Collection exports, task annotations и cross-links только для фактически реализованных волн | R2–R7 |
| `docs/operational-packets.xml` | Packet schema для card migration, collection sync, preservation ledger и evidence | R1 |
| `collections/**/README.md` | 10 thematic pages и 3 interview pages | R2, R7 |
| `tasks/*/README.md` | 20 migrated student cards | R3–R6 |
| `tasks/*/assets/fixture.html` | Три текстовых fixture удаляются после подтверждённого inline replacement | R3, R5 |
| `README.md` | Короткий student hub; переключается только после завершения всех карточек | R7 |
| Beads R1–R8 records | Dependencies, claims, evidence, commits, closure и final handoff | R1–R8 |

## Stable Interfaces

`StudentTaskCard`:

```text
title
back-to-all-collections link
editor instruction
visible condition
one or more complete starter code blocks
observable "Готово, когда"
three independent closed hints
closed full solution and explanation
closed self-check questions
optional supplementary reading
closed five-field metadata
browser-back instruction and fallback link
```

`CollectionEntry`:

```text
linked student title
one plain-language sentence for thematic collections
exact integer duration copied from the card
```

`CardMigrationEvidence`:

```text
slug | mode | editor profile | source learning goal | source prerequisite |
source runtime assumption | destination locations | expected | actual | verdict
```

Later tasks consume these interfaces exactly; they must not invent alternative labels or field names.

---

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

### Task 2: R2 — Thematic Collections and Interview Shells

**Files:**

- Create: `collections/javascript/arrays-and-objects/README.md`
- Create: `collections/javascript/this-and-closures/README.md`
- Create: `collections/javascript/event-loop-and-async/README.md`
- Create: `collections/javascript/dom-and-events/README.md`
- Create: `collections/typescript/type-modeling/README.md`
- Create: `collections/typescript/narrowing-and-validation/README.md`
- Create: `collections/html-css/layout/README.md`
- Create: `collections/html-css/accessibility/README.md`
- Create: `collections/react/state-and-derived-data/README.md`
- Create: `collections/react/effects-and-lifecycle/README.md`
- Create: `collections/interviews/interview-01/README.md`
- Create: `collections/interviews/interview-02/README.md`
- Create: `collections/interviews/interview-03/README.md`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/verification-plan.xml`
- Track: `frontend-livecoding-tasks-kln-student-r2-collections`

**Interfaces:**

- Consumes: `CollectionEntry`; existing student titles and exact card durations.
- Produces: 10 final thematic pages, 3 unlinked interview shells, implemented `Phase-9` facts, and stable paths consumed by R3–R8.

- [ ] **Step 1: Claim R2 and verify R1**

```bash
bd show frontend-livecoding-tasks-kln-student-r1-contract
bd update frontend-livecoding-tasks-kln-student-r2-collections --claim
git status --short --branch
```

Expected: R1 is closed, R2 is `in_progress`, checkout is clean.

- [ ] **Step 2: Create all ten thematic pages from the exact matrix**

Every file contains, in order:

1. `# <Ученическое название>`;
2. the exact two-sentence introduction below;
3. `После задачи нажмите «Назад», чтобы вернуться к этому списку.`;
4. the exact ordered entries below.

| Path | Title | Introduction | Ordered entries |
| --- | --- | --- | --- |
| `collections/javascript/arrays-and-objects/README.md` | `Массивы и объекты` | `Потренируйтесь преобразовывать коллекции без неожиданных мутаций. Задачи идут от прямой агрегации к сортировке по нескольким правилам.` | `Итоги по категориям без мутаций` — `Научитесь проверять данные и собирать суммы по категориям, не меняя исходный массив. Примерно 15 минут.`; `Стабильная сортировка товаров по двум ключам` — `Исправьте сортировку по наличию и цене, сохранив порядок равных элементов. Примерно 20 минут.` |
| `collections/javascript/this-and-closures/README.md` | `` `this` и замыкания `` | `Разберитесь, какие значения сохраняют замыкания и откуда функция получает this. Сначала проследите цикл, затем сравните разные формы вызова.` | `Замыкания, созданные внутри цикла` — `Предскажите значения функций, созданных на разных итерациях цикла. Примерно 10 минут.`; `` `this` у метода, стрелки и отделённого callback `` — `Объясните три способа вызова и причины разных значений this. Примерно 15 минут.` |
| `collections/javascript/event-loop-and-async/README.md` | `Event loop и асинхронность` | `Потренируйтесь рассуждать о порядке и актуальности асинхронных действий. Первая задача разбирает очереди event loop, вторая — гонку ответов поиска.` | `Порядок синхронного кода, microtask и timer callback` — `Определите порядок обычного кода, Promise и setTimeout в браузере. Примерно 12 минут.`; `Актуальный результат поиска при гонке ответов` — `Исправьте поиск так, чтобы поздний устаревший ответ не заменял новый. Примерно 25 минут.` |
| `collections/javascript/dom-and-events/README.md` | `DOM и события` | `Научитесь управлять DOM-событиями без лишних обработчиков. Задачи покрывают делегирование и безопасную повторную инициализацию.` | `Удаление динамической строки через делегирование событий` — `Добавьте один обработчик контейнеру и удаляйте строки, появившиеся позже. Примерно 18 минут.`; `Повторная инициализация без дублирования listener` — `Исправьте lifecycle обработчика, чтобы повторный запуск не удваивал реакцию. Примерно 20 минут.` |
| `collections/typescript/type-modeling/README.md` | `Моделирование типов` | `Потренируйтесь выражать связи между состояниями, ключами и значениями в типах. Сначала смоделируйте состояния, затем сохраните точный тип свойства.` | `Взаимоисключающие состояния загрузки` — `Опишите допустимые состояния через discriminated union и исчерпывающий switch. Примерно 20 минут.`; `Точный тип значения по ключу настройки` — `Свяжите generic-ключ объекта с точным типом возвращаемого значения. Примерно 20 минут.` |
| `collections/typescript/narrowing-and-validation/README.md` | `Сужение и проверка данных` | `Научитесь безопасно переходить от широкого типа к проверенному значению. Задачи идут от готового union к полной runtime-проверке unknown.` | `Безопасная обработка результата запроса` — `Исправьте сужение успешного и ошибочного результата запроса. Примерно 20 минут.`; `Проверка JSON-профиля без assertion` — `Проверьте unknown JSON и получите типизированный результат без assertion. Примерно 30 минут.` |
| `collections/html-css/layout/README.md` | `Вёрстка` | `Потренируйтесь исправлять раскладку без JavaScript. Сначала разберите flex-переполнение, затем постройте сетку от ширины контейнера.` | `Длинное слово во flex-строке` — `Разрешите flex-элементу сжиматься и переносить длинное слово без обрезки. Примерно 20 минут.`; `Сетка карточек от ширины контейнера` — `Соберите grid, который меняет число колонок по ширине контейнера. Примерно 30 минут.` |
| `collections/html-css/accessibility/README.md` | `Доступность интерфейсов` | `Потренируйтесь управлять клавиатурой, ARIA и фокусом в интерактивных компонентах. Сначала реализуйте вкладки, затем исправьте полный lifecycle модального диалога.` | `Вкладки с ARIA и клавиатурной навигацией` — `Свяжите вкладки и панели и добавьте управление стрелками, Home и End. Примерно 30 минут.`; `Диалог с удержанием и восстановлением фокуса` — `Удержите фокус внутри диалога и верните его кнопке после закрытия. Примерно 30 минут.` |
| `collections/react/state-and-derived-data/README.md` | `React: состояние и производные данные` | `Потренируйтесь отличать состояние от данных, которые можно вычислить. Затем исправьте обновления, зависящие от предыдущего state.` | `Производный список без копии состояния` — `Вычисляйте отфильтрованный список из props и state без дублирования данных. Примерно 20 минут.`; `Три обновления счётчика в одном событии` — `Исправьте три batched-обновления через функциональную форму setState. Примерно 15 минут.` |
| `collections/react/effects-and-lifecycle/README.md` | `React: эффекты и жизненный цикл` | `Разберитесь, как React синхронизируется с внешними ресурсами. Задачи покрывают зависимости effect, cleanup и проверочный цикл StrictMode.` | `Подписка, которая следует за выбранным каналом` — `Синхронизируйте подписку с выбранным каналом и снимайте старый ресурс. Примерно 25 минут.`; `Идемпотентный cleanup в корневом StrictMode` — `Объясните дополнительный цикл StrictMode и сделайте cleanup повторно безопасным. Примерно 30 минут.` |

Each entry uses `../../../tasks/<slug>/README.md`. Do not add tables, format, difficulty, slug text or metadata labels.

Expected: every thematic page has exactly two entries in the specification order.

- [ ] **Step 3: Create the three unlinked interview shells**

Each shell contains only:

```markdown
# Собеседование №N

Запускайте отдельный таймер перед каждой задачей. Указанное время приблизительное: оно помогает держать темп, но не является строгим лимитом. Сначала решайте без подсказок.

Подборка будет подключена к ученическому пути после завершения миграции всех карточек.
```

Replace `N` with `1`, `2`, or `3` in the corresponding file. Do not add task links before R7.

Expected: three pages render coherently but are not referenced by root README.

- [ ] **Step 4: Synchronize only facts implemented by R2**

Update `docs/knowledge-graph.xml` with the 13 collection path annotations and links from `M-CATALOG`; mark thematic pages available and interview composition pending. Update `docs/verification-plan.xml` so `Gate-Phase-9` proves exact path set, two tasks per thematic page, relative links, titles, descriptions and times while forbidding root cutover.

Expected: graph and verification describe the actual intermediate state; root README remains untouched.

- [ ] **Step 5: Verify, commit, push and close R2**

```bash
test "$(find collections -type f -name README.md | wc -l | tr -d ' ')" = "13"
test "$(find collections -mindepth 3 -maxdepth 3 -type f -name README.md | wc -l | tr -d ' ')" = "13"
test "$(rg -l 'После задачи нажмите «Назад»' collections/{javascript,typescript,html-css,react}/*/README.md | wc -l | tr -d ' ')" = "10"
test "$(rg -l 'Подборка будет подключена' collections/interviews/*/README.md | wc -l | tr -d ' ')" = "3"
git diff --exit-code HEAD -- README.md
for file in docs/*.xml; do xmllint --noout "$file"; done
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
git add collections docs/knowledge-graph.xml docs/verification-plan.xml
git commit -m "docs: add student task collections"
git push origin feature/frontend-livecoding-tasks-kln
R2_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r2-collections \
  --append-notes "PASS: 10 thematic pages and 3 unlinked interview shells; root README unchanged; XML and GRACE lint pass. Commit ${R2_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r2-collections --reason "Collection paths and Phase-9 gate verified"
```

Expected: R2 closed; R3 ready; old root catalog still provides access to all tasks.

---

### Task 3: R3 — JavaScript and DOM Cards

**Files:**

- Modify: `tasks/immutable-category-totals/README.md`
- Modify: `tasks/stable-product-sort/README.md`
- Modify: `tasks/loop-closure-bindings/README.md`
- Modify: `tasks/this-callback-binding/README.md`
- Modify: `tasks/browser-event-loop-order/README.md`
- Modify: `tasks/stale-search-response/README.md`
- Delete after replacement PASS: `tasks/stale-search-response/assets/fixture.html`
- Modify: `tasks/delegated-dynamic-list/README.md`
- Modify: `tasks/idempotent-event-listeners/README.md`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Track: `frontend-livecoding-tasks-kln-student-r3-javascript`

**Interfaces:**

- Consumes: R1 card contract, R2 thematic links, and existing code/solution semantics.
- Produces: eight migrated cards and eight `CardMigrationEvidence` rows.

- [ ] **Step 1: Claim R3 and capture the preservation ledger before editing**

```bash
bd update frontend-livecoding-tasks-kln-student-r3-javascript --claim
for slug in immutable-category-totals stable-product-sort loop-closure-bindings this-callback-binding browser-event-loop-order stale-search-response delegated-dynamic-list idempotent-event-listeners; do
  sed -n '1,16p' "tasks/$slug/README.md"
done
```

Record each source learning goal, prerequisite and runtime assumption in the R3 notes before rewriting.

Expected: eight source contracts are durable; no content has changed yet.

- [ ] **Step 2: Migrate the eight cards using the exact matrix**

| Slug | Mode | Technology | Collection | Format | Difficulty | Time | Editor profile |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `immutable-category-totals` | code-first | JavaScript | Массивы и объекты | Написать код | Базовая | 15 минут | Programiz |
| `stable-product-sort` | code-first | JavaScript | Массивы и объекты | Исправить код | Средняя | 20 минут | Programiz |
| `loop-closure-bindings` | code-first | JavaScript | `this` и замыкания | Предсказать результат | Базовая | 10 минут | Programiz |
| `this-callback-binding` | code-first | JavaScript | `this` и замыкания | Разобрать код | Средняя | 15 минут | CodePen browser ESM |
| `browser-event-loop-order` | code-first | JavaScript | Event loop и асинхронность | Предсказать результат | Средняя | 12 минут | CodePen classic script |
| `stale-search-response` | complex | HTML/JavaScript | Event loop и асинхронность | Исправить код | Продвинутая | 25 минут | CodePen browser ESM |
| `delegated-dynamic-list` | complex | HTML/JavaScript | DOM и события | Написать код | Базовая | 18 минут | CodePen browser ESM |
| `idempotent-event-listeners` | complex | HTML/JavaScript | DOM и события | Исправить код | Средняя | 20 минут | CodePen browser ESM |

For every card:

1. Keep its current title.
2. Put `[← Все подборки](../../README.md)` under the title.
3. Use the matrix editor and URL in a concrete copy/run instruction.
4. Move the existing learning goal into the first visible condition paragraph.
5. Preserve prerequisites at the first use; omit only `Нет`.
6. Preserve browser/ESM/classic-script assumptions beside the code.
7. Reuse the existing starter behavior and solution behavior; reorganize, do not change the learning outcome.
8. Make `Готово, когда` observable from existing outputs and edge cases.
9. Write three distinct hints at direction, next-step and near-algorithm levels; the third contains no complete answer.
10. Put the full solution and `Почему это работает` in one closed `Решение`.
11. Put only reflection questions in closed `Самопроверка`.
12. End with closed five-field `О задаче`, browser-back instruction and `[Потерялись? Открыть все подборки](../../README.md)`.

For `this-callback-binding`, compare its three visible outputs and binding explanations between current Node ESM behavior and CodePen browser ESM before accepting the editor conversion. If they differ, stop R3 without rewriting expected results.

For `stale-search-response`, inline the complete fixture HTML and controlled response behavior in the card. Do not delete `assets/fixture.html` yet.

Expected: all eight cards satisfy the new structure; no root README change.

- [ ] **Step 3: Verify each card in its target editor and delete only the proven text fixture**

Create eight evidence rows in Beads notes with exact `expected`, observed `actual` and `verdict`.

Required scenarios:

- aggregation keeps the input unchanged and handles invalid/empty data;
- sort uses both keys, keeps the input unchanged and preserves equal order;
- closures produce the current exact sequence;
- three `this` observations and reasons match the original contract;
- classic browser event loop produces the current exact order;
- stale successful and stale failed responses cannot replace the newest state;
- dynamically added rows are removable through the container handler;
- repeated initialization leaves one active listener and correct cleanup.

After `stale-search-response` passes in CodePen:

```bash
git rm tasks/stale-search-response/assets/fixture.html
test ! -e tasks/stale-search-response/assets/fixture.html
rg -n "assets/fixture.html" tasks/stale-search-response/README.md
```

Expected: final `rg` has no output; the inline replacement has a PASS row before deletion.

- [ ] **Step 4: Run structural and GRACE checks**

```bash
for slug in immutable-category-totals stable-product-sort loop-closure-bindings this-callback-binding browser-event-loop-order stale-search-response delegated-dynamic-list idempotent-event-listeners; do
  file="tasks/$slug/README.md"
  test "$(rg -c '<summary>Подсказка 1 — куда смотреть</summary>' "$file")" = "1"
  test "$(rg -c '<summary>Подсказка 2 — с чего начать</summary>' "$file")" = "1"
  test "$(rg -c '<summary>Подсказка 3 — почти решение</summary>' "$file")" = "1"
  test "$(rg -c '<summary>Решение</summary>' "$file")" = "1"
  test "$(rg -c '<summary>Самопроверка</summary>' "$file")" = "1"
  test "$(rg -c '<summary>О задаче</summary>' "$file")" = "1"
  test "$(rg -c '^<details>$' "$file")" = "$(rg -c '^</details>$' "$file")"
done
! rg -n '^#{2,3} (Теория|Входы|Выходы|Ограничения и побочные эффекты|Критерии готовности|Фикстуры|Локальный fixture|Стартовый код|Примеры)$' \
  tasks/{immutable-category-totals,stable-product-sort,loop-closure-bindings,this-callback-binding,browser-event-loop-order,stale-search-response,delegated-dynamic-list,idempotent-event-listeners}/README.md
for file in docs/*.xml; do xmllint --noout "$file"; done
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
```

Expected: every check passes; old structural headings are absent.

- [ ] **Step 5: Commit, push and close R3**

Update `docs/verification-plan.xml` and `docs/knowledge-graph.xml` with only the eight implemented card facts and Phase-10 evidence, then:

```bash
git add tasks docs/verification-plan.xml docs/knowledge-graph.xml
git commit -m "docs(tasks): redesign JavaScript task cards"
git push origin feature/frontend-livecoding-tasks-kln
R3_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r3-javascript \
  --append-notes "PASS: 8 JavaScript and DOM cards; preservation ledger and target-editor evidence recorded; stale-search fixture removed after PASS. Commit ${R3_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r3-javascript --reason "JavaScript migration and Phase-10 gate verified"
```

Expected: R3 closed; R4 ready.

---

### Task 4: R4 — TypeScript Cards

**Files:**

- Modify: `tasks/discriminated-load-state/README.md`
- Modify: `tasks/typed-object-property/README.md`
- Modify: `tasks/response-union-narrowing/README.md`
- Modify: `tasks/validate-unknown-profile/README.md`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Track: `frontend-livecoding-tasks-kln-student-r4-typescript`

**Interfaces:**

- Consumes: R1 card contract and TypeScript Playground profile.
- Produces: four TypeScript cards and four preservation/evidence rows.

- [ ] **Step 1: Claim R4 and capture source contracts**

```bash
bd update frontend-livecoding-tasks-kln-student-r4-typescript --claim
for slug in discriminated-load-state typed-object-property response-union-narrowing validate-unknown-profile; do
  sed -n '1,16p' "tasks/$slug/README.md"
done
```

Expected: learning goal, prerequisite and runtime assumptions are recorded before editing.

- [ ] **Step 2: Migrate the exact four-card matrix**

| Slug | Mode | Technology | Collection | Format | Difficulty | Time |
| --- | --- | --- | --- | --- | --- | --- |
| `discriminated-load-state` | code-first | TypeScript | Моделирование типов | Написать код | Базовая | 20 минут |
| `typed-object-property` | code-first | TypeScript | Моделирование типов | Исправить код | Средняя | 20 минут |
| `response-union-narrowing` | code-first | TypeScript | Сужение и проверка данных | Исправить код | Средняя | 20 минут |
| `validate-unknown-profile` | code-first | TypeScript | Сужение и проверка данных | Написать код | Продвинутая | 30 минут |

All four use `https://www.typescriptlang.org/play/`, keep TypeScript 5.9 and strict assumptions visible, and follow the 12 card rules from R3 Step 2.

Preserve these exact learning invariants:

- discriminated union remains mutually exclusive and exhaustively checked;
- generic key remains connected to `Preferences[Key]`;
- successful/error response branches remain safely narrowed and empty success title remains explicit;
- unknown JSON is runtime-validated without type assertion, including invalid JSON and invalid roles.

Expected: each card is one copy-ready TypeScript unit unless its existing contract proves otherwise.

- [ ] **Step 3: Verify in TypeScript Playground**

For each card, record:

- exact Playground settings needed for strict TypeScript 5.9 behavior;
- expected type/runtime result;
- observed result;
- PASS/BLOCKED verdict.

A local `tsc` or temporary harness may diagnose a problem but cannot replace the final Playground result.

Expected: four target-editor PASS rows.

- [ ] **Step 4: Run gates, commit, push and close R4**

Use the structural loop from R3 with the four TypeScript slugs. Also run XML, GRACE lint and `git diff --check`. Update only Phase-11 implemented facts, then:

```bash
git add tasks docs/verification-plan.xml docs/knowledge-graph.xml
git commit -m "docs(tasks): redesign TypeScript task cards"
git push origin feature/frontend-livecoding-tasks-kln
R4_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r4-typescript \
  --append-notes "PASS: 4 TypeScript cards; preservation ledger and TypeScript Playground evidence recorded; XML and GRACE gates pass. Commit ${R4_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r4-typescript --reason "TypeScript migration and Phase-11 gate verified"
```

Expected: R4 closed; R5 ready.

---

### Task 5: R5 — HTML/CSS and Accessibility Cards

**Files:**

- Modify: `tasks/flex-long-text-overflow/README.md`
- Modify: `tasks/container-responsive-grid/README.md`
- Modify: `tasks/accessible-keyboard-tabs/README.md`
- Delete after replacement PASS: `tasks/accessible-keyboard-tabs/assets/fixture.html`
- Modify: `tasks/modal-focus-lifecycle/README.md`
- Delete after replacement PASS: `tasks/modal-focus-lifecycle/assets/fixture.html`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Track: `frontend-livecoding-tasks-kln-student-r5-html-css`

**Interfaces:**

- Consumes: CodePen HTML/CSS/browser profile and complex-card contract.
- Produces: four complex cards, two verified asset removals and four manual browser evidence rows.

- [ ] **Step 1: Claim R5 and capture source contracts**

```bash
bd update frontend-livecoding-tasks-kln-student-r5-html-css --claim
```

Record the source learning goal, prerequisite, browser version/viewport/keyboard scenario and existing fixture content for all four cards before editing.

Expected: preservation ledger includes the two external text fixtures before they are inlined.

- [ ] **Step 2: Migrate the exact matrix**

| Slug | Technology | Collection | Format | Difficulty | Time | Required manual scenario |
| --- | --- | --- | --- | --- | --- | --- |
| `flex-long-text-overflow` | HTML/CSS | Вёрстка | Исправить код | Средняя | 20 минут | 640 CSS px; long unbroken word wraps without page overflow or clipping |
| `container-responsive-grid` | HTML/CSS | Вёрстка | Написать код | Продвинутая | 30 минут | container widths 360 and 768 CSS px; columns follow container without viewport breakpoint |
| `accessible-keyboard-tabs` | HTML/CSS/JavaScript | Доступность интерфейсов | Написать код | Средняя | 30 минут | Arrow keys, Home, End, focus, `aria-selected`, `aria-controls`, panels |
| `modal-focus-lifecycle` | HTML/CSS/JavaScript | Доступность интерфейсов | Исправить код | Продвинутая | 30 минут | initial focus, Tab/Shift+Tab trap, Escape close, initiator focus restore |

All four use `https://pen.new`. Inline complete HTML, CSS and JavaScript into one CodePen-ready HTML block unless a manual CodePen check proves that separate complete panes are clearer and equally copyable. Keep browser and viewport assumptions next to the code.

Expected: no learner needs an asset file or another README section to construct the scenario.

- [ ] **Step 3: Run manual CodePen/browser evidence**

For each card, record viewport/state, action, expected, actual and verdict. Do not use jsdom or CSS assertions as substitutes.

After accessibility replacements pass:

```bash
git rm tasks/accessible-keyboard-tabs/assets/fixture.html
git rm tasks/modal-focus-lifecycle/assets/fixture.html
test ! -e tasks/accessible-keyboard-tabs/assets/fixture.html
test ! -e tasks/modal-focus-lifecycle/assets/fixture.html
! rg -n "assets/fixture.html" tasks/accessible-keyboard-tabs/README.md tasks/modal-focus-lifecycle/README.md
```

Expected: both assets are removed only after the inline CodePen scenario passes.

- [ ] **Step 4: Run gates, commit, push and close R5**

Use the structural loop from R3 with these four slugs, plus:

```bash
! find tasks -path '*/assets/fixture.html' -print | rg .
for file in docs/*.xml; do xmllint --noout "$file"; done
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
git add tasks docs/verification-plan.xml docs/knowledge-graph.xml
git commit -m "docs(tasks): redesign HTML and CSS task cards"
git push origin feature/frontend-livecoding-tasks-kln
R5_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r5-html-css \
  --append-notes "PASS: 4 HTML/CSS/accessibility cards; manual CodePen/browser evidence recorded; two text fixtures removed after PASS. Commit ${R5_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r5-html-css --reason "HTML CSS migration and Phase-12 gate verified"
```

Expected: no `assets/fixture.html` remains in the repository; R6 ready.

---

### Task 6: R6 — React Cards

**Files:**

- Modify: `tasks/react-derived-list/README.md`
- Modify: `tasks/react-batched-counter/README.md`
- Modify: `tasks/react-effect-subscription/README.md`
- Modify: `tasks/react-strictmode-cleanup/README.md`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Track: `frontend-livecoding-tasks-kln-student-r6-react`

**Interfaces:**

- Consumes: `vite.new/react-ts` editor profile and React 19.2/TypeScript 5.9 assumptions.
- Produces: four complete `src/App.tsx` cards and four React/browser evidence rows.

- [ ] **Step 1: Claim R6 and capture source contracts**

```bash
bd update frontend-livecoding-tasks-kln-student-r6-react --claim
```

Record the source learning goal, prerequisite, development-mode assumption, fixtures and expected interactions for all four cards.

Expected: no React behavior is inferred after source content is rewritten.

- [ ] **Step 2: Migrate the exact matrix**

| Slug | Collection | Format | Difficulty | Time | Invariant |
| --- | --- | --- | --- | --- | --- |
| `react-derived-list` | React: состояние и производные данные | Написать код | Базовая | 20 минут | filtered data remains derived from props/state; prop changes cannot leave stale copied state |
| `react-batched-counter` | React: состояние и производные данные | Исправить код | Средняя | 15 минут | one click applies three functional updates and increments by exactly three |
| `react-effect-subscription` | React: эффекты и жизненный цикл | Исправить код | Средняя | 25 минут | subscription follows `channel`; old resource is cleaned before new one remains active |
| `react-strictmode-cleanup` | React: эффекты и жизненный цикл | Разобрать код | Продвинутая | 30 минут | development root StrictMode setup/cleanup/setup is explained; cleanup is idempotent |

All use:

- technology `React/TypeScript`;
- editor `https://vite.new/react-ts`;
- a complete replacement for `src/App.tsx`;
- visible React 19.2, TypeScript 5.9 and development-mode assumptions where they affect behavior.

Do not add extra files unless the task truly requires them; if a second file is retained, every starter and solution block must begin with matching `// FILE:` paths.

- [ ] **Step 3: Verify each card in StackBlitz**

For each card:

1. open `https://vite.new/react-ts`;
2. replace `src/App.tsx` exactly as instructed;
3. observe the primary interaction, edge case and failure/cleanup path;
4. record expected, actual and verdict in R6 notes.

Expected: four PASS rows; browser/runtime mismatch is `BLOCKED`.

- [ ] **Step 4: Run gates, commit, push and close R6**

Use the structural loop from R3 with the four React slugs, run XML, GRACE lint and whitespace checks, update Phase-13 facts, then:

```bash
git add tasks docs/verification-plan.xml docs/knowledge-graph.xml
git commit -m "docs(tasks): redesign React task cards"
git push origin feature/frontend-livecoding-tasks-kln
R6_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r6-react \
  --append-notes "PASS: 4 React TypeScript cards; vite.new/react-ts copy-run and browser evidence recorded; XML and GRACE gates pass. Commit ${R6_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r6-react --reason "React migration and Phase-13 gate verified"
```

Expected: all 20 cards now follow the new contract; old root catalog is still the entry point until R7.

---

### Task 7: R7 — Interview Composition and Atomic Root Cutover

**Files:**

- Modify: `collections/interviews/interview-01/README.md`
- Modify: `collections/interviews/interview-02/README.md`
- Modify: `collections/interviews/interview-03/README.md`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/task-validation-policy.md`
- Modify: `docs/requirements.xml`
- Modify: `docs/development-plan.xml`
- Modify: `docs/verification-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/operational-packets.xml`
- Track: `frontend-livecoding-tasks-kln-student-r7-cutover`

**Interfaces:**

- Consumes: all 13 collection paths, 20 migrated cards, exact title/time metadata and editor profiles.
- Produces: final three interviews, four-block root hub, final synchronized GRACE facts and implemented `Phase-14`.

- [ ] **Step 1: Claim R7 and prove all prerequisite cards are migrated**

```bash
bd update frontend-livecoding-tasks-kln-student-r7-cutover --claim
test "$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" = "20"
test "$(rg -l '<summary>Подсказка 3 — почти решение</summary>' tasks/*/README.md | wc -l | tr -d ' ')" = "20"
test "$(find collections -type f -name README.md | wc -l | tr -d ' ')" = "13"
```

Expected: all three assertions pass before root cutover.

- [ ] **Step 2: Replace interview shells with exact lists**

Keep the shared timer paragraph from R2. Then use:

`interview-01`:

```markdown
1. [Замыкания, созданные внутри цикла](../../../tasks/loop-closure-bindings/README.md) — 10 минут.
2. [Итоги по категориям без мутаций](../../../tasks/immutable-category-totals/README.md) — 15 минут.
3. [Удаление динамической строки через делегирование событий](../../../tasks/delegated-dynamic-list/README.md) — 18 минут.
4. [Взаимоисключающие состояния загрузки](../../../tasks/discriminated-load-state/README.md) — 20 минут.
5. [Три обновления счётчика в одном событии](../../../tasks/react-batched-counter/README.md) — 15 минут.
```

`interview-02`:

```markdown
1. [Порядок синхронного кода, microtask и timer callback](../../../tasks/browser-event-loop-order/README.md) — 12 минут.
2. [`this` у метода, стрелки и отделённого callback](../../../tasks/this-callback-binding/README.md) — 15 минут.
3. [Стабильная сортировка товаров по двум ключам](../../../tasks/stable-product-sort/README.md) — 20 минут.
4. [Точный тип значения по ключу настройки](../../../tasks/typed-object-property/README.md) — 20 минут.
5. [Длинное слово во flex-строке](../../../tasks/flex-long-text-overflow/README.md) — 20 минут.
```

`interview-03`:

```markdown
1. [Безопасная обработка результата запроса](../../../tasks/response-union-narrowing/README.md) — 20 минут.
2. [Актуальный результат поиска при гонке ответов](../../../tasks/stale-search-response/README.md) — 25 минут.
3. [Вкладки с ARIA и клавиатурной навигацией](../../../tasks/accessible-keyboard-tabs/README.md) — 30 минут.
4. [Производный список без копии состояния](../../../tasks/react-derived-list/README.md) — 20 минут.
5. [Подписка, которая следует за выбранным каналом](../../../tasks/react-effect-subscription/README.md) — 25 минут.
```

Expected: 15 unique task links; no slug is displayed as the student title.

- [ ] **Step 3: Replace root README with the exact four-block hub**

Use these headings and no others below the H1:

```markdown
# Frontend live-coding задачи

## Как пользоваться базой

1. Выберите направление или симуляцию собеседования.
2. Откройте подборку и начните с первой подходящей задачи.
3. После задачи нажмите «Назад» в браузере, чтобы вернуться к тому же списку.

## Подборки по направлениям

### JavaScript

- [Массивы и объекты](collections/javascript/arrays-and-objects/README.md)
- [`this` и замыкания](collections/javascript/this-and-closures/README.md)
- [Event loop и асинхронность](collections/javascript/event-loop-and-async/README.md)
- [DOM и события](collections/javascript/dom-and-events/README.md)

### TypeScript

- [Моделирование типов](collections/typescript/type-modeling/README.md)
- [Сужение и проверка данных](collections/typescript/narrowing-and-validation/README.md)

### HTML/CSS

- [Вёрстка](collections/html-css/layout/README.md)
- [Доступность интерфейсов](collections/html-css/accessibility/README.md)

### React

- [Состояние и производные данные](collections/react/state-and-derived-data/README.md)
- [Эффекты и жизненный цикл](collections/react/effects-and-lifecycle/README.md)

## Симуляции собеседований

- [Собеседование №1](collections/interviews/interview-01/README.md) — 5 задач, примерно 80 минут.
- [Собеседование №2](collections/interviews/interview-02/README.md) — 5 задач, примерно 90 минут.
- [Собеседование №3](collections/interviews/interview-03/README.md) — 5 задач, примерно 120 минут.

## Где писать код

- [Programiz JavaScript Online Compiler](https://www.programiz.com/javascript/online-compiler/) — JavaScript без browser API.
- [CodePen](https://pen.new) — browser JavaScript, DOM, HTML/CSS и ESM.
- [TypeScript Playground](https://www.typescriptlang.org/play/) — чистый TypeScript.
- [Vite React TypeScript in StackBlitz](https://vite.new/react-ts) — React с TypeScript.
```

Expected: no task table, task slug, metadata-source explanation, Beads, GRACE, knowledge graph or maintenance prose remains.

- [ ] **Step 4: Synchronize final authoring and GRACE facts**

Update authoring rules, validation policy, requirements, development plan, verification plan, knowledge graph and operational packets so:

- root hub and 13 collections are current facts;
- every task has one thematic and zero-or-one interview cross-link;
- editor map and card links agree;
- `Phase-14`/`Gate-Phase-14` are implemented/passing;
- `Phase-15`/`Gate-Phase-15` remain pending until R8;
- historical old metadata is retained only as migration history, never current contract.

Expected: no shared artifact describes the old root task tables as current.

- [ ] **Step 5: Run the complete cutover gate**

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

Expected: every assertion passes.

- [ ] **Step 6: Commit, push and close R7**

```bash
git add README.md collections AGENTS.md docs
git commit -m "docs: publish student task library hub"
git push origin feature/frontend-livecoding-tasks-kln
R7_COMMIT="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r7-cutover \
  --append-notes "PASS: 3 interviews, 15 unique entries, 4-block root hub, 13 collections, 20 cards and GRACE sync pass atomically. Commit ${R7_COMMIT} pushed."
bd close frontend-livecoding-tasks-kln-student-r7-cutover --reason "Student hub cutover and Phase-14 gate verified"
```

Expected: R7 closed; R8 ready; published branch exposes the final structure.

---

### Task 8: R8 — Published GitHub Rendered Audit and Final Handoff

**Files:**

- Modify only if audit finds a defect: affected `README.md`, `collections/**/README.md`, `tasks/*/README.md`, `docs/verification-plan.xml`, `docs/knowledge-graph.xml`
- Track: `frontend-livecoding-tasks-kln-student-r8-rendered-audit`
- Track final decision: `frontend-livecoding-tasks-kln-final-acceptance`

**Interfaces:**

- Consumes: pushed R7 commit, draft PR, 34 student-facing pages, four editor profiles and complete Beads evidence.
- Produces: full URL inventory, deep flow matrix, final branch SHA, remaining risks and one final user-acceptance request.

- [ ] **Step 1: Claim R8 and freeze the audit commit**

```bash
bd update frontend-livecoding-tasks-kln-student-r8-rendered-audit --claim
git fetch origin
git status --short --branch
git rev-list --left-right --count origin/main...HEAD
git push origin feature/frontend-livecoding-tasks-kln
AUDIT_SHA="$(git rev-parse HEAD)"
```

Expected: checkout clean, left divergence `0`, branch pushed, immutable audit SHA recorded. Any content fix creates a new SHA and restarts the rendered audit.

- [ ] **Step 2: Audit the full published URL inventory**

Open from the pushed branch or draft PR:

- root `README.md`;
- all 13 `collections/**/README.md`;
- all 20 `tasks/*/README.md`.

For each of 34 pages record:

```text
repository path | resolved published URL | visible title | HTTP/render status |
required links/details result | verdict
```

Expected: no 404, wrong branch, missing title, broken relative link or malformed `<details>`.

- [ ] **Step 3: Execute the deep student-flow matrix**

Run and record:

1. one thematic collection from JavaScript, TypeScript, HTML/CSS and React;
2. all three interviews;
3. one code-first and one complex card;
4. one card for Programiz, CodePen browser ESM, CodePen classic script, CodePen HTML/CSS, TypeScript Playground and `vite.new/react-ts`;
5. `stale-search-response`, `accessible-keyboard-tabs` and `modal-focus-lifecycle`;
6. on each deep card: open hints 1→2→3 separately, solution, self-check, then use browser Back and fallback link.

Record exact action, expected, actual and verdict. A missing browser/editor capability is `BLOCKED`, not PASS.

- [ ] **Step 4: Run final deterministic gates**

Re-run all R7 checks, plus:

```bash
test "$(git branch --show-current)" = "feature/frontend-livecoding-tasks-kln"
test "$(git rev-parse --show-toplevel)" = "/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks"
test "$(git rev-parse --git-dir)" = "$(git rev-parse --git-common-dir)"
! pwd -P | rg '/\\.workspace/'
git diff --check
git status --short
```

Expected: correct local root and branch, no linked worktree, no `.workspace`, no whitespace error, clean checkout.

- [ ] **Step 5: Fix audit defects atomically or record final PASS**

If a defect exists:

1. keep R8 open;
2. edit the smallest affected student and shared artifacts;
3. rerun the affected target-editor/card gates and all final deterministic gates;
4. commit `fix(docs): correct student library rendering`;
5. push and restart Steps 1–4 from the new SHA.

If no student-facing defect exists, update `Phase-15` and `Gate-Phase-15` to
implemented/PASS, validate XML/GRACE, commit
`docs: record student experience audit`, and push. This creates a new final
candidate SHA, so rerun Steps 2–4 against that exact SHA without any further
repository edit. Only the second PASS freezes the final audit SHA used in
Step 6.

- [ ] **Step 6: Close technical work and request one final acceptance**

```bash
FINAL_SHA="$(git rev-parse HEAD)"
bd update frontend-livecoding-tasks-kln-student-r8-rendered-audit \
  --append-notes "PASS: full 34-page URL inventory and deep student-flow matrix complete on ${FINAL_SHA}; correct root checkout and story branch proven; remaining risks recorded."
bd close frontend-livecoding-tasks-kln-student-r8-rendered-audit --reason "Published student experience and Phase-15 gate verified"
bd update frontend-livecoding-tasks-kln-final-acceptance \
  --spec-id docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md \
  --append-notes "Student redesign final review requested. Branch: feature/frontend-livecoding-tasks-kln. Commit: ${FINAL_SHA}. Review scope: root hub, all 13 collections, all 20 cards, editor links, progressive hints, copy-ready code, navigation and remaining risks."
```

Expected:

- R8 is closed;
- `frontend-livecoding-tasks-kln-final-acceptance` and top-level story remain open;
- no user acceptance is inferred;
- the user receives one exact branch/SHA/PR review request.

## Plan Self-Review Traceability

| Spec sections | Plan coverage |
| --- | --- |
| 1–3, 3.1 | Goal, Global Constraints, Mandatory Local Handoff |
| 4–10 | R2 collection matrix, R7 interviews/root hub, editor profiles in R1 and card matrices |
| 11–16 | R1 template/validation contract, R3–R6 card migrations |
| 17 | R1 GRACE planning delta, per-wave graph/verification updates, R7 final sync |
| 18, 18.1 | Serialized R1–R8 tasks and deterministic Beads dependency chain |
| 19 | Per-wave structural/editor/manual gates and R8 rendered audit |
| 20–21 | Global stop conditions, BLOCKED semantics, targeted audit fix loop |
| 22 | R7 complete cutover gate and R8 final handoff |

No plan task changes the learning goal, slug, duration, format or difficulty beyond the approved deterministic mappings. No task creates permanent runtime tooling or marks final user acceptance automatically.
