// FILE: docs/scripts/validate-army-97-beads.mjs
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Enforce the ARMY-97 source-audit and publication-decision contract against live Beads metadata.
//   SCOPE: Immutable snapshot hashing, mutable count derivation, candidate/card synchronization, and structured transition evidence.
//   DEPENDS: bd CLI, Git, docs/army-97-candidate-audit.json, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, DF-ARMY97-CANDIDATE-TO-CARD
//   ROLE: SCRIPT
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createImmutableManifest - Derive the immutable source-audit snapshot and digest.
//   createFullCatalogGateEvidence - Create a self-verifying structured gate record.
//   validatePublicationRegistry - Validate candidate/card state and derive mutable counts.
//   loadLiveRegistry - Read the current ARMY-97 registry from Beads.
//   run - Validate the live registry from the repository root.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v1.0.0 - Replace declarative transition text with a tracked deterministic Beads gate.
// END_CHANGE_SUMMARY

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const IMMUTABLE_CANDIDATE_FIELDS = [
  'recordType',
  'candidateId',
  'inputOrder',
  'centralAction',
  'starterBehavior',
  'expectedResult',
  'sourceAuditRevision',
  'sourceAuditDecision',
  'decisionEvidence',
  'duplicateTarget',
  'correctionPath',
  'targetTaskId',
  'targetCollection',
];

export const CARD_MIGRATION_EVIDENCE_FIELDS = [
  'slug',
  'mode',
  'editorProfile',
  'sourceLearningGoal',
  'sourcePrerequisite',
  'sourceRuntimeAssumption',
  'destinationLocations',
  'targetEditorExpectedResult',
  'targetEditorActualResult',
  'verdict',
];

export const FULL_CATALOG_GATE_EVIDENCE_FIELDS = [
  'policyPath',
  'catalogCommit',
  'verdict',
  'evidenceSha256',
];

const immutableManifestFields = [
  'schemaVersion',
  'sourceAuditRevision',
  'candidateRegisterSize',
  'immutableCandidateFields',
  'sourceAuditCounts',
  'immutableCandidateRecordsSha256',
];
const candidateIdPattern = /^frontend-livecoding-tasks-army-97-candidate-(\d{3})$/;
const cardIdPattern = /^frontend-livecoding-tasks-army-97-task-(\d{4})$/;
const taskIdPattern = /^task-(\d{4})$/;
const catalogCommitPattern = /^[0-9a-f]{40}$/;
const evidenceSha256Pattern = /^[0-9a-f]{64}$/;
const allowedSourceDecisions = new Set([
  'accepted',
  'needs-rewrite',
  'rejected',
  'duplicate',
]);
const allowedPublicationDecisions = new Set([
  'accepted',
  'needs-rewrite',
]);
const allowedModes = new Set(['focused', 'real-work']);
const allowedEditorProfiles = new Set([
  'Programiz',
  'CodePen',
  'TypeScript Playground',
  'React TypeScript',
]);
const allowedTargetCollections = new Set([
  'collections/javascript/interview-practice/README.md',
  'collections/typescript/interview-practice/README.md',
  'collections/react/interview-practice/README.md',
  'collections/html-css/interview-practice/README.md',
]);
const freezeEvidence = 'none: source-audit freeze';
const policyPath = 'docs/task-validation-policy.md';

const modulePath = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(modulePath), '..', '..');
const manifestPath = resolve(repoRoot, 'docs/army-97-candidate-audit.json');

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sameKeys(value, expectedKeys) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }

  return JSON.stringify(Object.keys(value).sort())
    === JSON.stringify([...expectedKeys].sort());
}

function requireNonEmptyRecord(record, fields, label) {
  for (const field of fields) {
    const value = record[field];

    if (
      value === undefined
      || value === null
      || (typeof value === 'string' && value.trim() === '')
    ) {
      fail(`${label} has an empty ${field}`);
    }
  }
}

function orderedImmutableRecord(candidate) {
  const record = {};

  for (const field of IMMUTABLE_CANDIDATE_FIELDS) {
    record[field] = candidate.metadata?.[field];
  }

  return record;
}

function orderedRecord(value, fields) {
  const record = {};

  for (const field of fields) {
    record[field] = value[field];
  }

  return record;
}

function immutableRecords(candidates) {
  return [...candidates]
    .sort((left, right) => (
      left.metadata.inputOrder - right.metadata.inputOrder
    ))
    .map(orderedImmutableRecord);
}

