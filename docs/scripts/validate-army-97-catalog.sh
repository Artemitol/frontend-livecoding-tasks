#!/usr/bin/env bash
# FILE: docs/scripts/validate-army-97-catalog.sh
# VERSION: 1.1.0
# START_MODULE_CONTRACT
#   PURPOSE: Validate the complete ARMY-97 student catalog without reading or mutating Beads.
#   SCOPE: Task cards, thematic and real-work projections, simulations, provenance exclusion, and local links.
#   DEPENDS: Bash 3+, find, rg, sed
#   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
#   ROLE: SCRIPT
#   MAP_MODE: NONE
# END_MODULE_CONTRACT
#
# START_CHANGE_SUMMARY
#   LAST_CHANGE: v1.1.0 - Certify the frozen final inventory and scan nested collection provenance under Bash 3.
# END_CHANGE_SUMMARY

set -euo pipefail

test "${BASH_VERSINFO:-0}" -ge 3

catalogFail() {
  printf 'ARMY-97 catalog gate: %s\n' "$1" >&2
  exit 1
}

# START_BLOCK_CERTIFY_FROZEN_CATALOG_INVENTORY
taskFiles="$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | sort)"
taskCount="$(printf '%s\n' "$taskFiles" | sed '/^$/d' | wc -l | tr -d ' ')"
if [ "$taskCount" -ne 118 ]; then
  catalogFail "expected exactly 118 task cards; found $taskCount"
fi
if [ -n "$(printf '%s\n' "$taskFiles" | rg -v '^tasks/task-[0-9]{4}/README\.md$' || true)" ]; then
  catalogFail 'task cards must use only tasks/task-NNNN/README.md paths'
fi
taskIds="$(printf '%s\n' "$taskFiles" | sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#')"
expectedTaskIds="$(for number in $(seq 1 118); do
  printf 'task-%04d\n' "$number"
done)"
if [ "$taskIds" != "$expectedTaskIds" ]; then
  catalogFail 'expected contiguous task-0001 through task-0118'
fi

controlledThematicFiles="$(printf '%s\n' \
  'collections/html-css/interview-practice/README.md' \
  'collections/javascript/interview-practice/README.md' \
  'collections/react/interview-practice/README.md' \
  'collections/typescript/interview-practice/README.md' |
  sort)"
thematicFiles="$(find collections -type f -name README.md |
  sort |
  rg -v '^collections/(interviews|real-work)(/|$)' || true)"
if [ "$thematicFiles" != "$controlledThematicFiles" ]; then
  catalogFail 'missing or unexpected thematic collection paths'
fi

thematicSpecifications=(
  'collections/javascript/interview-practice/README.md|92'
  'collections/typescript/interview-practice/README.md|8'
  'collections/react/interview-practice/README.md|16'
  'collections/html-css/interview-practice/README.md|2'
)
allThematicTaskFiles=''
for thematicSpecification in "${thematicSpecifications[@]}"; do
  thematicFile="${thematicSpecification%|*}"
  expectedCount="${thematicSpecification##*|}"
  thematicTaskFiles="$(rg -o 'tasks/task-[0-9]{4}/README\.md' "$thematicFile" || true)"
  thematicCount="$(printf '%s\n' "$thematicTaskFiles" | sed '/^$/d' | wc -l | tr -d ' ')"
  if [ "$thematicCount" -ne "$expectedCount" ]; then
    catalogFail "expected $expectedCount task links in $thematicFile; found $thematicCount"
  fi
  uniqueThematicCount="$(printf '%s\n' "$thematicTaskFiles" |
    sed '/^$/d' |
    sort -u |
    wc -l |
    tr -d ' ')"
  if [ "$uniqueThematicCount" -ne "$expectedCount" ]; then
    catalogFail "$thematicFile contains duplicate task links"
  fi
  allThematicTaskFiles="${allThematicTaskFiles}${thematicTaskFiles}"$'\n'
done

uniqueThematicTaskFiles="$(printf '%s' "$allThematicTaskFiles" |
  sed '/^$/d' |
  sort -u)"
if [ "$uniqueThematicTaskFiles" != "$taskFiles" ]; then
  catalogFail 'every frozen task must appear in exactly one controlled thematic collection'
fi
# END_BLOCK_CERTIFY_FROZEN_CATALOG_INVENTORY

