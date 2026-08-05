# ARMY-97 Topic Navigation Follow-up Design

## Status

- Linear issue: `ARMY-97`
- Beads issue: `frontend-livecoding-tasks-army-97-topic-navigation`
- Target branch: `feature/army-97`
- Parent design: `docs/superpowers/specs/2026-07-29-army-97-interview-practice-library-design.md`
- Dialogue design approved on 2026-08-04
- Implementation remains unauthorized until this written specification is reviewed

## Problem

The completed ARMY-97 catalog has 118 immutable task cards, but its thematic
navigation is still four broad technology lists: JavaScript, TypeScript,
React, and HTML/CSS. The JavaScript page alone mixes Event Loop, Promise,
prototype behavior, closures, DOM, algorithms, data structures, and coercion.
A student cannot choose one mechanism and continue drilling that mechanism as
the library grows.

The task cards also expose unnecessary environment wording inside starter
comments, use an advanced testing term for ordinary examples, and hide their
otherwise stable `task-XXXX` identity from student-facing headings and links.

The existing thirty simulations contain two tasks each. Once thematic
collections become real topic drills, each simulation should exercise at least
three different topics.

## Goal

Replace the four broad task lists with a fixed-depth student navigation tree:

```text
root README -> master technology -> topic -> append-only task list
```

Keep every immutable task path, assign every card to exactly one master and
one topic, expose task IDs consistently, simplify student wording, and expand
all thirty simulations to three tasks from at least three topics.

## Superseded Parent Rules

This follow-up changes the parent design only where this section says so.

- Task IDs are no longer hidden from students. They appear first in every card
  H1 and every internal task link.
- A thematic collection is now a topic drill at depth three, not one of four
  broad technology lists.
- The four broad technology pages become master indexes and contain topics,
  not tasks.
- A simulation must cover at least three topic collections. It does not need
  to cover multiple master technologies.
- The student card vocabulary rejects the testing term named in
  `Forbidden student vocabulary` below.

Immutable paths, one thematic membership, five metadata fields, real-work
projection rules, provenance exclusion, Markdown-only validation, thirty
static simulations, and the three-simulation recurrence rule remain in force.

## Considered Approaches

### Approved: derived two-level catalog

Keep cards at `tasks/task-XXXX/README.md`. Store the exact master/topic value
in card metadata, project each card once into a topic page, and project topics
into master pages with validated counts.

This preserves immutable task identity, requires no generator, and gives the
validator one deterministic ownership chain.

### Rejected: multi-tag generated index

Multiple tags would make cross-topic discovery flexible, but they contradict
the approved single-primary-topic contract and introduce generation tooling
into a Markdown-only repository.

### Rejected: topic-encoded task paths

Moving cards beneath technology and topic directories would make the file tree
mirror navigation, but it would break immutable task URLs, simulation links,
real-work links, Beads evidence, and external references.

## Repository Architecture

```text
README.md
collections/
  javascript/
    README.md
    event-loop/README.md
    promises-and-async/README.md
    ...
  typescript/
    README.md
    generics-and-object-keys/README.md
    ...
  react/
    README.md
    state-and-event-handlers/README.md
    ...
  html-css/
    README.md
    cascade-and-selectors/README.md
  real-work/README.md
  interviews/
    README.md
    simulation-001/README.md
    ...
tasks/
  task-0001/README.md
  ...
  task-0118/README.md
```

The following legacy broad pages are removed atomically, without compatibility
stubs:

- `collections/javascript/interview-practice/README.md`
- `collections/typescript/interview-practice/README.md`
- `collections/react/interview-practice/README.md`
- `collections/html-css/interview-practice/README.md`

## Ownership and Data Flow

The card H1 and five-field `О задаче` block remain student-facing source data.
The exact `Подборка` value owns the card's master and topic classification.

```text
task metadata
  -> exactly one topic row
  -> exactly one master topic entry and count
  -> optional real-work row
  -> optional simulation rows
  -> GRACE graph and Beads frozen mapping
```

Topic pages are the only files counted for thematic membership. Master pages,
real-work, interview indexes, and simulation pages never satisfy or duplicate
the one-topic requirement.

## Navigation Contract

The root README links only the four master technologies, real-work, the
interview index, and the four approved sandboxes through its existing four
second-level sections.

A master page contains a breadcrumb and a topic list. It does not repeat task
rows.

