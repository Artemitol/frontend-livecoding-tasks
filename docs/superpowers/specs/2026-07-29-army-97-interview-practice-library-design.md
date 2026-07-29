# ARMY-97 Interview Practice Library Redesign

## Status

- Linear issue: `ARMY-97`
- Target branch: `feature/army-97`
- Design approved in dialogue on 2026-07-29
- Implementation is not authorized until this written specification is reviewed

## Goal

Replace the current task inventory with a large, interview-oriented practice
library. Preserve many variations of the same frontend mechanism so a student
can train a topic repeatedly, while keeping every card simple, complete, and
independently understandable.

The user-provided candidate inventory contains 118 task sections. Every
distinct section becomes a complete card. Only exact duplicates may be
collapsed. Similar tasks remain separate variants.

## Non-goals

- Preserve any of the current 21 student cards.
- Publish an author, source link, video walkthrough, attribution, or migration
  history in student-facing materials.
- Add a runtime task or interview generator.
- Require every task to appear in an interview simulation.
- Assign Junior, Middle, or Senior labels to simulations.
- Encode a task's topic or classification in its stable ID.
- Add package-manager or application runtime tooling to this Markdown-first
  repository.

## Terminology

### Task

One student card stored at `tasks/task-XXXX/README.md`.

### Thematic collection

A page for learning or drilling one topic, such as Event Loop, Promise, React,
or algorithms. Every task belongs to exactly one thematic collection.

### Real-work collection

An additional cross-cutting page for confirmed React tasks whose format is
`Приближённая к реальной работе`. Real-work membership never replaces a task's
thematic membership.

### Interview simulation

A prebuilt static combination of tasks that resembles a real frontend
technical interview. A simulation may reuse a task only after the required
three-simulation gap.

### Catalog

The complete student navigation surface. The term does not mean one individual
thematic collection or one simulation.

## Stable identity

Task IDs use one global sequence:

```text
task-0001
task-0002
task-0003
```

Rules:

- The path is `tasks/<task-id>/README.md`.
- IDs are assigned after the exact-duplicate audit freezes the distinct
  inventory.
- An assigned ID is immutable.
- Removed IDs are never reused.
- IDs are not renumbered after later additions or deletions.
- IDs are technical and never appear in student-facing titles, card metadata,
  or collection rows.
- Topic classification is stored in collection membership, not in the ID.

Interview simulation paths use a separate stable sequence:

```text
collections/interviews/simulation-001/README.md
```

The student-facing name is `Симуляция собеседования №1`.

## Repository architecture

```text
tasks/
  task-0001/README.md
  task-0002/README.md
  ...

collections/
  javascript/<topic>/README.md
  typescript/<topic>/README.md
  react/<topic>/README.md
  html-css/<topic>/README.md
  real-work/README.md
  interviews/
    README.md
    simulation-001/README.md
    simulation-002/README.md
    ...
```

Relationships:

- A task card is the only source of its condition, starter, hints, solution,
  expected result, manual check, and metadata.
- Every task appears in exactly one thematic collection.
- A confirmed React real-work task additionally appears in
  `collections/real-work/README.md`.
- Interview membership is optional.
- A task may appear in several interview simulations when the recurrence rule
  passes.
- Collections and simulations link to cards and never duplicate their
  conditions.
- The root README links the thematic navigation, the real-work collection, and
  one interview index at `collections/interviews/README.md`.
- The root README retains its four current second-level sections. The
  simulations section contains one index link instead of thirty direct links.

## Student card contract

The exact order is:

1. Simple title.
2. One sandbox line.
3. `## Условие`.
4. Complete minimal starter code whose leading comments contain every
   requirement.
5. Exactly three closed hints.
6. Closed `Решение`.
7. Closed five-field `О задаче`.

Canonical shape:

````markdown
# Простое название задачи

