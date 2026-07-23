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

