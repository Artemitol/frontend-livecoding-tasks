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