while IFS= read -r taskFile; do
  test "$(rg -n '^Песочница для выполнения — \[[^]]+\]\(https?://[^)]+\)\.$' "$taskFile" | wc -l | tr -d ' ')" -eq 1
  conditionLine="$(rg -n '^## Условие$' "$taskFile" | cut -d: -f1)"
  test -n "$conditionLine"
  sed -n "$((conditionLine + 1))p" "$taskFile" | rg -q '^```'
  sed -n "$((conditionLine + 2)),$((conditionLine + 5))p" "$taskFile" | rg -q '(^//|^<!--|^/\*)'
  anchors=()
  while IFS= read -r anchor; do
    anchors+=("$anchor")
  done < <(rg -n '^# |^Песочница для выполнения — |^## Условие$|^<summary>(Подсказка 1 — куда смотреть|Подсказка 2 — с чего начать|Подсказка 3 — почти решение|Решение|О задаче)</summary>$' "$taskFile" | cut -d: -f1)
  test "${#anchors[@]}" -eq 8
  for index in $(seq 1 7); do
    test "${anchors[$((index - 1))]}" -lt "${anchors[$index]}"
  done
  test "$(rg -n '^<summary>Подсказка [123] — (куда смотреть|с чего начать|почти решение)</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 3
  rg -q '^<summary>Подсказка 1 — куда смотреть</summary>$' "$taskFile"
  rg -q '^<summary>Подсказка 2 — с чего начать</summary>$' "$taskFile"
  rg -q '^<summary>Подсказка 3 — почти решение</summary>$' "$taskFile"
  test "$(rg -n '^<details([[:space:]][^>]*)?>$' "$taskFile" | wc -l | tr -d ' ')" -eq 5
  test "$(rg -n '^<summary>Решение</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 1
  test "$(rg -n '^<summary>О задаче</summary>$' "$taskFile" | wc -l | tr -d ' ')" -eq 1
  ! rg -n '^<details[^>]*\bopen\b' "$taskFile"
  metadataLine="$(rg -n '^<summary>О задаче</summary>$' "$taskFile" | cut -d: -f1)"
  metadataEnd="$(tail -n +"$metadataLine" "$taskFile" | rg -n '^</details>$' | head -n 1 | cut -d: -f1)"
  metadataClose="$((metadataLine + metadataEnd - 1))"
  metadata="$(sed -n "$((metadataLine + 1)),$((metadataClose - 1))p" "$taskFile")"
  test "$(printf '%s\n' "$metadata" | rg -n '^\s*- ' | wc -l | tr -d ' ')" -eq 5
  test "$(printf '%s\n' "$metadata" | rg -n '^\s*- (Технология|Подборка|Формат|Сложность|Примерное время):' | wc -l | tr -d ' ')" -eq 5
  test -z "$(sed -n "1,$((metadataLine - 1))p" "$taskFile" | rg '^\s*- (Технология|Подборка|Формат|Сложность|Примерное время):' || true)"
  test -z "$(tail -n +$((metadataClose + 1)) "$taskFile" | rg '[^[:space:]]' || true)"
  for field in Технология Подборка Формат Сложность 'Примерное время'; do
    test "$(printf '%s\n' "$metadata" | rg -n -- "^- $field:" | wc -l | tr -d ' ')" -eq 1
  done
  printf '%s\n' "$metadata" | rg -q -- '- Технология: (JavaScript|TypeScript|HTML/CSS|HTML/JavaScript|HTML/CSS/JavaScript|React/TypeScript)$'
  printf '%s\n' "$metadata" | rg -q -- '- Формат: (Написать код|Исправить код|Разобрать код|Предсказать результат|Приближённая к реальной работе)$'
  printf '%s\n' "$metadata" | rg -q -- '- Сложность: (Базовая|Средняя|Продвинутая)$'
  printf '%s\n' "$metadata" | rg -q -- '- Примерное время: [1-9][0-9]*$'
  for summary in 'Подсказка 1 — куда смотреть' 'Подсказка 2 — с чего начать' 'Подсказка 3 — почти решение' Решение; do
    line="$(rg -n "^<summary>$summary</summary>$" "$taskFile" | cut -d: -f1)"
    end="$(tail -n +"$line" "$taskFile" | rg -n '^</details>$' | head -n 1 | cut -d: -f1)"
    test -n "$(sed -n "$((line + 1)),$((line + end - 2))p" "$taskFile" | rg '[^[:space:]]')"
  done
  ! rg -n -i 'author|source repository|video walkthrough|imported|migrated|мигрир|импортир|<!doctype|<html|<head|<body|<style|<script|← Все подборки|Самопроверка|Готово, когда' "$taskFile"
done <<< "$taskFiles"

