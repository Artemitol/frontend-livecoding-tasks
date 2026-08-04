// FILE: docs/scripts/validate-army-97-beads.test.mjs
// VERSION: 2.4.0
// START_MODULE_CONTRACT
//   PURPOSE: Prove that the ARMY-97 Beads publication validator rejects invalid decision transitions.
//   SCOPE: Deterministic in-memory candidate, card, published-wave, starter-classified pure/browser TypeScript editor, immutable-manifest, and structured-evidence probes.
//   DEPENDS: node:test, node:assert, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   makeFixture - Build a minimal synchronized candidate/card registry.
//   makePublishedWaveFixture - Build one complete published wave with exact card evidence.
//   assertInvalid - Require a focused validation failure.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v2.4.0 - Cover frozen topic paths and Markdown title and metadata collection synchronization.
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
    targetCollection: 'collections/javascript/event-loop/README.md',
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
    targetCollection: 'collections/javascript/event-loop/README.md',
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
    targetCollection: 'collections/javascript/event-loop/README.md',
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
    targetCollection: 'collections/javascript/event-loop/README.md',
    expectedLocalMarkdownEvidence: 'Complete local gate PASS.',
    prerequisitePublicationDecision: 'accepted',
    sourceAuditDecision: 'needs-rewrite',
    publicationDecision: 'needs-rewrite',
    publicationTransitionEvidence: 'none: source-audit freeze',
  },
};

const clone = (value) => structuredClone(value);
const cardMigrationEvidence = {
  slug: 'task-0001',
  mode: 'focused',
  editorProfile: 'Programiz',
  sourceLearningGoal: 'Return one deterministic value.',
  sourcePrerequisite: 'Basic JavaScript functions.',
  sourceRuntimeAssumption: 'Console JavaScript without browser APIs.',
  destinationLocations: 'tasks/task-0001/README.md; collections/javascript/event-loop/README.md; GRACE; Beads',
  targetEditorExpectedResult: 'NOT_RUN: Markdown-only delivery',
  targetEditorActualResult: 'NOT_RUN: Markdown-only delivery',
  verdict: 'PASS',
};
const fullCatalogGateEvidence = {
  policyPath: 'docs/task-validation-policy.md',
  catalogGatePath: 'docs/scripts/validate-army-97-catalog.sh',
  catalogCommit: '1'.repeat(40),
  catalogTree: '2'.repeat(40),
  catalogGateBlob: '3'.repeat(40),
  gateMode: 'wave',
  gateOutputSha256: '4'.repeat(64),
  verdict: 'PASS',
  evidenceSha256: '5'.repeat(64),
};

function publishedCatalog({
  publishedArmyTaskIds,
  thematicByTaskId,
  gateMode = 'wave',
  legacyTaskCount = 21,
  cardFactsByTaskId = Object.fromEntries(
    publishedArmyTaskIds.map((taskId) => [
      taskId,
      {
        technology: 'JavaScript',
        editorProfile: 'Programiz',
        starterCode: 'const value = 1;',
      },
    ]),
  ),
}) {
  return {
    gateMode,
    legacyTaskCount,
    totalTaskCount: legacyTaskCount + publishedArmyTaskIds.length,
    publishedArmyTaskIds,
    thematicByTaskId,
    cardFactsByTaskId,
  };
}

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

  return {
    candidates,
    cards,
    manifest,
    publishedCatalog: publishedCatalog({
      publishedArmyTaskIds: [],
      thematicByTaskId: {},
    }),
  };
}

