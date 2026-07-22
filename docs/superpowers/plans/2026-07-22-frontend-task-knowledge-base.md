# Frontend Task Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать GitHub-first базу самостоятельно сформулированных frontend live-coding задач, где только строго принятые карточки публикуются сериализованными техническими волнами, остаются синхронны с каталогом, GRACE knowledge graph и Beads evidence, а полная библиотека закрывает story только после единственного финального user review.

**Architecture:** Пять GRACE-модулей выполняются последовательно: governance задаёт правила, template фиксирует каноническую карточку, validation отделяет кандидатов от публикации, library хранит только `accepted` карточки, а catalog является производной проекцией их метаданных. Долговременное состояние хранится в существующей Beads story `frontend-livecoding-tasks-kln`; один linked worktree и ветка `feature/frontend-livecoding-tasks-kln` используются для всех дочерних issues, а волны сериализуются из-за общей записи в `README.md` и `docs/knowledge-graph.xml`. Каждая волна закрывается непрерывно после своих технических gates; один final user review проходит только после B7.

**Tech Stack:** GitHub Flavored Markdown, XML-артефакты GRACE 3.11.0, Git, Beads (`bd` 1.1.0), `rg`, `find`, `awk`, `xmllint`, временные task-specific JavaScript/TypeScript/React/DOM/browser harnesses без постоянного package manager или test runner.

## Global Constraints

- Основной интерфейс ученика — rendered view репозитория на GitHub; обязательного runtime и package manager нет.
- Каждая задача хранится в `tasks/<stable-slug>/README.md`; необязательные fixtures находятся только в `tasks/<stable-slug>/assets/`.
- Точные metadata labels: `Технологии`, `Тема`, `Формат`, `Уровень`, `Время`, `Навыки`, `Предварительные знания`, `Среда выполнения`.
- Допустимые форматы: `Реализация`, `Отладка`, `Разбор`, `Прогноз вывода`.
- Допустимые уровни: `Базовый`, `Средний`, `Продвинутый` с калибровкой из design spec; уровень описывает задачу, а не грейд ученика.
- Русский язык используется для task prose и стабильных section labels, если ментор явно не разрешил исключение.
- Теория, каждая `Подсказка N` и `Решение` находятся в отдельных `<details>` без атрибута `open`.
- Метаданные task card каноничны; каталог и `M-TASK-LIBRARY` annotations являются производными и меняются в одном атомарном wave change.
- Только `accepted` разрешает публикацию в `tasks/`; `needs-rewrite`, `rejected` и `duplicate` остаются нейтральными Beads decisions.
- Candidate register замораживается до аудита; каждый stable candidate ID получает один terminal decision, а story не закрывается, пока остаётся `needs-rewrite`.
- Полная волна содержит 8–10 accepted cards; только последняя неполная волна может содержать 1–7.
- UI проверяется вручную в браузере; CSS и visual styling не доказываются unit-тестами. Недоступное обязательное browser evidence означает `BLOCKED`, не `PASS`.
- Внешние материалы только дополняют локальный contract; обязательное чтение не требует платной подписки или закрытого аккаунта, а ссылка проходит HTTP/redirect и content-target проверку.
- Временные harness-файлы создаются вне репозитория и удаляются после evidence; generator, validator, CI или постоянный runtime в v1 не добавляются.
- Все child issues story используют linked worktree `/private/tmp/frontend-livecoding-tasks-kln` и ветку `feature/frontend-livecoding-tasks-kln`; force-push и переписывание опубликованной истории запрещены.

---

## Scope and Source-of-Truth Map

| Artifact | Responsibility | Planned action |
| --- | --- | --- |
| `AGENTS.md` | `M-GOVERNANCE`: authoring, validation, publication, wave and stop rules | Add the task publication contract; preserve existing Git/GRACE/Beads rules. |
| `.gitignore` | Project-local worktree safety | Verify the exact `.worktrees/` entry; no edit if already correct. |
| `templates/task-template.md` | `M-TASK-TEMPLATE`: canonical student-facing card | Create once before any candidate card. |
| `docs/task-validation-policy.md` | `M-TASK-VALIDATION`: ordered gates, outcomes, evidence and Beads schemas | Create once before candidate freeze. |
| `README.md` | `M-CATALOG`: student entry point and thematic projection | Create an explicit empty state, then update atomically in each accepted wave. |
| `tasks/<stable-slug>/README.md` | `M-TASK-LIBRARY`: one accepted task and canonical metadata | Create only from accepted candidate records during a wave. |
| `tasks/<stable-slug>/assets/*` | Local fixtures/assets used by one card | Create only when the local contract requires them. |
| `docs/development-plan.xml` | GRACE module/phase execution state | Move module and phase statuses only after corresponding evidence passes. |
| `docs/knowledge-graph.xml` | Public navigation graph | Move module status with implementation; add exactly one `export-<stable-slug>` per accepted card. |
| `docs/verification-plan.xml` | Shared verification contract | Change only if implementation reveals a real command, scenario, or evidence-surface delta. |
| `docs/operational-packets.xml` | Canonical execution/evidence schemas | Consume as-is; change only if a confirmed schema defect blocks execution. |
| Beads story/candidate/wave records | Durable scope, dependencies, decisions, technical publication evidence/status and final user acceptance | Create/claim/update/close through `bd`; never duplicate this state in a Markdown TODO file. |

## Beads Decomposition and Dependency Graph

The existing top-level story is `frontend-livecoding-tasks-kln` (`feature`, `in_progress`). Execution creates or reuses the following issue-sized children with deterministic IDs, so every later task can recover its issue without relying on shell variables from an earlier session.

| Role | Title | Primary scope | Acceptance / completion evidence | Depends on |
| --- | --- | --- | --- | --- |
| `B1` | Finalize task-authoring governance | `AGENTS.md`, `.gitignore`, Phase 1 GRACE status | Governance text, worktree check, XML and standard GRACE lint PASS | none |
| `B2` | Create canonical task template | `templates/task-template.md`, `M-TASK-TEMPLATE` status | Exact labels/sections, independent closed details, rendered GitHub review | `B1` |
| `B3` | Define strict candidate validation policy | `docs/task-validation-policy.md`, `M-TASK-VALIDATION` status | Ordered gates, all outcomes, evidence matrix, Beads record schema, stop conditions | `B2` |
| `B4` | Create student catalog empty state | `README.md`, `M-CATALOG` status | Understandable GitHub landing page, empty state, projection contract | `B3` |
| `B5` | Approve scope, then freeze and validate initial candidate register | Beads vocabulary decision and candidate records only | Mentor-approved initial vocabulary/scope; finite frozen count; one evidence-backed terminal decision per candidate; no `needs-rewrite`; accepted candidates grouped | `B4` |
| `B6-Wnn` | Publish accepted task wave nn | 8–10 cards, or final 1–7; README; graph; evidence | Atomic task/catalog/graph update, candidate recheck, all technical gates PASS, push, GitHub rendering, complete report and technical close | `B5` for first wave; previous wave thereafter |
| `B7` | Run final library audit | All repository and Beads state | Counts, projection, links, XML, Markdown, GRACE, Git divergence and technical publication PASS; complete-library user-review handoff prepared | last `B6-Wnn`, or `B5` if zero candidates are accepted |

`Phase 7 — Scale review` is intentionally not a child that blocks this story. Create a separate Beads `decision` issue only after observed catalog drift, vocabulary conflicts, or repeated manual verification cost provides evidence; do not invent a date/count threshold and do not add automation without mentor approval.

```text
frontend-livecoding-tasks-kln
└── B1 Governance
    └── B2 Task template
        └── B3 Validation policy
            └── B4 Empty catalog
                └── B5 Candidate audit
                    ├── candidate-001 ... candidate-N (audit records)
                    └── B6-W01 → B6-W02 → ... → B6-Wnn
                                              └── B7 Final audit
```

## Execution Preflight

- [ ] **Step 1: Recover Beads and inspect the story before any edit**

Run:

```bash
cd /private/tmp/frontend-livecoding-tasks-kln
bd prime
bd show frontend-livecoding-tasks-kln
```

Expected: the story is `in_progress`, links to `docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md`, and contains no implementation child graph yet.

- [ ] **Step 2: Reconfirm linked-worktree and branch isolation**

Run:

```bash
git_dir="$(cd "$(git rev-parse --git-dir)" && pwd -P)"
git_common="$(cd "$(git rev-parse --git-common-dir)" && pwd -P)"
test "$git_dir" != "$git_common"
test -z "$(git rev-parse --show-superproject-working-tree)"
test "$(git branch --show-current)" = "feature/frontend-livecoding-tasks-kln"
```

Expected: all commands exit 0; do not create a nested worktree.

- [ ] **Step 3: Fetch the real base and gate unexpected divergence**

Run:

```bash
git fetch origin
git merge-base --is-ancestor origin/main HEAD
git status --short --branch
```

Expected: `origin/main` is an ancestor of `HEAD` and the checkout is clean before execution. If either assertion fails, stop; do not rebase or merge published history without explicit authority.

- [ ] **Step 4: Establish the Markdown/XML baseline**

Run:

