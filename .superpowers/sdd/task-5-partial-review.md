# Task 5 partial review

## Spec compliance

**Verdict: issues found.** The 20-row register is frozen exactly, all 20 candidate records are parented to `frontend-livecoding-tasks-kln-audit`, B5 remains `in_progress`, Phase 4 remains pending, no wave exists, and no task card has been published. The twelve browser candidates correctly retain `decision=pending` with Verification `BLOCKED`; no rejection, duplicate, or browser PASS was invented. The eight `accepted` decisions and three browser scenarios still need fixes below.

## Strengths

- `/tmp/frontend-livecoding-tasks-kln-candidate-inventory.tsv` has exactly 20 data rows, seven columns, contiguous IDs `candidate-001..candidate-020`, and SHA-256 `96d74bd6e289d67894acb40bf4ce4c00b70c32e6ea835788ad36e04c77917f7b`, matching B5's frozen register and `candidateRegisterSize=20`.
- Every candidate has the correct B5 parent, approved identity/topic metadata, `candidateRegisterSize=20`, decision reason, duplicate target, evidence type, observed result, remaining risk, and wave-publication status. All remain open/in progress, which preserves resumability.
- `.superpowers/sdd/task-5-report.md:17-29` accurately reports partial accounting: 8 accepted, 12 pending, 0 rejected/duplicate/needs-rewrite, 0 waves, 0 task cards. `docs/development-plan.xml:263-266` correctly leaves Phase 4 pending.
- Browser harnesses are local and bounded. They use no production endpoint, uncontrolled network input, random data, or repository runtime tooling. The CSS candidates retain manual visual checks rather than substituting unit assertions.

## Issues

### Critical

None.

### Important

1. **The eight completed decisions do not preserve inspectable material for four claimed gates.** Candidate records `candidate-001..004` and `candidate-007..010` contain compact contracts and observed outputs, but not the complete condition, fixtures, starter code, solution, or Russian editorial content required by `docs/task-validation-policy.md:27-32`. `/tmp/frontend-livecoding-tasks-kln-evidence-ts-007-010/validation-report.md:1-39` likewise records contracts/commands/results but not the harness or candidate source; its final paragraph only claims that the prompt/starter/solution exist. This is insufficient to independently sustain Local completeness, Examples, Solution, and Editorial PASS, and leaves Task 6 without the exact accepted payload to publish. **Fix without browser evidence:** for Beads records `frontend-livecoding-tasks-kln-candidate-001`, `-002`, `-003`, `-004`, `-007`, `-008`, `-009`, and `-010`, preserve the exact complete candidate payload (prompt, fixtures, starter, solution, examples, Russian details) in a durable record field or checksum-linked review artifact, then re-review those four gates against that payload. Do not publish cards while doing so.

2. **Every candidate record is missing the required `waveId` key.** The live metadata for all 20 records omits `waveId`, although `docs/task-validation-policy.md:51-55` says every record contains it. The eight accepted records already use `waveAcceptanceStatus=pending` even though `.superpowers/sdd/task-5-report.md:28-29` confirms no wave exists; policy defines `pending` for an accepted candidate after wave assignment. **Fix without browser evidence:** add an explicit unassigned sentinel such as `waveId=none` to all 20 records now; do not create a wave. At Step 7, atomically replace it with the real wave ID and set `waveAcceptanceStatus=pending` only on accepted candidates. Align the eight current pre-assignment statuses with that sequencing.

3. **Resume accounting skips the final ordered Editorial gate.** The blocked records correctly say `Editorial PASS precheck`, not final PASS, but `.superpowers/sdd/task-5-report.md:144-146` says to provide Chrome observations and then update the candidates directly from pending to terminal. Strict gate order requires Verification PASS followed by a final Editorial PASS. **Fix without browser evidence:** change the resume condition in `.superpowers/sdd/task-5-report.md` and the B5/candidate notes to say `Verification -> Editorial` must be completed and recorded before any terminal decision, accounting, or wave partition.

