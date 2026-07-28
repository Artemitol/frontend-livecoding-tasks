# Политика валидации frontend live-coding задач

## Назначение

Эта политика отделяет подготовку кандидата, миграцию опубликованной карточки и
финальный catalog cutover. Только решение `accepted` создаёт
`AcceptedTaskCard`; остальные решения остаются нейтральными Beads records и не
создают файлов в `tasks/`.

## Целевые интерфейсы

`ConciseStudentTaskCard` содержит в таком порядке:

```text
title
target-editor instruction
Условие
one complete minimal starter block or minimum required HTML plus JavaScript
three independent closed hints
closed Решение with changed code, explanation, expected result, and manual check
closed five-field О задаче
```

Сфокусированная карточка содержит одно центральное действие и обычно занимает
10–30 минут. `Условие` является единственным видимым источником требований.

Карточка, приближённая к реальной работе, может содержать последовательные
связанные продуктовые требования и обычно занимает 45–60 минут. Она сохраняет
тот же порядок disclosure и metadata, входит ровно в одну thematic collection,
дополнительно входит в `collections/real-work/README.md` и входит не более чем
в одну interview collection.

`StudentHub` сохраняет ровно четыре блока второго уровня: `Как пользоваться
базой`, `Подборки по направлениям`, `Симуляции собеседований` и `Где писать
код`. После Phase 19 он ссылается на десять thematic, три interview и одну
real-work collection page, а также на четыре утверждённых редактора.

Целевой каталог после Phase 19 содержит 21 карточку и 14 collection pages:
десять thematic, три interview и одну real-work. `users-api-list` — единственная
real-work карточка в этом cutover; добавление следующей требует отдельного
accepted решения и синхронного обновления контракта.

`CardMigrationEvidence` содержит:

```text
slug | mode | editorProfile | sourceLearningGoal | sourcePrerequisite |
sourceRuntimeAssumption | destinationLocations | targetEditorExpectedResult |
targetEditorActualResult | verdict
```

Полная запись хранится в Beads issue соответствующей карточки. Оба поля
`targetEditor...` сохраняются только для совместимости схемы и в Markdown-only
delivery получают явное значение `NOT_RUN: Markdown-only delivery`. `verdict`
вычисляется по локальным deterministic Markdown, collection, XML и Beads checks;
внешний редактор, браузер или GitHub-rendered page не являются gate и не могут
сделать карточку `BLOCKED`.

## Временная совместимость

Пока хотя бы одна из Phases 16–19 не завершена, legacy-структуру разрешено
временно сохранять только этим двадцати уже существующим slug:

```text
accessible-keyboard-tabs
browser-event-loop-order
container-responsive-grid
delegated-dynamic-list
discriminated-load-state
flex-long-text-overflow
idempotent-event-listeners
immutable-category-totals
loop-closure-bindings
modal-focus-lifecycle
react-batched-counter
react-derived-list
react-effect-subscription
react-strictmode-cleanup
response-union-narrowing
stable-product-sort
stale-search-response
this-callback-binding
typed-object-property
validate-unknown-profile
```

Исключение разрешает только старую структуру. Оно не доказывает миграцию,
локальный deterministic PASS или новый catalog cutover. Новый `users-api-list` сразу
создаётся как `ConciseStudentTaskCard` и в список не входит. В Task 6 /
Phase 19 полный cutover scan сначала выполняется при сохранённом исключении.
Исключение удаляется только после этого PASS, затем тот же полный scan сразу
повторяется без исключения. Только повторный PASS разрешает завершить cutover.

## Контракт карточки

- Карточка находится в `tasks/<stable-slug>/README.md`.
- В карточке нет `← Все подборки`, browser-back или fallback instruction,
  учебной цели, `Готово, когда`, `Самопроверки`, инструкции к hints,
  обязательной теории, опубликованного harness или повторения starter в solution.
- Закрытый блок `О задаче` содержит ровно `Технология`, `Подборка`, `Формат`,
  `Сложность` и `Примерное время`.
- Технологии: `JavaScript`, `TypeScript`, `HTML/CSS`, `HTML/JavaScript`,
  `HTML/CSS/JavaScript`, `React/TypeScript`.
- Форматы: `Написать код`, `Исправить код`, `Разобрать код`, `Предсказать
  результат`, `Приближённая к реальной работе`.
- Сложности: `Базовая`, `Средняя`, `Продвинутая`; время — целое число минут.
- Сохраняются ровно три независимые закрытые hints с summaries `Подсказка 1 —
  куда смотреть`, `Подсказка 2 — с чего начать`, `Подсказка 3 — почти решение`.
- `Решение` и `О задаче` находятся в независимых `<details>` без атрибута
  `open`.
