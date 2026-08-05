# Student Experience Spec and Plan Review

Дата: 2026-07-23

Артефакты:

- `docs/superpowers/specs/2026-07-23-task-library-student-experience-design.md`
- `docs/superpowers/plans/2026-07-23-task-library-student-experience.md`

Метод: полный локальный проход `spec-reviewer`, targeted edits через
`spec-review-fixer`, затем новый полный локальный `spec-reviewer` pass. Fresh
subagent не запускался: пользователь запросил skills, но не авторизовал
subagent delegation для этого review.

## Initial Findings

- `[P1][F1] Final uniqueness and link resolution were not proven` — Plan R7
  cutover gate counted interview entries with filename-prefixed `rg` output and
  did not prove exactly-one thematic membership or resolve every relative link.
- `[P1][F2] Rendered evidence could become stale after the final GRACE commit` —
  Plan R8 marked `Phase-15` complete after the rendered audit but did not repeat
  the audit on the resulting final SHA.
- `[P2][F3] Beads setup was not resume-safe` — Plan R1 unconditionally created
  fixed issue IDs and dependency edges, so a resumed execution could fail or
  overwrite intent.
- `[P2][F4] Thematic headings were implicit` — Plan R2 fixed paths,
  introductions and entries but did not name each page title in the matrix.
- `[P2][F5] R5 and R6 claim actions lacked commands` — The checklist named a
  claim step but omitted the exact `bd update <id> --claim` action.

## Applied Fixes

- `F1` — added total-and-unique assertions for 20 thematic and 15 interview
  links, filesystem resolution for all collection/root links, and exact
  five-field metadata-block checks.
- `F2` — required a second full URL/deep-flow/deterministic audit on the exact
  SHA created by the `Phase-15` evidence commit.
- `F3` — made issue and dependency creation conditional on existing exact IDs,
  added record inspection, and required a stop on conflicting durable state.
- `F4` — added exact titles for all ten thematic collection paths.
- `F5` — added explicit R5 and R6 `bd update --claim` commands.

## Post-Edit Findings

No blocking findings. No unresolved P0–P3 finding remains.

## Coverage Matrix

| ID | Point | Status | Notes |
| --- | --- | --- | --- |
| S1 | Purpose and student problem | OK | Root overload, discovery, copy, hints and editor needs map to R1–R8. |
| S2 | Precedence over the original design | OK | Changed and preserved contracts are explicit; no unrelated scope enters the plan. |
| S3 | In-scope migration | OK | All 20 cards, 13 collections, two modes, assets, editors, GRACE and rendered review are covered. |
| S3-N | Non-goals | OK | Runtime tooling, deployment, new tasks, learning-goal changes and slug renames remain excluded. |
| S3.1 | Local execution context | OK | Exact root, branch, handoff, non-worktree proof and safe stop conditions are executable. |
| S4 | Content architecture | OK | Exact 13 paths and one-card source rule are reflected by R2 and R7. |
| S5 | Student navigation | OK | Root, collection, card, browser Back and fallback paths are implemented and rendered-tested. |
| S6 | Four-block root README | OK | R7 supplies exact content and negative assertions. |
| S7 | Thematic page contract | OK | R2 fixes title, introduction, reminder, order, link, description and time. |
| S8 | Thematic distribution | OK | All 20 slugs appear in exact approved collection order and R7 proves uniqueness. |
| S9 | Interview composition | OK | Three exact five-card lists, unique membership and exact times are explicit. |
| S10 | Editor map | OK | Four URLs, six execution modes, per-slug mapping and `this` equivalence stop are covered. |
| S11 | Two card modes | OK | R1 defines both structures; R3–R6 assign each card deterministically. |
| S12 | Copy-ready code | OK | Complete blocks, multi-file `FILE:` rules and editor-specific instructions are gated. |
| S13 | Text assets | OK | Three fixtures are inlined and deleted only after target-editor PASS. |
| S14 | Progressive disclosure | OK | Exactly three distinct hints, closed solution and closed self-check are verified per card. |
| S15 | Compact metadata | OK | Exact fields, values, deterministic mappings and preservation ledger are covered. |
| S16 | Student vocabulary | OK | R1 policy and per-wave negative heading checks enforce the approved labels. |
| S17 | Sources and synchronization | OK | Card, thematic, interview, root, graph, verification and Beads ownership are explicit. |
| S17.4 | GRACE delta | OK | Existing modules remain; new Phase-8–15 facts are introduced only with their implementation wave. |
| S18 | Migration sequencing | OK | R1–R8 preserve the old root until atomic R7 cutover and serialize shared write surfaces. |
| S18.1 | Beads decomposition | OK | Eight deterministic child issues have scope, dependencies, evidence and independent close signals. |
| S19.1 | Structural verification | OK | Exact path, count, uniqueness, details, metadata, fence and forbidden-label coverage is planned. |
| S19.2 | Synchronization verification | OK | Title/time/editor/profile/mapping/preservation/graph agreement is covered. |
| S19.3 | Content verification | OK | Condition, code, observable readiness, hint progression, solution and self-check are reviewed per card. |
| S19.4 | Runtime and browser verification | OK | Target-editor rows are mandatory; temporary harnesses cannot replace final evidence. |
| S19.5 | Published GitHub flow | OK | R8 inventories 34 pages and deep-tests technologies, interviews, modes, editors and former assets. |
| S20 | Stop conditions | OK | Ambiguity, missing files, editor mismatch, rendering failure and unavailable evidence stop execution. |
| S21 | Risks and mitigations | OK | Each named risk has a corresponding contract or verification gate. |
| S22 | Completion criteria | OK | R7 proves repository completeness; R8 proves published experience and preserves human acceptance. |
| P-H | Required Superpowers header and global constraints | OK | Header is exact; constraints copy all project-wide decisions. |
| P-L | Mandatory local handoff | OK | Uses app handoff and read-only proof; forbids destructive recovery. |
| P-F | File responsibility map and interfaces | OK | Every changed artifact has one responsibility and neighboring tasks share exact interfaces. |
| P1 | R1 contract and Beads setup | OK | Resume-safe issue graph, exact contracts, GRACE planning, gates, commit and close are defined. |
| P2 | R2 collections | OK | Exact files, titles, copy, task order, interview shells, checks and intermediate-state rules are defined. |
| P3 | R3 JavaScript/DOM | OK | Eight cards, `this` equivalence, fixture deletion, structural checks and editor evidence are defined. |
| P4 | R4 TypeScript | OK | Four cards, invariants, Playground evidence and sequential closure are defined. |
| P5 | R5 HTML/CSS/accessibility | OK | Four cards, manual browser evidence, two safe asset removals and claim/close lifecycle are defined. |
| P6 | R6 React | OK | Four cards, React invariants, StackBlitz evidence and claim/close lifecycle are defined. |
| P7 | R7 cutover | OK | Interviews, exact root copy, uniqueness, link resolution, metadata and GRACE sync pass atomically. |
| P8 | R8 rendered audit | OK | Frozen SHA, 34-page inventory, deep matrix, repair loop, second final-SHA audit and handoff are defined. |
| P-S | Plan self-review | OK | Spec coverage, placeholder scan and interface consistency have explicit evidence. |

## Open Questions

None.

## Recommendation

Approve. The revised specification and implementation plan are Beads-ready:
R1–R8 are atomic, sequential, independently closable and traceable to concrete
spec sections and verification evidence.