```bash
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
test -x "$grace_bin"
test "$("$grace_bin" --version)" = "3.11.0"
xmllint --noout docs/*.xml
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
test ! -e package.json
```

Expected: XML, standard GRACE lint and whitespace checks PASS; there is no `package.json`. `lint --profile autonomous` is diagnostic at this point and is expected to report the planned files as missing; it must not be mislabeled as PASS.

---

### Task 1: Finalize Governance and Create the Durable Beads Graph

**Files:**
- Modify: `AGENTS.md`
- Verify: `.gitignore`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Verify: `docs/verification-plan.xml`
- Verify: `docs/operational-packets.xml`

**Interfaces:**
- Consumes: approved design spec; `M-GOVERNANCE`; existing story `frontend-livecoding-tasks-kln`.
- Produces: durable child issue graph `B1`–`B5` and `B7`; `authoringRules`; completed Phase 1 governance state used by every later task.

- [ ] **Step 1: Create all deterministic phase issues and dependency edges**

Run as one shell session:

```bash
story_id='frontend-livecoding-tasks-kln'
governance_id='frontend-livecoding-tasks-kln-governance'
template_id='frontend-livecoding-tasks-kln-template'
validation_id='frontend-livecoding-tasks-kln-validation'
catalog_id='frontend-livecoding-tasks-kln-catalog'
audit_id='frontend-livecoding-tasks-kln-audit'
final_audit_id='frontend-livecoding-tasks-kln-final-audit'

bd show "$governance_id" >/dev/null 2>&1 || bd create --id="$governance_id" --type=task --priority=1 \
  --title='Finalize task-authoring governance' \
  --description='Scope: synchronize authoring, validation, publication, worktree, stop-condition, and shared-artifact rules. Deliverable: implemented M-GOVERNANCE and completed Phase 1.' \
  --acceptance='AGENTS.md states the approved task publication contract; .worktrees/ remains ignored; xmllint, standard GRACE lint, and git diff --check pass.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='beads,grace-cli,verification-before-completion'

bd show "$template_id" >/dev/null 2>&1 || bd create --id="$template_id" --type=task --priority=1 \
  --title='Create canonical task template' \
  --description='Scope: create the canonical GitHub-rendered task card and synchronize M-TASK-TEMPLATE state.' \
  --acceptance='The template contains every exact metadata label and required visible section; theory, every hint, and solution are independent closed details; structural and rendered review pass.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='grace-verification,verification-before-completion'

bd show "$validation_id" >/dev/null 2>&1 || bd create --id="$validation_id" --type=task --priority=1 \
  --title='Define strict candidate validation policy' \
  --description='Scope: define ordered candidate gates, terminal decisions, hybrid evidence, wave accounting, and stop conditions.' \
  --acceptance='The policy makes accepted the only publishable decision, defines all record fields and evidence routes, preserves neutral rejected/duplicate records, and passes V-M-TASK-VALIDATION review.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='grace-verification,beads,verification-before-completion'

bd show "$catalog_id" >/dev/null 2>&1 || bd create --id="$catalog_id" --type=task --priority=1 \
  --title='Create student catalog empty state' \
  --description='Scope: create the GitHub repository entry point and explicit empty catalog before task publication.' \
  --acceptance='README.md explains navigation, canonical metadata, thematic projection, and displays one explicit empty state with no fake task rows.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='grace-verification,verification-before-completion'

bd show "$audit_id" >/dev/null 2>&1 || bd create --id="$audit_id" --type=task --priority=1 \
  --title='Approve scope, freeze and validate initial candidate register' \
  --description='Scope: obtain mentor approval for initial controlled vocabulary and candidate boundary, independently author a finite neutral inventory, freeze it, deduplicate it, collect hybrid evidence, and assign one terminal decision per stable candidate ID.' \
  --acceptance='Mentor scope/vocabulary decision is recorded; terminal-decision count equals frozen register size; no needs-rewrite remains; accepted candidates are grouped into valid waves; rejected and duplicate decisions remain neutral and unpublished.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='beads,systematic-debugging,verification-before-completion'

bd show "$final_audit_id" >/dev/null 2>&1 || bd create --id="$final_audit_id" --type=task --priority=1 \
  --title='Run final knowledge-base audit' \
  --description='Scope: prove final candidate, task, catalog, graph, link, GRACE, Git, and technical wave-publication consistency, then prepare the complete-library user-review handoff.' \
  --acceptance='Every candidate is terminal with no needs-rewrite; every accepted task is unique, verified, linked, graph-indexed, and technically published; all defined gates pass; branch divergence is reported; the story remains open for final user acceptance.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='beads,grace-reviewer,verification-before-completion'

for child_id in "$governance_id" "$template_id" "$validation_id" "$catalog_id" "$audit_id" "$final_audit_id"; do
  bd update "$child_id" --parent="$story_id"
done

bd dep add "$template_id" "$governance_id"
bd dep add "$validation_id" "$template_id"
bd dep add "$catalog_id" "$validation_id"
bd dep add "$audit_id" "$catalog_id"
bd dep add "$final_audit_id" "$audit_id"

bd update "$story_id" --append-notes="Implementation-plan issue map: B1=$governance_id B2=$template_id B3=$validation_id B4=$catalog_id B5=$audit_id B7=$final_audit_id. Wave issues are created after candidate freeze and serialized before B7."
bd update "$governance_id" --claim
```

Expected: six child issues exist under the story; `bd ready` exposes only `B1`; the story notes preserve the actual role-to-ID mapping across sessions.

- [ ] **Step 2: Add the exact task publication contract to `AGENTS.md`**

Insert after `## Testing Guidelines` and before `## Commit & Pull Request Guidelines`:

```markdown
## Task Publication Contract

- Store each accepted exercise at `tasks/<stable-slug>/README.md`; treat the slug as a stable identifier and handle renames as migrations with inbound-link verification.
- Use the exact metadata labels `Технологии`, `Тема`, `Формат`, `Уровень`, `Время`, `Навыки`, `Предварительные знания`, and `Среда выполнения`.
- Use only the approved format values `Реализация`, `Отладка`, `Разбор`, and `Прогноз вывода`, and the level values `Базовый`, `Средний`, and `Продвинутый`.
- Treat task metadata as canonical. Update the root catalog and the task-library knowledge-graph annotation in the same change; every accepted task must appear exactly once in each projection.
- Keep theory, every hint, and the solution in independent `<details>` blocks without the `open` attribute. Keep the prompt, fixtures, starter code, and solution local even when targeted external reading is linked.
- Publish only candidates with an `accepted` Beads validation decision. Keep `needs-rewrite`, `rejected`, and `duplicate` candidates out of `tasks/` and record their neutral decision evidence in Beads.
- Validate JavaScript, TypeScript, React/DOM, UI, analysis, and output-prediction tasks with the evidence route defined in `docs/task-validation-policy.md`. Unavailable mandatory browser evidence is `BLOCKED`, never `PASS`.
- Publish accepted cards in serialized technical waves of 8–10, except that the final incomplete wave may contain 1–7. Close each wave continuously after candidate recheck, all deterministic and hybrid gates pass, the focused commit is pushed, GitHub-rendered evidence is captured, and the complete wave report is recorded. Do not require per-wave mentor or user approval; keep the top-level story open until the user accepts the complete library after the final audit.
- Stop instead of guessing when metadata, controlled vocabulary, environment, expected output, prerequisite, asset, external material, rendering, or mandatory evidence is ambiguous or unavailable.
```

- [ ] **Step 3: Verify the worktree ignore contract without rewriting it**

Run:

```bash
test "$(cat .gitignore)" = '.worktrees/'
git check-ignore -q .worktrees/probe
```

Expected: both commands exit 0. If `.gitignore` has additional legitimate user entries by execution time, replace the first assertion with `test "$(rg -n '^\.worktrees/$' .gitignore | wc -l | tr -d ' ')" = 1`; do not delete unrelated ignores.

- [ ] **Step 4: Mark only the governance module and Phase 1 complete**

Apply these exact semantic changes:

```xml
<!-- docs/development-plan.xml -->
<M-GOVERNANCE NAME="ProjectGovernance" TYPE="UTILITY" LAYER="0" ORDER="1" STATUS="implemented">
...
<Phase-1 name="Governance" status="completed">
  <goal>Record approved requirements, worktree isolation, technology boundaries, module contracts, data flows, verification references, and stop conditions.</goal>
  <step-1 module="M-GOVERNANCE" status="completed" verification="V-M-GOVERNANCE">Finalize and review the written specification and all GRACE planning artifacts.</step-1>
</Phase-1>

<!-- docs/knowledge-graph.xml -->
<M-GOVERNANCE NAME="ProjectGovernance" TYPE="UTILITY" STATUS="implemented">
```

Do not change the status of `M-TASK-TEMPLATE`, `M-TASK-VALIDATION`, `M-TASK-LIBRARY`, `M-CATALOG`, or Phases 2–7 in this task.