- Solution показывает только изменённую функцию, обработчик, CSS-фрагмент или
  компонент. Для multi-file real-work задачи solution включает только
  изменённые файлы; каждый включённый файл полный и использует matching starter
  `FILE: <path>`. Затем следуют короткое объяснение, ожидаемый результат и
  ручная проверка.

## Starter и редакторы

| Editor profile | Target editor | URL | Copy/run contract |
| --- | --- | --- | --- |
| Console JavaScript без browser API | Programiz JavaScript Online Compiler | `https://www.programiz.com/javascript/online-compiler/` | Один полный минимальный JavaScript block |
| Browser JavaScript, DOM, HTML/CSS или ESM | CodePen | `https://pen.new` | Минимально необходимые HTML/CSS/JavaScript fragments; инструкция фиксирует classic script или ESM |
| Чистый TypeScript | TypeScript Playground | `https://www.typescriptlang.org/play/` | Один минимальный TypeScript block |
| React + TypeScript | React TypeScript | `https://vite.new/react-ts` | Полная замена `src/App.tsx`; несколько файлов только для оправданной real-work структуры |

JavaScript-задача по умолчанию публикует один `javascript` block. Полный
HTML-документ, `<!doctype html>`, `<html>`, `<head>`, `<body>`, `<style>` и
`<script>` wrappers запрещены. DOM-задача может поставить перед JavaScript
только минимальный HTML-фрагмент с семантически необходимыми элементами.
HTML/CSS-задача также публикует только необходимый fragment и изменяемый CSS.

Starter использует один минимальный copy-ready block. Несколько файлов
разрешены только real-work задаче с настоящими file boundaries; каждый starter
file полный и начинается с language-appropriate `FILE: <path>` comment.
Solution публикует только изменённые файлы, но каждый включённый solution file
остаётся полным и использует matching starter `FILE: <path>`. Временный harness
не требуется и не является частью Markdown-only delivery.

## Gates

Gates выполняются по порядку. Провал не разрешает последующим gates выдать
`accepted` или `PASS`.

1. `Identity` — отклонить semantic duplicate или объединить полезное отличие с
   canonical candidate.
2. `Task class` — подтвердить одно центральное действие для focused или
   связанные последовательные требования и 45–60 минут для real-work.
3. `Student contract` — зафиксировать пять metadata fields, editor profile,
   observable result и target collection membership.
4. `Local completeness` — сохранить условие, минимальный starter, solution и
   обязательный verification context локально.
5. `Preservation` — записать source learning goal, prerequisite и runtime
   assumption с точными destination locations или concrete not-applicable.
6. `Structure` — проверить точный concise order, один минимальный block или
   оправданные real files, `FILE:` parity, три exact hints и closed details.
7. `Solution and content` — доказать соответствие условию, отсутствие
   дублирования окружения и реальную прогрессию hints.
8. `Markdown evidence` — проверить условие, starter, solution, expected result
   и manual check только по repository Markdown; записать оба `targetEditor...`
   поля как `NOT_RUN: Markdown-only delivery`, а verdict вывести из локальных
   deterministic checks.
9. `Synchronization` — синхронизировать одну thematic, ноль или одну interview,
   optional real-work, graph, verification и Beads evidence.
10. `Local presentation` — проверить исходный Markdown: порядок headings,
    парность `<details>`, language fences и разрешение локальных relative links.

## Evidence matrix

| Task kind | Required local evidence | Stop / failure signal |
| --- | --- | --- |
| Console JavaScript | Complete starter, solution, expected output и manual check в Markdown | Hidden Node/browser dependency или внутреннее противоречие |
| Browser JavaScript / DOM / HTML/CSS / ESM | Минимальные fragments, явный runtime mode, solution и описанный manual check | Hidden wrapper, mode ambiguity или неполный fragment |
| TypeScript | Complete typed starter, solution и ожидаемый type/runtime result в Markdown | Version ambiguity или необъяснённая type claim |
| React / TypeScript | Полный declared file starter, changed-file solution и описанные state/lifecycle results | Hidden environment dependency или неполный lifecycle contract |
| Разобрать код | Written trace, согласованный со starter и explanation | Unsupported causal claim |
| Предсказать результат | Written execution trace и exact expected output | Timing, environment или output ambiguity |
| Real work | Все последовательные требования, loading/error/empty states и заявленные boundaries | Частичный результат выдан за complete PASS |
| Markdown | Deterministic structure, details, fences, metadata и membership scans | Лишний anchor, hint, wrapper, field или membership |

CSS и visual behavior не проверяются автоматическими тестами. Markdown-only gate
проверяет полноту условия, CSS starter/solution и формулировку manual check без
запуска браузера.