```markdown
[Главная](../../README.md) → JavaScript

- [Event loop и очереди задач](event-loop/README.md) — 7 задач — Порядок синхронного кода, microtask и timer.
```

A topic page contains a breadcrumb and one append-only ordered task list.

```markdown
[Главная](../../../README.md) → [JavaScript](../README.md) → Event loop и очереди задач

1. [task-0015 — Три timer после Promise](../../../tasks/task-0015/README.md) — Средняя · 15 минут — Определите порядок синхронного кода, microtask и timer.
```

Rules:

- Breadcrumbs exist on master and topic pages only.
- Task cards contain no breadcrumb, back link, or fallback navigation.
- Every topic row begins with an ordinal and exact `task-XXXX — Title` link.
- Difficulty and duration match card metadata exactly.
- The final field is one short, substantive Russian description sentence.
- Existing cards retain ascending `task-XXXX` order inside their new topic.
- Later tasks append to the end. Existing rows are not reordered merely to
  create a learning progression.
- A deliberate classification correction is a separately verified migration,
  not an ordinary append.
- A topic has no minimum or maximum size. Its boundary follows the mechanism,
  not a quota.

## Student Card Contract Changes

The H1 is exact:

```markdown
# task-0015 — Три timer после Promise
```

Every task link in topic, real-work, and simulation pages uses the same visible
identity:

```markdown
[task-0015 — Три timer после Promise](path/to/task-0015/README.md)
```

The metadata collection field is plain text, not a back link:

```markdown
- Подборка: JavaScript → Event loop и очереди задач
```

The remaining H1 title text and every linked title must match exactly after the
`task-XXXX — ` prefix is removed.

## Environment Wording Cleanup

The selected sandbox line already identifies the execution surface. Starter
comments must not restate negative environment instructions such as:

- console JavaScript without ESM;
- JavaScript without browser APIs;
- pure or modern TypeScript without browser APIs;
- CodePen without ESM;
- equivalent wording that tells the student which environment is absent.

When such wording shares a comment with a real requirement, edit the sentence
instead of deleting the whole comment. Preserve expected output, input
immutability, local data, allowed APIs, event behavior, timing, callback
counts, and other task semantics.

Positive behavior requirements remain when the task depends on them. Examples
include using `setTimeout`, handling a `click`, avoiding a network request, or
preserving an input array. These describe the task, not an absent environment.

The sandbox-to-technology validator remains responsible for detecting whether
Programiz, CodePen, TypeScript Playground, or React TypeScript is appropriate.

For the current 118-card catalog, the student-content gate rejects matches for
these exact case-insensitive patterns anywhere under `tasks/**`:

- `\bESM\b`;
- `browser[ -]?API|браузерн\p{L}*[[:space:]]+API`;
- `консольн\p{L}*[[:space:]]+JavaScript`;
- `(используйте|используй).*`
  `(обычн\p{L}*|современн\p{L}*|чист\p{L}*).*(JavaScript|TypeScript)`;
- `CodePen.*(без|without).*`
  `(режим|mode|ESM|препроцесс|preprocessor|API|модул)`.

The gate does not ban ordinary references to `window`, `document`, DOM,
timers, events, or other APIs that are part of a task's actual behavior.

## Forbidden Student Vocabulary

The words `fixture`, `fixtures`, and every Russian inflection of the same
testing term are prohibited throughout `tasks/**`, including starter code,
solutions, hints, manual checks, and code identifiers.

Use:

- `пример` or `примеры` for ordinary inputs and expected results;
- `тестовые данные` for a declared data set;
- `мок` only when a dependency is actually replaced by a controlled
  implementation;
- domain-specific identifiers such as `TREE_EXAMPLE`, `RATE_EXAMPLES`,
  `sampleUsers`, or `mockFetch` according to meaning.

Internal engineering specifications, plans, XML history, tests, and Beads may
retain the technical term. The student-content gate applies to `tasks/**`.

## Master and Topic Registry

Visible topic names are Russian with conventional technical terms. Directory
slugs are English kebab-case.

### JavaScript

