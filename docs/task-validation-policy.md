# Политика валидации frontend live-coding задач

## Назначение

Эта политика отделяет подготовку кандидата и миграцию опубликованной карточки от публикации. Только решение `accepted` создаёт `AcceptedTaskCard`; остальные решения остаются нейтральными Beads records и не создают файлов в `tasks/`.

## Стабильные интерфейсы

`StudentTaskCard` содержит в таком порядке:

```text
title
back-to-all-collections link
editor instruction
visible condition
one or more complete starter code blocks
observable "Готово, когда"
three independent closed hints
closed full solution and explanation
closed self-check questions
optional supplementary reading
closed five-field metadata
browser-back instruction and fallback link
```

Обычный code-first режим ставит editor instruction перед `Условие`, а само задание переносит в комментарии одного полного starter block. Комплексный режим начинает с короткого `Условие`, затем показывает editor instruction, заголовок `Код — вставьте его в редактор` и один или несколько полных starter blocks. Остальная последовательность одинакова.

`CollectionEntry` содержит linked student title, одно plain-language предложение для thematic collection и точное целое время из карточки.

`CardMigrationEvidence` содержит:

```text
slug | mode | editor profile | source learning goal | source prerequisite |
source runtime assumption | destination locations | expected | actual | verdict
```

Без заполненного preservation ledger и финального target-editor verdict мигрированная карточка не получает `PASS`.

## Контракт карточки

- Карточка находится в `tasks/<stable-slug>/README.md` и сохраняет существующий slug и учебную цель.
- Закрытый блок `О задаче` содержит ровно `Технология`, `Подборка`, `Формат`, `Сложность` и `Примерное время`.
- Разрешённые технологии: `JavaScript`, `TypeScript`, `HTML/CSS`, `HTML/JavaScript`, `HTML/CSS/JavaScript`, `React/TypeScript`.
- Разрешённые форматы: `Написать код`, `Исправить код`, `Разобрать код`, `Предсказать результат`.
- Разрешённые сложности: `Базовая`, `Средняя`, `Продвинутая`; время — целое число минут.
- Legacy labels `Технологии`, `Тема`, `Уровень`, `Время`, `Навыки`, `Предварительные знания`, `Среда выполнения` проверяются только как запрещённый student-facing boilerplate или источник preservation ledger, а не как обязательные metadata.
- Старые значения мигрируют детерминированно: `Реализация` → `Написать код`, `Отладка` → `Исправить код`, `Разбор` → `Разобрать код`, `Прогноз вывода` → `Предсказать результат`; `Базовый` → `Базовая`, `Средний` → `Средняя`, `Продвинутый` → `Продвинутая`; число минут не меняется.
- Весь starter code находится в одном полном copy-ready block, кроме реальной многофайловой задачи. При нескольких блоках каждый starter и solution block начинается с language-appropriate `FILE: <path>`, содержит полный файл без пропусков, а starter и solution используют одинаковое разбиение.
- Текстовый HTML, fixtures, test data и сценарии находятся в карточке. `assets/` остаётся только для медиа или других бинарных материалов, которые нельзя разумно встроить.
- Карточка содержит ровно три независимых закрытых hints с summaries `Подсказка 1 — куда смотреть`, `Подсказка 2 — с чего начать`, `Подсказка 3 — почти решение`.
- `Решение`, `Самопроверка`, `О задаче` и необязательное `Почитать по теме` закрыты и не используют атрибут `open`.

## Профили выполнения

| Editor profile | Target editor | URL | Copy/run contract |
| --- | --- | --- | --- |
| Console JavaScript без browser API | Programiz JavaScript Online Compiler | `https://www.programiz.com/javascript/online-compiler/` | Один полный JavaScript block; DOM, browser API и Node-specific semantics запрещены |
| Browser JavaScript, DOM, HTML/CSS или ESM | CodePen | `https://pen.new` | Базово один полный HTML block со встроенными style/script; инструкция фиксирует classic script или `type="module"` |
| Чистый TypeScript | TypeScript Playground | `https://www.typescriptlang.org/play/` | Один полный TypeScript block, если несколько файлов не нужны учебной цели |
| React + TypeScript | React TypeScript | `https://vite.new/react-ts` | Базово полная замена `src/App.tsx`; дополнительные файлы только при реальной необходимости |

