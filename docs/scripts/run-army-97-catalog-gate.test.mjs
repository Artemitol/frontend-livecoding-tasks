// FILE: docs/scripts/run-army-97-catalog-gate.test.mjs
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Prove FullCatalogGateEvidence can only follow a successful exact-commit catalog gate.
//   SCOPE: Real temporary Git repositories, passing and failing catalog gates, receipt emission, and transition validation.
//   DEPENDS: node:test, Git, Bash, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, Army97PublicationDecisionTransition
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createGitFixture - Create a real isolated Git history with a tracked catalog gate.
//   createRegistryFixture - Build one needs-rewrite candidate and synchronized card.
//   applyTransition - Add supplied full-catalog evidence to both publication records.
//   createExecutedRegistry - Build a transition whose gate was emitted and is re-verifiable.
//   fabricateAncestorEvidence - Build a correctly digested receipt without executing its gate.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v1.0.0 - Add causal exact-commit catalog-gate evidence probes.
// END_CHANGE_SUMMARY

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  createImmutableManifest,
  validatePublicationRegistry,
} from './validate-army-97-beads.mjs';

const runnerUrl = new URL('./run-army-97-catalog-gate.mjs', import.meta.url);
const runnerExists = existsSync(runnerUrl);
const runner = runnerExists ? await import(runnerUrl) : {};
const catalogGatePath = 'docs/scripts/validate-army-97-catalog.sh';
const policyPath = 'docs/task-validation-policy.md';
const evidenceReference = 'Beads:frontend-livecoding-tasks-army-97-task-0001#cardMigrationEvidence+fullCatalogGateEvidence';
const temporaryRoots = [];

const cardMigrationEvidence = {
  slug: 'task-0001',
  mode: 'focused',
  editorProfile: 'Programiz',
  sourceLearningGoal: 'Repair one deterministic branch.',
  sourcePrerequisite: 'Basic JavaScript functions.',
  sourceRuntimeAssumption: 'Console JavaScript without browser APIs.',
  destinationLocations: 'tasks/task-0001/README.md; collections/javascript/interview-practice/README.md; GRACE; Beads',
  targetEditorExpectedResult: 'NOT_RUN: Markdown-only delivery',
  targetEditorActualResult: 'NOT_RUN: Markdown-only delivery',
  verdict: 'PASS',
};

function git(repositoryRoot, args) {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
  }).trim();
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }

  return value;
}

// START_CONTRACT: createGitFixture
//   PURPOSE: Create a real Git repository whose tracked catalog gate deterministically passes or fails.
//   INPUTS: { gatePasses: boolean }
//   OUTPUTS: { repositoryRoot, gateCommit, headCommit }
//   SIDE_EFFECTS: Creates a temporary Git repository and commits fixture files.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: createGitFixture
function createGitFixture(gatePasses) {
  const repositoryRoot = mkdtempSync(join(tmpdir(), 'army97-catalog-runner-test-'));
  const scriptsDirectory = join(repositoryRoot, 'docs', 'scripts');

  temporaryRoots.push(repositoryRoot);
  mkdirSync(scriptsDirectory, { recursive: true });
  writeFileSync(
    join(repositoryRoot, policyPath),
    '# Test catalog policy\n',
  );
  writeFileSync(
    join(repositoryRoot, catalogGatePath),
    [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      gatePasses ? 'test -f catalog-pass-marker' : 'test -f catalog-missing-marker',
      "printf '%s\\n' 'catalog-pass'",
      '',
    ].join('\n'),
  );

  if (gatePasses) {
    writeFileSync(join(repositoryRoot, 'catalog-pass-marker'), 'present\n');
  }

  git(repositoryRoot, ['init', '-q']);
  git(repositoryRoot, ['config', 'user.name', 'ARMY-97 Test']);
  git(repositoryRoot, ['config', 'user.email', 'army97-test@example.invalid']);
  git(repositoryRoot, ['add', '.']);
  git(repositoryRoot, ['commit', '-q', '-m', 'catalog gate fixture']);

  const gateCommit = git(repositoryRoot, ['rev-parse', 'HEAD']);

  writeFileSync(join(repositoryRoot, 'later.txt'), 'later commit\n');
  git(repositoryRoot, ['add', 'later.txt']);
  git(repositoryRoot, ['commit', '-q', '-m', 'later fixture commit']);

  return {
    repositoryRoot,
    gateCommit,
    headCommit: git(repositoryRoot, ['rev-parse', 'HEAD']),
  };
}