function sourceAuditCounts(candidates) {
  const counts = {
    accepted: 0,
    needsRewrite: 0,
    rejected: 0,
    duplicate: 0,
  };

  for (const candidate of candidates) {
    const decision = candidate.metadata?.sourceAuditDecision;

    if (decision === 'needs-rewrite') {
      counts.needsRewrite += 1;
    } else if (Object.hasOwn(counts, decision)) {
      counts[decision] += 1;
    } else {
      fail(`${candidate.id}: unsupported sourceAuditDecision ${String(decision)}`);
    }
  }

  return counts;
}

function publicationCounts(candidates) {
  const counts = {
    accepted: 0,
    needsRewrite: 0,
  };

  for (const candidate of candidates) {
    const decision = candidate.metadata?.publicationDecision;

    if (decision === 'needs-rewrite') {
      counts.needsRewrite += 1;
    } else if (decision === 'accepted') {
      counts.accepted += 1;
    } else {
      fail(`${candidate.id}: unsupported publicationDecision ${String(decision)}`);
    }
  }

  return counts;
}

// START_CONTRACT: createImmutableManifest
//   PURPOSE: Derive the frozen source-audit counts and aggregate record digest.
//   INPUTS: { candidates: Army97CandidateRecord[] - Candidate issues in any order }
//   OUTPUTS: { object - Deterministic immutable manifest }
//   SIDE_EFFECTS: none
//   LINKS: Army97CandidateRecord, M-TASK-VALIDATION
// END_CONTRACT: createImmutableManifest
export function createImmutableManifest(candidates) {
  const records = immutableRecords(candidates);
  const revisions = new Set(
    records.map((record) => record.sourceAuditRevision),
  );

  if (revisions.size !== 1) {
    fail('immutable source snapshot must contain exactly one audit revision');
  }

  return {
    schemaVersion: 1,
    sourceAuditRevision: records[0]?.sourceAuditRevision,
    candidateRegisterSize: records.length,
    immutableCandidateFields: [...IMMUTABLE_CANDIDATE_FIELDS],
    sourceAuditCounts: sourceAuditCounts(candidates),
    immutableCandidateRecordsSha256: sha256(JSON.stringify(records)),
  };
}

function transitionEvidenceReference(cardId) {
  return `Beads:${cardId}#cardMigrationEvidence+fullCatalogGateEvidence`;
}

function fullCatalogEvidenceDigest({
  cardMigrationEvidence,
  policyPath: evidencePolicyPath,
  catalogCommit,
  verdict,
}) {
  return sha256(JSON.stringify({
    policyPath: evidencePolicyPath,
    catalogCommit,
    verdict,
    cardMigrationEvidence: orderedRecord(
      cardMigrationEvidence,
      CARD_MIGRATION_EVIDENCE_FIELDS,
    ),
  }));
}

// START_CONTRACT: createFullCatalogGateEvidence
//   PURPOSE: Build a deterministic structured proof record tied to the card evidence and catalog commit.
//   INPUTS: { cardMigrationEvidence: object, catalogCommit: string }
//   OUTPUTS: { FullCatalogGateEvidence }
//   SIDE_EFFECTS: none
//   LINKS: V-M-TASK-VALIDATION, CardMigrationEvidence
// END_CONTRACT: createFullCatalogGateEvidence
export function createFullCatalogGateEvidence({
  cardMigrationEvidence,
  catalogCommit,
}) {
  const evidence = {
    policyPath,
    catalogCommit,
    verdict: 'PASS',
  };

  return {
    ...evidence,
    evidenceSha256: fullCatalogEvidenceDigest({
      ...evidence,
      cardMigrationEvidence,
    }),
  };
}

function validateManifest(candidates, manifest) {
  if (!sameKeys(manifest, immutableManifestFields)) {
    fail(`tracked immutable source manifest must contain exactly ${immutableManifestFields.join(', ')}`);
  }

  if (
    JSON.stringify(manifest.immutableCandidateFields)
    !== JSON.stringify(IMMUTABLE_CANDIDATE_FIELDS)
  ) {
    fail('tracked immutable source manifest field order does not match the validator');
  }

  const current = createImmutableManifest(candidates);

  if (
    current.schemaVersion !== manifest.schemaVersion
    || current.sourceAuditRevision !== manifest.sourceAuditRevision
    || current.candidateRegisterSize !== manifest.candidateRegisterSize
    || JSON.stringify(current.sourceAuditCounts)
      !== JSON.stringify(manifest.sourceAuditCounts)
    || current.immutableCandidateRecordsSha256
      !== manifest.immutableCandidateRecordsSha256
  ) {
    fail('immutable source snapshot does not match docs/army-97-candidate-audit.json');
  }

  return current;
}

