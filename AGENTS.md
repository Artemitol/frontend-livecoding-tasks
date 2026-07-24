# Repository Guidelines

## Project Structure & Module Organization

This repository is a knowledge base for frontend live-coding exercises. Keep each exercise self-contained under `tasks/<task-name>/`, with Markdown as the primary artifact. A task document should describe the prompt, constraints, expected discussion points, and any manual verification guidance. JavaScript, TypeScript, JSX, and TSX snippets may be embedded directly in Markdown.

Only create runnable implementation code when a task explicitly requires it. In that case, keep implementation code in the task's `src/`, automated checks in `tests/` (or colocated `*.test.ts[x]` files), and static fixtures in `assets/`. Shared helpers belong in `shared/` only after at least two runnable tasks need them.

## Build, Test, and Development Commands

No build system or package manager is required for Markdown-only tasks. Do not add runtime tooling merely to store or review task documents. When adding the first runnable task, provide repository-level scripts in `package.json` and keep these standard entry points stable:

- `npm install` — install declared dependencies.
- `npm run dev -- --filter <task-name>` — start one exercise locally.
- `npm test` — run the complete automated test suite.
- `npm run lint` — check formatting and static-analysis rules.
- `npm run build` — verify production compilation.

Until those scripts exist, use `git status` to review changes and perform a manual Markdown review; do not document commands that cannot be run.

### GRACE CLI Resolution

The Grace CLI is installed through Bun, but non-interactive shells may not load the `.zshrc` entry that adds `$HOME/.bun/bin` to `PATH`. Before running Grace, resolve the executable in this order:

```bash
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
test -x "$GRACE_BIN"
"$GRACE_BIN" --version
```

Use `"$GRACE_BIN"` for subsequent Grace commands in the same shell session. Do not report Grace as unavailable after only `command -v grace` fails; first test the `$HOME/.bun/bin/grace` fallback. If neither location is executable, follow the relevant Grace skill's documented fallback workflow.

## Coding Style & Naming Conventions

Choose JavaScript, TypeScript, or React examples according to the learning goal and state that choice in the task document. For code snippets and runnable exercises, use two-space indentation, semicolons, single quotes, and trailing commas where supported. Name variables in camelCase (`formattedDuration`) and types in PascalCase (`TodoItem`). Prefer type aliases over interfaces. Name all files and task directories in kebab-case (`todo-list.md`, `debounced-search/`). Keep task-specific content and code within its task. Add formatter and linter configuration only with the first runnable code contribution, then run both before opening a pull request.

## Testing Guidelines

Markdown-only tasks do not require automated tests. Review their structure, links, code fences, terminology, and example consistency manually. When a task includes a runnable solution or bug fix, add tests using `*.test.ts` or `*.test.tsx` and describe behavior rather than implementation details. In frontend tests, prefer `data-testid` selectors when identifying elements. Do not test CSS or visual styling with automated tests; verify it manually or with browser-based visual checks. Cover the primary interaction, an edge case, and failure handling when relevant. Document any task-specific manual verification steps in its Markdown file or README.

## Task Publication Contract

