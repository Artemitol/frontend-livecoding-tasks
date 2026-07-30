# Локальная политика валидации ARMY-97

`Army97CandidateRecord` разделяет неизменяемый `sourceAuditDecision` и
изменяемый `publicationDecision`; в `tasks/` попадает только публикация со
значением `accepted`. `docs/army-97-candidate-audit.json` фиксирует хеш всех
неизменяемых полей. `docs/scripts/validate-army-97-beads.mjs` читает live Beads,
выводит текущие publication-counts и проверяет синхронизацию candidate/card.

Переход `needs-rewrite → accepted` требует в metadata card issue двух вложенных
объектов, а не текста в notes: ровно десятипольного `cardMigrationEvidence` и
ровно восьмипольного `fullCatalogGateEvidence`. Последний выдаёт только
`docs/scripts/run-army-97-catalog-gate.mjs` после PASS полного catalog-only gate
из изолированного архива точного текущего `HEAD`. Evidence связывает policy,
gate script, commit, tree, gate blob, хеш вывода и `CardMigrationEvidence`.
`publicationTransitionEvidence` в candidate и card хранит точную ссылку
`Beads:<card-id>#cardMigrationEvidence+fullCatalogGateEvidence`.

Catalog-only gate принимает только полный замороженный каталог: ровно 118
карточек с непрерывными путями `task-0001..task-0118`, только четыре
контролируемых тематических пути с распределением `92/8/16/2`, и все вложенные
страницы коллекций участвуют в provenance scan, совместимом с Bash 3.

Сначала зафиксируйте полный каталог commit-ом. Затем передайте точный
десятипольный JSON в
`node docs/scripts/run-army-97-catalog-gate.mjs --commit HEAD --card-evidence-file <path>`.
Только успешно выданный объект можно сохранить в card metadata; после этого
синхронно измените candidate и card publication state и запустите полный gate.
Runner ничего не выдаёт при catalog failure, а live validator повторно запускает
gate на том же текущем `HEAD`.

После каждого изменения `tasks/` или `collections/` запускайте этот полный
локальный gate из корня. До первой replacement-wave он проверяется через
`bash -n`; PASS требует карточек и 30 simulations.

```bash
set -euo pipefail
BASH_VERSINFO="${BASH_VERSINFO:-0}"; test "$BASH_VERSINFO" -ge 3
node --test docs/scripts/validate-army-97-catalog.test.mjs docs/scripts/validate-army-97-beads.test.mjs docs/scripts/run-army-97-catalog-gate.test.mjs
bash docs/scripts/validate-army-97-catalog.sh
catalogCommit="$(git rev-parse HEAD)"
node docs/scripts/run-army-97-catalog-gate.mjs --commit "$catalogCommit" --verify-only
node docs/scripts/validate-army-97-beads.mjs
xmllint --noout docs/*.xml
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"; test -x "$GRACE_BIN"; "$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
```

The ordering is load-bearing: probes run first, then the current worktree
catalog-only gate, then the exact committed catalog gate, and only after both
PASS does live Beads transition validation run. A later catalog failure stops
before transition validation, while stale evidence also fails because its commit
must equal current `HEAD` and its gate is re-executed. Catalog checks cover exact
sandbox syntax, card structure, controlled metadata, provenance exclusion,
thematic and real-work projections, 30 simulations, recurrence, realism, and
local links. XML, Grace, and diff checks follow the transition gate. The
validator uses only built-in Node.js modules plus existing Bash, Git, `tar`, and
`bd`; it adds no task runtime, package, or dependency. The production-gate
regression executes a complete controlled 118-card fixture plus partial,
non-contiguous, thematic-drift, unexpected-path, and nested-provenance negative
probes. Browser, external editor, rendered-page, and CSS layout execution are
not local publication gates.