// START_CONTRACT: createRegistryFixture
//   PURPOSE: Build a one-record needs-rewrite registry before publication.
//   INPUTS: { none }
//   OUTPUTS: { candidates, cards, manifest }
//   SIDE_EFFECTS: none
//   LINKS: Army97CandidateRecord, Army97CardWorkItem
// END_CONTRACT: createRegistryFixture
function createRegistryFixture() {
  const candidate = {
    id: 'frontend-livecoding-tasks-army-97-candidate-001',
    metadata: {
      recordType: 'Army97CandidateRecord',
      candidateId: 'frontend-livecoding-tasks-army-97-candidate-001',
      inputOrder: 1,
      centralAction: 'Repair one branch.',
      starterBehavior: 'The starter omits the required branch.',
      expectedResult: 'Both branches return the declared result.',
      sourceAuditRevision: 'round-1',
      sourceAuditDecision: 'needs-rewrite',
      decisionEvidence: 'The source fixture cannot exercise the missing branch.',
      duplicateTarget: 'none',
      correctionPath: 'Add the missing fixture and its exact result.',
      publicationDecision: 'needs-rewrite',
      publicationTransitionEvidence: 'none: source-audit freeze',
      targetTaskId: 'task-0001',
      targetCollection: 'collections/javascript/interview-practice/README.md',
    },
  };
  const card = {
    id: 'frontend-livecoding-tasks-army-97-task-0001',
    metadata: {
      recordType: 'Army97CardWorkItem',
      candidateId: candidate.id,
      targetTaskId: 'task-0001',
      editorProfile: 'Programiz',
      format: 'Исправить код',
      targetCollection: 'collections/javascript/interview-practice/README.md',
      expectedLocalMarkdownEvidence: 'Complete exact-commit catalog gate PASS.',
      prerequisitePublicationDecision: 'accepted',
      sourceAuditDecision: 'needs-rewrite',
      publicationDecision: 'needs-rewrite',
      publicationTransitionEvidence: 'none: source-audit freeze',
    },
  };
  const candidates = [candidate];

  return {
    candidates,
    cards: [card],
    manifest: createImmutableManifest(candidates),
  };
}

// START_CONTRACT: applyTransition
//   PURPOSE: Synchronize candidate/card publication state with supplied evidence.
//   INPUTS: { fixture: object, fullCatalogGateEvidence: object }
//   OUTPUTS: { object - Mutated validation fixture }
//   SIDE_EFFECTS: Mutates fixture candidate and card metadata.
//   LINKS: Army97PublicationDecisionTransition
// END_CONTRACT: applyTransition
function applyTransition(fixture, fullCatalogGateEvidence) {
  const candidate = fixture.candidates[0];
  const card = fixture.cards[0];

  candidate.metadata.publicationDecision = 'accepted';
  candidate.metadata.publicationTransitionEvidence = evidenceReference;
  card.metadata.publicationDecision = 'accepted';
  card.metadata.publicationTransitionEvidence = evidenceReference;
  card.metadata.cardMigrationEvidence = structuredClone(cardMigrationEvidence);
  card.metadata.fullCatalogGateEvidence = fullCatalogGateEvidence;

  return fixture;
}

// START_CONTRACT: createExecutedRegistry
//   PURPOSE: Build a synchronized transition from a real successful exact-commit gate.
//   INPUTS: { none }
//   OUTPUTS: { registry: object, repository: object }
//   SIDE_EFFECTS: Creates a temporary Git repository and executes its catalog gate.
//   LINKS: Army97PublicationDecisionTransition, V-M-TASK-VALIDATION
// END_CONTRACT: createExecutedRegistry
function createExecutedRegistry() {
  assert.equal(typeof runner.emitFullCatalogGateEvidence, 'function');
  assert.equal(typeof runner.verifyFullCatalogGateEvidence, 'function');
  const repository = createGitFixture(true);
  const evidence = runner.emitFullCatalogGateEvidence({
    repositoryRoot: repository.repositoryRoot,
    catalogCommit: repository.headCommit,
    cardMigrationEvidence,
  });
  const registry = applyTransition(createRegistryFixture(), evidence);

  registry.verifyCatalogGateExecution = ({
    cardMigrationEvidence: candidateEvidence,
    fullCatalogGateEvidence,
  }) => runner.verifyFullCatalogGateEvidence({
    repositoryRoot: repository.repositoryRoot,
    cardMigrationEvidence: candidateEvidence,
    fullCatalogGateEvidence,
  });

  return { registry, repository };
}

// START_CONTRACT: fabricateAncestorEvidence
//   PURPOSE: Build a structurally correct ancestor receipt without running the catalog gate.
//   INPUTS: { repositoryRoot: string, catalogCommit: string }
//   OUTPUTS: { FullCatalogGateEvidence }
//   SIDE_EFFECTS: Reads Git object IDs but does not execute the catalog gate.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: fabricateAncestorEvidence
function fabricateAncestorEvidence(repositoryRoot, catalogCommit) {
  const evidence = {
    policyPath,
    catalogGatePath,
    catalogCommit,
    catalogTree: git(repositoryRoot, ['rev-parse', `${catalogCommit}^{tree}`]),
    catalogGateBlob: git(
      repositoryRoot,
      ['rev-parse', `${catalogCommit}:${catalogGatePath}`],
    ),
    gateOutputSha256: sha256('catalog-pass\n'),
    verdict: 'PASS',
  };

  return {
    ...evidence,
    evidenceSha256: sha256(JSON.stringify(canonicalize({
      ...evidence,
      cardMigrationEvidence,
    }))),
  };
}

