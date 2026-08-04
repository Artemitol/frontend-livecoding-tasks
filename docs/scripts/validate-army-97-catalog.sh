#!/usr/bin/env bash
# FILE: docs/scripts/validate-army-97-catalog.sh
# VERSION: 2.6.1
# START_MODULE_CONTRACT
#   PURPOSE: Validate either a serialized ARMY-97 publication wave or the strict final student catalog without reading or mutating Beads.
#   SCOPE: Closed legacy compatibility, complete wave prefixes, canonical duration, starter-only pure-versus-browser editor routing, registry-backed master/topic navigation, task wording, real-work projections, final simulations, bounded provenance exclusion, and local links.
#   DEPENDS: Bash 3+, find, xargs, rg, sed
#   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
#   ROLE: SCRIPT
#   MAP_MODE: NONE
# END_MODULE_CONTRACT
#
# START_CHANGE_SUMMARY
#   LAST_CHANGE: v2.6.1 - Enforce exact master rows, frozen simulation third tasks, and real-work visible titles.
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
allThematicFiles="$(find collections -type f -name README.md |
  sort |
  rg -v '^collections/(interviews|real-work)(/|$)' || true)"
thematicFiles="$allThematicFiles"
thematicSpecifications=(
  'collections/javascript/event-loop/README.md|JavaScript|Event loop и очереди задач|task-0015 task-0016 task-0018 task-0019 task-0020 task-0023 task-0025'
  'collections/javascript/promises-and-async/README.md|JavaScript|Promise и async/await|task-0017 task-0021 task-0022 task-0024 task-0026 task-0027 task-0028 task-0029 task-0051 task-0059'
  'collections/javascript/prototypes-inheritance-and-this/README.md|JavaScript|Прототипы, наследование и `this`|task-0030 task-0031 task-0032 task-0034 task-0035 task-0036'
  'collections/javascript/functions-closures-and-scope/README.md|JavaScript|Функции, замыкания и область видимости|task-0039 task-0047 task-0052 task-0060 task-0061 task-0062 task-0065 task-0066 task-0068 task-0069 task-0070 task-0071 task-0072 task-0113'
  'collections/javascript/objects-and-collections/README.md|JavaScript|Объекты и коллекции|task-0033 task-0040 task-0041 task-0042 task-0043 task-0044 task-0045 task-0050 task-0118'
  'collections/javascript/dom-and-events/README.md|JavaScript|DOM и события|task-0048 task-0058 task-0067'
  'collections/javascript/dates-and-time-intervals/README.md|JavaScript|Даты и временные интервалы|task-0037 task-0053 task-0054'
  'collections/javascript/arrays-search-and-sorting/README.md|JavaScript|Массивы, поиск и сортировка|task-0046 task-0082 task-0083 task-0084 task-0087 task-0088 task-0090 task-0095 task-0100'
  'collections/javascript/strings/README.md|JavaScript|Строки|task-0085 task-0086 task-0097 task-0098 task-0099'
  'collections/javascript/trees-and-recursion/README.md|JavaScript|Деревья и рекурсия|task-0073 task-0074 task-0075 task-0076 task-0077 task-0078 task-0079 task-0080 task-0081 task-0091 task-0096'
  'collections/javascript/graphs/README.md|JavaScript|Графы|task-0055 task-0056'
  'collections/javascript/linked-lists-and-stack/README.md|JavaScript|Связные списки и стек|task-0064 task-0089 task-0092 task-0093 task-0094'
  'collections/javascript/numbers-types-and-operators/README.md|JavaScript|Числа, типы и операторы|task-0109 task-0110 task-0111 task-0112 task-0114 task-0115 task-0116 task-0117'
  'collections/typescript/generics-and-object-keys/README.md|TypeScript|Дженерики и ключи объектов|task-0038 task-0102 task-0106'
  'collections/typescript/mapped-and-conditional-types/README.md|TypeScript|Mapped и conditional types|task-0101 task-0103 task-0105'
  'collections/typescript/recursive-types/README.md|TypeScript|Рекурсивные типы|task-0104'
  'collections/typescript/integration-typing/README.md|TypeScript|Типизация интеграций|task-0057'
  'collections/react/state-and-event-handlers/README.md|React|Состояние и обработчики событий|task-0009 task-0063'
  'collections/react/effects-timers-and-cleanup/README.md|React|Эффекты, таймеры и очистка|task-0001 task-0005 task-0014'
  'collections/react/rendering-and-memoization/README.md|React|Рендеринг и мемоизация|task-0002 task-0003 task-0007'
  'collections/react/async-data-and-ui-states/README.md|React|Асинхронные данные и состояния интерфейса|task-0004 task-0006 task-0008 task-0010'
  'collections/react/component-composition-and-state-management/README.md|React|Композиция компонентов и управление состоянием|task-0011 task-0012 task-0013 task-0049'
  'collections/html-css/cascade-and-selectors/README.md|HTML/CSS|Каскад и селекторы|task-0107 task-0108'
)
registeredTopicFiles="$(for thematicSpecification in "${thematicSpecifications[@]}"; do
  printf '%s\n' "${thematicSpecification%%|*}"