- [ ] **Step 5: Run the governance gate**

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
rg -n 'Task Publication Contract|only candidates with an `accepted`|final incomplete wave' AGENTS.md
git diff --check
```

Expected: XML and standard GRACE lint PASS with zero issues; all three governance anchors are found; whitespace check is clean.

- [ ] **Step 6: Commit, push, record evidence, and close B1**

Run:

```bash
git add AGENTS.md docs/development-plan.xml docs/knowledge-graph.xml
git commit -m "docs: finalize task authoring governance"
governance_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
bd update "$governance_id" --append-notes="PASS: xmllint; grace lint standard 0 issues; git diff --check. Commit $governance_commit pushed on feature/frontend-livecoding-tasks-kln."
bd close "$governance_id" --reason='Governance contract implemented and verified.' --suggest-next
```

Expected: one focused commit is pushed; B1 closes and B2 becomes ready.

---

### Task 2: Create the Canonical GitHub-Rendered Task Template

**Files:**
- Create: `templates/task-template.md`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Verify: `docs/verification-plan.xml` (`V-M-TASK-TEMPLATE`)

**Interfaces:**
- Consumes: `authoringRules` from Task 1; exact metadata vocabulary and `TaskMetadata` contract.
- Produces: `taskSchema` / `MarkdownTemplate` consumed by validation and every accepted task card.

- [ ] **Step 1: Claim B2 and reread its contracts**

Run:

```bash
template_id='frontend-livecoding-tasks-kln-template'
bd update "$template_id" --claim
rg -n 'M-TASK-TEMPLATE|V-M-TASK-TEMPLATE|type-TaskMetadata|export-taskSchema' \
  docs/development-plan.xml docs/knowledge-graph.xml docs/verification-plan.xml
```

Expected: the module, interface and verification anchors resolve before editing.

- [ ] **Step 2: Create the complete canonical template**

Create `templates/task-template.md` with this complete content. Values between `⟦` and `⟧` are intentional authoring fields of the template, not unfinished implementation placeholders; the uncommon sentinel keeps later placeholder scans from rejecting valid JavaScript/JSX braces.

````markdown
# ⟦Название задачи⟧

**Учебная цель:** ⟦Одно наблюдаемое умение, которое тренирует задача.⟧

| Метаданные | Значение |
| --- | --- |
| Технологии | ⟦Значения из approved vocabulary⟧ |
| Тема | ⟦Одна основная тема из approved vocabulary⟧ |
| Формат | ⟦Реализация / Отладка / Разбор / Прогноз вывода⟧ |
| Уровень | ⟦Базовый / Средний / Продвинутый⟧ |
| Время | ⟦Оценка или диапазон в минутах⟧ |
| Навыки | ⟦Краткий список наблюдаемых навыков⟧ |
| Предварительные знания | ⟦Нет / относительные ссылки / явно обозначенное targeted reading⟧ |
| Среда выполнения | ⟦Точные runtime, mode и значимые версии⟧ |

<details>
<summary>Теория</summary>

⟦Краткий локальный контекст, необходимый для попытки. Не копируйте объёмную внешнюю документацию.⟧

</details>

## Условие

⟦Самодостаточное условие без скрытого внешнего контекста.⟧

### Входы

⟦Точные входы или, для Разбора/Прогноза вывода, точные вопросы ученику.⟧

### Выходы

⟦Наблюдаемый результат или формат ответа.⟧

### Ограничения и побочные эффекты

- ⟦Границы входов и данных.⟧
- ⟦Разрешённая или запрещённая мутация.⟧
- ⟦Ошибки, пустой результат и допустимые side effects.⟧

### Стартовый код

⟦Приведите полный стартовый код, когда без него меняется контракт; иначе явно напишите «Не требуется».⟧

```js
// Полный task-specific starter code, если он требуется.
```

### Примеры

#### Обычный сценарий

⟦Вход, ожидаемый результат и краткое объяснение.⟧

#### Граничный сценарий

⟦Граница и ожидаемый результат.⟧

#### Ошибка или пустой результат

⟦Негативный сценарий и ожидаемое поведение, когда он применим.⟧

## Критерии готовности

- ⟦Наблюдаемый критерий основного поведения.⟧
- ⟦Наблюдаемый критерий граничного сценария.⟧
- ⟦Наблюдаемый критерий ошибки, пустого результата или ограничения.⟧
- ⟦Для UI: состояния, взаимодействия и ручные визуальные критерии.⟧

<details>
<summary>Подсказка 1</summary>

⟦Минимальная направляющая подсказка без полного решения.⟧

</details>

<!-- Повторяйте отдельный закрытый details для Подсказка 2, Подсказка 3 и далее только по необходимости. -->

<details>
<summary>Решение</summary>

### Подход

⟦Почему решение удовлетворяет контракту.⟧

```js
// Полное task-specific решение.
```

### Сложность

- Время: ⟦точная оценка⟧.
- Память: ⟦точная оценка⟧.

### Компромиссы и альтернативы

⟦Существенные компромиссы и краткое сравнение других корректных решений.⟧

</details>

## Самопроверка

- ⟦Вопрос о ключевой концепции.⟧
- ⟦Вопрос о границе или ошибке.⟧
- ⟦Вопрос о компромиссе решения.⟧

## Дополнительные материалы

- [⟦Название материала⟧](⟦URL⟧) — ⟦зачем открывать и какой точный фрагмент изучить⟧.

<!-- Удалите весь раздел, если targeted materials не добавляют учебной ценности. -->
````

- [ ] **Step 3: Run deterministic template checks before status changes**

Run:

```bash
test "$(for label in 'Технологии' 'Тема' 'Формат' 'Уровень' 'Время' 'Навыки' 'Предварительные знания' 'Среда выполнения'; do rg -F "| $label |" templates/task-template.md >/dev/null || exit 1; done; echo PASS)" = PASS
test "$(rg -c '^<details>$' templates/task-template.md)" -ge 3
test "$(rg -c '^</details>$' templates/task-template.md)" = "$(rg -c '^<details>$' templates/task-template.md)"
! rg -n '<details[^>]*\bopen\b' templates/task-template.md
rg -n '^## (Условие|Критерии готовности|Самопроверка)$|^<summary>(Теория|Подсказка 1|Решение)</summary>$' templates/task-template.md
```

Expected: all eight labels exist; details tags are paired; no `open` attribute exists; required visible/collapsed anchors are found.

- [ ] **Step 4: Render-review the template on GitHub**

Create the reviewable template commit only after Step 3:

```bash
git add templates/task-template.md
git commit -m "docs: add canonical task template"
template_content_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
```

Inspect the rendered file in the existing draft PR. Verify: the table renders, prompt/criteria/self-check remain visible, theory/hint/solution bodies are hidden initially, and each block opens independently. If GitHub cannot be reached or rendering differs, record `BLOCKED` in B2 and stop rather than changing GRACE status.

- [ ] **Step 5: Mark M-TASK-TEMPLATE implemented only after rendered PASS**

Apply:

```xml
<!-- docs/development-plan.xml -->
<M-TASK-TEMPLATE NAME="TaskTemplate" TYPE="UTILITY" LAYER="1" ORDER="1" STATUS="implemented">
...
<step-1 module="M-TASK-TEMPLATE" status="completed" verification="V-M-TASK-TEMPLATE">Create and render-review templates/task-template.md.</step-1>

<!-- docs/knowledge-graph.xml -->
<M-TASK-TEMPLATE NAME="TaskTemplate" TYPE="UTILITY" STATUS="implemented">
```

Keep Phase 2 `in-progress`/`pending` until Task 3 also passes.

- [ ] **Step 6: Verify, commit, push and close B2**

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
template_content_commit="$(git rev-parse HEAD)"
git add docs/development-plan.xml docs/knowledge-graph.xml
git commit -m "docs: record task template verification"
template_verification_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
bd update "$template_id" --append-notes="PASS: exact labels, paired closed details, required anchors, GitHub rendered review, xmllint, standard GRACE lint, whitespace. Content commit $template_content_commit; verification-status commit $template_verification_commit."
bd close "$template_id" --reason='Canonical task template implemented and rendered successfully.' --suggest-next
```

Expected: B2 closes and B3 becomes ready.

---

### Task 3: Define the Strict Candidate Validation Policy

**Files:**
- Create: `docs/task-validation-policy.md`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Verify: `docs/verification-plan.xml` (`V-M-TASK-VALIDATION`)
- Verify: `docs/operational-packets.xml` (`CandidateValidationRecordTemplate`)

**Interfaces:**
- Consumes: `taskSchema`, `CandidateRegister`, accepted-library metadata and operational packet schemas.
- Produces: `validateCandidate(candidate, register, acceptedLibrary, taskSchema) -> ValidationDecision + optional AcceptedTaskCard + BeadsValidationRecord`.

- [ ] **Step 1: Claim B3 and create the policy**

Set `validation_id='frontend-livecoding-tasks-kln-validation'`, run `bd update "$validation_id" --claim`, then create `docs/task-validation-policy.md` with:

