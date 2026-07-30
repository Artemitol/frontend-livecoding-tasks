# Локальная политика валидации ARMY-97

`Army97CandidateRecord` хранит `accepted`, `needs-rewrite`, `rejected` или
`duplicate`; в `tasks/` попадает только `accepted`. В migration Beads issue
хранит ровно `CardMigrationEvidence`: `slug`, `mode`, `editorProfile`,
`sourceLearningGoal`, `sourcePrerequisite`, `sourceRuntimeAssumption`,
`destinationLocations`, `targetEditorExpectedResult`, `targetEditorActualResult`
и `verdict`.

После каждого изменения `tasks/` или `collections/` запускайте этот полный
локальный gate из корня. До первой replacement-wave он проверяется через
`bash -n`; PASS требует карточек и 30 simulations.

```bash
set -euo pipefail
taskFiles="$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | sort)"; test -n "$taskFiles"
test -z "$(printf '%s\n' "$taskFiles" | rg -v '^tasks/task-[0-9]{4}/README\.md$' || true)"
taskIds="$(printf '%s\n' "$taskFiles" | sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#')"; test "$(printf '%s\n' "$taskIds" | sort | uniq -d | wc -l | tr -d ' ')" -eq 0
while IFS= read -r taskFile; do
  test "$(rg -n '^Песочница для выполнения — \[[^]]+\]\(https?://[^)]+\)\.$' "$taskFile" | wc -l | tr -d ' ')" -eq 1
  conditionLine="$(rg -n '^## Условие$' "$taskFile" | cut -d: -f1)"; test -n "$conditionLine"; sed -n "$((conditionLine + 1))p" "$taskFile" | rg '^```'; sed -n "$((conditionLine + 2)),$((conditionLine + 5))p" "$taskFile" | rg -q '(^//|^<!--|^/\*)'
  mapfile -t anchors < <(rg -n '^# |^Песочница для выполнения — |^## Условие$|^<summary>(Подсказка 1 — куда смотреть|Подсказка 2 — с чего начать|Подсказка 3 — почти решение|Решение|О задаче)</summary>$' "$taskFile" | cut -d: -f1); test "${#anchors[@]}" -eq 8; for index in $(seq 1 7); do test "${anchors[$((index - 1))]}" -lt "${anchors[$index]}"; done
  test "$(rg -n '^<summary>Подсказка [123] — (куда смотреть|с чего начать|почти решение)</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 3
  rg -q '^<summary>Подсказка 1 — куда смотреть</summary>$' "$taskFile"; rg -q '^<summary>Подсказка 2 — с чего начать</summary>$' "$taskFile"; rg -q '^<summary>Подсказка 3 — почти решение</summary>$' "$taskFile"
  test "$(rg -n '^<summary>Решение</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 1; test "$(rg -n '^<summary>О задаче</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 1; ! rg -n '^<details[^>]*\bopen\b' "$taskFile"
  test "$(rg -n '^\s*- (Технология|Подборка|Формат|Сложность|Примерное время):' "$taskFile" | wc -l | tr -d ' ')" -eq 5
  rg -q -- '- Технология: (JavaScript|TypeScript|HTML/CSS|HTML/JavaScript|HTML/CSS/JavaScript|React/TypeScript)$' "$taskFile"; rg -q -- '- Формат: (Написать код|Исправить код|Разобрать код|Предсказать результат|Приближённая к реальной работе)$' "$taskFile"; rg -q -- '- Сложность: (Базовая|Средняя|Продвинутая)$' "$taskFile"
  ! rg -n -i 'author|source repository|video walkthrough|imported|migrated|мигрир|импортир|<!doctype|<html|<head|<body|<style|<script|← Все подборки|Самопроверка|Готово, когда' "$taskFile"
done <<< "$taskFiles"
while IFS= read -r taskFile; do
  references="$(rg -l -F "$taskFile" collections || true)"; test -n "$references"; test "$(printf '%s\n' "$references" | rg -v '^collections/(interviews|real-work)/' | wc -l | tr -d ' ')" -eq 1
  if rg -q -- '- Формат: Приближённая к реальной работе$' "$taskFile"; then rg -l -F "$taskFile" collections/real-work/README.md >/dev/null; else ! rg -l -F "$taskFile" collections/real-work/README.md; fi
done <<< "$taskFiles"
test "$(find collections/interviews -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" -eq 30
for number in $(seq 1 30); do
  id="$(printf '%03d' "$number")"; file="collections/interviews/simulation-$id/README.md"; test -f "$file"; rg -q "Симуляция собеседования №$number" "$file"; rg -q 'Реализм:' "$file"
  mapfile -t simulationTasks < <(rg -o 'tasks/task-[0-9]{4}/README\.md' "$file" | sort -u); test "${#simulationTasks[@]}" -ge 2
  total=0; collections=''
  for taskFile in "${simulationTasks[@]}"; do minutes="$(rg -o -- '- Примерное время: [0-9]+' "$taskFile" | sed -E 's/.*: //')"; total=$((total + minutes)); thematicFile="$(rg -l -F "$taskFile" collections | rg -v '^collections/(interviews|real-work)/' | head -n 1)"; collections="$collections$thematicFile\n"; done
  test "$(printf '%b' "$collections" | sort -u | rg '.' | wc -l | tr -d ' ')" -ge 2
  declared="$(rg -o 'Общее время: [0-9]+ минут' "$file" | rg -o '[0-9]+')"; test "$declared" -ge 30; test "$declared" -le 120; test "$declared" -eq "$total"
done
for start in $(seq 1 28); do ids="$(seq "$start" "$((start + 2))" | while read -r n; do printf 'collections/interviews/simulation-%03d/README.md\n' "$n"; done)"; test -z "$(rg --no-filename -o 'tasks/task-[0-9]{4}/README\.md' $ids | sort | uniq -d)"; done
while IFS= read -r file; do while IFS= read -r link; do test -e "$(dirname "$file")/$link"; done < <(rg -o '\]\((\.\.?/)[^)#]+\)' "$file" | sed -E 's/.*\]\(([^)#]+).*/\1/'); done < <(find README.md tasks collections -type f -name README.md)
xmllint --noout docs/*.xml
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"; test -x "$GRACE_BIN"; "$GRACE_BIN" lint --fail-on errors --path "$PWD"
git diff --check
```

The checks cover exact sandbox syntax; required order and closed details; starter
requirement comments; controlled metadata; no provenance, migration, or full
document markers; local links; thematic and real-work projections; 30 sequential
static simulations; their links, duration, two-collection composition, recurrence,
and realism evidence; XML, Grace, and whitespace hygiene. Simulations link cards
and never duplicate conditions. Browser, external editor, rendered-page, and CSS
layout execution are not local publication gates.