done | sort)"
registeredMasterFiles="$(printf '%s\n' \
  'collections/javascript/README.md' \
  'collections/typescript/README.md' \
  'collections/react/README.md' \
  'collections/html-css/README.md' | sort)"
frozenSimulationThirdTasks=(
  task-0033 task-0016 task-0030 task-0065 task-0087 task-0098 task-0109 task-0067 task-0074 task-0089
  task-0037 task-0063 task-0031 task-0044 task-0100 task-0066 task-0111 task-0077 task-0085 task-0092
  task-0032 task-0045 task-0068 task-0112 task-0080 task-0082 task-0097 task-0093 task-0035 task-0114
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
  expectedFinalThematicFiles="$(printf '%s\n%s\n' "$registeredTopicFiles" "$registeredMasterFiles" | sort)"
  if [ "$allThematicFiles" != "$expectedFinalThematicFiles" ]; then
    catalogFail 'missing or unexpected thematic collection paths'
  fi
  thematicFiles="$registeredTopicFiles"
  for thematicSpecification in "${thematicSpecifications[@]}"; do
    thematicFile="${thematicSpecification%%|*}"
    specificationRemainder="${thematicSpecification#*|}"
    masterName="${specificationRemainder%%|*}"
    specificationRemainder="${specificationRemainder#*|}"
    topicName="${specificationRemainder%%|*}"
    expectedTaskIds="${specificationRemainder#*|}"
    expectedCount="$(printf '%s\n' "$expectedTaskIds" | wc -w | tr -d ' ')"
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
    actualTaskIds="$(printf '%s\n' "$thematicTaskFiles" | sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#' | paste -sd ' ' -)"
    if [ "$actualTaskIds" != "$expectedTaskIds" ]; then
      catalogFail "$thematicFile must retain ascending initial task IDs"
    fi
    topicSlug="$(basename "$(dirname "$thematicFile")")"
    masterSlug="$(basename "$(dirname "$(dirname "$thematicFile")")")"
    masterFile="collections/$masterSlug/README.md"
    masterBreadcrumb="[Главная](../../README.md) → $masterName"
    topicBreadcrumb="[Главная](../../../README.md) → [$masterName](../README.md) → $topicName"
    rg -qxF "$masterBreadcrumb" "$masterFile" || catalogFail "$masterFile must use its exact master breadcrumb"
    rg -qxF "$topicBreadcrumb" "$thematicFile" || catalogFail "$thematicFile must use its exact topic breadcrumb"
    masterRow="- [$topicName]($topicSlug/README.md) — $expectedCount задач —"
    test "$(rg -F -- "$masterRow" "$masterFile" | wc -l | tr -d ' ')" -eq 1 ||
      catalogFail "$masterFile master topic count or row drift"
  done
  while IFS= read -r masterFile; do
    [ -z "$masterFile" ] && continue
    masterSlug="$(basename "$(dirname "$masterFile")")"
    expectedMasterTopicCount="$(printf '%s\n' "${thematicSpecifications[@]}" |
      rg -c "^collections/$masterSlug/[^/]+/README\\.md\\|" || true)"
    actualMasterTopicCount="$(rg -c '^- ' "$masterFile" || true)"
    if [ "$actualMasterTopicCount" -ne "$expectedMasterTopicCount" ] ||
      rg -q 'tasks/task-[0-9]{4}/README\.md' "$masterFile"; then
      catalogFail "$masterFile must list exactly its registered topic rows"
    fi
  done <<< "$registeredMasterFiles"
  if rg -n 'interview-practice' README.md collections; then
    catalogFail 'broad interview-practice pages and links are forbidden'
  fi
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
  if [ "$gateMode" = 'final' ]; then
    taskId="$(basename "$(dirname "$taskFile")")"
    cardTitle="$(sed -n 's/^# //p' "$taskFile" | head -n 1)"
    expectedPrefix="$taskId — "
    [[ "$cardTitle" == "$expectedPrefix"* ]] ||
      catalogFail "$taskFile task H1 must use its immutable task ID"
  fi
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
  printf '%s\n' "$metadata" | rg -q -- '- Примерное время: [1-9][0-9]* минут$'
  if [ "$gateMode" = 'final' ]; then
    taskId="$(basename "$(dirname "$taskFile")")"
    cardTitle="$(sed -n 's/^# //p' "$taskFile" | head -n 1)"
    expectedPrefix="$taskId — "
    [[ "$cardTitle" == "$expectedPrefix"* ]] ||
      catalogFail "$taskFile task H1 must use its immutable task ID"
    expectedCollection=''
    for thematicSpecification in "${thematicSpecifications[@]}"; do
      specificationRemainder="${thematicSpecification#*|}"
      masterName="${specificationRemainder%%|*}"
      specificationRemainder="${specificationRemainder#*|}"
      topicName="${specificationRemainder%%|*}"
      expectedTaskIds="${specificationRemainder#*|}"
      if printf ' %s ' "$expectedTaskIds" | rg -q " $taskId "; then
        expectedCollection="$masterName → $topicName"
        break
      fi
    done
    [ -n "$expectedCollection" ] || catalogFail "$taskFile is absent from the frozen topic registry"
    metadataCollection="$(printf '%s\n' "$metadata" | sed -n 's/^- Подборка: //p')"
    [ "$metadataCollection" = "$expectedCollection" ] ||
      catalogFail "$taskFile metadata collection does not match the registered topic"
  fi
  technology="$(printf '%s\n' "$metadata" |
    sed -n 's/^- Технология: //p')"
  sandboxLine="$(rg '^Песочница для выполнения — ' "$taskFile")"
  programizLine='Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).'
  codePenLine='Песочница для выполнения — [CodePen](https://pen.new).'
  typeScriptPlaygroundLine='Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).'
  reactTypeScriptLine='Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).'
  starterSection="$(sed -n '/^## Условие$/,/^<details>$/p' "$taskFile")"
  browserStarterPattern='(^|[^[:alnum:]_$])(document|window|navigator|localStorage|sessionStorage|location|history|HTMLElement|NodeList|EventTarget|Document|WebSocket|MutationObserver|IntersectionObserver|ResizeObserver)([^[:alnum:]_$]|$)|(^|[^[:alnum:]_$])(fetch|requestAnimationFrame|cancelAnimationFrame|addEventListener|removeEventListener)[[:space:]]*\(|^[[:space:]]*(import|export)([[:space:]{]|$)|(^|[^[:alnum:]_$])import[[:space:]]*\('
  usesBrowserRuntime='false'
  if printf '%s\n' "$starterSection" | rg -q "$browserStarterPattern"; then
    usesBrowserRuntime='true'
  fi
  case "$technology" in
    JavaScript)
      if [ "$usesBrowserRuntime" = 'true' ]; then
        expectedSandboxLine="$codePenLine"
      else
        expectedSandboxLine="$programizLine"
      fi
      ;;
    TypeScript)
      if [ "$usesBrowserRuntime" = 'true' ]; then
        expectedSandboxLine="$codePenLine"
      else
        expectedSandboxLine="$typeScriptPlaygroundLine"
      fi
      ;;
    React/TypeScript)
      expectedSandboxLine="$reactTypeScriptLine"
      ;;
    HTML/CSS|HTML/JavaScript|HTML/CSS/JavaScript)
      expectedSandboxLine="$codePenLine"
      ;;
  esac
  if [ "$sandboxLine" != "$expectedSandboxLine" ]; then
    catalogFail "$taskFile technology and editor profile do not match"
  fi
  for summary in 'Подсказка 1 — куда смотреть' 'Подсказка 2 — с чего начать' 'Подсказка 3 — почти решение' Решение; do
    line="$(rg -n "^<summary>$summary</summary>$" "$taskFile" | cut -d: -f1)"
    end="$(tail -n +"$line" "$taskFile" | rg -n '^</details>$' | head -n 1 | cut -d: -f1)"
    test -n "$(sed -n "$((line + 1)),$((line + end - 2))p" "$taskFile" | rg '[^[:space:]]')"
  done
  ! rg -q -i '(^|[^[:alnum:]_])author([^[:alnum:]_]|$)|source repository|video walkthrough|imported|migrated|мигрир|импортир|<!doctype|<html|<head|<body|<style|<script|← Все подборки|Самопроверка|Готово, когда' "$taskFile"