4. **candidate-015 does not exercise the accepted learning contract.** `/tmp/frontend-livecoding-tasks-kln-evidence-browser-015-020/candidate-contracts.md:7-12` defines `items` as an input and requires `useMemo` over `items`, `query`, and `category`, but `/tmp/frontend-livecoding-tasks-kln-evidence-browser-015-020/src/main.tsx:8-22` uses a module constant and omits `items` from the dependency list. The browser scenario can therefore pass without proving derivation from props or behavior after a prop change. **Fix without browser evidence:** make `DerivedList` receive `items` as a prop, include `items` in the memo dependencies, add a local prop-change control/fixture, and extend README/report/Beads scenario 015 to verify the projection updates after both state and prop input changes.

5. **candidate-018's StrictMode placement does not reliably trigger the required initial Effect replay in React 19.** `/tmp/frontend-livecoding-tasks-kln-evidence-browser-015-020/src/main.tsx:80-84` places `<StrictMode>` below the root, around only `StrictModeProbe`; the scenario at `README.md:20` requires the initial `setup -> cleanup -> setup` sequence. React's root-sensitive StrictMode behavior makes that expectation unsupported in this layout. In addition, the scenario never invokes the same cleanup twice, so it cannot observe the idempotency requirement stated at `candidate-contracts.md:34-39`. **Fix without browser evidence:** enable StrictMode at the React root (or mount this probe in its own StrictMode root) and add a controlled release probe that attempts a second cleanup/release and exposes a stable count/trace. Update scenario 018 to assert both initial replay and one release per acquired resource.

6. **candidate-020 can silently test the wrong container width after candidate-019.** Scenario 019 sets the viewport to 640 CSS px (`README.md:21`); scenario 020 then selects 768, while `.grid-container` has `max-width: 100%` (`src/styles.css:9`). If run in the listed order without resetting the viewport, the nominal 768 container is clamped below 768 and the result cannot prove the 768 contract. **Fix without browser evidence:** update README, `.superpowers/sdd/task-5-report.md`, and Beads record `frontend-livecoding-tasks-kln-candidate-020` to require a sufficiently wide viewport (for example at least 1024 CSS px) and confirm the container's measured width before judging its columns.

### Minor

1. **candidate-006 is not retry-stable.** `/tmp/frontend-livecoding-tasks-kln-evidence-browser-005-014/candidate-006.html:21,48-56` clears the trace but not `latestRequestId`, while the pass condition hard-codes `ignore stale #1`. A second scenario run on the same page reports FAIL despite correct race handling. Reset safely when no request is active, derive the expected request ID from a captured start value, or explicitly require a page reload before retry.

2. **candidate-006's blank-input instruction is imprecise.** `.superpowers/sdd/task-5-report.md:78` says “Submit a blank query,” but the fixture has no form (`candidate-006.html:11-14`). Say “clear `#query` and click `Искать`” so the evidence action is reproducible.

## Explicit verdicts

### (a) Completed eight decisions

**Needs fixes; not approved as completed decisions yet.** Their Identity/Learning-value separation and recorded runtime/type outcomes are plausible, and there is no unsupported rejection or duplicate. However, the accepted payload needed to verify Local completeness, Examples, Solution, and Editorial is not preserved, and every record lacks `waveId`. Reconstruct/preserve the exact payload and re-review the affected non-browser gates before treating these eight as review-clean.

### (b) Readiness of twelve manual scenarios

**Nine are ready; three need harness/checklist fixes before browser execution.** Candidates `005`, `006`, `011`, `012`, `013`, `014`, `016`, `017`, and `019` have sufficient bounded scenarios; reload before retrying `006`. Candidates `015`, `018`, and `020` are not ready for trustworthy acceptance for the reasons above. All twelve must remain non-terminal until their corrected current-Chrome Verification evidence is recorded and then final Editorial runs in order.

## Assessment

**Task quality: Needs fixes.** The partial stop and nonpublication behavior are correct, but the accepted evidence package, record schema, resume sequence, and three browser harnesses need correction before Task 5 can safely resume.
