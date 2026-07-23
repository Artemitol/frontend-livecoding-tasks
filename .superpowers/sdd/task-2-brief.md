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