function validateCandidateShape(candidate, expectedOrder) {
  const metadata = candidate.metadata ?? {};
  const candidateMatch = candidateIdPattern.exec(candidate.id);
  const taskMatch = taskIdPattern.exec(metadata.targetTaskId);

  requireNonEmptyRecord(
    metadata,
    [...IMMUTABLE_CANDIDATE_FIELDS, 'publicationDecision', 'publicationTransitionEvidence'],
    candidate.id,
  );

  if (
    !candidateMatch
    || Number(candidateMatch[1]) !== expectedOrder
    || metadata.candidateId !== candidate.id
    || metadata.inputOrder !== expectedOrder
  ) {
    fail(`${candidate.id}: candidate ID and inputOrder are not contiguous`);
  }

  if (
    !taskMatch
    || Number(taskMatch[1]) !== expectedOrder
  ) {
    fail(`${candidate.id}: targetTaskId is not contiguous`);
  }

  if (metadata.recordType !== 'Army97CandidateRecord') {
    fail(`${candidate.id}: recordType must be Army97CandidateRecord`);
  }

  if (!allowedSourceDecisions.has(metadata.sourceAuditDecision)) {
    fail(`${candidate.id}: unsupported sourceAuditDecision`);
  }

  if (!allowedPublicationDecisions.has(metadata.publicationDecision)) {
    fail(`${candidate.id}: unsupported publicationDecision`);
  }

  if (!allowedTargetCollections.has(metadata.targetCollection)) {
    fail(`${candidate.id}: unsupported targetCollection`);
  }

  if (Object.hasOwn(metadata, 'decision')) {
    fail(`${candidate.id}: legacy decision metadata is forbidden`);
  }
}

function validateCardShape(card, expectedOrder) {
  const metadata = card.metadata ?? {};
  const cardMatch = cardIdPattern.exec(card.id);
  const expectedTaskId = `task-${String(expectedOrder).padStart(4, '0')}`;
  const expectedCandidateId = `frontend-livecoding-tasks-army-97-candidate-${String(expectedOrder).padStart(3, '0')}`;
  const requiredFields = [
    'recordType',
    'candidateId',
    'targetTaskId',
    'editorProfile',
    'format',
    'targetCollection',
    'expectedLocalMarkdownEvidence',
    'prerequisitePublicationDecision',
    'sourceAuditDecision',
    'publicationDecision',
    'publicationTransitionEvidence',
  ];

  requireNonEmptyRecord(metadata, requiredFields, card.id);

  if (
    !cardMatch
    || Number(cardMatch[1]) !== expectedOrder
    || metadata.targetTaskId !== expectedTaskId
    || metadata.candidateId !== expectedCandidateId
  ) {
    fail(`${card.id}: card ID, candidateId, and targetTaskId are not contiguous`);
  }

  if (metadata.recordType !== 'Army97CardWorkItem') {
    fail(`${card.id}: recordType must be Army97CardWorkItem`);
  }

  if (metadata.prerequisitePublicationDecision !== 'accepted') {
    fail(`${card.id}: prerequisitePublicationDecision must be accepted`);
  }

  if (!allowedEditorProfiles.has(metadata.editorProfile)) {
    fail(`${card.id}: unsupported editorProfile`);
  }

  if (!allowedTargetCollections.has(metadata.targetCollection)) {
    fail(`${card.id}: unsupported targetCollection`);
  }

  if (
    Object.hasOwn(metadata, 'prerequisiteDecision')
    || Object.hasOwn(metadata, 'currentCandidateDecision')
  ) {
    fail(`${card.id}: legacy card decision metadata is forbidden`);
  }
}

