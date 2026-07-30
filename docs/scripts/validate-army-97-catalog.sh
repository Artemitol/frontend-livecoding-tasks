#!/usr/bin/env bash
# FILE: docs/scripts/validate-army-97-catalog.sh
# VERSION: 2.0.0
# START_MODULE_CONTRACT
#   PURPOSE: Validate either a serialized ARMY-97 publication wave or the strict final student catalog without reading or mutating Beads.
#   SCOPE: Closed legacy compatibility, complete wave prefixes, task-card structure, thematic and real-work projections, final simulations, provenance exclusion, and local links.
#   DEPENDS: Bash 3+, find, xargs, rg, sed
#   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
#   ROLE: SCRIPT
#   MAP_MODE: NONE
# END_MODULE_CONTRACT
#
# START_CHANGE_SUMMARY
#   LAST_CHANGE: v2.0.0 - Separate cumulative wave certification from the strict cutover and final-audit certificate.
# END_CHANGE_SUMMARY

set -euo pipefail

test "${BASH_VERSINFO:-0}" -ge 3

catalogFail() {
  printf 'ARMY-97 catalog gate: %s\n' "$1" >&2
  exit 1
}

if [ "$#" -ne 2 ] || [ "$1" != '--mode' ]; then
  catalogFail 'usage: validate-army-97-catalog.sh --mode wave|final'
fi

gateMode="$2"
case "$gateMode" in
  wave|final) ;;
  *) catalogFail "unsupported gate mode: $gateMode" ;;
esac

# START_BLOCK_CERTIFY_MODE_INVENTORY
taskFiles="$(find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | sort)"
taskCount="$(printf '%s\n' "$taskFiles" | sed '/^$/d' | wc -l | tr -d ' ')"
controlledThematicFiles="$(printf '%s\n' \
  'collections/html-css/interview-practice/README.md' \
  'collections/javascript/interview-practice/README.md' \
  'collections/react/interview-practice/README.md' \
  'collections/typescript/interview-practice/README.md' |
  sort)"
thematicFiles="$(find collections -type f -name README.md |
  sort |
  rg -v '^collections/(interviews|real-work)(/|$)' || true)"
thematicSpecifications=(
  'collections/javascript/interview-practice/README.md|92'
  'collections/typescript/interview-practice/README.md|8'
  'collections/react/interview-practice/README.md|16'
  'collections/html-css/interview-practice/README.md|2'
)

legacyTaskFiles="$(printf '%s\n' \
  'tasks/accessible-keyboard-tabs/README.md' \
  'tasks/browser-event-loop-order/README.md' \
  'tasks/container-responsive-grid/README.md' \
  'tasks/delegated-dynamic-list/README.md' \
  'tasks/discriminated-load-state/README.md' \
  'tasks/flex-long-text-overflow/README.md' \
  'tasks/idempotent-event-listeners/README.md' \
  'tasks/immutable-category-totals/README.md' \
  'tasks/loop-closure-bindings/README.md' \
  'tasks/modal-focus-lifecycle/README.md' \
  'tasks/react-batched-counter/README.md' \
  'tasks/react-derived-list/README.md' \
  'tasks/react-effect-subscription/README.md' \
  'tasks/react-strictmode-cleanup/README.md' \
  'tasks/response-union-narrowing/README.md' \
  'tasks/stable-product-sort/README.md' \
  'tasks/stale-search-response/README.md' \
  'tasks/this-callback-binding/README.md' \
  'tasks/typed-object-property/README.md' \
  'tasks/users-api-list/README.md' \
  'tasks/validate-unknown-profile/README.md' |
  sort)"
legacyThematicFiles="$(printf '%s\n' \
  'collections/html-css/accessibility/README.md' \
  'collections/html-css/layout/README.md' \
  'collections/javascript/arrays-and-objects/README.md' \
  'collections/javascript/dom-and-events/README.md' \
  'collections/javascript/event-loop-and-async/README.md' \
  'collections/javascript/this-and-closures/README.md' \
  'collections/react/effects-and-lifecycle/README.md' \
  'collections/react/state-and-derived-data/README.md' \
  'collections/typescript/narrowing-and-validation/README.md' \
  'collections/typescript/type-modeling/README.md' |
  sort)"
allowedWaveThematicFiles="$(printf '%s\n%s\n' \
  "$legacyThematicFiles" \
  "$controlledThematicFiles" |
  sed '/^$/d' |
  sort -u)"
armyTaskFiles="$(printf '%s\n' "$taskFiles" |
  rg '^tasks/task-[0-9]{4}/README\.md$' || true)"
currentLegacyTaskFiles="$(printf '%s\n' "$taskFiles" |
  rg -v '^tasks/task-[0-9]{4}/README\.md$' || true)"
armyTaskCount="$(printf '%s\n' "$armyTaskFiles" |
  sed '/^$/d' |
  wc -l |
  tr -d ' ')"
legacyTaskCount="$(printf '%s\n' "$currentLegacyTaskFiles" |
  sed '/^$/d' |
  wc -l |
  tr -d ' ')"

