# Task 8 report: R8 published student experience audit

## Status and evidence lifecycle

`PASS` for the published student surface and Phase-15 candidate. R8 was
reopened after final whole-branch review; that prior verdict does not cover the
new forward hygiene commit.

The immutable GitHub-rendered audit passed twice before this report was
prepared:

1. frozen R7 candidate
   `8421e3231ed65d70bbd825eafbd634895f8025bc`;
2. pushed Phase-15 commit
   `7d158b3890ee6c64bb1e5998f0ede6c7144b94ec`.

This report and the progress-ledger update form an evidence-only candidate
commit after the second pass. That enclosing commit must receive one final
immutable Steps 2–4 rerun before R8 is closed. Its exact SHA is intentionally
recorded in Beads and the final handoff rather than inside its own commit
content, which cannot self-reference its Git object ID.

No student-facing README, collection, task card, editor instruction, or runtime
artifact changed during R8.

## Final-review hygiene follow-up

The forward-only follow-up removes the tracked local runtime and machine files
`.superpowers/brainstorm/.last-port`, `.superpowers/brainstorm/.last-token`,
`.superpowers/brainstorm/578-1784781394/state/server-info`,
`.superpowers/brainstorm/578-1784781394/state/server-instance-id`,
`.superpowers/brainstorm/578-1784781394/state/server.pid`, and
`docs/superpowers/.DS_Store`. Root ignore rules now cover `.DS_Store`, the two
brainstorm marker files, and every `.superpowers/brainstorm/*/state/` directory.
The legitimate `578-1784781394/content/*.html` artifacts remain tracked.

R8 remains open and a new immutable audit of the hygiene-fix SHA is pending.
Published history is not rewritten, so the former local token remains in
published history until separately authorized remediation.

## Baseline and publication surface

- Checkout:
  `/Users/artemiy/VsCode/mentor/frontend-livecoding-tasks`.
- Branch: `feature/frontend-livecoding-tasks-kln`.
- Initial frozen SHA:
  `8421e3231ed65d70bbd825eafbd634895f8025bc`.
- Initial `origin/main...HEAD`: `0` behind / `36` ahead.
- Initial branch tracking: `0` behind / `0` ahead.
- Correct root checkout: PASS.
- Normal checkout, not a linked worktree: PASS.
- `.workspace` absent from the physical path: PASS.
- Published audit surface: immutable GitHub `blob/<sha>/<path>` pages.
- Browser: Codex in-app browser in an unsigned public GitHub session.
- Existing draft PR:
  `https://github.com/Artemitol/frontend-livecoding-tasks/pull/2`.
  R8 used immutable commit pages, so it does not infer a fresh PR UI state.

## First immutable audit

Commit `8421e3231ed65d70bbd825eafbd634895f8025bc` passed:

- `34/34` rendered pages;
- root `13/13` collection links and all four editor links;
- `13/13` collection pages;
- `20/20` task cards with all six required details initially closed;
- `9/9` source flows across eight unique deep cards;
- progressive Hint 1, Hint 2, Hint 3, `Решение`, and `Самопроверка`;
- browser Back and fallback navigation on every source flow;
- `6/6` editor-profile instruction checks;
- `4/4` external editor surfaces.

No student-facing defect was found. The canonical Phase/Gate vocabulary was
then applied: `Phase-15` and its step became `completed`,
`Gate-Phase-15` became `implemented` with PASS evidence, and the knowledge
graph received rendered-audit PASS state.

The R8 ownership table omitted `docs/development-plan.xml`, although that file
owned the only canonical `Phase-15` status. Leaving it pending would contradict
the Step-5 result and GRACE current-state rules. The focused audit commit
therefore included the minimal canonical owner update together with
`docs/verification-plan.xml` and `docs/knowledge-graph.xml`.

## Final 34-page inventory on the Phase-15 commit

Verdict rule: PASS required a rendered GitHub `main article`, the exact visible
H1, no `Page not found` state, and all required links or initially closed
details. The controller reran the complete inventory from scratch on
`7d158b3890ee6c64bb1e5998f0ede6c7144b94ec`.

