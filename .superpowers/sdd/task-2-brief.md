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