if [ "$gateMode" = 'wave' ]; then
  if [ "$currentLegacyTaskFiles" != "$legacyTaskFiles" ]; then
    catalogFail 'wave mode requires the exact closed 21-card legacy inventory'
  fi

  case "$armyTaskCount" in
    0|10|20|30|40|50|60|70|80|90|100|110|118) ;;
    *) catalogFail 'wave mode requires a complete serialized ARMY-97 wave prefix' ;;
  esac

  expectedArmyTaskIds=''
  if [ "$armyTaskCount" -gt 0 ]; then
    expectedArmyTaskIds="$(for number in $(seq 1 "$armyTaskCount"); do
      printf 'task-%04d\n' "$number"
    done)"
  fi
  armyTaskIds="$(printf '%s\n' "$armyTaskFiles" |
    sed '/^$/d' |
    sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#')"
  if [ "$armyTaskIds" != "$expectedArmyTaskIds" ]; then
    catalogFail 'wave mode requires a contiguous immutable ARMY-97 task prefix'
  fi

  while IFS= read -r legacyThematicFile; do
    printf '%s\n' "$thematicFiles" | rg -qxF "$legacyThematicFile" ||
      catalogFail "wave mode is missing legacy thematic path $legacyThematicFile"
  done <<< "$legacyThematicFiles"
  while IFS= read -r thematicFile; do
    printf '%s\n' "$allowedWaveThematicFiles" | rg -qxF "$thematicFile" ||
      catalogFail "wave mode found unexpected thematic path $thematicFile"
  done <<< "$thematicFiles"

  expectedTaskCount="$((legacyTaskCount + armyTaskCount))"
  if [ "$taskCount" -ne "$expectedTaskCount" ]; then
    catalogFail "wave task count $taskCount does not equal legacy $legacyTaskCount plus published ARMY-97 $armyTaskCount"
  fi
else
  if [ "$taskCount" -ne 118 ]; then
    catalogFail "expected exactly 118 task cards; found $taskCount"
  fi
  if [ "$legacyTaskCount" -ne 0 ]; then
    catalogFail 'final mode permits only tasks/task-NNNN/README.md paths'
  fi
  expectedArmyTaskIds="$(for number in $(seq 1 118); do
    printf 'task-%04d\n' "$number"
  done)"
  armyTaskIds="$(printf '%s\n' "$armyTaskFiles" |
    sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#')"
  if [ "$armyTaskIds" != "$expectedArmyTaskIds" ]; then
    catalogFail 'expected contiguous task-0001 through task-0118'
  fi
  if [ "$thematicFiles" != "$controlledThematicFiles" ]; then
    catalogFail 'missing or unexpected thematic collection paths'
  fi
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
  done
fi

allCollectionTaskFiles="$(find collections -type f -name README.md -print0 |
  xargs -0 rg --no-filename -o 'tasks/[a-z0-9-]+/README\.md' || true)"
while IFS= read -r referencedTaskFile; do
  [ -z "$referencedTaskFile" ] && continue
  test -f "$referencedTaskFile" ||
    catalogFail "collection references unpublished task card $referencedTaskFile"
done <<< "$allCollectionTaskFiles"

allThematicTaskFiles="$(while IFS= read -r thematicFile; do
  rg --no-filename -o 'tasks/[a-z0-9-]+/README\.md' "$thematicFile" || true
done <<< "$thematicFiles")"
thematicReferenceCount="$(printf '%s\n' "$allThematicTaskFiles" |
  sed '/^$/d' |
  wc -l |
  tr -d ' ')"
uniqueThematicTaskFiles="$(printf '%s\n' "$allThematicTaskFiles" |
  sed '/^$/d' |
  sort -u)"
coveredCount="$(printf '%s\n' "$uniqueThematicTaskFiles" |
  sed '/^$/d' |
  wc -l |
  tr -d ' ')"
if [ "$uniqueThematicTaskFiles" != "$taskFiles" ] ||
  [ "$thematicReferenceCount" -ne "$taskCount" ]; then
  catalogFail 'every current task must appear in exactly one thematic collection'
fi
# END_BLOCK_CERTIFY_MODE_INVENTORY

trap 'catalogFail "$taskFile failed ARMY-97 card contract"' ERR
while IFS= read -r taskFile; do
  [ -z "$taskFile" ] && continue
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
done <<< "$armyTaskFiles"
trap - ERR

while IFS= read -r taskFile; do
  [ -z "$taskFile" ] && continue
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
done <<< "$armyTaskFiles"

if [ "$gateMode" = 'final' ]; then
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
fi

# START_BLOCK_SCAN_ALL_MARKDOWN_PROVENANCE
if [ "$gateMode" = 'wave' ]; then
  provenanceFiles="$({
    find README.md collections -type f -name README.md
    printf '%s\n' "$armyTaskFiles"
  } | sed '/^$/d' | sort -u)"
else
  provenanceFiles="$(find README.md collections tasks -type f -name README.md | sort)"
fi
while IFS= read -r markdownFile; do
  if rg -n -i 'author|source repository|video walkthrough|imported|migrated|мигрир|импортир' "$markdownFile"; then
    catalogFail "prohibited provenance in $markdownFile"
  fi
done <<< "$provenanceFiles"
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

printf '{"catalogGate":"PASS","gateMode":"%s","tasks":%s,"legacyCards":%s,"publishedArmyCards":%s,"covered":%s,"orphans":0,"thematicErrors":0}\n' \
  "$gateMode" \
  "$taskCount" \
  "$legacyTaskCount" \
  "$armyTaskCount" \
  "$coveredCount"