```markdown
# Политика валидации frontend live-coding задач

## Назначение

Эта политика отделяет подготовку кандидата от публикации. Только решение `accepted` создаёт `AcceptedTaskCard`; остальные решения остаются нейтральными Beads records и не создают файлов в `tasks/`.

## Candidate register

До проверки агент создаёт конечный нейтральный список и фиксирует `candidateRegisterSize`. Каждая запись получает стабильный `candidateId`, самостоятельно сформулированную `learningGoal`, одну `proposedTopic` из controlled vocabulary и ссылку на story. В реестре не фиксируются внешнее происхождение или заимствованные формулировки.

После freeze новый кандидат сначала получает новый ID и увеличивает `candidateRegisterSize`; неучтённый кандидат не может попасть в волну. Завершение аудита требует равенства числа terminal decisions размеру реестра и отсутствия `needs-rewrite`.

## Gates

Gates выполняются строго по порядку. При провале gate последующие gates не выдают кандидату `accepted`.

1. `Identity` — сравнить учебную цель с accepted library и текущим register; семантический дубль получает `duplicate`, а полезные отличия переносятся в canonical candidate.
2. `Learning value` — подтвердить конкретный frontend-навык и исключить случайный трюк без педагогической ценности.
3. `Contract` — зафиксировать среду, входы/вопросы, выходы, ограничения, мутацию, ошибки, пустой результат и side effects.
4. `Local completeness` — хранить условие, fixtures, starter code и solution локально; targeted external materials остаются дополнительными.
5. `Examples` — сверить happy path, значимую границу и ошибку/пустой результат, когда они применимы.
6. `Solution` — доказать соответствие contract; описать complexity, существенные trade-offs и альтернативы.
7. `Verification` — получить evidence по матрице ниже; недоступное обязательное evidence означает `BLOCKED`, не `PASS`.
8. `Editorial` — проверить русский task prose, exact labels, controlled vocabulary, Markdown, независимые закрытые details и оригинальность формулировок/кода.

## Outcomes

- `accepted` — все gates PASS; кандидат можно включить ровно в одну wave.
- `needs-rewrite` — кандидат потенциально полезен, но contract/evidence/content пока не проходит; публикация запрещена, а конкретный failed gate фиксируется.
- `rejected` — тема технически некорректна или педагогически слаба; публикация запрещена.
- `duplicate` — учебная цель уже представлена; фиксируются `duplicateTarget` и перенесённые полезные отличия; отдельная карточка запрещена.

## Evidence matrix

| Task kind | Required evidence | PASS signal | Stop / failure signal |
| --- | --- | --- | --- |
| JavaScript | Temporary harness in the declared runtime/mode | Happy path, boundary and applicable error match the card | Runtime/output mismatch or undeclared mode |
| TypeScript | Temporary runtime evidence plus type check in the declared TypeScript version | Expected runtime and type outcomes match | Type error outside the taught contract or version ambiguity |
| React / DOM | Minimal temporary example or browser scenario in declared versions | Required state and interactions match | Hidden environment dependency or unverified lifecycle |
| UI / CSS | Manual browser scenario at declared viewport/states | Interaction and visual criteria observed | Browser unavailable means `BLOCKED`; unit CSS assertions are not substitutes |
| Разбор | Written step trace plus factual run/reproduction | Trace and observed behavior agree | Unsupported causal claim |
| Прогноз вывода | Written execution trace plus actual output | Exact ordering/value match | Timing, environment or output ambiguity |
| Markdown structure | Deterministic label, heading, details, fence and local-link checks | Canonical structure and links resolve | Missing section, malformed details/fence or broken link |
| External material | HTTP success/valid redirect plus target-content review | Expected material opens without required paid/closed access | Broken, redirected to unrelated content, paywalled required reading |

Temporary harnesses live outside the repository and are removed after evidence capture. They never justify adding a package manager, catalog generator, validator, site framework or CI pipeline to v1.

Metadata values and task titles used in Markdown tables are single-line values without the `|` character; use comma-separated wording instead. This keeps the GitHub table valid and makes exact task-to-catalog projection deterministic.

## Beads validation record

Every candidate record contains: `candidateId`, `candidateRegisterSize`, `storyId`, `learningGoal`, `proposedTopic`, `decision`, `decisionReason`, `duplicateTarget`, `evidenceType`, `observedResult`, `waveId`, `remainingRisk`, and `waveAcceptanceStatus`.

Allowed `waveAcceptanceStatus` values are `not-applicable`, `pending`, `accepted`, and `changes-requested`. Accepted candidates use `pending` after wave assignment; non-accepted outcomes use `not-applicable`.

`waveAcceptanceStatus` is a technical publication status, not a human approval. For an accepted candidate, `pending` means that its assigned wave has not completed every technical publication gate, `accepted` means that candidate recheck, required evidence, pushed commit, GitHub-rendered review, and the complete wave report all passed, and `changes-requested` means that a technical gate requires correction.

## Wave rules

Accepted candidates are ordered by stable candidate ID and grouped sequentially: take 10 while at least 10 remain; the last group may therefore contain 1–10. A group of 8–10 is a full wave; a final group of 1–7 is the only permitted incomplete wave. Each wave is one serialized Beads child issue, changes task cards/catalog/graph/evidence atomically, and closes continuously after candidate recheck, deterministic and hybrid PASS, pushed commit, GitHub-rendered evidence, and a complete wave report. Per-wave mentor or user approval is not required; the top-level story remains open until the user accepts the complete library after the final audit.

## Stop conditions

Stop without guessing for ambiguous vocabulary, environment or expected output; contradictory examples; happy-path-only solution; missing prerequisite/asset; nondeterministic network/time/state without a fixture/fake/adapter; unavailable browser-only evidence; broken supplementary material; unexpected GitHub rendering; task/catalog/graph drift; unapproved permanent tooling; or a slug migration without inbound-link evidence.

## Updating a published task

For content, metadata, prerequisite or asset changes, resolve all derived artifacts and inbound links first, rerun every affected validation gate, update the canonical card, catalog and graph in one change, and repeat projection/link/evidence checks. Deletion removes the card, its single catalog row and its single graph annotation in the same change. Reclassification requires mentor approval for any new or ambiguous vocabulary. Slug rename is a dedicated migration: verify every inbound link before removing the old path, update all derived references, and record before/after evidence in Beads.

## Completion checks

- Candidate terminal count equals frozen `candidateRegisterSize`.
- No `needs-rewrite` remains at story completion.
- Only accepted candidates have task paths or wave IDs.
- Every accepted candidate belongs to exactly one valid wave.
- Every decision has concise reason, evidence type, observed result and remaining risk.
- A wave closes only after candidate recheck, technical PASS, pushed commit, GitHub-rendered evidence, and a complete report.
- The top-level story closes only after the final audit and explicit user acceptance of the complete library.
```

- [ ] **Step 2: Review the policy against all specified gates and outcomes**

Run:

```bash
for gate in Identity 'Learning value' Contract 'Local completeness' Examples Solution Verification Editorial; do rg -F "$gate" docs/task-validation-policy.md >/dev/null || exit 1; done
for decision in accepted needs-rewrite rejected duplicate; do rg -F "\`$decision\`" docs/task-validation-policy.md >/dev/null || exit 1; done
rg -n 'candidateRegisterSize|duplicateTarget|waveAcceptanceStatus|BLOCKED|Temporary harnesses|Updating a published task|Slug rename|1–7|8–10' docs/task-validation-policy.md
! rg -n 'TBD|TODO|implement later|fill in details' docs/task-validation-policy.md
```

Expected: every gate/outcome/record/wave/stop anchor exists and no unresolved placeholder exists.

- [ ] **Step 3: Mark validation and Phase 2 implemented**

Apply:

```xml
<!-- docs/development-plan.xml -->
<M-TASK-VALIDATION NAME="TaskValidation" TYPE="UTILITY" LAYER="2" ORDER="1" STATUS="implemented">
...
<Phase-2 name="TaskContract" status="completed">
...
<step-2 module="M-TASK-VALIDATION" status="completed" verification="V-M-TASK-VALIDATION">Create docs/task-validation-policy.md and prove all terminal decisions and hybrid evidence routes.</step-2>

<!-- docs/knowledge-graph.xml -->
<M-TASK-VALIDATION NAME="TaskValidation" TYPE="UTILITY" STATUS="implemented">
```

- [ ] **Step 4: Run Phase 2 gates**

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
```

Then repeat the Task 2 rendered template check. Expected: Phase 2 evidence is PASS; autonomous lint may still report missing `README.md` and task-library files until later phases.

- [ ] **Step 5: Commit, push, record and close B3**

Run:

```bash
git add docs/task-validation-policy.md docs/development-plan.xml docs/knowledge-graph.xml
git commit -m "docs: define strict task validation"
validation_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
bd update "$validation_id" --append-notes="PASS: ordered gates, four outcomes, evidence matrix, candidate accounting, stop conditions, xmllint, standard GRACE lint, whitespace. Commit $validation_commit."
bd close "$validation_id" --reason='Strict candidate validation policy implemented and verified.' --suggest-next
```

---

### Task 4: Create the Student Catalog Entry Point and Empty State

**Files:**
- Create: `README.md`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Verify: `docs/verification-plan.xml` (`V-M-CATALOG`)

**Interfaces:**
- Consumes: canonical `TaskMetadataSet`, even when empty.
- Produces: `studentIndex` with exactly one thematic projection per accepted task.

- [ ] **Step 1: Claim B4 and create `README.md`**

Set `catalog_id='frontend-livecoding-tasks-kln-catalog'`, run `bd update "$catalog_id" --claim`, then create:

```markdown
# Frontend live-coding задачи