| Slug | Visible topic | Initial task IDs |
|---|---|---|
| `event-loop` | Event loop и очереди задач | `task-0015`, `task-0016`, `task-0018`, `task-0019`, `task-0020`, `task-0023`, `task-0025` |
| `promises-and-async` | Promise и async/await | `task-0017`, `task-0021`, `task-0022`, `task-0024`, `task-0026`, `task-0027`, `task-0028`, `task-0029`, `task-0051`, `task-0059` |
| `prototypes-inheritance-and-this` | Прототипы, наследование и `this` | `task-0030`, `task-0031`, `task-0032`, `task-0034`, `task-0035`, `task-0036` |
| `functions-closures-and-scope` | Функции, замыкания и область видимости | `task-0039`, `task-0047`, `task-0052`, `task-0060`, `task-0061`, `task-0062`, `task-0065`, `task-0066`, `task-0068`, `task-0069`, `task-0070`, `task-0071`, `task-0072`, `task-0113` |
| `objects-and-collections` | Объекты и коллекции | `task-0033`, `task-0040`, `task-0041`, `task-0042`, `task-0043`, `task-0044`, `task-0045`, `task-0050`, `task-0118` |
| `dom-and-events` | DOM и события | `task-0048`, `task-0058`, `task-0067` |
| `dates-and-time-intervals` | Даты и временные интервалы | `task-0037`, `task-0053`, `task-0054` |
| `arrays-search-and-sorting` | Массивы, поиск и сортировка | `task-0046`, `task-0082`, `task-0083`, `task-0084`, `task-0087`, `task-0088`, `task-0090`, `task-0095`, `task-0100` |
| `strings` | Строки | `task-0085`, `task-0086`, `task-0097`, `task-0098`, `task-0099` |
| `trees-and-recursion` | Деревья и рекурсия | `task-0073`, `task-0074`, `task-0075`, `task-0076`, `task-0077`, `task-0078`, `task-0079`, `task-0080`, `task-0081`, `task-0091`, `task-0096` |
| `graphs` | Графы | `task-0055`, `task-0056` |
| `linked-lists-and-stack` | Связные списки и стек | `task-0064`, `task-0089`, `task-0092`, `task-0093`, `task-0094` |
| `numbers-types-and-operators` | Числа, типы и операторы | `task-0109`, `task-0110`, `task-0111`, `task-0112`, `task-0114`, `task-0115`, `task-0116`, `task-0117` |

The JavaScript registry contains exactly 92 initial cards.

### TypeScript

| Slug | Visible topic | Initial task IDs |
|---|---|---|
| `generics-and-object-keys` | Дженерики и ключи объектов | `task-0038`, `task-0102`, `task-0106` |
| `mapped-and-conditional-types` | Mapped и conditional types | `task-0101`, `task-0103`, `task-0105` |
| `recursive-types` | Рекурсивные типы | `task-0104` |
| `integration-typing` | Типизация интеграций | `task-0057` |

The TypeScript registry contains exactly 8 initial cards.

### React

| Slug | Visible topic | Initial task IDs |
|---|---|---|
| `state-and-event-handlers` | Состояние и обработчики событий | `task-0009`, `task-0063` |
| `effects-timers-and-cleanup` | Эффекты, таймеры и очистка | `task-0001`, `task-0005`, `task-0014` |
| `rendering-and-memoization` | Рендеринг и мемоизация | `task-0002`, `task-0003`, `task-0007` |
| `async-data-and-ui-states` | Асинхронные данные и состояния интерфейса | `task-0004`, `task-0006`, `task-0008`, `task-0010` |
| `component-composition-and-state-management` | Композиция компонентов и управление состоянием | `task-0011`, `task-0012`, `task-0013`, `task-0049` |

The React registry contains exactly 16 initial cards.

### HTML/CSS

| Slug | Visible topic | Initial task IDs |
|---|---|---|
| `cascade-and-selectors` | Каскад и селекторы | `task-0107`, `task-0108` |

The HTML/CSS registry contains exactly 2 initial cards.

## Simulation Contract

All thirty existing simulation paths and numbers remain stable. Each current
simulation is migrated to exactly three task rows:

- preserve the existing first two tasks and their order;
- append one third task from a third topic;
- cover at least three distinct topics across the three rows;
- allow all topics to belong to the same master technology;
- keep declared total time equal to the three card durations;
- keep total time between 30 and 120 minutes;
- keep every task absent from any other simulation in the same rolling window
  of three consecutive simulations;
- retain one substantive `Реализм:` sentence.

Future simulations may contain more than three tasks or topics, but never
fewer than three topics.

