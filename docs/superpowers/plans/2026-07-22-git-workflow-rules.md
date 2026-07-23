# Git Workflow Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prevent direct pushes to `main`, require delivery through `feature/*` branches and pull requests, and keep Superpowers artifacts out of Git.

**Architecture:** Tighten the repository-level contributor contract in `AGENTS.md`, add a root ignore rule for the local-only `docs/superpowers/` workspace, and remove the already tracked Superpowers specification from the Git index without deleting its working-tree copy.

**Tech Stack:** Markdown governance, Git ignore rules, Git, Beads.

## Global Constraints

- Never push directly to `main`.
- Push project changes only from `feature/*` branches.
- Create a pull request after pushing a feature branch.
- Preserve local files under `docs/superpowers/` while excluding them from Git.

---

### Task 1: Tighten Git governance and ignore Superpowers artifacts

**Files:**
- Modify: `AGENTS.md`
- Create: `.gitignore`
- Modify: `docs/requirements.xml`
- Modify: `docs/development-plan.xml`
- Modify: `docs/knowledge-graph.xml`
- Modify: `docs/verification-plan.xml`
- Untrack while preserving locally: `docs/superpowers/`

**Interfaces:**
- Consumes: the existing repository Git authority and Beads branch conventions.
- Produces: an unambiguous Git workflow contract and a repository-local ignore rule.

- [ ] **Step 1: Update the Git workflow rules**

Replace the broad permission to push the active branch with explicit rules that prohibit direct pushes to `main`, require `feature/*` for pushed work, and require a pull request after the first push.

- [ ] **Step 2: Add the root ignore rule**

Create `.gitignore` containing `/docs/superpowers/`.

- [ ] **Step 3: Synchronize the GRACE governance contract**

Record the feature-branch and pull-request delivery constraint in `docs/requirements.xml`, add delivery and `.gitignore` to the `M-GOVERNANCE` contract in `docs/development-plan.xml` and `docs/knowledge-graph.xml`, and add an exact governance check in `docs/verification-plan.xml`.

- [ ] **Step 4: Remove existing Superpowers artifacts from the Git index**

Run: `git rm -r --cached docs/superpowers`

Expected: tracked Superpowers files are staged for deletion but remain present in the working tree and become ignored.

- [ ] **Step 5: Verify the contract and ignore behavior**

Run: `rg -n "main|feature/|pull request|push" AGENTS.md`

Expected: direct main pushes are forbidden and feature branch plus PR requirements are explicit.

Run: `git check-ignore -v docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md`

Expected: `.gitignore` matches `/docs/superpowers/`.

Run: `test -f docs/superpowers/specs/2026-07-22-frontend-task-knowledge-base-design.md`

Expected: exit status 0, proving the local specification was preserved.

Run: `xmllint --noout docs/*.xml`

Expected: exit status 0 for every GRACE XML artifact.

- [ ] **Step 6: Review and deliver**

Run: `git diff --check && git diff --cached --check && git status --short --branch`

Expected: no whitespace errors; only the intended governance, ignore, and untracking changes are present on `feature/git-workflow-rules`.

Commit: `docs: restrict pushes to feature branches`

Push the branch with upstream tracking and create a pull request targeting `main`.