done <<< "$armyTaskFiles"
trap - ERR

if [ "$gateMode" = 'final' ]; then
  forbiddenStudentVocabulary='fixture|fixtures|фикстур\p{L}*'
  forbiddenEnvironmentWording='\bESM\b|browser[ -]?API|браузерн\p{L}*[[:space:]]+API|консольн\p{L}*[[:space:]]+JavaScript|(используйте|используй).*(обычн\p{L}*|современн\p{L}*|чист\p{L}*).*(JavaScript|TypeScript)|CodePen.*(без|without).*(режим|mode|ESM|препроцесс|preprocessor|API|модул)'
  if rg -n -i "$forbiddenStudentVocabulary" tasks; then
    catalogFail 'forbidden student vocabulary in task cards'
  fi
  if rg -n -i "$forbiddenEnvironmentWording" tasks; then
    catalogFail 'forbidden environment wording in task cards'
  fi
fi

while IFS= read -r taskFile; do
  [ -z "$taskFile" ] && continue
  references="$(rg -l "\]\([^)]*$taskFile\)" collections || true)"
  test -n "$references"
  thematicFile="$(printf '%s\n' "$references" | rg -v '^collections/(interviews|real-work)/')"
  test "$(printf '%s\n' "$thematicFile" | wc -l | tr -d ' ')" -eq 1
  collectionName="$(rg -o -- '- Подборка: .+' "$taskFile" | sed 's/- Подборка: //')"
  rg -qF "$collectionName" "$thematicFile"
  cardTitle="$(sed -n 's/^# //p' "$taskFile" | head -n 1)"
  cardDuration="$(rg -o -- '- Примерное время: [1-9][0-9]* минут$' "$taskFile" |
    sed 's/- Примерное время: //')"
  collectionRow="$(rg -F "$taskFile" "$thematicFile" || true)"
  collectionRowCount="$(printf '%s\n' "$collectionRow" |
    sed '/^$/d' |
    wc -l |
    tr -d ' ')"
  if [ "$gateMode" = 'final' ]; then
    collectionRowGrammar='^[1-9][0-9]*\. \[task-[0-9]{4} — [^]]+\]\(\.\./\.\./\.\./tasks/task-[0-9]{4}/README\.md\) — (Базовая|Средняя|Продвинутая) · [1-9][0-9]* минут — [^—.!?]*\p{L}[^—.!?]*\p{L}[^—.!?]*[.!?]$'
  else
    collectionRowGrammar='^[1-9][0-9]*\. \[[^]]+\]\(\.\./\.\./\.\./tasks/task-[0-9]{4}/README\.md\) — [^—.!?]*\p{L}[^—.!?]*\p{L}[^—.!?]*[.!?] — [1-9][0-9]* минут$'
  fi
  if (
    [ "$collectionRowCount" -ne 1 ] ||
    ! printf '%s\n' "$collectionRow" | rg -q "$collectionRowGrammar"
  ); then
    catalogFail "$taskFile collection row must use exact ordinal, link, substantive sentence, and duration grammar"
  fi
  linkedTitle="$(printf '%s\n' "$collectionRow" |
    sed -E 's/^[1-9][0-9]*\. \[([^]]+)\]\(.*/\1/')"
  if [ "$gateMode" = 'final' ]; then
    rowDuration="$(printf '%s\n' "$collectionRow" | rg -o '[1-9][0-9]* минут' || true)"
    rowDescription="$(printf '%s\n' "$collectionRow" |
      sed -E 's/^[1-9][0-9]*\. \[[^]]+\]\([^)]*\) — (Базовая|Средняя|Продвинутая) · [1-9][0-9]* минут — //')"
  else
    rowDuration="$(printf '%s\n' "$collectionRow" |
      rg -o '[1-9][0-9]* минут$' || true)"
    rowDescription="$(printf '%s\n' "$collectionRow" |
      sed -E 's/^[1-9][0-9]*\. \[[^]]+\]\([^)]*\) — //' |
      sed -E 's/ — [1-9][0-9]* минут$//')"
  fi
  if (
    [ "$linkedTitle" != "$cardTitle" ] ||
    [ "$rowDuration" != "$cardDuration" ] ||
    ! printf '%s\n' "$rowDescription" | rg -q '\p{L}.*\p{L}[.!?]$'
  ); then
    catalogFail "$taskFile collection row must match the card title, one description sentence, and exact duration"
  fi
  realWorkReferences="$(rg -o "\]\([^)]*$taskFile\)" collections/real-work/README.md || true)"
  realWorkReferenceCount="$(printf '%s\n' "$realWorkReferences" |
    sed '/^$/d' |
    wc -l |
    tr -d ' ')"
  if rg -q -- '- Формат: Приближённая к реальной работе$' "$taskFile"; then
    if [ "$realWorkReferenceCount" -ne 1 ]; then
      catalogFail "$taskFile real-work format must appear exactly once in the real-work collection"
    fi
    realWorkRow="$(rg -F "$taskFile" collections/real-work/README.md || true)"
    if ! printf '%s\n' "$realWorkRow" | rg -qF "[$cardTitle]("; then
      catalogFail "$taskFile real-work row title must match the card title"
    fi
  elif [ "$realWorkReferenceCount" -ne 0 ]; then
    catalogFail "$taskFile focused card must not appear in the real-work collection"
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
    rg -q '^Реализм: .+$' "$file"
    test "$(rg -o "\[Симуляция собеседования №$number\]\([^)]*simulation-$id/README\.md\) — [0-9]+ минут" collections/interviews/README.md | wc -l | tr -d ' ')" -eq 1
    simulationTasks=()
    orderedSimulationTasks=()
    while IFS= read -r task; do
      orderedSimulationTasks+=("$task")
    done < <(rg -o 'tasks/task-[0-9]{4}/README\.md' "$file")
    while IFS= read -r task; do
      simulationTasks+=("$task")
    done < <(rg -o 'tasks/task-[0-9]{4}/README\.md' "$file" | sort -u)
    test "${#simulationTasks[@]}" -eq 3 ||
      catalogFail "$file must contain exactly three task links"
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
    test "$(printf '%b' "$collections" | sort -u | rg '.' | wc -l | tr -d ' ')" -ge 3 ||
      catalogFail "$file must cover at least three topic collections"
    expectedThirdTask="${frozenSimulationThirdTasks[$((number - 1))]}"
    actualThirdTask="$(printf '%s\n' "${orderedSimulationTasks[2]}" |
      sed -E 's#tasks/(task-[0-9]{4})/README\.md#\1#')"
    if [ "$actualThirdTask" != "$expectedThirdTask" ]; then
      catalogFail "$file frozen third task must be $expectedThirdTask"
    fi
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
  if rg -n -i '(^|[^[:alnum:]_])author([^[:alnum:]_]|$)|source repository|video walkthrough|imported|migrated|мигрир|импортир' "$markdownFile"; then
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
