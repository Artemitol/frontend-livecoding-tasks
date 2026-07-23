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

