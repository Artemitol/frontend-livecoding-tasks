// FILE: docs/scripts/validate-army-97-beads.test.mjs
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Prove that the ARMY-97 Beads publication validator rejects invalid decision transitions.
//   SCOPE: Deterministic in-memory candidate, card, immutable-manifest, and structured-evidence probes.
//   DEPENDS: node:test, node:assert, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   makeFixture - Build a minimal synchronized candidate/card registry.
//   makeValidTransition - Add exact CardMigrationEvidence and full-catalog gate evidence.
//   assertInvalid - Require a focused validation failure.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v1.0.0 - Add focused negative probes for the tracked ARMY-97 publication gate.
// END_CHANGE_SUMMARY

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

const validatorUrl = new URL('./validate-army-97-beads.mjs', import.meta.url);
const validatorExists = existsSync(validatorUrl);
const validator = validatorExists ? await import(validatorUrl) : {};

const acceptedCandidate = {
  id: 'frontend-livecoding-tasks-army-97-candidate-001',
  metadata: {
    recordType: 'Army97CandidateRecord',
    candidateId: 'frontend-livecoding-tasks-army-97-candidate-001',
    inputOrder: 1,
    centralAction: 'Return one value.',
    starterBehavior: 'The starter returns the wrong value.',
    expectedResult: 'The corrected function returns one.',
    sourceAuditRevision: 'round-1',
    sourceAuditDecision: 'accepted',
    decisionEvidence: 'The source contract is complete.',
    duplicateTarget: 'none',
    correctionPath: 'none',
    publicationDecision: 'accepted',
    publicationTransitionEvidence: 'none: source-audit freeze',
    targetTaskId: 'task-0001',
    targetCollection: 'collections/javascript/interview-practice/README.md',
  },
};

const rewriteCandidate = {
  id: 'frontend-livecoding-tasks-army-97-candidate-002',
  metadata: {
    recordType: 'Army97CandidateRecord',
    candidateId: 'frontend-livecoding-tasks-army-97-candidate-002',
    inputOrder: 2,
    centralAction: 'Repair one branch.',
    starterBehavior: 'The starter omits a required branch.',
    expectedResult: 'Both branches return the declared result.',
    sourceAuditRevision: 'round-1',
    sourceAuditDecision: 'needs-rewrite',
    decisionEvidence: 'The supplied fixture cannot exercise the missing branch.',
    duplicateTarget: 'none',
    correctionPath: 'Add the missing fixture and state its expected result.',
    publicationDecision: 'needs-rewrite',
    publicationTransitionEvidence: 'none: source-audit freeze',
    targetTaskId: 'task-0002',
    targetCollection: 'collections/javascript/interview-practice/README.md',
  },
};

const acceptedCard = {
  id: 'frontend-livecoding-tasks-army-97-task-0001',
  metadata: {
    recordType: 'Army97CardWorkItem',
    candidateId: acceptedCandidate.id,
    targetTaskId: 'task-0001',
    editorProfile: 'Programiz',
    format: 'Исправить код',
    targetCollection: 'collections/javascript/interview-practice/README.md',
    expectedLocalMarkdownEvidence: 'Complete local gate PASS.',
    prerequisitePublicationDecision: 'accepted',
    sourceAuditDecision: 'accepted',
    publicationDecision: 'accepted',
    publicationTransitionEvidence: 'none: source-audit freeze',
  },
};

const rewriteCard = {
  id: 'frontend-livecoding-tasks-army-97-task-0002',
  metadata: {
    recordType: 'Army97CardWorkItem',
    candidateId: rewriteCandidate.id,
    targetTaskId: 'task-0002',
    editorProfile: 'Programiz',
    format: 'Исправить код',
    targetCollection: 'collections/javascript/interview-practice/README.md',
    expectedLocalMarkdownEvidence: 'Complete local gate PASS.',
    prerequisitePublicationDecision: 'accepted',
    sourceAuditDecision: 'needs-rewrite',
    publicationDecision: 'needs-rewrite',
    publicationTransitionEvidence: 'none: source-audit freeze',
  },
};

const clone = (value) => structuredClone(value);

// START_CONTRACT: makeFixture
//   PURPOSE: Build a minimal synchronized registry and its immutable source manifest.
//   INPUTS: { none }
//   OUTPUTS: { candidates, cards, manifest }
//   SIDE_EFFECTS: none
//   LINKS: M-TASK-VALIDATION
// END_CONTRACT: makeFixture
function makeFixture() {
  assert.equal(typeof validator.createImmutableManifest, 'function');
  const candidates = [clone(acceptedCandidate), clone(rewriteCandidate)];
  const cards = [clone(acceptedCard), clone(rewriteCard)];
  const manifest = validator.createImmutableManifest(candidates);

  return { candidates, cards, manifest };
}

