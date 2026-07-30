# Локальная политика валидации ARMY-97

Публикационный gate имеет два явных режима: `wave` и `final`. Они используют
один tracked-скрипт, но подтверждают разные состояния каталога.

## Режим `wave`

`wave` применяется только во время Task 3, до cutover. Он:

- сохраняет точный закрытый список из 21 legacy-карточки;
- принимает только полный накопительный префикс сериализованных ARMY-97 волн:
  `0, 10, 20, …, 110, 118` карточек;
- требует непрерывный префикс `task-0001..task-NNNN`;
- проверяет все текущие `tasks/` против всех тематических `collections/`:
  каждый task существует, покрыт и входит ровно в одну тематическую подборку;
- отклоняет ссылку на отсутствующую, то есть ещё не опубликованную,
  ARMY-97 карточку;
- проверяет полный `ConciseStudentTaskCard` контракт у каждой опубликованной
  `tasks/task-NNNN/README.md`, не применяя новый контракт к legacy-карточкам;
- требует canonical metadata duration `- Примерное время: N минут`; вариант
  только с числом отклоняется;
- связывает `Технология` с точными sandbox name/URL: Programiz для console
  JavaScript без browser API и ESM, CodePen для browser JavaScript, DOM,
  HTML/CSS и ESM, TypeScript Playground для pure TypeScript, React TypeScript
  для React/TypeScript;
- требует у каждой ARMY-97 карточки тематическую строку точного вида
  `N. [Exact title](../../../tasks/task-XXXX/README.md) — Substantive sentence. — N минут`:
  без префикса, суффикса и дополнительного поля, с точным linked title,
  содержательными словами, ровно одним завершающим знаком предложения и
  duration, полностью совпадающим с `N минут` из card metadata;
- не требует 118 карточек, финальные `92/8/16/2` или 30 симуляций.

Live Beads-валидатор дополнительно доказывает, что число текущих task-файлов
равно `21 legacy + опубликованные immutable ARMY-97 IDs`, каждый опубликованный
ID имеет `publicationDecision: accepted`, совпадает со своей frozen thematic
mapping, а editor profile, прочитанный из card Markdown, совпадает с
technology mapping и frozen Beads card metadata. Каждая карточка содержит
текущие `CardMigrationEvidence` и
`FullCatalogGateEvidence`. Поэтому частичный filesystem-вывод сам по себе не
может разрешить публикацию или переход `needs-rewrite → accepted`.

## Режим `final`

`final` резервируется для cutover и финального аудита. В этом режиме legacy
пути уже отсутствуют, а gate требует:

- ровно 118 карточек и непрерывный диапазон `task-0001..task-0118`;
- только четыре controlled thematic paths;
- точные тематические количества JavaScript 92, TypeScript 8, React 16 и
  HTML/CSS 2;
- ровно 30 последовательных симуляций с правильными ссылками, суммой времени,
  минимум двумя тематиками, трёхсимуляционным recurrence и realism evidence.

## Evidence и порядок исполнения

`Army97CandidateRecord` разделяет неизменяемый `sourceAuditDecision` и
изменяемый `publicationDecision`. В `tasks/` попадает только карточка с
`publicationDecision: accepted`. Переход `needs-rewrite → accepted` разрешён в
Task 3 после полного PASS текущего накопительного каталога в режиме `wave`;
строгий финальный сертификат для этого перехода до cutover не требуется.

Каждая опубликованная карточка, включая исходно `accepted`, хранит в metadata
card issue:

- ровно десятипольный `cardMigrationEvidence`;
- ровно девятипольный `fullCatalogGateEvidence`: `policyPath`,
  `catalogGatePath`, `catalogCommit`, `catalogTree`, `catalogGateBlob`,
  `gateMode`, `gateOutputSha256`, `verdict`, `evidenceSha256`.

Evidence выдаёт только `docs/scripts/run-army-97-catalog-gate.mjs`. Runner
архивирует точный текущий `HEAD`, запускает из архива tracked gate с явным
`--mode`, проверяет JSON PASS того же режима и связывает commit, tree, gate blob,
полный output и точный `CardMigrationEvidence`; его `slug` обязан существовать
как task-файл именно в исполненном commit. Live Beads-валидатор требует тот же
режим текущего каталога и повторно исполняет receipt. Ancestor commit,
самостоятельно вычисленный digest, output другого режима или PASS произвольной
частичной команды не принимаются.

Сначала закоммитьте полную текущую волну. Для каждой её карточки подготовьте
точный десятипольный JSON и выполните:

```bash
catalogCommit="$(git rev-parse HEAD)"
node docs/scripts/run-army-97-catalog-gate.mjs \
  --mode wave \
  --commit "$catalogCommit" \
  --card-evidence-file <path>
```

Сохраните только успешно выданный объект, синхронно обновите candidate/card
publication state и запустите полный wave gate. Канонический порядок
load-bearing: regression probes, current-worktree catalog gate, exact-HEAD
archive gate, live Beads validation, затем XML, Grace и diff.

```bash
set -euo pipefail
test "${BASH_VERSINFO[0]:-0}" -ge 3
node --test docs/scripts/validate-army-97-catalog.test.mjs docs/scripts/validate-army-97-beads.test.mjs docs/scripts/run-army-97-catalog-gate.test.mjs
bash docs/scripts/validate-army-97-catalog.sh --mode wave
catalogCommit="$(git rev-parse HEAD)"
node docs/scripts/run-army-97-catalog-gate.mjs --mode wave --commit "$catalogCommit" --verify-only
node docs/scripts/validate-army-97-beads.mjs
xmllint --noout docs/*.xml
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"; test -x "$GRACE_BIN"; "$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
```

После cutover замените `--mode wave` на `--mode final` в обеих catalog-командах
и повторно выдайте current-HEAD receipts финального режима перед финальным
Beads-аудитом.

Оба режима используют только встроенные модули Node.js и существующие Bash,
Git, `tar`, `find`, `xargs`, `rg`, `sed` и `bd`. Внешние редакторы, браузеры,
GitHub rendering, API и CSS-layout проверки не являются локальными
publication gates.