while IFS= read -r taskFile; do
  references="$(rg -l "\]\([^)]*$taskFile\)" collections || true)"
  test -n "$references"
  thematicFile="$(printf '%s\n' "$references" | rg -v '^collections/(interviews|real-work)/')"
  test "$(printf '%s\n' "$thematicFile" | wc -l | tr -d ' ')" -eq 1
  collectionName="$(rg -o -- '- Подборка: .+' "$taskFile" | sed 's/- Подборка: //')"
  rg -qF "$collectionName" "$thematicFile"
  if rg -q -- '- Формат: Приближённая к реальной работе$' "$taskFile"; then
    rg -q -- '- Технология: React/TypeScript$' "$taskFile"
    rg -l "\]\([^)]*$taskFile\)" collections/real-work/README.md >/dev/null
  else
    ! rg -l "\]\([^)]*$taskFile\)" collections/real-work/README.md
  fi
done <<< "$taskFiles"

test "$(rg -o '\]\([^)]*collections/interviews/README\.md\)' README.md | wc -l | tr -d ' ')" -eq 1
test "$(rg -o '\]\([^)]*simulation-[0-9]{3}/README\.md\)' collections/interviews/README.md | wc -l | tr -d ' ')" -eq 30
test "$(find collections/interviews -mindepth 2 -maxdepth 2 -type f -name README.md | wc -l | tr -d ' ')" -eq 30

for number in $(seq 1 30); do
  id="$(printf '%03d' "$number")"
  file="collections/interviews/simulation-$id/README.md"
  test -f "$file"
  rg -q "Симуляция собеседования №$number" "$file"
  rg -q '^Реализм: .\+' "$file"
  test "$(rg -o "\[Симуляция собеседования №$number\]\([^)]*simulation-$id/README\.md\) — [0-9]+ минут" collections/interviews/README.md | wc -l | tr -d ' ')" -eq 1
  simulationTasks=()
  while IFS= read -r task; do
    simulationTasks+=("$task")
  done < <(rg -o 'tasks/task-[0-9]{4}/README\.md' "$file" | sort -u)
  test "${#simulationTasks[@]}" -ge 2
  test "$(rg -o '\]\([^)]*tasks/task-[0-9]{4}/README\.md\)' "$file" | sort -u | wc -l | tr -d ' ')" -eq "${#simulationTasks[@]}"
  total=0
  collections=''
  for taskFile in "${simulationTasks[@]}"; do
    minutes="$(rg -o -- '- Примерное время: [0-9]+' "$taskFile" | sed -E 's/.*: //')"
    title="$(sed -n 's/^# //p' "$taskFile" | head -n 1)"
    total=$((total + minutes))
    rg -q "\[$title\]\([^)]*$taskFile\) — $minutes минут" "$file"
    thematicFile="$(rg -l "\]\([^)]*$taskFile\)" collections | rg -v '^collections/(interviews|real-work)/' | head -n 1)"
    collections="$collections$thematicFile\n"
  done
  test "$(printf '%b' "$collections" | sort -u | rg '.' | wc -l | tr -d ' ')" -ge 2
  declared="$(rg -o 'Общее время: [0-9]+ минут' "$file" | rg -o '[0-9]+')"
  test "$declared" -ge 30
  test "$declared" -le 120
  test "$declared" -eq "$total"
done

for start in $(seq 1 28); do
  ids="$(seq "$start" "$((start + 2))" | while read -r n; do
    printf 'collections/interviews/simulation-%03d/README.md\n' "$n"
  done)"
  test -z "$(rg --no-filename -o 'tasks/task-[0-9]{4}/README\.md' $ids | sort | uniq -d)"
done

# START_BLOCK_SCAN_ALL_MARKDOWN_PROVENANCE
while IFS= read -r markdownFile; do
  if rg -n -i 'author|source repository|video walkthrough|imported|migrated|мигрир|импортир' "$markdownFile"; then
    catalogFail "prohibited provenance in $markdownFile"
  fi
done < <(find README.md collections tasks -type f -name README.md | sort)
# END_BLOCK_SCAN_ALL_MARKDOWN_PROVENANCE

while IFS= read -r file; do
  while IFS= read -r link; do
    target="${link%%#*}"
    case "$target" in
      ''|//*) continue ;;
    esac
    printf '%s\n' "$target" | rg -q '^[[:alpha:]][[:alnum:]+.-]*:' && continue
    test -e "$(dirname "$file")/$target"
  done < <(rg -o '\]\([^)]+\)' "$file" | sed -E 's/.*\]\(([^)]+).*/\1/')
done < <(find README.md tasks collections -type f -name README.md)

printf '%s\n' '{"catalogGate":"PASS"}'