Target editor определяется task profile, а не только значением `Технология`. Временный harness разрешён для диагностики, но не заменяет final expected/actual/verdict в заявленном online editor.

Для текущей миграции profile map фиксирован:

- Programiz: `immutable-category-totals`, `stable-product-sort`, `loop-closure-bindings`;
- CodePen browser ESM: `this-callback-binding`, `stale-search-response`, `delegated-dynamic-list`, `idempotent-event-listeners`, `accessible-keyboard-tabs`, `modal-focus-lifecycle`;
- CodePen browser classic script: `browser-event-loop-order`;
- CodePen HTML/CSS: `flex-long-text-overflow`, `container-responsive-grid`;
- TypeScript Playground: `discriminated-load-state`, `typed-object-property`, `response-union-narrowing`, `validate-unknown-profile`;
- React TypeScript: `react-derived-list`, `react-batched-counter`, `react-effect-subscription`, `react-strictmode-cleanup`.

`this-callback-binding` использует CodePen browser ESM только после доказательства совпадения трёх наблюдаемых строк и причин привязки `this` с исходным Node ESM contract. При несовпадении миграция останавливается; ожидаемый результат не переписывается под editor.

## Candidate register

До проверки агент создаёт конечный нейтральный список и фиксирует `candidateRegisterSize`. Каждая запись получает стабильный `candidateId`, самостоятельно сформулированную `learningGoal`, одну `proposedCollection` из controlled vocabulary и ссылку на story. В реестре не фиксируются внешнее происхождение или заимствованные формулировки.

После freeze новый кандидат сначала получает новый ID и увеличивает `candidateRegisterSize`; неучтённый кандидат не может попасть в волну. Завершение аудита требует равенства числа terminal decisions размеру реестра и отсутствия `needs-rewrite`.

## Gates

Gates выполняются строго по порядку. При провале gate последующие gates не выдают кандидату `accepted`, а миграция опубликованной карточки не получает `PASS`.

1. `Identity` — сравнить учебную цель с accepted library и текущим register; семантический дубль получает `duplicate`, а полезные отличия переносятся в canonical candidate.
2. `Learning value` — подтвердить конкретный frontend-навык и исключить случайный трюк без педагогической ценности.
3. `Student contract` — выбрать ordinary или complex mode, зафиксировать пять metadata fields, task profile, target editor, observable result и границы.
4. `Local completeness` — сохранить visible condition, полный starter code, text fixtures, solution и обязательный verification context локально; внешние материалы остаются дополнительными.
5. `Preservation` — для миграции отразить source learning goal, prerequisite и runtime assumption в destination locations либо дать конкретное `not applicable`.
6. `Structure` — проверить точный порядок режима, один copy-ready block или обоснованные real files, `FILE:` parity, три exact hints, закрытые details, fences и student vocabulary.
7. `Solution and content` — доказать, что решение выполняет условие, `Готово, когда` наблюдаемо, hints образуют прогрессию, объяснение раскрывает концепцию, а self-check соответствует учебной цели.
8. `Target editor` — выполнить точную instruction в editor profile, записать expected, actual и verdict; обязательное недоступное evidence означает `BLOCKED`, не `PASS`.
9. `Synchronization` — обновить ровно одну thematic collection, ноль или одну interview collection, graph, verification и Beads evidence; сверить title, time, profile, links и membership.
10. `Rendered` — проверить GitHub-rendered details, code fences, relative links, student headings и обратную навигацию для изменённой структуры.

## Outcomes

- `accepted` — все candidate gates PASS; кандидат можно включить ровно в одну wave.
- `needs-rewrite` — кандидат потенциально полезен, но contract/evidence/content пока не проходит; публикация запрещена, а конкретный failed gate фиксируется.
- `rejected` — тема технически некорректна или педагогически слаба; публикация запрещена.
- `duplicate` — учебная цель уже представлена; фиксируются `duplicateTarget` и перенесённые полезные отличия; отдельная карточка запрещена.
- `PASS` — миграция сохранила исходный контракт, прошла structural/content/synchronization checks и имеет final target-editor evidence.
- `BLOCKED` — обязательный editor, browser, asset, link или rendered evidence недоступен; `PASS` запрещён.

## Evidence matrix

