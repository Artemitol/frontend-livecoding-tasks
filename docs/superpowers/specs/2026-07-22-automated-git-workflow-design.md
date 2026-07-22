# Automated Git Workflow Design

## Goal

Allow project agents to create branches, commits, and pushes without asking for
permission after every completed change, while preserving Artemiy's authorship
and keeping branch history aligned with Beads stories.

## Beads Story Model

A story is a top-level Beads issue of type `feature` or `epic` that owns multiple
child issues through the Beads parent relationship. Starting work on a story
creates or reuses one branch named `feature/<story-id>`. All child issues of that
story are implemented, verified, committed, and pushed on the same branch.

Standalone Beads issues do not require a dedicated branch. They use the current
appropriate branch unless the user requests a separate branch.

## Commit Policy

After a coherent change passes its relevant verification gates, the agent
creates a focused commit automatically. Commit messages must be written in
English and follow Conventional Commits 1.0.0:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Use `feat` for new functionality and `fix` for bug fixes. Other meaningful
types such as `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `style`, and
`perf` are allowed. Use `!` after the type or scope, or a `BREAKING CHANGE:`
footer, when the commit introduces a breaking change.

Git author and committer identity must come from the user's existing Git
configuration. Commit messages must not contain `Co-authored-by`, `Signed-off-by`,
`Generated-by`, or any Codex/agent attribution trailer unless the user explicitly
requests one.

## Push and Safety Policy

After committing, the agent may push the active branch and configure its upstream
without asking again. This authorization does not include force-pushing,
automatically merging, deleting branches, or rewriting published history.

An explicit user instruction not to create a branch, commit, or push overrides
the automatic workflow for that task.

## Repository Bootstrap

Because the remote repository is empty, the current project scaffold is committed
and pushed to `main` once. Story-level branches are used after that bootstrap.

The Beads `no-git-ops` configuration must be disabled so injected Beads context
does not contradict this policy.

## Verification

- Confirm `AGENTS.md` states the complete workflow without contradicting Beads.
- Confirm `bd config get no-git-ops` returns `false`.
- Confirm commit author and committer match the user's Git configuration.
- Confirm commit messages are English Conventional Commits without agent trailers.
- Confirm `origin` points to `Artemitol/frontend-livecoding-tasks`.
- Confirm the bootstrap commit is present on remote `main`.