| Repository path | Exact resolved published URL | Visible title | HTTP/render status | Required links/details actual | Verdict |
| --- | --- | --- | --- | --- | --- |
| `README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/README.md` | Frontend live-coding задачи | GitHub article rendered; no 404 | 13 collection links and four editor links visible | PASS |
| `collections/html-css/accessibility/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/html-css/accessibility/README.md` | Доступность интерфейсов | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/html-css/layout/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/html-css/layout/README.md` | Вёрстка | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/interviews/interview-01/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/interviews/interview-01/README.md` | Собеседование №1 | GitHub article rendered; no 404 | 5 task links | PASS |
| `collections/interviews/interview-02/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/interviews/interview-02/README.md` | Собеседование №2 | GitHub article rendered; no 404 | 5 task links | PASS |
| `collections/interviews/interview-03/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/interviews/interview-03/README.md` | Собеседование №3 | GitHub article rendered; no 404 | 5 task links | PASS |
| `collections/javascript/arrays-and-objects/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/javascript/arrays-and-objects/README.md` | Массивы и объекты | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/javascript/dom-and-events/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/javascript/dom-and-events/README.md` | DOM и события | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/javascript/event-loop-and-async/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/javascript/event-loop-and-async/README.md` | Event loop и асинхронность | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/javascript/this-and-closures/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/javascript/this-and-closures/README.md` | this и замыкания | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/react/effects-and-lifecycle/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/react/effects-and-lifecycle/README.md` | React: эффекты и жизненный цикл | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/react/state-and-derived-data/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/react/state-and-derived-data/README.md` | React: состояние и производные данные | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/typescript/narrowing-and-validation/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/typescript/narrowing-and-validation/README.md` | Сужение и проверка данных | GitHub article rendered; no 404 | 2 task links | PASS |
| `collections/typescript/type-modeling/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/collections/typescript/type-modeling/README.md` | Моделирование типов | GitHub article rendered; no 404 | 2 task links | PASS |
| `tasks/accessible-keyboard-tabs/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/accessible-keyboard-tabs/README.md` | Вкладки с ARIA и клавиатурной навигацией | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/browser-event-loop-order/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/browser-event-loop-order/README.md` | Порядок синхронного кода, microtask и timer callback | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/container-responsive-grid/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/container-responsive-grid/README.md` | Сетка карточек от ширины контейнера | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/delegated-dynamic-list/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/delegated-dynamic-list/README.md` | Удаление динамической строки через делегирование событий | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/discriminated-load-state/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/discriminated-load-state/README.md` | Взаимоисключающие состояния загрузки | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/flex-long-text-overflow/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/flex-long-text-overflow/README.md` | Длинное слово во flex-строке | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/idempotent-event-listeners/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/idempotent-event-listeners/README.md` | Повторная инициализация без дублирования listener | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/immutable-category-totals/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/immutable-category-totals/README.md` | Итоги по категориям без мутаций | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/loop-closure-bindings/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/loop-closure-bindings/README.md` | Замыкания, созданные внутри цикла | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/modal-focus-lifecycle/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/modal-focus-lifecycle/README.md` | Диалог с удержанием и восстановлением фокуса | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/react-batched-counter/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/react-batched-counter/README.md` | Три обновления счётчика в одном событии | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/react-derived-list/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/react-derived-list/README.md` | Производный список без копии состояния | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/react-effect-subscription/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/react-effect-subscription/README.md` | Подписка, которая следует за выбранным каналом | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/react-strictmode-cleanup/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/react-strictmode-cleanup/README.md` | Идемпотентный cleanup в корневом StrictMode | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/response-union-narrowing/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/response-union-narrowing/README.md` | Безопасная обработка результата запроса | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/stable-product-sort/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/stable-product-sort/README.md` | Стабильная сортировка товаров по двум ключам | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/stale-search-response/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/stale-search-response/README.md` | Актуальный результат поиска при гонке ответов | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/this-callback-binding/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/this-callback-binding/README.md` | this у метода, стрелки и отделённого callback | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/typed-object-property/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/typed-object-property/README.md` | Точный тип значения по ключу настройки | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |
| `tasks/validate-unknown-profile/README.md` | `https://github.com/Artemitol/frontend-livecoding-tasks/blob/7d158b3890ee6c64bb1e5998f0ede6c7144b94ec/tasks/validate-unknown-profile/README.md` | Проверка JSON-профиля без assertion | GitHub article rendered; no 404 | 6 required details initially closed and 2 root links | PASS |

Aggregate: `34/34 PASS`; `20/20` cards rendered all six required summaries
closed initially; no required summary or relative navigation link was missing.

## Deep student-flow matrix

Each unique deep card exposed its starter code with six required details closed.
The exact action sequence was: open the source page, open the card, verify the
starter block, open and close Hint 1, Hint 2, Hint 3, `Решение`, and
`Самопроверка` separately, verify the profile instruction, use browser Back,
reopen the card, and use `Потерялись? Открыть все подборки`.

