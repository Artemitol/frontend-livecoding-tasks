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
  --description='Scope: prove final candidate, task, catalog, graph, link, GRACE, Git, and mentor-acceptance consistency.' \
  --acceptance='Every candidate is terminal with no needs-rewrite; every accepted task is unique, verified, linked, graph-indexed, and mentor-accepted; all defined gates pass; branch divergence is reported.' \
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
- Publish accepted cards in mentor-reviewed waves of 8–10, except that the final incomplete wave may contain 1–7. Keep the wave issue open until mentor acceptance is recorded.
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