| Task kind | Required target evidence | PASS signal | Stop / failure signal |
| --- | --- | --- | --- |
| Console JavaScript | Copy/run в Programiz | Exact output и значимые границы совпадают с карточкой | Browser/Node dependency или output mismatch |
| Browser JavaScript / DOM / HTML/CSS / ESM | Copy/run в CodePen и минимальный browser scenario | Declared mode, output, interaction и applicable manual visual criteria совпадают | Неуказанный classic/ESM mode, hidden dependency или browser unavailable |
| TypeScript | Copy/run/type-check в TypeScript Playground с TypeScript 5.9 behavior | Expected runtime и type outcomes совпадают | Version ambiguity или неописанная type error |
| React / TypeScript | Copy/run в `vite.new/react-ts` с React 19.2 behavior и browser scenario | State, effects, interactions и lifecycle соответствуют карточке | Неполный `src/App.tsx`, hidden environment dependency или unverified lifecycle |
| Разобрать код | Written step trace плюс target-editor reproduction | Trace и observed behavior согласованы | Unsupported causal claim |
| Предсказать результат | Written execution trace плюс target-editor output | Exact ordering/value match | Timing, environment или output ambiguity |
| Markdown structure | Deterministic headings, details, fence, `FILE:` и local-link checks | Выбранный режим и все anchors корректны | Missing section, malformed details/fence, broken link или лишний hint |
| External material | HTTP success/valid redirect плюс target-content review | Материал открывается без required paid/closed access | Broken, unrelated redirect или обязательный paywall |

CSS и визуальное поведение проверяются вручную в браузере, не unit-тестами.

## Beads validation record

Каждая candidate record содержит `candidateId`, `candidateRegisterSize`, `storyId`, `learningGoal`, `proposedCollection`, `decision`, `decisionReason`, `duplicateTarget`, `evidenceType`, `observedResult`, `waveId`, `remainingRisk` и `waveAcceptanceStatus`.

Каждая card migration record содержит точную строку `CardMigrationEvidence`, target-editor instruction, expected, actual, verdict, collection sync result, graph/verification delta и remaining risk.

Allowed `waveAcceptanceStatus` values: `not-applicable`, `pending`, `accepted`, `changes-requested`. Это technical publication status, а не human approval.

## Синхронизация изменения

Одно изменение карточки синхронизирует:

```text
tasks/<slug>/README.md
→ ровно один thematic README
→ ноль или один interview README
→ docs/knowledge-graph.xml
→ docs/verification-plan.xml
→ Beads evidence
```

Значение `Примерное время` в карточке и collections совпадает. Target-editor link соответствует task profile. Slug rename остаётся отдельной migration с inbound-link evidence. Удаление карточки удаляет все её student navigation и graph references атомарно.

## Wave rules

Accepted candidates упорядочиваются по stable candidate ID и группируются последовательно: полная wave содержит 8–10 cards, только final incomplete wave может содержать 1–7. Каждая wave закрывается после candidate recheck, deterministic и hybrid PASS, pushed commit, GitHub-rendered evidence и complete report. Per-wave human approval не требуется; top-level story остаётся открытой до final user acceptance.

## Stop conditions

Остановиться, если невозможно создать три разные полезные подсказки; код нельзя скопировать и запустить по инструкции; для решения нужен неописанный файл; технология или editor неоднозначны; task profile отсутствует или не воспроизводит source environment; несколько blocks созданы без реальной необходимости; `FILE:` path не соответствует instruction; embedded replacement не воспроизводит удаляемый asset; metadata и collection расходятся; одна задача попала в несколько thematic или interview collections; обязательная ссылка не открывается; GitHub неожиданно отображает `<details>`, code fences или relative links.

Нельзя выдавать непроверенную карточку за `PASS`, заполнять три hints повторениями или сохранять hidden context ради завершения wave.

## Completion checks

- Candidate terminal count equals frozen `candidateRegisterSize`; `needs-rewrite` отсутствует.
- Only accepted candidates have task paths or wave IDs, and every accepted candidate belongs to exactly one valid wave.
- Every migrated card has complete `CardMigrationEvidence` and final target-editor verdict.
- Every task belongs to exactly one thematic collection and zero or one interview; title, time, editor profile, graph and verification facts agree.
- A text asset is removed only after its embedded replacement receives `PASS`.
- The top-level story closes only after the final rendered audit and explicit user acceptance.
