# Concise Task Cards Implementation Plan Review

**Artifact:** `docs/superpowers/plans/2026-07-24-task-card-simplification.md`
**Source design:** `docs/superpowers/specs/2026-07-23-task-card-simplification-design.md`
**Method:** complete local `spec-reviewer` pass, targeted `spec-review-fixer` edits, then a second independent local `spec-reviewer` pass. A subagent was not used because the active collaboration policy forbids delegation unless explicitly requested.

## Initial Findings

- `[P1] A `BLOCKED` card could still satisfy the original wave acceptance` — Task 1, Wave hierarchy: the first draft allowed `PASS or BLOCKED evidence` while also requiring a pushed, rendered, technically closed wave. That could misrepresent unavailable mandatory evidence as a shippable wave.
- `[P2] Beads dependency commands used invented identifiers` — Task 1, dependency setup: placeholder wave IDs were not executable and violated the plan's no-placeholder requirement.
- `[P2] The plan assumed Beads changes belong in a Git commit` — Task 1 and wave commits: Beads uses Dolt as its durable store and `.beads/issues.jsonl` is a passive export, so blindly staging `.beads` can create an empty or unrelated Git change.
- `[P2] The real-work page and root hub would be out of sync for one commit` — first draft Tasks 5–6: `users-api-list` and `collections/real-work/README.md` were committed before the root linked that collection.
- `[P2] Phase 20 had no commit boundary after rendered evidence` — first draft Task 7: it required marking the audit implemented only after GitHub inspection but did not commit that factual status before publishing it.
- `[P3] The plan's placeholder scan matched its own command text` — self-review section: the literal red-flag pattern was searched inside the plan itself.
- `[P2] Final deterministic checks did not prove all root links, metadata rows, and thematic memberships` — Tasks 6–7: counts alone were insufficient to prove the final student projection.

## Applied Fixes

- `P1` — Wave acceptance now requires `PASS` for every mandatory card; any `BLOCKED` result keeps the wave open.
- `P2` — Task 1 captures issue IDs with `bd create --silent`, creates all 21 child issues through one complete command block, and wires the graph using those variables.
- `P2` — Beads persistence uses `bd graph check`, `bd dolt status`, and `bd dolt push`; Git stages `.beads` only if it is actually changed.
- `P2` — Wave C now creates the real-work page, its React thematic entry, and the root real-work link in one commit; Task 6 only revalidates that atomic catalog fact.
- `P2` — Task 7 now commits the Phase/Gate 20 factual result after rendered evidence and before pushing that audit commit.
- `P3` — The self-scan uses `[T]ODO` and `[T]BD`, which searches for the real words without matching its own regular expression.
- `P2` — The cutover and final-audit commands now assert four root headings, 14 root collection links, four editor links, 21 cards, 14 collections, five metadata rows per card, exactly one thematic membership, and the unique real-work entry.

## Post-Edit Review

**Findings**

No blocking findings.

**Coverage Matrix**

| ID | Point | Status | Notes |
| --- | --- | --- | --- |
| P1 | Goal, scope exclusions, final acceptance | OK | Global constraints retain the open human decision and exclude unsupported tooling, CSS assertions, history rewrite, and automatic acceptance. |
| P2 | Focused and real-work classes | OK | Duration, single-action rule, real-work exception, and cross-cutting membership are explicit. |
| P3 | Card structure and code boundaries | OK | Target order, three hints, solution limits, JavaScript/minimal-markup, TypeScript, HTML/CSS, and React rules have implementation and verification owners. |
| P4 | Metadata and catalog contract | OK | Five values, new format, 21-card / 14-collection inventory, root four-heading contract, and exact memberships are checked. |
| P5 | `users-api-list` product contract | OK | Slug, editor, page size, endpoints, submitted search, pagination bounds, all states, stale-response protection, duplicate stop, and browser evidence are explicit. |
| P6 | Twenty existing cards | OK | All 20 stable slugs are assigned once across serialized 8 + 8 + 5 waves, each with a preserved central action and Beads work unit. |
| P7 | Verification and stop conditions | OK | Structural, target-editor, browser/manual visual, DummyJSON, GitHub rendering, XML, branch divergence, and `BLOCKED` outcomes are concrete. |
| P8 | Sequencing and intermediate consistency | OK | Compatibility state is time-bounded; no wave closes with unavailable evidence; root/real-work cutover is atomic; phase status is updated only after evidence. |
| P9 | GRACE synchronization | OK | Requirements, technology, development, verification, graph, and operational packets have named pending phases/gates and module owners. |
| P10 | Beads readiness | OK | Parent, three waves, 21 card issues, dependencies, acceptance criteria, durable synchronization, and close conditions are executable. |
| P11 | Release and audit | OK | Focused commits, push, draft PR update, current rendered audit, audit commit, and final human handoff are ordered without inferring acceptance. |

**Open Questions**

None. The only intentionally deferred decision is the specification-defined product stop: a duplicate or ambiguous thematic placement for `users-api-list` must be brought to the user during execution.

**Recommendation**

Approve. The revised artifact is Beads-ready: individual card work is durable and reviewable, while the three serialized waves own the shared-file and publication gates.