- Store each accepted exercise at `tasks/<stable-slug>/README.md`; treat the slug as a stable identifier and handle renames as migrations with inbound-link verification.
- `ConciseStudentTaskCard` is the target student contract. Its exact order is title, target-editor instruction, `Условие`, one complete minimal starter block or the minimum necessary HTML fragment plus JavaScript, exactly three closed hints, closed `Решение`, and closed five-field `О задаче`.
- A focused card has one central action and normally takes 10–30 minutes. A real-work card may contain sequential related product requirements, normally takes 45–60 minutes, and uses `Приближённая к реальной работе` as its format.
- `Условие` is the only visible requirements source. Do not add `← Все подборки`, browser-back or fallback instructions, learning-goal prose, `Готово, когда`, `Самопроверка`, hint instructions, mandatory theory, a test harness, diagnostic flags, or duplicated starter code.
- Keep the root `README.md` as the student hub with exactly the four `##` blocks `Как пользоваться базой`, `Подборки по направлениям`, `Симуляции собеседований`, and `Где писать код`. At cutover it links all ten thematic, three interview, and one real-work collection plus the four approved editors; task tables, metadata-source explanations, agent-maintenance prose, Beads, GRACE, and knowledge-graph terminology do not belong there.
- The target catalog has exactly 21 task cards and 14 collection pages: ten thematic, three interview, and `collections/real-work/README.md`. Every task appears in exactly one thematic collection and no more than one interview. A confirmed real-work task additionally appears exactly once in the real-work collection; a focused task never appears there.
- Thematic entries include a linked student title, one plain-language sentence, and exact time. Interview entries include only the linked student title and exact time after the shared timer paragraph. Real-work entries include the linked student title and exact time after the shared format explanation.
- End every card with one closed `О задаче` block containing exactly `Технология`, `Подборка`, `Формат`, `Сложность`, and `Примерное время`. The legacy labels `Технологии`, `Тема`, `Уровень`, `Время`, `Навыки`, `Предварительные знания`, and `Среда выполнения` are migration inputs only and are not mandatory student-card labels.
- Use only the technology values `JavaScript`, `TypeScript`, `HTML/CSS`, `HTML/JavaScript`, `HTML/CSS/JavaScript`, and `React/TypeScript`; the format values `Написать код`, `Исправить код`, `Разобрать код`, `Предсказать результат`, and `Приближённая к реальной работе`; and the difficulty values `Базовая`, `Средняя`, and `Продвинутая`.
- For JavaScript publish one `javascript` block by default. Do not publish `<!doctype html>`, `<html>`, `<head>`, `<body>`, `<style>`, or `<script>` wrappers. If a DOM task needs declared markup, place only the semantically necessary HTML fragment before the JavaScript block. HTML/CSS tasks likewise use only the necessary fragment and editable CSS.
- Keep starter code in one complete minimal copy-ready block by default. Several files are permitted only for a real-work mini-project with genuine file boundaries. Every starter file begins with a language-appropriate `FILE: <path>` comment and is complete. The solution includes only changed files; every included solution file is complete and uses the matching starter `FILE: <path>`.
- Select exactly one target editor from the execution profile: Programiz (`https://www.programiz.com/javascript/online-compiler/`) for console JavaScript without browser APIs; CodePen (`https://pen.new`) for browser JavaScript, DOM, HTML/CSS, or ESM; TypeScript Playground (`https://www.typescriptlang.org/play/`) for pure TypeScript; or React TypeScript (`https://vite.new/react-ts`) for React with TypeScript. State any browser, ESM, framework-version, or runtime assumption next to the transfer instruction when it can affect behavior.
- Include exactly three distinct closed hints with the summaries `Подсказка 1 — куда смотреть`, `Подсказка 2 — с чего начать`, and `Подсказка 3 — почти решение`. Keep `Решение` and `О задаче` in independent `<details>` blocks without the `open` attribute.
- `Решение` contains only changed code or, for a multi-file real-work task, only changed complete files with matching starter `FILE: <path>` comments, plus a short explanation, the expected result, and a simple manual check. It does not repeat unchanged fixtures, an entire single-block starter, an HTML document, a harness, or unchanged files.
- Keep the prompt, complete starter code, text fixtures, solution, and required verification context local even when targeted external reading is linked. Text code, HTML, test data, and scenarios belong in the card; reserve `assets/` for media or other binary material that cannot reasonably be embedded.
- Publish only candidates with an `accepted` Beads validation decision. Keep `needs-rewrite`, `rejected`, and `duplicate` candidates out of `tasks/` and record their neutral decision evidence in Beads.
- Before a migrated card can pass, record `CardMigrationEvidence` in its Beads issue with exactly `slug`, `mode`, `editorProfile`, `sourceLearningGoal`, `sourcePrerequisite`, `sourceRuntimeAssumption`, `destinationLocations`, `targetEditorExpectedResult`, `targetEditorActualResult`, and `verdict`. A temporary harness is diagnostic only and never substitutes for final evidence in the named target editor.
- Validate JavaScript, TypeScript, React/DOM, UI, analysis, and output-prediction tasks with the route defined in `docs/task-validation-policy.md`. Unavailable mandatory browser or editor evidence is `BLOCKED`, never `PASS`; verify CSS and visual behavior manually in a browser rather than with unit tests.
- Treat the card's title and five-field `О задаче` block as student-facing source data. Update the card, exactly one thematic collection, zero or one interview collection, `docs/knowledge-graph.xml`, `docs/verification-plan.xml`, and Beads evidence in the same change. Keep title, duration, editor profile, links, and collection membership synchronized.
- Publish accepted cards in serialized technical waves of 8–10, except that the final incomplete wave may contain 1–7. Close each wave continuously after candidate recheck, all deterministic and hybrid gates pass, the focused commit is pushed, GitHub-rendered evidence is captured, and the complete wave report is recorded. Do not require per-wave mentor or user approval; keep the top-level story open until the user accepts the complete library after the final audit.
- While Phases 16–19 are incomplete, only these 20 pre-existing slugs may temporarily retain the legacy `StudentTaskCard` structure: `accessible-keyboard-tabs`, `browser-event-loop-order`, `container-responsive-grid`, `delegated-dynamic-list`, `discriminated-load-state`, `flex-long-text-overflow`, `idempotent-event-listeners`, `immutable-category-totals`, `loop-closure-bindings`, `modal-focus-lifecycle`, `react-batched-counter`, `react-derived-list`, `react-effect-subscription`, `react-strictmode-cleanup`, `response-union-narrowing`, `stable-product-sort`, `stale-search-response`, `this-callback-binding`, `typed-object-property`, and `validate-unknown-profile`. This compatibility state permits legacy structure only; it does not claim concise migration PASS. During Phase 19, run the complete cutover scan with the exception still present, remove the exception only after PASS, then rerun the identical scan without it; only the second PASS completes cutover.
- After cutover, run the deterministic commands in `docs/task-validation-policy.md`. They reject legacy markers, any fourth hint, any `<details open...>`, full HTML documents, invalid metadata, duplicate thematic membership, and unsupported real-work membership before a card or phase receives PASS.
- Stop instead of guessing when three distinct useful hints cannot be written; code cannot be copied and run as instructed; a required file is not described; technology, editor, or task profile is ambiguous; multiple blocks are unnecessary or lack matching `FILE:` paths; an inlined replacement does not preserve a removed asset; metadata and collection facts disagree; one task belongs to multiple thematic or interview collections; real-work membership contradicts format or duration; a required link does not open; GitHub renders details, code fences, or relative links unexpectedly; or required editor/browser evidence is unavailable. Unavailable mandatory evidence is `BLOCKED`, never `PASS`.