GitHub-first база самостоятельных упражнений по frontend-разработке. Репозиторий можно читать без установки зависимостей: выберите задачу в каталоге, откройте её условие и критерии готовности, а теорию, подсказки и решение раскрывайте по необходимости.

## Как выбрать задачу

Каталог сгруппирован по одной основной теме. В строке задачи указаны технологии, формат, уровень, оценка времени, тренируемые навыки и предварительные знания. Пересекающиеся навыки не дублируют задачу в других темах.

Уровень описывает сложность упражнения: `Базовый`, `Средний` или `Продвинутый`. Формат имеет одно из значений: `Реализация`, `Отладка`, `Разбор`, `Прогноз вывода`.

## Каталог задач

Принятых задач пока нет. Первая тематическая таблица появится после строгой валидации и технической публикации первой волны.

## Как устроена карточка

Метаданные внутри `tasks/<stable-slug>/README.md` являются источником истины. Условие, критерии готовности и самопроверка видимы сразу; теория, каждая подсказка и решение закрыты независимо. Внешние материалы дополняют карточку, но не заменяют локальные условие, fixtures, стартовый код или решение.

## Поддержка каталога

ИИ-агент публикует только кандидатов со статусом `accepted` и в одном изменении синхронизирует карточку, эту тематическую проекцию, knowledge graph и Beads evidence. Каждая задача встречается в каталоге ровно один раз и сортируется внутри темы сначала по уровню, затем по названию.
```

- [ ] **Step 2: Verify the explicit empty state**

Run:

```bash
rg -n '^# Frontend live-coding задачи$|^## (Как выбрать задачу|Каталог задач|Как устроена карточка|Поддержка каталога)$' README.md
test "$(rg -c '^Принятых задач пока нет\.' README.md)" = 1
test "$(rg -c '^\| .*tasks/.*/README\.md.*\|$' README.md || true)" = 0
```

Expected: all landing-page sections exist, one empty state exists and no fake task row exists.

- [ ] **Step 3: Push and render-review the empty catalog before changing GRACE status**

Run:

```bash
git add README.md
git commit -m "docs: add student catalog entry point"
catalog_content_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
```

Inspect the pushed `README.md` in the existing draft PR. Confirm headings, inline code and paragraphs render correctly, the empty state is visible once, and there are no fake rows or broken navigation links. If GitHub rendering is unavailable or unexpected, record `BLOCKED` in B4 and stop.

- [ ] **Step 4: Mark M-CATALOG and Phase 3 implemented after rendered PASS**

Apply:

```xml
<!-- docs/development-plan.xml -->
<M-CATALOG NAME="StudentCatalog" TYPE="ENTRY_POINT" LAYER="4" ORDER="1" STATUS="implemented">
...
<Phase-3 name="StudentEntryPoint" status="completed">
...
<step-1 module="M-CATALOG" status="completed" verification="V-M-CATALOG">Create README.md with navigation rules and the catalog projection contract.</step-1>

<!-- docs/knowledge-graph.xml -->
<M-CATALOG NAME="StudentCatalog" TYPE="ENTRY_POINT" STATUS="implemented">
```

- [ ] **Step 5: Run, commit, push and close the Phase 3 gate**

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
catalog_content_commit="$(git rev-parse HEAD)"
git add docs/development-plan.xml docs/knowledge-graph.xml
git commit -m "docs: record student catalog verification"
catalog_verification_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
bd update "$catalog_id" --append-notes="PASS: explicit empty catalog, GitHub rendered navigation contract, xmllint, standard GRACE lint, whitespace. Content commit $catalog_content_commit; verification-status commit $catalog_verification_commit."
bd close "$catalog_id" --reason='Student entry point and empty catalog implemented.' --suggest-next
```

Expected: B4 closes and B5 becomes ready.

---

### Task 5: Freeze and Validate the Initial Candidate Register

**Files:**
- Modify: Beads story/audit/candidate records only
- Modify: `docs/development-plan.xml` after terminal accounting passes
- Verify: `templates/task-template.md`
- Verify: `docs/task-validation-policy.md`
- Verify: accepted metadata already present in `tasks/` (expected empty before this audit)

**Interfaces:**
- Consumes: `CandidateRegister`, `taskSchema`, empty or current `TaskMetadataSet`, `validateCandidate` gates.
- Produces: finite frozen register; one `ValidationDecision` and `BeadsValidationRecord` per candidate; ordered accepted set assigned to wave IDs.

- [ ] **Step 1: Claim B5 and verify that publication has not started early**

Run:

```bash
audit_id='frontend-livecoding-tasks-kln-audit'
final_audit_id='frontend-livecoding-tasks-kln-final-audit'
bd update "$audit_id" --claim
test ! -d tasks || test -z "$(find tasks -mindepth 2 -maxdepth 2 -name README.md -print -quit)"
bd update "$audit_id" --set-metadata registerFrozen=false
```

Expected: no candidate task card exists before the audit.

- [ ] **Step 2: Independently author a provisional finite neutral inventory**

Produce `/tmp/frontend-livecoding-tasks-kln-candidate-inventory.tsv` with these exact tab-separated columns: `candidateId`, `learningGoal`, `proposedTopic`, `technology`, `format`, `level`, `environment`. Assign provisional sequential IDs `candidate-001` through `candidate-N` after semantic deduplication of the inventory itself. Do not store copied wording, source provenance, draft cards or rejected content in `tasks/`.

Because the initial catalog has no established topic set, this provisional inventory must not be frozen until the next mentor decision. `N=0` is allowed only when the audit evidence explicitly concludes that no independently authored candidate meets the learning-value scope; do not fabricate filler to reach a wave size.

- [ ] **Step 3: Obtain the mentor-owned initial vocabulary and scope decision**

Create or reuse one explicit human-needed decision and make it a blocker of B5:

```bash
vocabulary_decision_id='frontend-livecoding-tasks-kln-initial-vocabulary'
bd show "$vocabulary_decision_id" >/dev/null 2>&1 || bd create --id="$vocabulary_decision_id" \
  --type=decision --priority=1 --labels=human \
  --title='Approve initial task vocabulary and candidate boundary' \
  --description="Decision required: approve or revise the proposed technologies, one-primary-topic vocabulary, and finite candidate inventory boundary before register freeze. Proposed inventory and vocabulary are recorded in B5 $audit_id notes." \
  --acceptance='Mentor records approved technologies/topics and confirms or revises the finite candidate boundary; no candidate record is frozen before the response.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md'
bd update "$vocabulary_decision_id" --parent='frontend-livecoding-tasks-kln'
inventory_evidence="$(sed -n '1,240p' /tmp/frontend-livecoding-tasks-kln-candidate-inventory.tsv)"
bd update "$audit_id" --append-notes="Proposed initial vocabulary and candidate boundary from /tmp inventory:\n$inventory_evidence\nAwaiting $vocabulary_decision_id."
bd dep add "$audit_id" "$vocabulary_decision_id"
bd human list
```

Pause execution and ask the mentor to approve or revise the recorded vocabulary/boundary. After the response is captured with `bd human respond "$vocabulary_decision_id" --response="$mentor_response"`, update the provisional inventory exactly as decided, re-deduplicate it, assign final contiguous IDs, and continue. This checkpoint resolves mentor-owned classification without inventing product scope inside the plan.

- [ ] **Step 4: Create one Beads candidate record per approved row**

For each scratch row, run the following command with values taken exactly from that row:

```bash
candidate_issue_id="frontend-livecoding-tasks-kln-$candidate_id"
bd show "$candidate_issue_id" >/dev/null 2>&1 || bd create --id="$candidate_issue_id" --type=task --priority=2 \
  --title="$candidate_id — $learning_goal" \
  --description="Candidate validation record for $candidate_id. Learning goal: $learning_goal. Proposed topic: $proposed_topic. Story: frontend-livecoding-tasks-kln." \
  --acceptance='One ordered validation decision, reason, evidence type, observed result, duplicate target, wave ID, remaining risk, and wave technical-publication status are recorded; only accepted may be published.' \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md'
bd update "$candidate_issue_id" \
  --parent="$audit_id" \
  --set-metadata candidateId="$candidate_id" \
  --set-metadata learningGoal="$learning_goal" \
  --set-metadata proposedTopic="$proposed_topic" \
  --set-metadata decision=pending
```

Keep a scratch mapping from `candidateId` to returned `candidate_issue_id`. The mapping and register count are durable only after the next step.

- [ ] **Step 5: Freeze the register atomically in B5**

Run:

```bash
candidate_register_size="$N"
candidate_ids_csv="$(printf '%s\n' "${candidate_ids[@]}" | paste -sd, -)"
bd update "$audit_id" \
  --set-metadata registerFrozen=true \
  --set-metadata candidateRegisterSize="$candidate_register_size" \
  --append-notes="Frozen candidate register: size=$candidate_register_size ids=$candidate_ids_csv. Any later addition must receive the next stable ID and increment this count before validation."
```

Expected: the register size and complete ID list are recoverable from `bd show "$audit_id"`; no candidate can enter a wave without appearing in that list.

- [ ] **Step 6: Validate every candidate in strict gate order**

