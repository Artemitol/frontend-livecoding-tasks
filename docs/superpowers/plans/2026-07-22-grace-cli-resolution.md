# Grace CLI Resolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure future agents can run the installed Grace CLI from non-interactive shells where `$HOME/.bun/bin` is absent from `PATH`.

**Architecture:** Define one canonical resolution rule: prefer `command -v grace`, then fall back to `$HOME/.bun/bin/grace`, and only report the CLI unavailable after both checks fail. Publish that rule in repository governance and the project-local Grace CLI skill, register the tool in the GRACE technology contract, and enforce it through `V-M-GOVERNANCE`.

**Tech Stack:** Markdown governance, GRACE XML artifacts, Bun-installed Grace CLI 3.11.0, Beads, Git.

## Global Constraints

- Keep the fallback portable through `$HOME`; do not hard-code a username.
- Do not modify user shell startup files.
- Do not add repository runtime tooling or wrapper scripts.
- Keep all M-GOVERNANCE shared artifacts synchronized.
- Deliver through the existing `feature/git-workflow-rules` branch and PR #1.

---

### Task 1: Publish and verify non-interactive Grace resolution

**Files:**
- Modify: `AGENTS.md`
- Modify: `.agents/skills/grace-cli/SKILL.md`
- Modify: `docs/requirements.xml`
- Modify: `docs/technology.xml`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/verification-plan.xml`

**Interfaces:**
- Consumes: the installed CLI at `$HOME/.bun/bin/grace` and the M-GOVERNANCE contract.
- Produces: one grep-stable fallback rule and an executable governance check.

- [ ] **Step 1: Add the agent-facing resolution contract**

Document this exact resolution order in `AGENTS.md` and `.agents/skills/grace-cli/SKILL.md`:

```bash
GRACE_BIN="$(command -v grace || printf '%s' "$HOME/.bun/bin/grace")"
test -x "$GRACE_BIN"
"$GRACE_BIN" --version
```

Agents must use `$GRACE_BIN` for subsequent Grace commands and must not report Grace missing until both sources fail.

- [ ] **Step 2: Synchronize the GRACE shared contract**

Add the resolution invariant to `docs/requirements.xml`, register Grace in `docs/technology.xml`, add tool resolution to the M-GOVERNANCE public interface in `docs/development-plan.xml` and `docs/knowledge-graph.xml`, and add the executable check to `docs/verification-plan.xml`.

- [ ] **Step 3: Verify both shell modes and GRACE integrity**

Run the canonical resolution command in a non-interactive shell and verify version `3.11.0`.

Run `/bin/zsh -ic 'grace --version'` and verify version `3.11.0`.

Run the resolved binary with `lint --fail-on errors --path "$PWD"` and expect zero errors.

Run `xmllint --noout docs/*.xml`, `git diff --check`, and direct exact-text checks for every synchronized contract entry.

- [ ] **Step 4: Deliver the follow-up**

Commit the documentation and shared contract update, push `feature/git-workflow-rules`, confirm PR #1 contains the new commit, close Beads issue `frontend-livecoding-tasks-4bv`, then commit and push the Beads completion record if it changes tracked state.