test.after(() => {
  for (const repositoryRoot of temporaryRoots) {
    rmSync(repositoryRoot, { recursive: true, force: true });
  }
});

// START_BLOCK_CAUSAL_CATALOG_GATE_PROBES
test('the tracked exact-commit catalog runner exists', () => {
  assert.equal(runnerExists, true);
});

test('emits FullCatalogGateEvidence only after the exact commit gate passes', () => {
  assert.equal(typeof runner.emitFullCatalogGateEvidence, 'function');
  const fixture = createGitFixture(true);
  const evidence = runner.emitFullCatalogGateEvidence({
    repositoryRoot: fixture.repositoryRoot,
    catalogCommit: fixture.headCommit,
    cardMigrationEvidence,
  });

  assert.equal(evidence.catalogCommit, fixture.headCommit);
  assert.equal(evidence.verdict, 'PASS');
  assert.match(evidence.gateOutputSha256, /^[0-9a-f]{64}$/);
});

test('does not emit FullCatalogGateEvidence when the exact commit gate fails', () => {
  assert.equal(typeof runner.emitFullCatalogGateEvidence, 'function');
  const fixture = createGitFixture(false);

  assert.throws(
    () => runner.emitFullCatalogGateEvidence({
      repositoryRoot: fixture.repositoryRoot,
      catalogCommit: fixture.headCommit,
      cardMigrationEvidence,
    }),
    /catalog gate failed/,
  );
});

test('rejects a correctly digested ancestor receipt when no catalog gate execution is verified', () => {
  const repository = createGitFixture(true);
  const registry = applyTransition(
    createRegistryFixture(),
    fabricateAncestorEvidence(repository.repositoryRoot, repository.gateCommit),
  );

  assert.throws(
    () => validatePublicationRegistry(registry),
    /actual exact-commit catalog gate execution is required/,
  );
});

test('rejects executed evidence from an ancestor instead of current HEAD', () => {
  assert.equal(typeof runner.verifyFullCatalogGateEvidence, 'function');
  const repository = createGitFixture(true);
  const evidence = fabricateAncestorEvidence(
    repository.repositoryRoot,
    repository.gateCommit,
  );
  const registry = applyTransition(createRegistryFixture(), evidence);

  registry.verifyCatalogGateExecution = ({
    cardMigrationEvidence: candidateEvidence,
    fullCatalogGateEvidence,
  }) => runner.verifyFullCatalogGateEvidence({
    repositoryRoot: repository.repositoryRoot,
    cardMigrationEvidence: candidateEvidence,
    fullCatalogGateEvidence,
  });

  assert.throws(
    () => validatePublicationRegistry(registry),
    /current HEAD/,
  );
});

test('accepts a synchronized transition only after runner emission and verification', () => {
  const { registry } = createExecutedRegistry();

  const result = validatePublicationRegistry(registry);

  assert.equal(result.transitionCount, 1);
});

test('rejects an incomplete CardMigrationEvidence after a real gate execution', () => {
  const { registry } = createExecutedRegistry();

  delete registry.cards[0].metadata.cardMigrationEvidence.sourcePrerequisite;

  assert.throws(
    () => validatePublicationRegistry(registry),
    /CardMigrationEvidence keys/,
  );
});

test('rejects a non-PASS CardMigrationEvidence after a real gate execution', () => {
  const { registry } = createExecutedRegistry();

  registry.cards[0].metadata.cardMigrationEvidence.verdict = 'FAIL';

  assert.throws(
    () => validatePublicationRegistry(registry),
    /CardMigrationEvidence verdict/,
  );
});

test('rejects missing FullCatalogGateEvidence after a real gate execution', () => {
  const { registry } = createExecutedRegistry();

  delete registry.cards[0].metadata.fullCatalogGateEvidence;

  assert.throws(
    () => validatePublicationRegistry(registry),
    /FullCatalogGateEvidence record/,
  );
});

test('rejects a forged digest after re-executing the exact catalog gate', () => {
  const { registry } = createExecutedRegistry();

  registry.cards[0].metadata.fullCatalogGateEvidence.evidenceSha256 = '0'.repeat(64);

  assert.throws(
    () => validatePublicationRegistry(registry),
    /evidenceSha256/,
  );
});

test('rejects candidate and card drift before accepting executed evidence', () => {
  const { registry } = createExecutedRegistry();

  registry.cards[0].metadata.publicationDecision = 'needs-rewrite';

  assert.throws(
    () => validatePublicationRegistry(registry),
    /candidate-card synchronization/,
  );
});
// END_BLOCK_CAUSAL_CATALOG_GATE_PROBES