function validateCardMigrationEvidence(card) {
  const metadata = card.metadata;
  const evidence = metadata.cardMigrationEvidence;

  if (!sameKeys(evidence, CARD_MIGRATION_EVIDENCE_FIELDS)) {
    fail(`${card.id}: CardMigrationEvidence keys must be exactly ${CARD_MIGRATION_EVIDENCE_FIELDS.join(', ')}`);
  }

  requireNonEmptyRecord(
    evidence,
    CARD_MIGRATION_EVIDENCE_FIELDS,
    `${card.id}: CardMigrationEvidence`,
  );

  if (evidence.slug !== metadata.targetTaskId) {
    fail(`${card.id}: CardMigrationEvidence slug does not match targetTaskId`);
  }

  if (!allowedModes.has(evidence.mode)) {
    fail(`${card.id}: CardMigrationEvidence mode is unsupported`);
  }

  if (evidence.editorProfile !== metadata.editorProfile) {
    fail(`${card.id}: CardMigrationEvidence editorProfile is not synchronized`);
  }

  if (
    evidence.targetEditorExpectedResult !== 'NOT_RUN: Markdown-only delivery'
    || evidence.targetEditorActualResult !== 'NOT_RUN: Markdown-only delivery'
  ) {
    fail(`${card.id}: target-editor evidence must use the Markdown-only compatibility value`);
  }

  if (evidence.verdict !== 'PASS') {
    fail(`${card.id}: CardMigrationEvidence verdict must be PASS`);
  }

  return evidence;
}

function validateFullCatalogGateEvidence(
  card,
  cardMigrationEvidence,
  hasCatalogCommit,
) {
  const evidence = card.metadata.fullCatalogGateEvidence;

  if (!sameKeys(evidence, FULL_CATALOG_GATE_EVIDENCE_FIELDS)) {
    fail(`${card.id}: FullCatalogGateEvidence record must contain exactly ${FULL_CATALOG_GATE_EVIDENCE_FIELDS.join(', ')}`);
  }

  requireNonEmptyRecord(
    evidence,
    FULL_CATALOG_GATE_EVIDENCE_FIELDS,
    `${card.id}: FullCatalogGateEvidence`,
  );

  if (
    evidence.policyPath !== policyPath
    || evidence.verdict !== 'PASS'
  ) {
    fail(`${card.id}: FullCatalogGateEvidence must record the tracked policy and PASS`);
  }

  if (
    !catalogCommitPattern.test(evidence.catalogCommit)
    || !hasCatalogCommit(evidence.catalogCommit)
  ) {
    fail(`${card.id}: FullCatalogGateEvidence catalogCommit is not an ancestor of HEAD`);
  }

  if (!evidenceSha256Pattern.test(evidence.evidenceSha256)) {
    fail(`${card.id}: FullCatalogGateEvidence evidenceSha256 is malformed`);
  }

  const expectedDigest = fullCatalogEvidenceDigest({
    cardMigrationEvidence,
    policyPath: evidence.policyPath,
    catalogCommit: evidence.catalogCommit,
    verdict: evidence.verdict,
  });

  if (evidence.evidenceSha256 !== expectedDigest) {
    fail(`${card.id}: FullCatalogGateEvidence evidenceSha256 does not match the structured record`);
  }
}

function validateSynchronizedState(candidate, card) {
  const candidateMetadata = candidate.metadata;
  const cardMetadata = card.metadata;
  const synchronizedFields = [
    'candidateId',
    'targetTaskId',
    'targetCollection',
    'sourceAuditDecision',
    'publicationDecision',
    'publicationTransitionEvidence',
  ];

  for (const field of synchronizedFields) {
    if (candidateMetadata[field] !== cardMetadata[field]) {
      fail(`${candidate.id}: candidate-card synchronization failed for ${field}`);
    }
  }
}

function validatePublicationTransition(candidate, card, hasCatalogCommit) {
  const metadata = candidate.metadata;

  if (metadata.sourceAuditDecision === 'accepted') {
    if (metadata.publicationDecision !== 'accepted') {
      fail(`${candidate.id}: accepted source candidate cannot leave publication accepted`);
    }

    if (metadata.publicationTransitionEvidence !== freezeEvidence) {
      fail(`${candidate.id}: accepted source candidate must retain the source-freeze marker`);
    }

    return false;
  }

  if (metadata.sourceAuditDecision !== 'needs-rewrite') {
    fail(`${candidate.id}: rejected or duplicate source candidates are not publishable`);
  }

  if (metadata.correctionPath === 'none') {
    fail(`${candidate.id}: needs-rewrite source candidate requires a correctionPath`);
  }

  if (metadata.publicationDecision === 'needs-rewrite') {
    if (metadata.publicationTransitionEvidence !== freezeEvidence) {
      fail(`${candidate.id}: held rewrite candidate must retain the source-freeze marker`);
    }

    return false;
  }

  const expectedReference = transitionEvidenceReference(card.id);

  if (metadata.publicationTransitionEvidence !== expectedReference) {
    fail(`${candidate.id}: transition requires the exact structured evidence reference ${expectedReference}`);
  }

  const cardMigrationEvidence = validateCardMigrationEvidence(card);
  validateFullCatalogGateEvidence(
    card,
    cardMigrationEvidence,
    hasCatalogCommit,
  );

  return true;
}