For each candidate issue:

1. `bd update "$candidate_issue_id" --claim`.
2. Run `Identity → Learning value → Contract → Local completeness → Examples → Solution → Verification → Editorial` from the policy.
3. Use a task-appropriate temporary harness outside the repo. Record exact environment/versions, command or manual scenario, and observed result.
4. Update the issue metadata/notes with `decision`, `decisionReason`, `duplicateTarget`, `evidenceType`, `observedResult`, `remainingRisk`, and `waveAcceptanceStatus`.
5. For `needs-rewrite`, keep the issue open, revise only the failed contract, rerun affected and downstream gates, and stop after two failed fix attempts for mentor clarification.
6. For `rejected` or `duplicate`, set `waveAcceptanceStatus=not-applicable`, ensure no task path exists, and close the candidate issue with the neutral reason.
7. Keep `accepted` candidate issues open until wave assignment is written in Step 7; do not create task files yet.

Expected: each decision is evidence-backed; browser unavailability is `BLOCKED`, not a substituted PASS.

- [ ] **Step 7: Partition accepted candidates and create serialized wave issues**

Order accepted candidates by `candidateId`. Repeatedly take the next 10; the final remainder is the last wave. Validate every group: non-final size is exactly 10, and final size is 1–10 (8–10 full or 1–7 incomplete).

For each group, create:

```bash
wave_id="frontend-livecoding-tasks-kln-wave-$wave_number"
bd show "$wave_id" >/dev/null 2>&1 || bd create --id="$wave_id" --type=task --priority=1 \
  --title="Publish accepted task wave $wave_number" \
  --description="Scope: publish accepted candidates $wave_candidate_ids atomically as task cards, catalog rows, graph annotations, verification evidence, pushed commit, GitHub-rendered evidence, and a complete technical report." \
  --acceptance="Wave size $wave_size is valid; every candidate is accepted and rechecked; task/catalog/graph/evidence gates pass; the focused commit is pushed; GitHub-rendered evidence and the complete report are recorded before technical close." \
  --spec-id='docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md' \
  --skills='beads,grace-execute,systematic-debugging,verification-before-completion'
bd update "$wave_id" --parent='frontend-livecoding-tasks-kln'
bd dep add "$wave_id" "$audit_id"
if test -n "$previous_wave_id"; then bd dep add "$wave_id" "$previous_wave_id"; fi
```

Update every accepted candidate record with this `waveId` and `waveAcceptanceStatus=pending`, then close the candidate record as a completed validation decision. Add `bd dep add "$final_audit_id" "$wave_id"`; retain the original B7→B5 dependency as well. Record the ordered wave ID/candidate list in B5 notes.

- [ ] **Step 8: Prove terminal accounting and close B5**

Run read-only Beads queries and calculate:

```text
terminal_count = accepted + rejected + duplicate
needs_rewrite_count = 0
pending_count = 0
terminal_count = candidateRegisterSize
accepted_with_exactly_one_wave = accepted_count
```

If `accepted_count=0`, create no wave issue; B7 remains blocked only by B5. Otherwise B7 also depends on every serialized wave and cannot become ready early.

Record the counts and wave partition in B5, then apply and verify the Phase 4 completion state:

```xml
<Phase-4 name="CandidateAudit" status="completed">
  <goal>Freeze a finite neutral Beads candidate register, deduplicate it, and record a validation decision for every stable candidate ID.</goal>
  <step-1 module="M-TASK-VALIDATION" status="completed" verification="V-M-TASK-VALIDATION">Freeze candidate IDs, apply DF-VALIDATE-TASK, and group accepted cards into waves of 8-10 with a permitted final wave of 1-7.</step-1>
</Phase-4>
```

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
git add docs/development-plan.xml
git commit -m "docs: record completed candidate audit"
candidate_audit_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
bd update "$audit_id" --append-notes="Phase 4 PASS and published at $candidate_audit_commit."
bd close "$audit_id" --reason='Frozen register fully validated; every candidate is terminal and accepted candidates are assigned to valid serialized waves.' --suggest-next
```

Expected: B5 closes; only the first wave becomes ready, or B7 becomes ready if there are no accepted candidates.

---

### Task 6: Publish One Accepted Task Wave (Repeat for Each Serialized Wave)

**Files:**
- Create: `tasks/<stable-slug>/README.md` for each accepted candidate in the current wave
- Create: `tasks/<stable-slug>/assets/*` only when required by that card
- Modify: `README.md`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/development-plan.xml` on first and final wave status transitions
- Modify: `docs/verification-plan.xml` only for a real verification-surface delta
- Modify: Beads wave and candidate records

**Interfaces:**
- Consumes: accepted candidate records with exact stable slugs/metadata/evidence; `taskSchema`; `DF-PUBLISH-TASK-WAVE`.
- Produces: `TaskMetadataSet` delta, one `export-<stable-slug>` per card, technically passing pushed wave, GitHub-rendered evidence, complete report, and technical publication status.

- [ ] **Step 1: Claim exactly the ready wave and enforce serialization**

Run:

```bash
wave_id="frontend-livecoding-tasks-kln-wave-$wave_number"
bd ready
bd show "$wave_id"
bd update "$wave_id" --claim
git status --short --branch
```

Expected: no later wave is ready; the checkout is clean; the wave lists 8–10 candidates, or 1–7 only if it is final. Restore `wave_candidate_issue_ids` from the exact candidate IDs recorded in this wave and set `is_final_wave=true` only when no later serialized wave exists; these values are used in Step 10.

- [ ] **Step 2: Recheck candidate decisions immediately before publication**

For every wave candidate, verify: `decision=accepted`, exact stable slug, exact metadata, evidence type/result, remaining risk, and `waveId=$wave_id`. Search the existing task library by learning goal and slug again. Any new duplicate, ambiguity, or stale evidence returns the candidate to `needs-rewrite`/`duplicate`, blocks the wave, and updates candidate accounting before files are written.

- [ ] **Step 3: Create each task card from the canonical template**

For each accepted candidate, copy `templates/task-template.md` to `tasks/<stable-slug>/README.md` and replace every `⟦...⟧` authoring field/comment with complete candidate-specific content. Change fenced-code language identifiers from `js` when TypeScript/JSX/TSX or another declared syntax is used. Remove irrelevant optional sections and the starter-code fence when starter code is not needed. Preserve exact labels and independent details blocks.

Before accepting a card locally, run:

```bash
task_file="tasks/$stable_slug/README.md"
for label in 'Технологии' 'Тема' 'Формат' 'Уровень' 'Время' 'Навыки' 'Предварительные знания' 'Среда выполнения'; do rg -F "| $label |" "$task_file" >/dev/null || exit 1; done
rg -n '^## (Условие|Критерии готовности|Самопроверка)$|^<summary>(Теория|Решение)</summary>$' "$task_file"
test "$(rg -c '^<details>$' "$task_file")" = "$(rg -c '^</details>$' "$task_file")"
! rg -n '<details[^>]*\bopen\b|⟦|⟧|TBD|TODO|implement later|fill in details' "$task_file"
```

Expected: no template field remains; structural contract passes.

- [ ] **Step 4: Reproduce the hybrid evidence for every card**

Use the policy matrix and declared environment. Run happy path, meaningful boundary and applicable error/empty-result evidence. For UI, inspect every declared state/interaction manually at the declared viewport and record visual observations; never add CSS unit assertions. For external links, follow redirects and confirm expected target content, not only status code. Put commands/results and remaining risk into candidate and wave notes; keep harnesses outside the repository.

- [ ] **Step 5: Replace the empty state and update thematic catalog tables atomically**

Remove the empty-state sentence when the first task is added. Use this exact table schema under each approved `## <Тема>` heading:

```markdown
| Задача | Технологии | Формат | Уровень | Время | Навыки | Предварительные знания |
| --- | --- | --- | --- | --- | --- | --- |
| [<Название>](tasks/<stable-slug>/README.md) | <Технологии> | <Формат> | <Уровень> | <Время> | <Навыки> | <Предварительные знания> |
```

Each slug appears in exactly one topic table. Within each topic, order levels `Базовый → Средний → Продвинутый`, then sort by task title. Do not invent a synonym topic; a new/ambiguous value blocks the wave for mentor direction.

- [ ] **Step 6: Add one graph annotation per accepted task**

Inside `M-TASK-LIBRARY > annotations` add exactly one self-closing entry per new slug:

```xml
<export-stable-slug PURPOSE="Expose the accepted student-facing task card at tasks/stable-slug/README.md" />
```

Replace `stable-slug` in both tag and path with the exact card slug. Do not add task-level CrossLinks because the approved graph contract models cards as public annotations of `M-TASK-LIBRARY`.

On the first accepted wave, change `M-TASK-LIBRARY` from `planned` to `implemented` in both `docs/development-plan.xml` and `docs/knowledge-graph.xml`, and change Phase 5 to `in-progress`. Phase 4 was completed by Task 5. On the final accepted wave, mark Phase 5 complete after the wave's technical gates, pushed commit, GitHub-rendered evidence, and complete report pass; no human approval is required.

- [ ] **Step 7: Run deterministic local, projection, graph and XML checks**

Run:

```bash
xmllint --noout docs/*.xml
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"

verification_dir="$(mktemp -d)"
projection_check="$verification_dir/verify-catalog-projection.sh"

cat >"$projection_check" <<'SH'
#!/usr/bin/env bash
set -euo pipefail

expected_file="$1"
: >"$expected_file"

metadata_value() {
  task_file="$1"
  label="$2"
  awk -F'|' -v target="$label" '
    function trim(value) {
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      return value
    }
    trim($2) == target { print trim($3); found = 1; exit }
    END { if (!found) exit 1 }
  ' "$task_file"
}

while IFS= read -r task_file; do
  slug="${task_file#tasks/}"
  slug="${slug%/README.md}"
  title="$(sed -n 's/^# //p' "$task_file" | head -n 1)"
  technologies="$(metadata_value "$task_file" 'Технологии')"
  topic="$(metadata_value "$task_file" 'Тема')"
  format="$(metadata_value "$task_file" 'Формат')"
  level="$(metadata_value "$task_file" 'Уровень')"
  duration="$(metadata_value "$task_file" 'Время')"
  skills="$(metadata_value "$task_file" 'Навыки')"
  prerequisites="$(metadata_value "$task_file" 'Предварительные знания')"

  for value in "$title" "$technologies" "$topic" "$format" "$level" "$duration" "$skills" "$prerequisites"; do
    test -n "$value"
    case "$value" in *'|'*|*'\t'*) echo "Invalid catalog cell in $task_file: $value" >&2; exit 1;; esac
  done

  case "$level" in
    Базовый) level_rank=1 ;;
    Средний) level_rank=2 ;;
    Продвинутый) level_rank=3 ;;
    *) echo "Invalid level in $task_file: $level" >&2; exit 1 ;;
  esac

  row="| [$title](tasks/$slug/README.md) | $technologies | $format | $level | $duration | $skills | $prerequisites |"
  printf '%s\t%s\t%s\t%s\n' "$topic" "$level_rank" "$title" "$row" >>"$expected_file"

  test "$(rg -F -c "(tasks/$slug/README.md)" README.md)" = 1
  test "$(rg -c "<export-$slug[[:space:]]" docs/knowledge-graph.xml)" = 1
  awk -v heading="## $topic" -v expected="$row" '
    $0 == heading { in_topic = 1; next }
    in_topic && /^## / { exit }
    in_topic && $0 == expected { found = 1 }
    END { exit(found ? 0 : 1) }
  ' README.md
done < <(find tasks -mindepth 2 -maxdepth 2 -name README.md | LC_ALL=C sort)

while IFS= read -r topic; do
  expected_rows="$(awk -F '\t' -v topic="$topic" '$1 == topic' "$expected_file" | LC_ALL=C sort -t "$(printf '\t')" -k2,2n -k3,3 | cut -f4-)"
  actual_rows="$(awk -v heading="## $topic" '
    $0 == heading { in_topic = 1; next }
    in_topic && /^## / { exit }
    in_topic && /^\| \[/ { print }
  ' README.md)"
  test "$actual_rows" = "$expected_rows"
done < <(cut -f1 "$expected_file" | LC_ALL=C sort -u)

task_count="$(find tasks -mindepth 2 -maxdepth 2 -name README.md | wc -l | tr -d ' ')"
catalog_link_count="$(rg -o '\(tasks/[^)]+/README\.md\)' README.md | LC_ALL=C sort -u | wc -l | tr -d ' ')"
graph_task_count="$(rg -c '<export-[a-z0-9-]+ PURPOSE="Expose the accepted student-facing task card at tasks/' docs/knowledge-graph.xml || true)"
test "$catalog_link_count" = "$task_count"
test "$graph_task_count" = "$task_count"
SH

chmod +x "$projection_check"
"$projection_check" "$verification_dir/expected-catalog.tsv"

while IFS= read -r local_link; do test -e "$local_link" || exit 1; done < <(rg -No '\]\((tasks/[^)#]+|tasks/[^)#]+/assets/[^)#]+)\)' README.md tasks/*/README.md | sed -E 's/^.*\]\(([^)]+)\).*$/\1/' | LC_ALL=C sort -u)