The exact third-task projection for the current migration is frozen below.
Each row preserves the existing pair and appends the named task.

| Simulation | Third task | Topic | New total |
|---|---|---|---|
| `simulation-001` | `task-0033 — Опечатка во вложенном свойстве` | Объекты и коллекции | 55 минут |
| `simulation-002` | `task-0016 — Цепочка Promise между двумя timer` | Event loop и очереди задач | 45 минут |
| `simulation-003` | `task-0030 — Замена prototype после создания объекта` | Прототипы, наследование и `this` | 50 минут |
| `simulation-004` | `task-0065 — Снимок и актуальное значение в замыкании` | Функции, замыкания и область видимости | 90 минут |
| `simulation-005` | `task-0087 — Вычитание значений одного массива из другого` | Массивы, поиск и сортировка | 60 минут |
| `simulation-006` | `task-0098 — Поиск строк с подстрокой` | Строки | 90 минут |
| `simulation-007` | `task-0109 — Сравнение десятичных дробей` | Числа, типы и операторы | 65 минут |
| `simulation-008` | `task-0067 — Индексы DOM-обработчиков в цикле` | DOM и события | 95 минут |
| `simulation-009` | `task-0074 — Сумма числовых листьев` | Деревья и рекурсия | 60 минут |
| `simulation-010` | `task-0089 — Проверка вложенных скобок` | Связные списки и стек | 65 минут |
| `simulation-011` | `task-0037 — Стоимость проживания по дням недели` | Даты и временные интервалы | 60 минут |
| `simulation-012` | `task-0063 — Игра «Память» с перезапуском` | Состояние и обработчики событий | 115 минут |
| `simulation-013` | `task-0031 — Привязка отсоединённого метода` | Прототипы, наследование и `this` | 100 минут |
| `simulation-014` | `task-0044 — Объект из ключей и значений` | Объекты и коллекции | 70 минут |
| `simulation-015` | `task-0100 — Упорядоченная подпоследовательность` | Массивы, поиск и сортировка | 60 минут |
| `simulation-016` | `task-0066 — Актуальное сообщение в замыкании` | Функции, замыкания и область видимости | 70 минут |
| `simulation-017` | `task-0111 — NaN и сравнение с самим собой` | Числа, типы и операторы | 95 минут |
| `simulation-018` | `task-0077 — Рекурсивное раскрытие объекта` | Деревья и рекурсия | 85 минут |
| `simulation-019` | `task-0085 — Проверка двух строк на анаграмму` | Строки | 70 минут |
| `simulation-020` | `task-0092 — Односвязный список` | Связные списки и стек | 70 минут |
| `simulation-021` | `task-0032 — Повторная привязка функции` | Прототипы, наследование и `this` | 75 минут |
| `simulation-022` | `task-0045 — Разделение игроков по командам` | Объекты и коллекции | 55 минут |
| `simulation-023` | `task-0068 — var в отложенных callback` | Функции, замыкания и область видимости | 60 минут |
| `simulation-024` | `task-0112 — Пустые Math.max и Math.min` | Числа, типы и операторы | 60 минут |
| `simulation-025` | `task-0080 — Чтение значения по точечному пути` | Деревья и рекурсия | 80 минут |
| `simulation-026` | `task-0082 — Слияние двух отсортированных массивов` | Массивы, поиск и сортировка | 65 минут |
| `simulation-027` | `task-0097 — Разворот каждого второго слова` | Строки | 70 минут |
| `simulation-028` | `task-0093 — Слияние отсортированных списков` | Связные списки и стек | 115 минут |
| `simulation-029` | `task-0035 — Собственные и унаследованные свойства` | Прототипы, наследование и `this` | 65 минут |
| `simulation-030` | `task-0114 — Сложение пустых массива и объекта` | Числа, типы и операторы | 95 минут |

## Validation Architecture

The tracked catalog validator and its Node tests gain a topic registry with:

- master slug and display name;
- topic slug and display name;
- exact `Подборка` value;
- expected current task IDs;
- expected master count derived from its topic rows.

The full final gate verifies:

1. exactly 118 contiguous task paths from `task-0001` through `task-0118`;
2. H1 identity and task-link identity use `task-XXXX — Title`;
3. every card appears in exactly one registered topic page;
4. card metadata master/topic equals that page's registry entry;
5. every topic row matches H1, difficulty, duration, description grammar, and
   ascending initial ID order;