// START_CONTRACT: validatePublicationRegistry
//   PURPOSE: Enforce immutable source state, synchronized card state, and structured publication transitions.
//   INPUTS: { candidates: Army97CandidateRecord[], cards: Army97CardWorkItem[], manifest: object, hasCatalogCommit?: function }
//   OUTPUTS: { object - Derived source and publication counts plus transition count }
//   SIDE_EFFECTS: none
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, DF-ARMY97-CANDIDATE-TO-CARD
// END_CONTRACT: validatePublicationRegistry
export function validatePublicationRegistry({
  candidates,
  cards,
  manifest,
  hasCatalogCommit = () => true,
}) {
  if (!Array.isArray(candidates) || !Array.isArray(cards)) {
    fail('candidate and card registries must be arrays');
  }

  if (
    candidates.length !== manifest?.candidateRegisterSize
    || cards.length !== candidates.length
  ) {
    fail('candidate and card registries do not match the tracked register size');
  }

  const sortedCandidates = [...candidates].sort(
    (left, right) => left.metadata.inputOrder - right.metadata.inputOrder,
  );
  const sortedCards = [...cards].sort(
    (left, right) => left.metadata.targetTaskId.localeCompare(
      right.metadata.targetTaskId,
    ),
  );
  const immutableSnapshot = validateManifest(sortedCandidates, manifest);
  let transitionCount = 0;

  // START_BLOCK_VALIDATE_CANDIDATE_CARD_STATE
  for (let index = 0; index < sortedCandidates.length; index += 1) {
    const expectedOrder = index + 1;
    const candidate = sortedCandidates[index];
    const card = sortedCards[index];

    validateCandidateShape(candidate, expectedOrder);
    validateCardShape(card, expectedOrder);
    validateSynchronizedState(candidate, card);

    if (validatePublicationTransition(candidate, card, hasCatalogCommit)) {
      transitionCount += 1;
    }
  }
  // END_BLOCK_VALIDATE_CANDIDATE_CARD_STATE

  return {
    candidateRegisterSize: sortedCandidates.length,
    immutableSourceCounts: immutableSnapshot.sourceAuditCounts,
    publicationCounts: publicationCounts(sortedCandidates),
    transitionCount,
    immutableCandidateRecordsSha256:
      immutableSnapshot.immutableCandidateRecordsSha256,
  };
}

// START_CONTRACT: loadLiveRegistry
//   PURPOSE: Read ARMY-97 candidate and card metadata from the local Beads database.
//   INPUTS: { cwd: string - Repository root }
//   OUTPUTS: { candidates, cards }
//   SIDE_EFFECTS: Executes the read-only bd list command.
//   LINKS: M-TASK-VALIDATION
// END_CONTRACT: loadLiveRegistry
export function loadLiveRegistry(cwd = repoRoot) {
  const output = execFileSync(
    'bd',
    ['list', '--all', '--limit', '0', '--flat', '--json'],
    {
      cwd,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  const issues = JSON.parse(output);
  const candidates = issues.filter((issue) => candidateIdPattern.test(issue.id));
  const cards = issues.filter((issue) => cardIdPattern.test(issue.id));

  return { candidates, cards };
}

function isCatalogCommit(commit) {
  try {
    execFileSync(
      'git',
      ['merge-base', '--is-ancestor', commit, 'HEAD'],
      {
        cwd: repoRoot,
        stdio: 'ignore',
      },
    );
    return true;
  } catch {
    return false;
  }
}

// START_CONTRACT: run
//   PURPOSE: Apply the tracked manifest and validator to the live Beads registry.
//   INPUTS: { none }
//   OUTPUTS: { object - Validation summary }
//   SIDE_EFFECTS: Reads Beads, Git history, and the tracked manifest; writes summary to stdout.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: run
export function run() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const registry = loadLiveRegistry(repoRoot);
  const summary = validatePublicationRegistry({
    ...registry,
    manifest,
    hasCatalogCommit: isCatalogCommit,
  });

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === modulePath) {
  try {
    run();
  } catch (error) {
    process.stderr.write(`ARMY-97 Beads validation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