git diff --check
rm -r "$verification_dir"
```

Expected: the temporary checker proves exact equality for all seven projected fields, one topic section per card, level-then-title order, one catalog link and one graph annotation per task; every local link exists; XML/GRACE/whitespace PASS. The checker is removed and no permanent validator/runtime enters the repository.

- [ ] **Step 8: Push the technically passing wave and obtain GitHub-rendered evidence**

Run:

```bash
git add README.md docs/development-plan.xml docs/knowledge-graph.xml docs/verification-plan.xml tasks
git commit -m "feat(tasks): publish accepted wave $wave_number"
wave_commit="$(git rev-parse HEAD)"
git push origin feature/frontend-livecoding-tasks-kln
```

Inspect the pushed PR rendering for every changed card or, for a large wave, the template plus a documented deterministic sample while still structurally checking all cards. Confirm tables, code fences, details default state, relative links and assets. Unexpected rendering or inaccessible required browser evidence sets the technical status to `changes-requested`, blocks wave closure, and requires a follow-up commit on the same branch.

- [ ] **Step 9: Publish the complete wave report and record technical publication status**

Build the report from the exact outputs captured in Steps 2–8 and append it:

```bash
wave_report="$(printf '%s\n' \
  "Wave: $wave_id / $wave_number" \
  "Candidates: $wave_candidate_ids" \
  "Task paths: $wave_task_paths" \
  'Validation decisions: accepted for every listed candidate' \
  "Evidence: $wave_evidence" \
  "Duplicate/rejected merges since audit: $wave_merge_records" \
  'Checks: template, local links, external targets, projection, graph counts, XML, GRACE, whitespace, GitHub rendering' \
  "Commit/push: $wave_commit / feature/frontend-livecoding-tasks-kln" \
  "Remaining risks: $wave_remaining_risks" \
  'Technical publication status: accepted')"
bd update "$wave_id" --append-notes="$wave_report"
```

The variables contain complete observed values; use the literal `none` for an empty merge/risk set rather than omitting the field.

`waveAcceptanceStatus` is the retained Beads field name for technical publication status, not a human approval. If any technical check, render review, or report review requires changes, set candidate/wave status to `changes-requested`, make only supported fixes, rerun all affected gates, push a focused `fix(tasks): address wave $wave_number review` commit, and return to `pending` until every technical gate passes.

- [ ] **Step 10: Record technical completion, close this wave, and continue**

After Step 9 records a complete technically passing report, update every wave candidate to technical status `accepted`. If this is the final wave, first apply these exact `docs/development-plan.xml` status changes:

```xml
<Phase-5 name="TaskWaves" status="completed">
  <goal>Publish strictly accepted tasks through serialized atomic task, catalog, graph, evidence, pushed-commit, GitHub-rendered, report, and technical-status updates.</goal>
  <step-1 module="M-TASK-LIBRARY" status="completed" verification="V-M-TASK-LIBRARY">Publish 8-10 accepted task cards from the canonical template, or 1-7 for the final incomplete wave.</step-1>
  <step-2 module="M-CATALOG" status="completed" verification="V-M-CATALOG">Synchronize thematic student-catalog tables for the wave.</step-2>
  <step-3 module="M-GOVERNANCE" status="completed" verification="V-M-GOVERNANCE">Apply graph and verification deltas, record the complete report and technical publication status in Beads, close the wave, and continue.</step-3>
</Phase-5>
```

Then run:

```bash
published_wave_commit="$(git rev-parse HEAD)"
for candidate_issue_id in $wave_candidate_issue_ids; do
  bd update "$candidate_issue_id" --set-metadata waveAcceptanceStatus=accepted --append-notes="Technical publication completed for wave $wave_id at $published_wave_commit."
done