6. every master page lists every registered topic once with the exact factual
   count;
7. broad `interview-practice` pages and links are absent;
8. forbidden student vocabulary and redundant environment wording are absent
   from every task card;
9. real-work membership still matches task format;
10. thirty simulations each have exactly three current rows, at least three
    topics, exact duration, recurrence compliance, and realism prose;
11. all local Markdown links resolve;
12. the final summary is exactly
    `tasks=118 covered=118 orphans=0 thematicErrors=0`.

The live Beads validator must read all registered topic paths rather than four
hard-coded broad paths. Frozen card mappings, candidate targets, card metadata,
and exact-HEAD evidence are updated together.

## GRACE Synchronization

The implementation updates these shared contracts in the same change:

- `docs/requirements.xml` for visible IDs, topic navigation, three-topic
  simulations, vocabulary, and row grammar;
- `docs/technology.xml` for the simplified student environment wording while
  retaining editor-profile detection;
- `docs/development-plan.xml` for master/topic ownership, candidate mappings,
  flows, and implementation phases;
- `docs/verification-plan.xml` for topic projections, H1/link grammar,
  vocabulary scans, simulation diversity, and final evidence;
- `docs/knowledge-graph.xml` for public task exports, topic collections,
  master indexes, and CrossLinks;
- `docs/operational-packets.xml` only where current packet contracts or frozen
  paths would otherwise contradict the new architecture.

No browser, external editor, live API, CSS automation, or runtime harness is
introduced. Evidence remains local Markdown, XML, Git, Beads, Node, Bash, and
Grace output.

## Atomic Migration Order

1. Add failing validator tests for topic hierarchy, task identity, row grammar,
   vocabulary, and three-topic simulations.
2. Change the local catalog and Beads validators to understand the approved
   registry while keeping the current production catalog failing until the
   cutover is complete.
3. Create master and topic pages, migrate all 118 cards, update real-work and
   simulation links, and remove the four broad pages atomically.
4. Add one third task to every simulation and revalidate duration and
   recurrence.
5. Synchronize GRACE artifacts and frozen Beads mappings.
6. Commit the coherent catalog, issue current exact-HEAD receipts, replay live
   Beads validation, and run the full final gate.
7. Push `feature/army-97`, refresh the existing draft pull request, and request
   revised final human acceptance. Do not close the parent story before that
   explicit response.

## Rollback

The migration is one focused catalog cutover. If any post-commit verification
or review exposes a defect, do not publish partial compatibility pages or
rewrite history. Add a focused corrective commit, or revert the complete
cutover commit through an explicitly authorized ordinary Git revert. The old
broad pages, old card headings, old simulation pairs, old GRACE mappings, and
old Beads evidence must be restored together; a mixed hierarchy is never a
valid rollback state.

## Stop Conditions

Stop and replan instead of guessing when:

- a card does not have one defensible central topic;
- a task is absent from the registry or appears in multiple topics;
- wording cleanup removes or changes an observable requirement;
- a topic page, master count, card metadata value, GRACE mapping, or Beads
  mapping disagrees;
- a simulation cannot reach three topics without breaking 30–120 minutes or
  recurrence;
- a compatibility stub or duplicate broad task list remains;
- exact-HEAD evidence cannot be regenerated from the revised gate;
- any full-catalog result differs from
  `tasks=118 covered=118 orphans=0 thematicErrors=0`.

## Acceptance Criteria

- Four master pages and twenty-three topic pages implement the approved
  fixed-depth hierarchy.
- All 118 cards have one exact master/topic metadata value and appear in one
  topic page.
- All card H1s and internal task links begin with their immutable IDs.
- Topic rows expose exact difficulty, duration, and one description sentence.
- Master rows expose exact current topic counts.
- No task card contains prohibited environment wording or forbidden student
  vocabulary.
- All thirty simulations contain exactly three current tasks from at least
  three topics and pass time and recurrence rules.
- Real-work membership remains format-driven and valid.
- Node regression tests, final catalog gate, exact-HEAD verification, live
  Beads validation, XML validation, Grace lint, link checks, orphan checks, and
  `git diff --check` pass.
- The focused commit is pushed to `feature/army-97`; the draft PR is updated;
  the parent ARMY-97 story remains open for explicit revised human acceptance.
