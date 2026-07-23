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
  --acceptance='One ordered validation decision, reason, evidence type, observed result, duplicate target, wave ID, remaining risk, and wave-acceptance status are recorded; only accepted may be published.' \
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
  --description="Scope: publish accepted candidates $wave_candidate_ids atomically as task cards, catalog rows, graph annotations, verification evidence, and a mentor-reviewed report." \
  --acceptance="Wave size $wave_size is valid; every candidate is accepted; task/catalog/graph/evidence gates pass; the focused commit is pushed; mentor acceptance is recorded before close." \
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