## Синхронизация

Одно изменение карточки синхронизирует:

```text
tasks/<slug>/README.md
→ ровно один thematic README
→ ноль или один interview README
→ real-work README только для подтверждённого real-work формата
→ docs/knowledge-graph.xml
→ docs/verification-plan.xml
→ Beads CardMigrationEvidence
```

Title, integer duration, editor profile, format and membership должны совпасть.
Slug rename остаётся отдельной migration с inbound-link evidence.

## Детерминированный cutover gate

Весь блок ниже запускается дважды. Первый запуск выполняется при сохранённом
временном исключении. Только после полного первого PASS удаляется исключение из
`AGENTS.md` и этой политики. Затем без изменений команд выполняется второй
запуск уже после удаления. Только второй PASS завершает Phase 19:

```bash
test "$(find tasks -mindepth 2 -maxdepth 2 -name README.md | wc -l | tr -d ' ')" -eq 21
test "$(find collections -mindepth 2 -maxdepth 3 -name README.md | wc -l | tr -d ' ')" -eq 14
test "$(find tasks -mindepth 2 -maxdepth 2 -name README.md -print0 | xargs -0 rg -l 'Готово, когда|Самопроверка|← Все подборки|Потерялись\?' | wc -l | tr -d ' ')" -eq 0
! rg -n '<details[^>]*[[:space:]]open([[:space:]=]|>)' tasks/*/README.md
! rg -n '<!doctype[[:space:]]+html|<html([[:space:]>])|<head([[:space:]>])|<body([[:space:]>])|<style([[:space:]>])|<script([[:space:]>])' tasks/*/README.md
while IFS= read -r cardFile; do
  test "$(rg -c '^<summary>Подсказка 1 — куда смотреть</summary>$' "$cardFile")" -eq 1
  test "$(rg -c '^<summary>Подсказка 2 — с чего начать</summary>$' "$cardFile")" -eq 1
  test "$(rg -c '^<summary>Подсказка 3 — почти решение</summary>$' "$cardFile")" -eq 1
  test "$(rg -c '<summary>Подсказка ' "$cardFile")" -eq 3
  test "$(rg -c '^- Технология:|^- Подборка:|^- Формат:|^- Сложность:|^- Примерное время:' "$cardFile")" -eq 5
  rg -q '^- Технология: (JavaScript|TypeScript|HTML/CSS|HTML/JavaScript|HTML/CSS/JavaScript|React/TypeScript)$' "$cardFile"
  rg -q '^- Подборка: .+$' "$cardFile"
  rg -q '^- Формат: (Написать код|Исправить код|Разобрать код|Предсказать результат|Приближённая к реальной работе)$' "$cardFile"
  rg -q '^- Сложность: (Базовая|Средняя|Продвинутая)$' "$cardFile"
  rg -q '^- Примерное время: [1-9][0-9]* минут$' "$cardFile"
  slug="${cardFile#tasks/}"
  slug="${slug%/README.md}"
  test "$(rg -l "tasks/$slug/README\\.md" collections/javascript collections/typescript collections/html-css collections/react | wc -l | tr -d ' ')" -eq 1
done < <(find tasks -mindepth 2 -maxdepth 2 -name README.md | sort)
test "$(rg -o 'tasks/[a-z0-9-]+/README\.md' collections/real-work/README.md | sort -u)" = 'tasks/users-api-list/README.md'
test -z "$(comm -3 <(rg -l '^- Формат: Приближённая к реальной работе$' tasks/*/README.md | sort) <(rg -o 'tasks/[a-z0-9-]+/README\.md' collections/real-work/README.md | sort -u))"
```

Каждая exact hint summary обязана встретиться ровно один раз, а общий count
остаётся равен трём; это отклоняет missing, duplicate и четвёртую подсказку.
Metadata checks отклоняют missing, duplicate и controlled-vocabulary drift.
Thematic loop отклоняет нулевую или duplicate membership. Сравнение множеств
real-work формата и collection membership отклоняет focused entry в
`collections/real-work/README.md` и real-work card вне этой страницы.

## Stop conditions

Остановиться, если невозможно написать три разные полезные hints; условие
нельзя свести к одному действию без изменения смысла; minimal starter
недостаточен; solution требует hidden environment; technology, editor
instruction, format или collection неоднозначны; multiple files не являются
настоящими частями real-work мини-проекта; metadata и collections расходятся;
real-work membership противоречит format или time; обязательная локальная
relative link не разрешается; deterministic evidence неполно или противоречиво.

Нельзя выдавать compatibility state или partial real-work result за `PASS`.
Top-level story закрывается только после Phase 20 local catalog audit и явного
пользовательского acceptance.