Песочница для выполнения — [CodePen](https://pen.new).

## Условие

```javascript
// Что будет выведено в консоль?
// Объясни порядок выполнения операций.

const value = Promise.resolve();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>
...
</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>
...
</details>

<details>
<summary>Подсказка 3 — почти решение</summary>
...
</details>

<details>
<summary>Решение</summary>
...
</details>

<details>
<summary>О задаче</summary>
...
</details>
````

### Sandbox line

Every card uses exactly:

```text
Песочница для выполнения — [Название](URL).
```

The selected sandbox depends on the technology:

- Programiz for console JavaScript without browser APIs.
- CodePen for browser JavaScript, DOM, HTML, and CSS.
- TypeScript Playground for pure TypeScript.
- React TypeScript for React.

The line does not include instructions to wait, replace a file, choose a mode,
or use a particular browser version. A runtime constraint that is genuinely
required belongs in the starter comments.

### Condition

- `## Условие` remains a stable structural anchor.
- The starter code starts immediately after that heading.
- Every requirement exists only in code comments.
- JavaScript, TypeScript, and React use `//`.
- HTML uses `<!-- -->`.
- CSS uses `/* */`.
- Requirements are not duplicated in prose outside the starter.
- A normal card has one central action.
- Wording is direct: `Что будет выведено в консоль?`, `Напиши функцию
  сортировки`, or `Проведи код-ревью и исправь ошибки`.
- Phrases such as `предскажите единственную строку` are forbidden.
- Contrived product stories are forbidden for JavaScript, TypeScript,
  Event Loop, algorithms, HTML/CSS, and focused React cards.
- Necessary product context is allowed only for React cards whose format is
  `Приближённая к реальной работе`.
- React real-work context states only the interface behavior and data needed
  for tasks such as search, pagination, timers, or a player component. It does
  not invent a company, business story, or irrelevant background.

### Starter and solution

- The starter is complete, minimal, and copy-ready.
- Broken or incomplete candidate examples are repaired before publication.
- A real-work multi-file starter is allowed only when genuine file boundaries
  are necessary.
- Requirements live in the first editable starter file and are not duplicated
  across files.
- Each hint advances the student beyond the previous hint.
- `Решение` contains changed code, a short explanation, the expected result,
  and a simple manual check.
- `Решение` does not repeat unchanged fixtures or unrelated environment code.

### Metadata

`О задаче` contains exactly:

- `Технология`
- `Подборка`
- `Формат`
- `Сложность`
- `Примерное время`

The task ID is not a sixth student-facing field.

### Provenance exclusion

Student-facing cards, collections, the root README, and simulation pages never
contain:

- an author name;
- a source repository or source link;
- a video walkthrough;
- text saying that a task was imported or migrated.

The candidate set is an input to ARMY-97, not part of the published student
experience.

## Candidate audit and duplicate policy

The baseline candidate inventory contains 118 task sections.

- Each section is inspected as an independent candidate.
- Exact duplicates have the same central action, starter behavior, and
  expected result.
- Only exact duplicates are collapsed.
- Similar inputs, different control flow, different output order, different
  edge cases, or different implementation constraints make distinct variants.
- An unclear similarity decision defaults to keeping both candidates until an
  exact duplicate is proved.
- A broken, incomplete, or contradictory candidate is independently rewritten
  into the most likely complete interview task instead of being published
  unfinished.
- The final card count is 118 minus only the exact duplicate groups proved
  during the audit.

Beads stores neutral target-card goals and acceptance evidence. It does not
publish author, source URL, or migration history.

## Migration strategy

### Branch preparation

The previous task-card Wave C is preserved first. ARMY-97 uses an isolated
worktree on `feature/army-97` based on the full preserved previous feature
state. This is an explicit one-time base exception because the current
architecture is not yet in `main`.

Published history is not rewritten. Reset, stash, force-push, and destructive
cleanup are not used to transfer the previous work.

### Transitional state

- Existing 21 cards remain until replacement cards are accepted.
- Governance contains a closed temporary list of those legacy slugs.
- New cards must use `task-XXXX` paths and the new card contract immediately.
- Every new card is linked from one thematic collection in the same change.
- The temporary legacy list is removed during final cutover.

### Serialized publication

At a final count of 118 cards, publication uses twelve waves: eleven waves of
ten and a final wave of eight. If exact duplicates reduce the inventory, waves
remain 8–10 cards except for the final incomplete wave.

For each card:

1. Write the complete card.
2. Add exactly one thematic membership.
3. Add real-work membership when applicable.
4. Synchronize knowledge graph, verification plan, and Beads evidence.
5. Run card-local checks and the full orphan regression.
6. Obtain an independent content review.

A wave is committed and published only after every card in the wave passes.
Partial or draft cards do not enter `tasks/`.

### Final cutover

After all replacement waves pass:

- remove the current 21 legacy task directories;
- remove their collection rows;
- remove the temporary legacy-path exception;
- rebuild root navigation and all thematic projections;
- create the interview index and thirty simulation pages;
- synchronize GRACE artifacts and Beads evidence;
- run the complete final catalog gate.

## Thematic collections

Thematic collections are for learning and drilling one topic. Large pages use
subheadings for narrower mechanisms and keep similar variants near one another.
For example, an Event Loop page may group synchronous order, microtasks and
macrotasks, Promise chains, async/await, and combined examples.

Collection rules:

- The candidate audit freezes one controlled broad-topic registry before the
  first card wave assigns thematic memberships.
- The registry, collection count, and every task-to-collection mapping are
  recorded in the GRACE artifacts and deterministic verification expectations.
- Every task appears in exactly one thematic collection.
- A collection row contains a linked student title, one plain-language
  sentence, and exact time.
- Similar tasks may be displayed as variants, but the hidden task ID remains
  the stable identity.
- A task may change subgroup without changing its ID.
- `real-work` and `interviews` never satisfy the required thematic membership.

## Interview simulations

The initial catalog contains exactly thirty static mixed simulations.

### Composition

- Each simulation lasts 30–120 minutes.
- Task count is not fixed.
- Every simulation contains at least two tasks from at least two thematic
  collections.
- Total time equals the sum of the linked card times.
- A simulation may combine output prediction, implementation, bug fixing,
  code review, TypeScript, and React.
- A long React real-work card may occupy most of a simulation.
- There are no Junior, Middle, or Senior labels.
- Not every task must appear in a simulation.
- There are no thematic simulations; focused practice belongs to thematic
  collections.

### Realism

Each simulation is manually reviewed as a plausible frontend technical
interview. It may start with a short warm-up, continue with implementation or
debugging, and sometimes end with a larger React or real-work task. There is no
quota requiring one task from every technology.

The initial task distribution is varied, then manually adjusted for coherent
duration, progression, and interview realism.

### Recurrence

- Task IDs are unique within one simulation.
- In any three consecutive simulations, every task ID appears at most once.
- A task used in simulation 1 may first reappear in simulation 4.
- The recurrence rule applies across the one ordered list of thirty
  simulations.

### Navigation

`collections/interviews/README.md` contains thirty entries with the simulation
name and total time. Each entry links to
`collections/interviews/simulation-XXX/README.md`.

A simulation page contains linked task titles and time per task. It does not
copy task conditions.

## Regression policy

Any addition, deletion, rename, move, or recomposition under `tasks/` or
`collections/` requires a full-catalog check. Checking only changed files is
forbidden.

The agent must:

1. Enumerate every `tasks/task-XXXX/README.md`.
2. Find references across all of `collections/`.
3. Report every card with no reference.
4. Verify exactly one thematic collection reference after excluding
   `collections/interviews/` and `collections/real-work/`.
5. Print total, covered, orphan, and thematic-error counts.
6. Treat any orphan or thematic error as a failed publication gate.

Canonical command:

```bash
taskCount=0
coveredCount=0
orphanCount=0
thematicErrorCount=0

invalidTaskPaths="$(
  find tasks -mindepth 2 -maxdepth 2 -type f -name README.md \
    | sort \
    | rg -v '^tasks/task-[0-9]{4}/README\.md$' \
    || true
)"

if [ -n "$invalidTaskPaths" ]; then
  printf 'INVALID TASK PATH:\n%s\n' "$invalidTaskPaths"
  exit 1
fi

while IFS= read -r taskFile; do
  taskCount=$((taskCount + 1))
  references="$(rg -l -F "$taskFile" collections || true)"

  if [ -z "$references" ]; then
    printf 'ORPHAN: %s\n' "$taskFile"
    orphanCount=$((orphanCount + 1))
    continue
  fi

  coveredCount=$((coveredCount + 1))

  thematicCount="$(
    printf '%s\n' "$references" \
      | rg -v '^collections/(interviews|real-work)/' \
      | rg '.+' \
      | wc -l \
      | tr -d ' '
  )"

  if [ "$thematicCount" -ne 1 ]; then
    printf 'INVALID THEMATIC MEMBERSHIP: %s (%s)\n' \
      "$taskFile" "$thematicCount"
    thematicErrorCount=$((thematicErrorCount + 1))
  fi
done < <(
  find tasks -mindepth 2 -maxdepth 2 -type f -name README.md | sort
)

printf 'tasks=%s covered=%s orphans=%s thematicErrors=%s\n' \
  "$taskCount" "$coveredCount" "$orphanCount" "$thematicErrorCount"

test "$taskCount" -gt 0
test "$coveredCount" -eq "$taskCount"
test "$orphanCount" -eq 0
test "$thematicErrorCount" -eq 0
```

Expected final shape:

```text
tasks=<N> covered=<N> orphans=0 thematicErrors=0
```

## Simulation verification

The final catalog contains exactly thirty sequential simulation pages:

```bash
test "$(
  find collections/interviews \
    -mindepth 2 \
    -maxdepth 2 \
    -type f \
    -name README.md \
    | wc -l \
    | tr -d ' '
)" -eq 30

for simulationNumber in $(seq 1 30); do
  simulationId="$(printf '%03d' "$simulationNumber")"
  simulationFile="collections/interviews/simulation-$simulationId/README.md"
  test -f "$simulationFile"

  taskLinkCount="$(
    rg -o 'tasks/task-[0-9]{4}/README\.md' "$simulationFile" \
      | sort \
      | uniq \
      | wc -l \
      | tr -d ' '
  )"

  test "$taskLinkCount" -ge 2
done
```

The sliding three-simulation recurrence check is:

```bash
for windowStart in $(seq 1 28); do
  firstId="$(printf '%03d' "$windowStart")"
  secondId="$(printf '%03d' "$((windowStart + 1))")"
  thirdId="$(printf '%03d' "$((windowStart + 2))")"

  duplicateIds="$(
    rg --no-filename \
      -o 'tasks/task-[0-9]{4}/README\.md' \
      "collections/interviews/simulation-$firstId/README.md" \
      "collections/interviews/simulation-$secondId/README.md" \
      "collections/interviews/simulation-$thirdId/README.md" \
      | sort \
      | uniq -d
  )"

  test -z "$duplicateIds"
done
```

Additional checks prove:

- every simulation link resolves;
- every simulation contains tasks from at least two thematic collections;
- every simulation duration is 30–120 minutes;
- declared total time equals the sum of its task times;
- every set has a recorded manual realism review.

## Other verification gates

After any catalog change:

- every path matches `tasks/task-[0-9]{4}/README.md`;
- task IDs are unique;
- every card has the exact sandbox-line shape;
- `## Условие` is followed by starter code with requirement comments;
- every card has exactly three hint summaries;
- `Решение` and `О задаче` are closed;
- metadata has exactly five permitted fields;
- student-facing content contains no attribution, source link, video, or
  migration language;
- all local relative links resolve;
- all GRACE XML files pass `xmllint`;
- Grace lint passes through the repository's documented executable resolution;
- `git diff --check` passes.

External sandboxes and browsers are not publication gates. Validation remains
local and Markdown-only.

## Failure handling

- A task remains distinct until an exact duplicate is proved.
- An incomplete candidate is reconstructed into a complete interview task.
- A card with incomplete starter code, solution, metadata, or collection
  membership is not published.
- One failed card prevents its wave from closing but does not discard already
  accepted work.
- Any failed orphan, relative-link, simulation, XML, Grace, or diff gate blocks
  the corresponding commit and publication.
- No failure is hidden by weakening the target inventory or reusing an ID.

## Branch and delivery rules

All repository branches use:

```text
feature/<linear-issue-id-lowercase>
```

For example:

```text
ARMY-97 -> feature/army-97
```

The Linear issue type does not change the prefix. `fix/`, `docs/`, and other
branch prefixes are not used. If the user has not provided a Linear issue, the
agent asks for one before creating a branch and does not invent an identifier.
Direct commits to `main` remain forbidden.

After a coherent verified change, the repository's automatic authority still
applies: commit, push the feature branch without force, and open or update a
pull request targeting `main`.

## Superpowers artifact cleanup

ARMY-97 removes the entire `.superpowers/` directory from Git and the working
tree, including SDD and brainstorm artifacts. The root `.gitignore` adds:

```text
.superpowers/
```

`docs/superpowers/` remains tracked and is the only Git location for
specifications, plans, and plan reviews.

## Durable user preferences

After design approval, record these preferences in the approved memory
extension mechanism:

- Branches use the provided Linear issue:
  `feature/<linear-issue-id-lowercase>`.
- If no Linear issue is provided, ask the user for one before branching.
- Any collection change runs a full inventory regression across all task cards.
- No task may remain without exactly one thematic collection reference.
- Student cards use the universal sandbox line and keep every requirement in
  starter-code comments.

## Acceptance criteria

The design is satisfied when:

- the distinct candidate inventory is frozen from all 118 sections;
- every published replacement card uses an immutable hidden `task-XXXX` ID;
- every card follows the approved concise comment-driven contract;
- every task has exactly one thematic collection membership;
- thirty static mixed interview simulations pass the three-simulation
  recurrence rule and manual realism review;
- the current 21 cards and transitional exceptions are removed at cutover;
- `.superpowers/` is removed and ignored while `docs/superpowers/` remains;
- all Markdown, catalog, simulation, XML, Grace, link, orphan, and diff gates
  pass;
- the work is delivered from `feature/army-97` through a pull request to
  `main`.
