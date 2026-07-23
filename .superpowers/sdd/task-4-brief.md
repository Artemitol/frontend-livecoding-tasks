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

Принятых задач пока нет. Первая тематическая таблица появится после строгой валидации и принятия первой волны ментором.

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