// START_CONTRACT: makeValidTransition
//   PURPOSE: Convert the rewrite fixture into a fully evidenced publication transition.
//   INPUTS: { fixture: object - Mutable fixture returned by makeFixture }
//   OUTPUTS: { object - The same fixture with synchronized structured evidence }
//   SIDE_EFFECTS: Mutates fixture candidate and card metadata.
//   LINKS: Army97PublicationDecisionTransition, CardMigrationEvidence
// END_CONTRACT: makeValidTransition
function makeValidTransition(fixture) {
  assert.equal(typeof validator.createFullCatalogGateEvidence, 'function');
  const candidate = fixture.candidates[1];
  const card = fixture.cards[1];
  const evidenceRef = `Beads:${card.id}#cardMigrationEvidence+fullCatalogGateEvidence`;
  const cardMigrationEvidence = {
    slug: 'task-0002',
    mode: 'focused',
    editorProfile: 'Programiz',
    sourceLearningGoal: 'Repair one deterministic branch.',
    sourcePrerequisite: 'Basic JavaScript functions.',
    sourceRuntimeAssumption: 'Console JavaScript without browser APIs.',
    destinationLocations: 'tasks/task-0002/README.md; collections/javascript/interview-practice/README.md; GRACE; Beads',
    targetEditorExpectedResult: 'NOT_RUN: Markdown-only delivery',
    targetEditorActualResult: 'NOT_RUN: Markdown-only delivery',
    verdict: 'PASS',
  };

  candidate.metadata.publicationDecision = 'accepted';
  candidate.metadata.publicationTransitionEvidence = evidenceRef;
  card.metadata.publicationDecision = 'accepted';
  card.metadata.publicationTransitionEvidence = evidenceRef;
  card.metadata.cardMigrationEvidence = cardMigrationEvidence;
  card.metadata.fullCatalogGateEvidence = validator.createFullCatalogGateEvidence({
    cardMigrationEvidence,
    catalogCommit: '0123456789abcdef0123456789abcdef01234567',
  });

  return fixture;
}

// START_CONTRACT: assertInvalid
//   PURPOSE: Require a focused deterministic validation failure.
//   INPUTS: { fixture: object, expected: RegExp }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: none
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: assertInvalid
function assertInvalid(fixture, expected) {
  assert.equal(typeof validator.validatePublicationRegistry, 'function');
  assert.throws(
    () => validator.validatePublicationRegistry(fixture),
    expected,
  );
}

// START_BLOCK_TRACKED_VALIDATOR_PROBE
test('the tracked ARMY-97 validator exists', () => {
  assert.equal(validatorExists, true);
});

test('derives mutable publication counts from current candidate state', () => {
  const fixture = makeFixture();
  const held = validator.validatePublicationRegistry(fixture);
  const transitioned = validator.validatePublicationRegistry(
    makeValidTransition(fixture),
  );

  assert.deepEqual(held.publicationCounts, {
    accepted: 1,
    needsRewrite: 1,
  });
  assert.deepEqual(transitioned.publicationCounts, {
    accepted: 2,
    needsRewrite: 0,
  });
});

test('rejects a needs-rewrite to accepted transition backed only by free-form text', () => {
  const fixture = makeFixture();
  const candidate = fixture.candidates[1];
  const card = fixture.cards[1];

  candidate.metadata.publicationDecision = 'accepted';
  candidate.metadata.publicationTransitionEvidence = 'CardMigrationEvidence PASS and full gate PASS';
  card.metadata.publicationDecision = 'accepted';
  card.metadata.publicationTransitionEvidence = 'CardMigrationEvidence PASS and full gate PASS';

  assertInvalid(fixture, /structured evidence reference/);
});

test('rejects a transition with an incomplete CardMigrationEvidence record', () => {
  const fixture = makeValidTransition(makeFixture());

  delete fixture.cards[1].metadata.cardMigrationEvidence.sourcePrerequisite;

  assertInvalid(fixture, /CardMigrationEvidence keys/);
});

test('rejects a transition whose CardMigrationEvidence verdict is not PASS', () => {
  const fixture = makeValidTransition(makeFixture());

  fixture.cards[1].metadata.cardMigrationEvidence.verdict = 'FAIL';

  assertInvalid(fixture, /CardMigrationEvidence verdict/);
});

test('rejects a transition without durable full-catalog gate evidence', () => {
  const fixture = makeValidTransition(makeFixture());

  delete fixture.cards[1].metadata.fullCatalogGateEvidence;

  assertInvalid(fixture, /FullCatalogGateEvidence record/);
});

test('rejects a transition with a forged full-catalog evidence digest', () => {
  const fixture = makeValidTransition(makeFixture());

  fixture.cards[1].metadata.fullCatalogGateEvidence.evidenceSha256 = '0'.repeat(64);

  assertInvalid(fixture, /evidenceSha256/);
});

test('rejects candidate and card publication-state drift', () => {
  const fixture = makeValidTransition(makeFixture());

  fixture.cards[1].metadata.publicationDecision = 'needs-rewrite';

  assertInvalid(fixture, /candidate-card synchronization/);
});

test('rejects mutation of an immutable source-audit field', () => {
  const fixture = makeFixture();

  fixture.candidates[1].metadata.decisionEvidence = 'Changed after the source freeze.';

  assertInvalid(fixture, /immutable source snapshot/);
});

test('rejects reverting an accepted source candidate to needs-rewrite', () => {
  const fixture = makeFixture();

  fixture.candidates[0].metadata.publicationDecision = 'needs-rewrite';
  fixture.cards[0].metadata.publicationDecision = 'needs-rewrite';

  assertInvalid(fixture, /accepted source candidate/);
});

test('accepts a synchronized transition with exact structured evidence', () => {
  const summary = validator.validatePublicationRegistry(
    makeValidTransition(makeFixture()),
  );

  assert.equal(summary.transitionCount, 1);
});
// END_BLOCK_TRACKED_VALIDATOR_PROBE