if test "$is_final_wave" = true; then
  xmllint --noout docs/*.xml
  grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
  "$grace_bin" lint --fail-on errors --path "$PWD"
  git diff --check
  git add docs/development-plan.xml
  git commit -m "docs: record technically published task waves"
  git push origin feature/frontend-livecoding-tasks-kln
fi

bd update "$wave_id" --append-notes="Technical publication status: accepted. Published commit: $published_wave_commit."
bd close "$wave_id" --reason='Candidate recheck, technical gates, push, GitHub rendering, and complete report passed.' --suggest-next
```

If this was not the final wave, continue immediately with the next serialized wave. The final-wave status commit contains no task-content changes and is made immediately after the final wave's technical gates and complete report pass.

---

### Task 7: Run the Final Story Audit and Prepare Delivery

**Files:**
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml` only if final audit finds a confirmed missing/extra annotation
- Modify: `docs/verification-plan.xml` only if final evidence changes its contract
- Modify: Beads final-audit and story records
- Verify: all `README.md`, `tasks/*/README.md`, `templates/task-template.md`, `docs/*.xml`, local/external links and Git state

**Interfaces:**
- Consumes: frozen candidate register, all terminal decisions, technically published waves and complete `TaskMetadataSet`.
- Produces: completed Phase 6 evidence, ready draft PR/branch and story handoff; the story itself closes only after the user accepts the complete result.

- [ ] **Step 1: Claim B7 and prove every prerequisite is closed**

Run:

```bash
final_audit_id='frontend-livecoding-tasks-kln-final-audit'
bd show "$final_audit_id"
bd blocked
bd update "$final_audit_id" --claim
```

Expected: B7 has no open blocker; every wave issue is technically published and closed, or B5 proved `accepted_count=0`.

- [ ] **Step 2: Reconcile candidate accounting from Beads**

Read the frozen size/IDs from B5 and every candidate record. Prove:

```text
registered IDs are unique and contiguous candidate-001..candidate-N
terminal_count = N
needs-rewrite = 0
pending = 0
accepted + rejected + duplicate = N
each accepted has exactly one waveId and waveAcceptanceStatus=accepted
each rejected/duplicate has no task path and waveAcceptanceStatus=not-applicable
```

Any mismatch blocks Phase 6; repair the Beads record or repository artifact based on the canonical task/decision, never by changing business intent silently.

- [ ] **Step 3: Run the full repository audit**

Create and execute this final temporary projection check; it handles both a populated library and the valid zero-accepted-candidate empty state:

```bash
final_verification_dir="$(mktemp -d)"
final_projection_check="$final_verification_dir/verify-final-projection.sh"

cat >"$final_projection_check" <<'SH'
#!/usr/bin/env bash
set -euo pipefail

metadata_value() {
  awk -F'|' -v target="$2" '
    function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
    trim($2) == target { print trim($3); found = 1; exit }
    END { if (!found) exit 1 }
  ' "$1"
}

expected_file="$1"
: >"$expected_file"
task_count="$(find tasks -mindepth 2 -maxdepth 2 -name README.md 2>/dev/null | wc -l | tr -d ' ')"

if test "$task_count" = 0; then
  test "$(rg -c '^Принятых задач пока нет\.' README.md)" = 1
  test "$(rg -o '\(tasks/[^)]+/README\.md\)' README.md | wc -l | tr -d ' ')" = 0
  test "$(rg -c '<export-[a-z0-9-]+ PURPOSE="Expose the accepted student-facing task card at tasks/' docs/knowledge-graph.xml || true)" = 0
  exit 0
fi

while IFS= read -r task_file; do
  slug="${task_file#tasks/}"; slug="${slug%/README.md}"
  title="$(sed -n 's/^# //p' "$task_file" | head -n 1)"
  technologies="$(metadata_value "$task_file" 'Технологии')"
  topic="$(metadata_value "$task_file" 'Тема')"
  format="$(metadata_value "$task_file" 'Формат')"
  level="$(metadata_value "$task_file" 'Уровень')"
  duration="$(metadata_value "$task_file" 'Время')"
  skills="$(metadata_value "$task_file" 'Навыки')"
  prerequisites="$(metadata_value "$task_file" 'Предварительные знания')"

  for value in "$title" "$technologies" "$topic" "$format" "$level" "$duration" "$skills" "$prerequisites"; do
    test -n "$value"
    case "$value" in *'|'*|*'\t'*) exit 1;; esac
  done

  case "$level" in Базовый) rank=1;; Средний) rank=2;; Продвинутый) rank=3;; *) exit 1;; esac
  row="| [$title](tasks/$slug/README.md) | $technologies | $format | $level | $duration | $skills | $prerequisites |"
  printf '%s\t%s\t%s\t%s\n' "$topic" "$rank" "$title" "$row" >>"$expected_file"

  test "$(rg -F -c "(tasks/$slug/README.md)" README.md)" = 1
  test "$(rg -c "<export-$slug[[:space:]]" docs/knowledge-graph.xml)" = 1
  awk -v heading="## $topic" -v expected="$row" '
    $0 == heading { in_topic = 1; next }
    in_topic && /^## / { exit }
    in_topic && $0 == expected { found = 1 }
    END { exit(found ? 0 : 1) }
  ' README.md
done < <(find tasks -mindepth 2 -maxdepth 2 -name README.md | LC_ALL=C sort)

while IFS= read -r topic; do
  expected_rows="$(awk -F '\t' -v topic="$topic" '$1 == topic' "$expected_file" | LC_ALL=C sort -t "$(printf '\t')" -k2,2n -k3,3 | cut -f4-)"
  actual_rows="$(awk -v heading="## $topic" '
    $0 == heading { in_topic = 1; next }
    in_topic && /^## / { exit }
    in_topic && /^\| \[/ { print }
  ' README.md)"
  test "$actual_rows" = "$expected_rows"
done < <(cut -f1 "$expected_file" | LC_ALL=C sort -u)

catalog_count="$(rg -o '\(tasks/[^)]+/README\.md\)' README.md | LC_ALL=C sort -u | wc -l | tr -d ' ')"
graph_count="$(rg -c '<export-[a-z0-9-]+ PURPOSE="Expose the accepted student-facing task card at tasks/' docs/knowledge-graph.xml || true)"
test "$catalog_count" = "$task_count"
test "$graph_count" = "$task_count"
SH

chmod +x "$final_projection_check"
"$final_projection_check" "$final_verification_dir/expected-catalog.tsv"

for xml in docs/*.xml; do xmllint --noout "$xml" || exit 1; done
grace_bin="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
"$grace_bin" lint --fail-on errors --path "$PWD"
rg -n --glob '!docs/superpowers/plans/**' 'TBD|TODO|implement later|fill in details' README.md AGENTS.md templates docs tasks && exit 1 || true
git diff --check

while IFS= read -r task_file; do
  for label in 'Технологии' 'Тема' 'Формат' 'Уровень' 'Время' 'Навыки' 'Предварительные знания' 'Среда выполнения'; do rg -F "| $label |" "$task_file" >/dev/null || exit 1; done
  ! rg -n '<details[^>]*\bopen\b' "$task_file" || exit 1
  test "$(rg -c '^<details>$' "$task_file")" = "$(rg -c '^</details>$' "$task_file")" || exit 1
done < <(find tasks -mindepth 2 -maxdepth 2 -name README.md 2>/dev/null | LC_ALL=C sort)

rm -r "$final_verification_dir"
```

Re-run every external link and task-specific hybrid evidence whose environment or content could have changed since its wave. Expected: every defined gate passes; if browser or network evidence is currently unavailable, record `BLOCKED` rather than using stale evidence as current PASS.

- [ ] **Step 4: Run a final GitHub student-flow walkthrough**

From the pushed branch/PR, perform `README catalog → task card → visible prompt/criteria → optional theory → hints one by one → solution → self-check` on at least one card per format present and every card with custom HTML/assets. Confirm that no raw link is required to understand the contract. Record the exact cards sampled and observations.

- [ ] **Step 5: Mark Phases 4–6 complete only after evidence**

In `docs/development-plan.xml`, verify Phase 4 is already `completed`. Mark Phase 5 `completed` here only for the valid zero-accepted-candidate path; otherwise it was completed by the final wave's technical closure. Mark Phase 6 and its step `completed` only when their exact Beads/evidence conditions hold. Do not mark Phase 7 complete and do not add automation; it remains a future evidence-triggered decision.

- [ ] **Step 6: Commit final artifact-state changes and rerun the gates**

Run:

```bash
git add docs/development-plan.xml docs/knowledge-graph.xml docs/verification-plan.xml
if ! git diff --cached --quiet; then git commit -m "docs: record completed knowledge base audit"; fi
xmllint --noout docs/*.xml
"$grace_bin" lint --fail-on errors --path "$PWD"
git diff --check
git push origin feature/frontend-livecoding-tasks-kln
```

Expected: final status changes are committed only if needed, and the pushed branch contains all verified artifacts.

- [ ] **Step 7: Fetch again and report divergence without rewriting history**

Run:

```bash
git fetch origin
git rev-list --left-right --count origin/main...HEAD
git status --short --branch
```

Expected: the worktree is clean; report the exact `behind ahead` counts. If origin/main advanced, do not rebase/force-push; report the divergence and request explicit integration direction if it blocks mergeability.

- [ ] **Step 8: Close B7, update the story, and leave final acceptance to the user**

Run:

```bash
final_commit="$(git rev-parse HEAD)"
bd update "$final_audit_id" --append-notes="PASS: candidate accounting, technical wave-publication status, task/catalog/graph projection, local/external links, task evidence, XML, standard GRACE lint, Markdown/whitespace, GitHub student flow, and Git divergence review. Final commit $final_commit."
bd close "$final_audit_id" --reason='Final repository and Beads audit passed.'
bd update frontend-livecoding-tasks-kln --append-notes="Implementation complete at $final_commit; all planned child issues closed; awaiting user's final story acceptance before closing the story."
bd preflight
git status --short --branch
```

Expected: B7 is closed, the top-level story remains `in_progress` only for explicit user acceptance, `bd preflight` has no blocking tracker defect, and Git is clean.

## Execution Handoff

Plan execution must use this existing story worktree and branch. Recommended execution mode is `superpowers:subagent-driven-development` with a fresh implementer and reviewer per issue; inline execution may use `superpowers:executing-plans`. In both modes Beads remains the durable source of truth, shared XML/catalog files are controller-owned, and wave work is sequential because `README.md` and `docs/knowledge-graph.xml` are shared write surfaces.