// START_CONTRACT: makePublishedWaveFixture
//   PURPOSE: Build one complete ten-card publication wave with optional held rewrite candidates.
//   INPUTS: { rewriteTaskNumbers?: number[] }
//   OUTPUTS: { candidates, cards, manifest, publishedCatalog, verifyCatalogGateExecution }
//   SIDE_EFFECTS: none
//   LINKS: V-M-TASK-VALIDATION, Army97CardWorkItem
// END_CONTRACT: makePublishedWaveFixture
function makePublishedWaveFixture({ rewriteTaskNumbers = [] } = {}) {
  const rewriteSet = new Set(rewriteTaskNumbers);
  const candidates = [];
  const cards = [];
  const publishedArmyTaskIds = [];
  const thematicByTaskId = {};

  for (let number = 1; number <= 10; number += 1) {
    const paddedTaskNumber = String(number).padStart(4, '0');
    const paddedCandidateNumber = String(number).padStart(3, '0');
    const targetTaskId = `task-${paddedTaskNumber}`;
    const candidateId = `frontend-livecoding-tasks-army-97-candidate-${paddedCandidateNumber}`;
    const cardId = `frontend-livecoding-tasks-army-97-task-${paddedTaskNumber}`;
    const isRewrite = rewriteSet.has(number);
    const candidate = clone(acceptedCandidate);
    const card = clone(acceptedCard);

    candidate.id = candidateId;
    candidate.metadata.candidateId = candidateId;
    candidate.metadata.inputOrder = number;
    candidate.metadata.targetTaskId = targetTaskId;
    candidate.metadata.sourceAuditDecision = isRewrite
      ? 'needs-rewrite'
      : 'accepted';
    candidate.metadata.correctionPath = isRewrite
      ? 'Repair the deterministic source contradiction.'
      : 'none';
    candidate.metadata.publicationDecision = isRewrite
      ? 'needs-rewrite'
      : 'accepted';
    card.id = cardId;
    card.metadata.candidateId = candidateId;
    card.metadata.targetTaskId = targetTaskId;
    card.metadata.sourceAuditDecision = candidate.metadata.sourceAuditDecision;
    card.metadata.publicationDecision = candidate.metadata.publicationDecision;
    card.metadata.cardMigrationEvidence = {
      ...clone(cardMigrationEvidence),
      slug: targetTaskId,
      destinationLocations: `tasks/${targetTaskId}/README.md; collections/javascript/event-loop/README.md; GRACE; Beads`,
    };
    card.metadata.fullCatalogGateEvidence = clone(fullCatalogGateEvidence);
    candidates.push(candidate);
    cards.push(card);
    publishedArmyTaskIds.push(targetTaskId);
    thematicByTaskId[targetTaskId] =
      'collections/javascript/event-loop/README.md';
  }

  return {
    candidates,
    cards,
    manifest: validator.createImmutableManifest(candidates),
    publishedCatalog: publishedCatalog({
      publishedArmyTaskIds,
      thematicByTaskId,
    }),
    verifyCatalogGateExecution: () => true,
  };
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

  assert.deepEqual(held.publicationCounts, {
    accepted: 1,
    needsRewrite: 1,
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

test('rejects a published ARMY-97 card whose publication decision is still needs-rewrite', () => {
  const fixture = makePublishedWaveFixture({
    rewriteTaskNumbers: [2],
  });

  assertInvalid(fixture, /published ARMY-97 card requires publicationDecision accepted/);
});

test('rejects a published accepted-source card without current catalog evidence', () => {
  const fixture = makePublishedWaveFixture();

  delete fixture.cards[0].metadata.cardMigrationEvidence;

  assertInvalid(fixture, /CardMigrationEvidence keys/);
});

test('accepts a published accepted-source card only with synchronized current-wave evidence', () => {
  const fixture = makePublishedWaveFixture();

  const result = validator.validatePublicationRegistry(fixture);

  assert.equal(result.catalogMode, 'wave');
  assert.equal(result.legacyTaskCount, 21);
  assert.equal(result.publishedArmyTaskCount, 10);
});

test('rejects published thematic membership that drifts from the frozen card mapping', () => {
  const fixture = makePublishedWaveFixture();

  fixture.publishedCatalog.thematicByTaskId['task-0001'] =
    'collections/react/effects-timers-and-cleanup/README.md';

  assertInvalid(fixture, /published thematic collection does not match/);
});

test('rejects a published Markdown title without its immutable task ID', () => {
  const fixture = makePublishedWaveFixture();

  fixture.publishedCatalog.cardFactsByTaskId['task-0001'] = {
    technology: 'JavaScript',
    editorProfile: 'Programiz',
    starterCode: 'const value = 1;',
    title: 'Task 0001',
  };

  assertInvalid(fixture, /Markdown task title does not use its immutable ID/);
});

test('rejects a published Markdown metadata collection outside its frozen topic', () => {
  const fixture = makePublishedWaveFixture();

  fixture.publishedCatalog.cardFactsByTaskId['task-0001'] = {
    technology: 'JavaScript',
    editorProfile: 'Programiz',
    starterCode: 'const value = 1;',
    metadataCollection: 'JavaScript → Promise и async/await',
  };

  assertInvalid(fixture, /Markdown metadata collection does not match its frozen topic/);
});

test('rejects a published card whose Markdown editor differs from the frozen Beads profile', () => {
  const fixture = makePublishedWaveFixture();

  fixture.publishedCatalog.cardFactsByTaskId['task-0001'] = {
    technology: 'JavaScript',
    editorProfile: 'CodePen',
    starterCode: 'const value = 1;',
  };

  assertInvalid(fixture, /Markdown editor profile does not match/);
});

test('accepts a published browser TypeScript card with synchronized CodePen metadata', () => {
  const fixture = makePublishedWaveFixture();
  const candidate = fixture.candidates[0];
  const card = fixture.cards[0];
  const targetTaskId = card.metadata.targetTaskId;
  const targetCollection =
    'collections/typescript/generics-and-object-keys/README.md';

  candidate.metadata.targetCollection = targetCollection;
  card.metadata.targetCollection = targetCollection;
  card.metadata.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.destinationLocations =
    `tasks/${targetTaskId}/README.md; ${targetCollection}; GRACE; Beads`;
  fixture.publishedCatalog.thematicByTaskId[targetTaskId] = targetCollection;
  fixture.publishedCatalog.cardFactsByTaskId[targetTaskId] = {
    technology: 'TypeScript',
    editorProfile: 'CodePen',
    starterCode: 'declare const target: EventTarget;',
  };
  fixture.manifest = validator.createImmutableManifest(fixture.candidates);

  const result = validator.validatePublicationRegistry(fixture);

  assert.equal(result.publishedArmyTaskCount, 10);
});

test('rejects a browser TypeScript card whose Markdown editor differs from frozen CodePen', () => {
  const fixture = makePublishedWaveFixture();
  const candidate = fixture.candidates[0];
  const card = fixture.cards[0];
  const targetTaskId = card.metadata.targetTaskId;
  const targetCollection =
    'collections/typescript/generics-and-object-keys/README.md';

  candidate.metadata.targetCollection = targetCollection;
  card.metadata.targetCollection = targetCollection;
  card.metadata.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.destinationLocations =
    `tasks/${targetTaskId}/README.md; ${targetCollection}; GRACE; Beads`;
  fixture.publishedCatalog.thematicByTaskId[targetTaskId] = targetCollection;
  fixture.publishedCatalog.cardFactsByTaskId[targetTaskId] = {
    technology: 'TypeScript',
    editorProfile: 'TypeScript Playground',
    starterCode: 'declare const target: EventTarget;',
  };
  fixture.manifest = validator.createImmutableManifest(fixture.candidates);

  assertInvalid(fixture, /Markdown editor profile does not match/);
});

test('rejects frozen CodePen for a pure TypeScript starter', () => {
  const fixture = makePublishedWaveFixture();
  const candidate = fixture.candidates[0];
  const card = fixture.cards[0];
  const targetTaskId = card.metadata.targetTaskId;
  const targetCollection =
    'collections/typescript/generics-and-object-keys/README.md';

  candidate.metadata.targetCollection = targetCollection;
  card.metadata.targetCollection = targetCollection;
  card.metadata.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.editorProfile = 'CodePen';
  card.metadata.cardMigrationEvidence.destinationLocations =
    `tasks/${targetTaskId}/README.md; ${targetCollection}; GRACE; Beads`;
  fixture.publishedCatalog.thematicByTaskId[targetTaskId] = targetCollection;
  fixture.publishedCatalog.cardFactsByTaskId[targetTaskId] = {
    technology: 'TypeScript',
    editorProfile: 'CodePen',
    starterCode: 'const value: number = 1;',
  };
  fixture.manifest = validator.createImmutableManifest(fixture.candidates);

  assertInvalid(fixture, /Markdown editor profile does not match/);
});

test('rejects frozen TypeScript Playground for a browser starter', () => {
  const fixture = makePublishedWaveFixture();
  const candidate = fixture.candidates[0];
  const card = fixture.cards[0];
  const targetTaskId = card.metadata.targetTaskId;
  const targetCollection =
    'collections/typescript/generics-and-object-keys/README.md';

  candidate.metadata.targetCollection = targetCollection;
  card.metadata.targetCollection = targetCollection;
  card.metadata.editorProfile = 'TypeScript Playground';
  card.metadata.cardMigrationEvidence.editorProfile =
    'TypeScript Playground';
  card.metadata.cardMigrationEvidence.destinationLocations =
    `tasks/${targetTaskId}/README.md; ${targetCollection}; GRACE; Beads`;
  fixture.publishedCatalog.thematicByTaskId[targetTaskId] = targetCollection;
  fixture.publishedCatalog.cardFactsByTaskId[targetTaskId] = {
    technology: 'TypeScript',
    editorProfile: 'TypeScript Playground',
    starterCode: 'declare const socket: WebSocket;',
  };
  fixture.manifest = validator.createImmutableManifest(fixture.candidates);

  assertInvalid(fixture, /Markdown editor profile does not match/);
});

test('rejects a published catalog whose total is not legacy plus exact ARMY IDs', () => {
  const fixture = makePublishedWaveFixture();

  fixture.publishedCatalog.totalTaskCount = 30;

  assertInvalid(fixture, /legacy-card count plus published ARMY-97 IDs/);
});

test('rejects a published card receipt from a different catalog mode', () => {
  const fixture = makePublishedWaveFixture();

  fixture.cards[0].metadata.fullCatalogGateEvidence.gateMode = 'final';

  assertInvalid(fixture, /gateMode does not match the current catalog/);
});

// END_BLOCK_TRACKED_VALIDATOR_PROBE