| Source / card | Exact expected result | Controller-observed actual | Verdict |
| --- | --- | --- | --- |
| JavaScript / Массивы и объекты → `immutable-category-totals` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; Programiz console-JS instruction; Back to thematic URL; fallback to root | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; Programiz/no-browser-API instruction; exact Back and root fallback | PASS |
| TypeScript / Моделирование типов → `discriminated-load-state` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; TypeScript 5.9 strict diagnostics/Run instruction; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; TypeScript 5.9 strict instruction; exact Back and root fallback | PASS |
| HTML/CSS / Вёрстка → `flex-long-text-overflow` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; CodePen full-HTML and 640 CSS px instruction; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; full-HTML/640 CSS px instruction; exact Back and root fallback | PASS |
| React / Состояние и производные данные → `react-batched-counter` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; `vite.new/react-ts`, only `src/App.tsx`, React 19.2 instruction; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; Vite/App.tsx/React 19.2 instruction; exact Back and root fallback | PASS |
| Собеседование №1 → `immutable-category-totals` | Interview link opens the same Programiz card; Back returns the exact interview URL; fallback returns root | Fresh interview navigation, exact Back, and root fallback passed; the same immutable card details had already passed 5/5 above | PASS |
| Собеседование №2 → `browser-event-loop-order` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; CodePen classic `<script>`, explicitly not ESM/Node; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; classic-script instruction; exact interview Back and root fallback | PASS |
| Собеседование №3 → `stale-search-response` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; CodePen full HTML with `<script type="module">`; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; browser-ESM instruction; exact interview Back and root fallback | PASS |
| HTML/CSS / Доступность → `accessible-keyboard-tabs` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; CodePen browser-ESM full HTML; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; browser-ESM instruction; exact thematic Back and root fallback | PASS |
| HTML/CSS / Доступность → `modal-focus-lifecycle` | Exact task H1; starter visible; 6 details closed; 5 content bodies open/close; CodePen browser-ESM full HTML; exact Back and fallback | Exact H1 and starter; 6 closed; 5/5 non-empty open/close; browser-ESM instruction; exact thematic Back and root fallback | PASS |

Coverage: four technology sections, all three interviews, code-first and
complex card modes, all six editor profiles, and all three former fixture cards.

## External editor availability

| Exact action | Expected | Controller-observed actual | Verdict |
| --- | --- | --- | --- |
| Open `https://www.programiz.com/javascript/online-compiler/` | Public JavaScript editor with Run/output surface | Same URL; `Online JavaScript Compiler (Editor) - Programiz`; `main.js`, Run, and Output visible | PASS |
| Open `https://pen.new` | Public CodePen creation surface with HTML/CSS/JS panels | Resolved `https://codepen.io/pen`; `CodePen - Create a New Pen`; all three panels visible | PASS |
| Open `https://www.typescriptlang.org/play/` | TypeScript Playground with TS Config | Same URL; Playground and TS Config visible | PASS |
| Open `https://vite.new/react-ts` | Fresh Vite React TypeScript StackBlitz project | Fresh StackBlitz project URL; project files and Vite editor visible | PASS |

## Deterministic Steps 4 evidence

The full R7 gate plus exact R8 root/worktree checks ran both before and after the
focused commit. The post-push run was guarded by the authoritative full SHA and
passed with a clean branch synchronized to its remote-tracking ref.

Fresh results on `7d158b3890ee6c64bb1e5998f0ede6c7144b94ec`:

- root second-level blocks: `4`;
- collection README files: `13`;
- task cards: `20`;
- thematic links: `20` total / `20` unique;
- interview links: `15` total / `15` unique;
- all root-to-collection and collection-to-task links resolve;
- every card has the exact five current metadata fields;
- no forbidden legacy metadata fields or open details;
- all `docs/*.xml` parse with `xmllint`;
- Grace `3.11.0`: `0` errors / `0` warnings;
- branch: `feature/frontend-livecoding-tasks-kln`;
- root: exact required checkout;
- Git dir equals common dir;
- physical path contains no `.workspace`;
- `git diff --check`: PASS;
- `git status --short`: empty;
- remote feature divergence: `0` / `0`.

## Diagnostic evidence handling

The first post-Phase-15 browser attempt used an incorrectly expanded short hash,
`7d158b3a7ba55ca4166510050d9a1b7ba700ec92`. GitHub rendered
`Ref is invalid`, and local Git proved that object did not exist. The attempt
was excluded from page evidence.

The authoritative hash was then obtained from `git rev-parse HEAD`:
`7d158b3890ee6c64bb1e5998f0ede6c7144b94ec`. The complete browser and
deterministic matrix was restarted from scratch and passed. No invalid hash is
used as audit, Beads, or handoff evidence.

Earlier GitHub SPA navigation diagnostics also observed stale URLs when waiting
for a full navigation event. Explicit `waitForURL` isolated that as automation
timing; the final navigation run passed every exact Back and fallback target.

## Remaining risks

- GitHub was audited as a public unsigned session. Authentication-only controls
  were irrelevant to reading the published Markdown.
- `vite.new/react-ts` is a moving hosted template. R6 separately records
  TypeScript 5.9 compatibility and React 19.2 browser behavior; R8 verifies the
  published link and exact instruction profile.
- Editor availability is external state and may change after this audit.
- The report/progress evidence commit changes no student surface, but still
  receives a complete immutable browser and deterministic rerun before closure.
- The forward hygiene fix removes local runtime state from HEAD only; its new
  immutable audit remains pending, and the former token persists in published
  history because rewriting that history is not authorized.

## Final handoff contract

- Focused Phase-15 commit:
  `7d158b3890ee6c64bb1e5998f0ede6c7144b94ec`
  (`docs: record student experience audit`).
- R8 was reopened after final whole-branch review and closes only after the
  hygiene-fix commit passes a new immutable rerun.
- `frontend-livecoding-tasks-kln-final-acceptance` stays open and receives the
  exact final branch SHA and review scope.
- The top-level story stays open.
- No user acceptance is inferred.