## Commit & Pull Request Guidelines

Agents are authorized to create branches, commits, pushes, and pull requests automatically. Never commit or push directly to `main`. Before making project changes, create or reuse a `feature/*` branch. After a coherent change passes its relevant verification gates, create a focused commit, push the active `feature/*` branch, and open a pull request targeting `main` without asking for additional permission. An explicit user instruction not to branch, commit, push, or create a pull request overrides this default for that task.

### Worktree Isolation

Before making project changes, work from an isolated Git worktree based on the current remote default branch:

1. Detect whether the current checkout is already a linked worktree. Do not create a nested worktree.
2. Run `git fetch origin` and use the resulting `origin/main` as the base; do not assume the local `main` is current.
3. Prefer a native worktree facility when the agent environment provides one. Otherwise use `git worktree add`.
4. For a Beads story, create or reuse `feature/<story-id>` and keep every child issue for that story in the same worktree and branch.
5. Prefer `.worktrees/` for a project-local manual worktree. The directory must remain ignored by Git.
6. Verify a clean project-appropriate baseline before editing. If the baseline fails, report the evidence and get direction before proceeding.
7. Before final delivery, fetch `origin` again and report branch divergence. Do not force-push, rewrite published history, or integrate a conflicting `main` without the required explicit authority.

Write commit messages in English and follow Conventional Commits 1.0.0:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Use `feat` for new functionality and `fix` for bug fixes. Other meaningful types such as `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `style`, and `perf` are allowed. Mark breaking changes with `!` after the type or scope, or with a `BREAKING CHANGE:` footer. Keep subjects short and imperative and keep each commit focused.

Use the author's existing local Git `user.name` and `user.email` for both author and committer identity. Do not add `Co-authored-by`, `Signed-off-by`, `Generated-by`, or any Codex/agent attribution to commits. Do not install or enable hooks that add agent attribution.

A Beads story is a top-level issue of type `feature` or `epic` that owns multiple child issues through the Beads parent relationship. Create or reuse one branch per story named `feature/<story-id>`. Implement, verify, commit, and push all child issues for that story on the same branch; do not create a separate branch for each child issue. For a standalone Beads issue, create or reuse an appropriate `feature/*` branch; never implement or commit the issue directly on `main`.

For a new branch, configure its upstream on the first push and create a pull request targeting `main`. Automatic Git authority does not include force-pushing, merging, deleting branches, or rewriting published history unless the user explicitly requests the specific action.

Pull requests should summarize the task, list verification commands and results, link related issues, and include screenshots or recordings for visible UI changes.

# GRACE Framework - Project Engineering Protocol

## Keywords
frontend, live-coding, knowledge-base, markdown, javascript, typescript, react

## Annotation
Knowledge base of frontend live-coding tasks maintained primarily as Markdown documents with JavaScript, TypeScript, and React examples; tasks are not expected to run from the repository by default.

## Core Principles

### 1. Never Write Code Without a Contract
Before generating or editing any module, create or update its MODULE_CONTRACT with PURPOSE, SCOPE, INPUTS, and OUTPUTS. The contract is the source of truth. Code implements the contract, not the other way around.

For Markdown-only task modules, the task document and its corresponding entries in the GRACE shared artifacts provide the contract. Add source-level semantic markup only when runnable code exists.

### 2. Semantic Markup Is Load-Bearing Structure
Markers like `// START_BLOCK_<NAME>` and `// END_BLOCK_<NAME>` are navigation anchors, not documentation. They must be:
- uniquely named
- paired
- proportionally sized so one block fits inside an LLM working window

### 3. Knowledge Graph Is Always Current
`docs/knowledge-graph.xml` is the project map. When you add a module, move a module, rename exports, or add dependencies, update the graph so future agents can navigate deterministically.

### 4. Verification Is a First-Class Artifact
Testing, traces, and log anchors are designed before large execution waves. `docs/verification-plan.xml` is part of the architecture, not an afterthought. Logs are evidence. Tests are executable contracts.

For Markdown-only modules, deterministic verification may consist of structural review, link checks, code-fence checks, and explicit manual review criteria rather than runtime tests or logs.

### 5. Top-Down Synthesis
Code generation follows:
`RequirementsAnalysis -> TechnologyStack -> DevelopmentPlan -> VerificationPlan -> Code + Tests`

Never jump straight to code when requirements, architecture, or verification intent are still unclear.

### 6. Governed Autonomy
Agents have freedom in HOW to implement, but not in WHAT to build. Contracts, plans, graph references, and verification requirements define the allowed space.

## Grep-First Navigation

Use shared docs and semantic anchors as the primary navigation surface. Prefer grep and exact-text lookup before broad prose reading.

Navigation order:

1. Shared/public truth: `docs/knowledge-graph.xml`, `docs/development-plan.xml`, `docs/verification-plan.xml`
2. File-local/private truth: `MODULE_CONTRACT`, `MODULE_MAP`, `CHANGE_SUMMARY`, function contracts, semantic blocks
3. Full file reads only after the target module, file, or block is narrowed

Canonical search anchors:

- `START_MODULE_CONTRACT` / `END_MODULE_CONTRACT`
- `START_MODULE_MAP` / `END_MODULE_MAP`
- `START_CONTRACT:` / `END_CONTRACT:`
- `START_BLOCK_` / `END_BLOCK_`
- `START_CHANGE_SUMMARY` / `END_CHANGE_SUMMARY`
- `LINKS:` for graph-linked references
- `M-` for module IDs
- `V-M-` for verification IDs
- `CrossLink` for graph edges

Canonical grep-stable naming rules:

- Module IDs use exact uppercase kebab form: `M-<TOKEN>` or `M-<TOKEN>-<TOKEN>` (`M-AUTH`, `M-USER-STORE`)
- Verification IDs use exact derived form: `V-M-<MODULE-SUFFIX>` (`V-M-AUTH`, `V-M-USER-STORE`)
- Module contract field names stay exact: `PURPOSE`, `SCOPE`, `DEPENDS`, `LINKS`, `ROLE`, `MAP_MODE`
- Function contract field names stay exact: `PURPOSE`, `INPUTS`, `OUTPUTS`, `SIDE_EFFECTS`, `LINKS`
- Semantic block names use uppercase snake form after the prefix: `START_BLOCK_VALIDATE_INPUT`
- `LINKS:` values should prefer exact IDs or canonical annotation tags instead of prose references: `M-*`, `V-M-*`, `fn-*`, `type-*`, `class-*`, `export-*`, `const-*`
- Graph edges use the exact `CrossLink from="..." to="..." relation="..."` shape; do not invent alternate attribute names

Canonical search recipes:

- Find the target module record: search `M-<ID>` in `docs/development-plan.xml` and `docs/knowledge-graph.xml`
- Find verification for a module: search `V-M-<ID>` or the module ID in `docs/verification-plan.xml`
- Find implementation files tied to graph context: search `LINKS:` plus the module ID in `tasks/` and `shared/`
- Find file-local contracts quickly: search `START_MODULE_CONTRACT` or `START_CONTRACT:`
- Find important logic slices: search `START_BLOCK_`
- Find recent local rationale: search `START_CHANGE_SUMMARY`

AI-friendly documentation rule:

- do not restate code in prose when exact anchors already exist
- record only non-obvious intent, invariants, hazards, and search hints
- if a fact can be maintained as code, XML, contract markup, or a stable anchor, keep it there instead of duplicating it in Markdown

## Semantic Markup Reference

### Module Level
```
// FILE: path/to/file.ext
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: [What this module does - one sentence]
//   SCOPE: [What operations are included]
//   DEPENDS: [List of module dependencies]
//   LINKS: [Knowledge graph references]
//   ROLE: [Optional: RUNTIME | TEST | BARREL | CONFIG | TYPES | SCRIPT]
//   MAP_MODE: [Optional: EXPORTS | LOCALS | SUMMARY | NONE]
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   exportedSymbol - one-line description
// END_MODULE_MAP
```

### Function or Component Level
Place START_CONTRACT/END_CONTRACT above function signature and docstrings/comments.
```
// START_CONTRACT: functionName
//   PURPOSE: [What it does]
//   INPUTS: { paramName: Type - description }
//   OUTPUTS: { ReturnType - description }
//   SIDE_EFFECTS: [External state changes or "none"]
//   LINKS: [Related modules/functions]
// END_CONTRACT: functionName
```

### Code Block Level
```
// START_BLOCK_VALIDATE_INPUT
// ... code ...
// END_BLOCK_VALIDATE_INPUT
```

### Change Tracking
```
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.2.0 - What changed and why]
// END_CHANGE_SUMMARY
```

### Optional Lint Semantics

Use `ROLE` and `MAP_MODE` only when the file should be linted differently from a normal runtime module.

- `RUNTIME` + `EXPORTS`: normal source files with public APIs
- `TEST` + `LOCALS`: tests where the map should describe helpers, fixtures, and assertion surfaces
- `BARREL` + `SUMMARY`: re-export aggregators and grouped entry points
- `CONFIG` + `NONE`: build or tool configuration files
- `TYPES` + `EXPORTS`: pure type/interface modules
- `SCRIPT` + `LOCALS`: CLI/bootstrap/smoke scripts

## Logging and Trace Convention

When runnable code exists, all important logs must point back to semantic blocks:
```
logger.info(`[ModuleName][functionName][BLOCK_NAME] message`, {
  correlationId,
  stableField: value,
});
```

Rules:
- prefer structured fields over prose-heavy log lines
- redact secrets and high-risk payloads
- treat missing log anchors on critical branches as a verification defect
- update tests when log markers change intentionally
- do not introduce logging or observability dependencies for Markdown-only tasks

## Verification Conventions

`docs/verification-plan.xml` is the project-wide verification contract. Keep it current when module scope, test files, commands, critical log markers, manual review criteria, or gate expectations change. Use `docs/operational-packets.xml` as the canonical schema for execution packets, graph deltas, verification deltas, and failure handoff packets.

Testing rules:
- deterministic assertions first
- for Markdown-only tasks, prefer deterministic document checks and explicit manual review evidence
- trace or log assertions when trajectory matters in runnable code
- test files may also carry MODULE_CONTRACT, MODULE_MAP, semantic blocks, and CHANGE_SUMMARY when they are substantial
- module-local tests should stay close to the runnable module they verify
- wave-level and phase-level checks should be explicit in the verification plan

## File Structure
```
docs/
  requirements.xml        - Product requirements and use cases
  technology.xml          - Stack decisions, tooling, observability, testing
  development-plan.xml    - Modules, phases, data flows, ownership, write scopes
  verification-plan.xml   - Verification strategy, evidence, module and phase gates
  knowledge-graph.xml     - Project-wide navigation graph
  operational-packets.xml - Canonical packet, delta, and failure handoff templates
tasks/
  <task-name>/             - Self-contained Markdown task and optional runnable artifacts
shared/                    - Content or code reused by at least two tasks
```

## Documentation Artifacts - Unique Tag Convention

In `docs/*.xml`, repeated entities must use their unique ID as the XML tag name instead of a generic tag with an `ID` attribute. This reduces closing-tag ambiguity and gives LLMs stronger anchors.

### Tag naming conventions

| Entity type | Anti-pattern | Correct (unique tags) |
|---|---|---|
| Module | `<Module ID="M-CONFIG">...</Module>` | `<M-CONFIG NAME="Config" TYPE="UTILITY">...</M-CONFIG>` |
| Verification module | `<Verification ID="V-M-AUTH">...</Verification>` | `<V-M-AUTH MODULE="M-AUTH">...</V-M-AUTH>` |
| Phase | `<Phase number="1">...</Phase>` | `<Phase-1 name="Foundation">...</Phase-1>` |
| Flow | `<Flow ID="DF-SEARCH">...</Flow>` | `<DF-SEARCH NAME="...">...</DF-SEARCH>` |
| Use case | `<UseCase ID="UC-001">...</UseCase>` | `<UC-001>...</UC-001>` |
| Step | `<step order="1">...</step>` | `<step-1>...</step-1>` |
| Export | `<export name="config" .../>` | `<export-config .../>` |
| Function | `<function name="search" .../>` | `<fn-search .../>` |
| Type | `<type name="SearchResult" .../>` | `<type-SearchResult .../>` |
| Class | `<class name="Error" .../>` | `<class-Error .../>` |

### What NOT to change
- `CrossLink` tags stay self-closing
- single-use structural wrappers like `<contract>`, `<inputs>`, `<outputs>`, `<annotations>`, `<test-files>`, `<module-checks>`, and `<phase-gates>` stay generic
- code-level markup already uses unique names and stays as-is

## Rules for Modifications

1. Read the MODULE_CONTRACT before editing any runnable code file; for Markdown-only tasks, read the task document and shared GRACE references first.
2. After editing source or test files, update MODULE_MAP in a way that matches the file's role and map mode.
3. After adding or removing modules, update `docs/knowledge-graph.xml`.
4. After changing test files, commands, critical scenarios, manual review criteria, or log markers, update `docs/verification-plan.xml`.
5. After fixing bugs, add a CHANGE_SUMMARY entry and strengthen nearby verification if the old evidence was weak.
6. Never remove semantic markup anchors unless the structure is intentionally replaced with better anchors.

<!-- BEGIN BEADS CODEX SETUP: generated by bd setup codex -->
## Beads Issue Tracker

Use Beads (`bd`) for durable task tracking in repositories that include it. Use the `beads` skill at `.agents/skills/beads/SKILL.md` (project install) or `~/.agents/skills/beads/SKILL.md` (global install) for Beads workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh Beads context
```

### Rules

- Use `bd` for all task tracking; do not create markdown task lists.
- Run `bd prime` when Beads context is missing or stale. Codex 0.129.0+ can load Beads context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in Beads via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.
<!-- END BEADS CODEX SETUP -->
