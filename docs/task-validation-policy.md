# Политика валидации frontend live-coding задач

## Назначение

Эта политика отделяет подготовку кандидата от публикации. Только решение `accepted` создаёт `AcceptedTaskCard`; остальные решения остаются нейтральными Beads records и не создают файлов в `tasks/`.

## Candidate register

До проверки агент создаёт конечный нейтральный список и фиксирует `candidateRegisterSize`. Каждая запись получает стабильный `candidateId`, самостоятельно сформулированную `learningGoal`, одну `proposedTopic` из controlled vocabulary и ссылку на story. В реестре не фиксируются внешнее происхождение или заимствованные формулировки.

После freeze новый кандидат сначала получает новый ID и увеличивает `candidateRegisterSize`; неучтённый кандидат не может попасть в волну. Завершение аудита требует равенства числа terminal decisions размеру реестра и отсутствия `needs-rewrite`.

## Gates

Gates выполняются строго по порядку. При провале gate последующие gates не выдают кандидату `accepted`.

1. `Identity` — сравнить учебную цель с accepted library и текущим register; семантический дубль получает `duplicate`, а полезные отличия переносятся в canonical candidate.
2. `Learning value` — подтвердить конкретный frontend-навык и исключить случайный трюк без педагогической ценности.
3. `Contract` — зафиксировать среду, входы/вопросы, выходы, ограничения, мутацию, ошибки, пустой результат и side effects.
4. `Local completeness` — хранить условие, fixtures, starter code и solution локально; targeted external materials остаются дополнительными.
5. `Examples` — сверить happy path, значимую границу и ошибку/пустой результат, когда они применимы.
6. `Solution` — доказать соответствие contract; описать complexity, существенные trade-offs и альтернативы.
7. `Verification` — получить evidence по матрице ниже; недоступное обязательное evidence означает `BLOCKED`, не `PASS`.
8. `Editorial` — проверить русский task prose, exact labels, controlled vocabulary, Markdown, независимые закрытые details и оригинальность формулировок/кода.

## Outcomes

- `accepted` — все gates PASS; кандидат можно включить ровно в одну wave.
- `needs-rewrite` — кандидат потенциально полезен, но contract/evidence/content пока не проходит; публикация запрещена, а конкретный failed gate фиксируется.
- `rejected` — тема технически некорректна или педагогически слаба; публикация запрещена.
- `duplicate` — учебная цель уже представлена; фиксируются `duplicateTarget` и перенесённые полезные отличия; отдельная карточка запрещена.

## Evidence matrix

| Task kind | Required evidence | PASS signal | Stop / failure signal |
| --- | --- | --- | --- |
| JavaScript | Temporary harness in the declared runtime/mode | Happy path, boundary and applicable error match the card | Runtime/output mismatch or undeclared mode |
| TypeScript | Temporary runtime evidence plus type check in the declared TypeScript version | Expected runtime and type outcomes match | Type error outside the taught contract or version ambiguity |
| React / DOM | Minimal temporary example or browser scenario in declared versions | Required state and interactions match | Hidden environment dependency or unverified lifecycle |
| UI / CSS | Manual browser scenario at declared viewport/states | Interaction and visual criteria observed | Browser unavailable means `BLOCKED`; unit CSS assertions are not substitutes |
| Разбор | Written step trace plus factual run/reproduction | Trace and observed behavior agree | Unsupported causal claim |
| Прогноз вывода | Written execution trace plus actual output | Exact ordering/value match | Timing, environment or output ambiguity |
| Markdown structure | Deterministic label, heading, details, fence and local-link checks | Canonical structure and links resolve | Missing section, malformed details/fence or broken link |
| External material | HTTP success/valid redirect plus target-content review | Expected material opens without required paid/closed access | Broken, redirected to unrelated content, paywalled required reading |

Temporary harnesses live outside the repository and are removed after evidence capture. They never justify adding a package manager, catalog generator, validator, site framework or CI pipeline to v1.

Metadata values and task titles used in Markdown tables are single-line values without the `|` character; use comma-separated wording instead. This keeps the GitHub table valid and makes exact task-to-catalog projection deterministic.

## Beads validation record

Every candidate record contains: `candidateId`, `candidateRegisterSize`, `storyId`, `learningGoal`, `proposedTopic`, `decision`, `decisionReason`, `duplicateTarget`, `evidenceType`, `observedResult`, `waveId`, `remainingRisk`, and `waveAcceptanceStatus`.

Allowed `waveAcceptanceStatus` values are `not-applicable`, `pending`, `accepted`, and `changes-requested`. Accepted candidates use `pending` after wave assignment; non-accepted outcomes use `not-applicable`.

`waveAcceptanceStatus` is a technical publication status, not a human approval. For an accepted candidate, `pending` means that its assigned wave has not completed every technical publication gate, `accepted` means that candidate recheck, required evidence, pushed commit, GitHub-rendered review, and the complete wave report all passed, and `changes-requested` means that a technical gate requires correction.

## Wave rules

Accepted candidates are ordered by stable candidate ID and grouped sequentially: take 10 while at least 10 remain; the last group may therefore contain 1–10. A group of 8–10 is a full wave; a final group of 1–7 is the only permitted incomplete wave. Each wave is one serialized Beads child issue, changes task cards/catalog/graph/evidence atomically, and closes continuously after candidate recheck, deterministic and hybrid PASS, pushed commit, GitHub-rendered evidence, and a complete wave report. Per-wave mentor or user approval is not required; the top-level story remains open until the user accepts the complete library after the final audit.

## Stop conditions

Stop without guessing for ambiguous vocabulary, environment or expected output; contradictory examples; happy-path-only solution; missing prerequisite/asset; nondeterministic network/time/state without a fixture/fake/adapter; unavailable browser-only evidence; broken supplementary material; unexpected GitHub rendering; task/catalog/graph drift; unapproved permanent tooling; or a slug migration without inbound-link evidence.

## Updating a published task

For content, metadata, prerequisite or asset changes, resolve all derived artifacts and inbound links first, rerun every affected validation gate, update the canonical card, catalog and graph in one change, and repeat projection/link/evidence checks. Deletion removes the card, its single catalog row and its single graph annotation in the same change. Reclassification requires mentor approval for any new or ambiguous vocabulary. Slug rename is a dedicated migration: verify every inbound link before removing the old path, update all derived references, and record before/after evidence in Beads.

## Completion checks

- Candidate terminal count equals frozen `candidateRegisterSize`.
- No `needs-rewrite` remains at story completion.
- Only accepted candidates have task paths or wave IDs.
- Every accepted candidate belongs to exactly one valid wave.
- Every decision has concise reason, evidence type, observed result and remaining risk.
- A wave closes only after candidate recheck, technical PASS, pushed commit, GitHub-rendered evidence, and a complete report.
- The top-level story closes only after the final audit and explicit user acceptance of the complete library.
