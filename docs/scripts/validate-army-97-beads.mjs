// FILE: docs/scripts/validate-army-97-beads.mjs
// VERSION: 2.5.0
// START_MODULE_CONTRACT
//   PURPOSE: Enforce the ARMY-97 source-audit, published-catalog, and publication-decision contract against live Beads metadata.
//   SCOPE: Immutable snapshot hashing, mutable count derivation, current task/collection/editor inventory with starter-only browser classification, candidate/card synchronization, and structured current-commit evidence.
//   DEPENDS: bd CLI, Git, Node fs, docs/army-97-candidate-audit.json, docs/scripts/run-army-97-catalog-gate.mjs, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, DF-ARMY97-CANDIDATE-TO-CARD
//   ROLE: SCRIPT
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createImmutableManifest - Derive the immutable source-audit snapshot and digest.
//   validatePublishedCatalogState - Cross-check published Markdown identities against Beads state and current receipts.
//   validatePublicationRegistry - Validate candidate/card state and derive mutable counts.
//   loadLiveRegistry - Read the current ARMY-97 registry from Beads.
//   loadPublishedCatalogState - Read current task identities, thematic membership, technology, and editor profile from Markdown.
//   extractStarterCode - Read only fenced starter code from the condition section.
//   expectedEditorProfileForCard - Map technology and starter browser APIs to one editor profile.
//   run - Validate the live registry from the repository root.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v2.5.0 - Version the one-time immutable navigation migration from retired broad paths to the frozen 23-topic registry.
// END_CHANGE_SUMMARY

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readdirSync,
  readFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  FULL_CATALOG_GATE_EVIDENCE_FIELDS,
  verifyFullCatalogGateEvidence,
} from './run-army-97-catalog-gate.mjs';

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

const immutableManifestFields = [
  'schemaVersion',
  'sourceAuditRevision',
  'candidateRegisterSize',
  'immutableCandidateFields',
  'sourceAuditCounts',
  'immutableCandidateRecordsSha256',
];
const immutableManifestSchemaVersion = 2;
const candidateIdPattern = /^frontend-livecoding-tasks-army-97-candidate-(\d{3})$/;
const cardIdPattern = /^frontend-livecoding-tasks-army-97-task-(\d{4})$/;
const taskIdPattern = /^task-(\d{4})$/;
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
const allowedGateModes = new Set(['wave', 'final']);
const completeWaveCardCounts = new Set([
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  110,
  118,
]);
const allowedModes = new Set(['focused', 'real-work']);
const allowedEditorProfiles = new Set([
  'Programiz',
  'CodePen',
  'TypeScript Playground',
  'React TypeScript',
]);
const fixedEditorByTechnology = {
  'HTML/CSS': 'CodePen',
  'HTML/JavaScript': 'CodePen',
  'HTML/CSS/JavaScript': 'CodePen',
  'React/TypeScript': 'React TypeScript',
};
const browserStarterPattern =
  /(^|[^A-Za-z0-9_$])(document|window|navigator|localStorage|sessionStorage|location|history|HTMLElement|NodeList|EventTarget|Document|WebSocket|MutationObserver|IntersectionObserver|ResizeObserver)([^A-Za-z0-9_$]|$)|(^|[^A-Za-z0-9_$])(fetch|requestAnimationFrame|cancelAnimationFrame|addEventListener|removeEventListener)\s*\(|^\s*(import|export)([\s{]|$)|(^|[^A-Za-z0-9_$])import\s*\(/m;
const editorProfileBySandboxLine = new Map([
  [
    'Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).',
    'Programiz',
  ],
  [
    'Песочница для выполнения — [CodePen](https://pen.new).',
    'CodePen',
  ],
  [
    'Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).',
    'TypeScript Playground',
  ],
  [
    'Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).',
    'React TypeScript',
  ],
]);
const topicRegistry = [
  ['collections/javascript/event-loop/README.md', 'JavaScript', 'Event loop и очереди задач'],
  ['collections/javascript/promises-and-async/README.md', 'JavaScript', 'Promise и async/await'],
  ['collections/javascript/prototypes-inheritance-and-this/README.md', 'JavaScript', 'Прототипы, наследование и `this`'],
  ['collections/javascript/functions-closures-and-scope/README.md', 'JavaScript', 'Функции, замыкания и область видимости'],
  ['collections/javascript/objects-and-collections/README.md', 'JavaScript', 'Объекты и коллекции'],
  ['collections/javascript/dom-and-events/README.md', 'JavaScript', 'DOM и события'],
  ['collections/javascript/dates-and-time-intervals/README.md', 'JavaScript', 'Даты и временные интервалы'],
  ['collections/javascript/arrays-search-and-sorting/README.md', 'JavaScript', 'Массивы, поиск и сортировка'],
  ['collections/javascript/strings/README.md', 'JavaScript', 'Строки'],
  ['collections/javascript/trees-and-recursion/README.md', 'JavaScript', 'Деревья и рекурсия'],
  ['collections/javascript/graphs/README.md', 'JavaScript', 'Графы'],
  ['collections/javascript/linked-lists-and-stack/README.md', 'JavaScript', 'Связные списки и стек'],
  ['collections/javascript/numbers-types-and-operators/README.md', 'JavaScript', 'Числа, типы и операторы'],
  ['collections/typescript/generics-and-object-keys/README.md', 'TypeScript', 'Дженерики и ключи объектов'],
  ['collections/typescript/mapped-and-conditional-types/README.md', 'TypeScript', 'Mapped и conditional types'],
  ['collections/typescript/recursive-types/README.md', 'TypeScript', 'Рекурсивные типы'],
  ['collections/typescript/integration-typing/README.md', 'TypeScript', 'Типизация интеграций'],
  ['collections/react/state-and-event-handlers/README.md', 'React', 'Состояние и обработчики событий'],
  ['collections/react/effects-timers-and-cleanup/README.md', 'React', 'Эффекты, таймеры и очистка'],
  ['collections/react/rendering-and-memoization/README.md', 'React', 'Рендеринг и мемоизация'],
  ['collections/react/async-data-and-ui-states/README.md', 'React', 'Асинхронные данные и состояния интерфейса'],
  ['collections/react/component-composition-and-state-management/README.md', 'React', 'Композиция компонентов и управление состоянием'],
  ['collections/html-css/cascade-and-selectors/README.md', 'HTML/CSS', 'Каскад и селекторы'],
].map(([path, masterName, topicName]) => ({
  path,
  collectionName: `${masterName} → ${topicName}`,
}));
const allowedTargetCollections = new Set(topicRegistry.map(({ path }) => path));
const topicByPath = new Map(topicRegistry.map((topic) => [topic.path, topic]));
const freezeEvidence = 'none: source-audit freeze';

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
    schemaVersion: immutableManifestSchemaVersion,
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
  verifyCatalogGateExecution,
  expectedGateMode,
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
    expectedGateMode !== undefined
    && evidence.gateMode !== expectedGateMode
  ) {
    fail(`${card.id}: FullCatalogGateEvidence gateMode does not match the current catalog`);
  }

  if (typeof verifyCatalogGateExecution !== 'function') {
    fail(`${card.id}: actual exact-commit catalog gate execution is required`);
  }

  const verified = verifyCatalogGateExecution({
    cardMigrationEvidence,
    fullCatalogGateEvidence: evidence,
  });

  if (verified !== true) {
    fail(`${card.id}: exact-commit catalog gate execution was not verified`);
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

function validatePublicationTransition(
  candidate,
  card,
  verifyCatalogGateExecution,
  verifiedCardIds,
) {
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
    verifyCatalogGateExecution,
  );
  verifiedCardIds.add(card.id);

  return true;
}

// START_CONTRACT: validatePublishedCatalogState
//   PURPOSE: Cross-check current task identities, thematic mapping, publication decisions, and mode-bound card evidence.
//   INPUTS: { publishedCatalog: PublishedCatalogState, candidates: Army97CandidateRecord[], cards: Army97CardWorkItem[], transitionTaskIds: Set<string>, verifiedCardIds: Set<string>, verifyCatalogGateExecution: function }
//   OUTPUTS: { object - Current catalog mode and exact legacy, ARMY, and total counts }
//   SIDE_EFFECTS: Executes exact-commit receipt verification for published cards not already verified as transitions.
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
// END_CONTRACT: validatePublishedCatalogState
function validatePublishedCatalogState({
  publishedCatalog,
  candidates,
  cards,
  transitionTaskIds,
  verifiedCardIds,
  verifyCatalogGateExecution,
}) {
  const {
    gateMode,
    legacyTaskCount,
    totalTaskCount,
    publishedArmyTaskIds,
    thematicByTaskId,
    cardFactsByTaskId,
  } = publishedCatalog ?? {};

  if (
    !allowedGateModes.has(gateMode)
    || !Number.isInteger(legacyTaskCount)
    || !Number.isInteger(totalTaskCount)
    || !Array.isArray(publishedArmyTaskIds)
    || !thematicByTaskId
    || Array.isArray(thematicByTaskId)
    || typeof thematicByTaskId !== 'object'
    || !cardFactsByTaskId
    || Array.isArray(cardFactsByTaskId)
    || typeof cardFactsByTaskId !== 'object'
  ) {
    fail('published catalog state is malformed');
  }

  const sortedTaskIds = [...publishedArmyTaskIds].sort();
  const uniqueTaskIds = [...new Set(sortedTaskIds)];

  if (JSON.stringify(sortedTaskIds) !== JSON.stringify(uniqueTaskIds)) {
    fail('published ARMY-97 task IDs must be unique');
  }

  if (totalTaskCount !== legacyTaskCount + uniqueTaskIds.length) {
    fail('current task count must equal legacy-card count plus published ARMY-97 IDs');
  }

  if (
    (gateMode === 'wave' && legacyTaskCount !== 21)
    || (gateMode === 'final' && legacyTaskCount !== 0)
  ) {
    fail(`${gateMode} catalog has an invalid legacy-card count`);
  }

  if (
    (gateMode === 'wave' && !completeWaveCardCounts.has(uniqueTaskIds.length))
    || (gateMode === 'final' && uniqueTaskIds.length !== 118)
  ) {
    fail(`${gateMode} catalog does not end at a complete serialized wave boundary`);
  }

  const expectedTaskIds = Array.from(
    { length: uniqueTaskIds.length },
    (_, index) => `task-${String(index + 1).padStart(4, '0')}`,
  );

  if (JSON.stringify(uniqueTaskIds) !== JSON.stringify(expectedTaskIds)) {
    fail('published ARMY-97 task IDs must be one contiguous immutable prefix');
  }

  const thematicTaskIds = Object.keys(thematicByTaskId).sort();

  if (JSON.stringify(thematicTaskIds) !== JSON.stringify(uniqueTaskIds)) {
    fail('published ARMY-97 thematic map must contain exactly the published IDs');
  }

  const cardFactTaskIds = Object.keys(cardFactsByTaskId).sort();

  if (JSON.stringify(cardFactTaskIds) !== JSON.stringify(uniqueTaskIds)) {
    fail('published ARMY-97 card facts must contain exactly the published IDs');
  }

  const candidatesByTaskId = new Map(
    candidates.map((candidate) => [
      candidate.metadata.targetTaskId,
      candidate,
    ]),
  );
  const cardsByTaskId = new Map(
    cards.map((card) => [card.metadata.targetTaskId, card]),
  );
  const publishedTaskIdSet = new Set(uniqueTaskIds);

  for (const transitionTaskId of transitionTaskIds) {
    if (!publishedTaskIdSet.has(transitionTaskId)) {
      fail(`${transitionTaskId}: accepted rewrite transition has no published card`);
    }
  }

  for (const publishedTaskId of uniqueTaskIds) {
    const candidate = candidatesByTaskId.get(publishedTaskId);
    const card = cardsByTaskId.get(publishedTaskId);

    if (!candidate || !card) {
      fail(`${publishedTaskId}: published task is absent from the immutable registry`);
    }

    if (
      candidate.metadata.publicationDecision !== 'accepted'
      || card.metadata.publicationDecision !== 'accepted'
    ) {
      fail(`${publishedTaskId}: published ARMY-97 card requires publicationDecision accepted`);
    }

    if (thematicByTaskId[publishedTaskId] !== card.metadata.targetCollection) {
      fail(`${publishedTaskId}: published thematic collection does not match the frozen card mapping`);
    }

    const cardFact = cardFactsByTaskId[publishedTaskId];
    const topic = topicByPath.get(thematicByTaskId[publishedTaskId]);
    const expectedMarkdownEditor = expectedEditorProfileForCard(
      cardFact?.technology,
      cardFact?.starterCode,
    );

    if (
      cardFact?.editorProfile !== expectedMarkdownEditor
      || cardFact.editorProfile !== card.metadata.editorProfile
    ) {
      fail(`${card.id}: Markdown editor profile does not match card technology and frozen Beads profile`);
    }

    if (
      cardFact?.title !== undefined
      && !cardFact.title.startsWith(`${publishedTaskId} — `)
    ) {
      fail(`${publishedTaskId}: Markdown task title does not use its immutable ID`);
    }

    if (
      cardFact?.metadataCollection !== undefined
      && cardFact.metadataCollection !== topic?.collectionName
    ) {
      fail(`${publishedTaskId}: Markdown metadata collection does not match its frozen topic`);
    }

    const cardEvidence = validateCardMigrationEvidence(card);

    if (
      !cardEvidence.destinationLocations.includes(
        `tasks/${publishedTaskId}/README.md`,
      )
      || !cardEvidence.destinationLocations.includes(
        card.metadata.targetCollection,
      )
    ) {
      fail(`${card.id}: CardMigrationEvidence destinations do not identify the published card and thematic collection`);
    }

    if (
      card.metadata.fullCatalogGateEvidence?.gateMode !== gateMode
    ) {
      fail(`${card.id}: FullCatalogGateEvidence gateMode does not match the current catalog`);
    }

    if (!verifiedCardIds.has(card.id)) {
      validateFullCatalogGateEvidence(
        card,
        cardEvidence,
        verifyCatalogGateExecution,
        gateMode,
      );
      verifiedCardIds.add(card.id);
    }
  }

  return {
    catalogMode: gateMode,
    legacyTaskCount,
    publishedArmyTaskCount: uniqueTaskIds.length,
    currentTaskCount: totalTaskCount,
  };
}

// START_CONTRACT: extractStarterCode
//   PURPOSE: Isolate only fenced starter bodies from the student condition section.
//   INPUTS: { content: string - Complete task-card Markdown }
//   OUTPUTS: { string - Concatenated starter code without hints, solution, metadata, or prose }
//   SIDE_EFFECTS: none
//   LINKS: M-TASK-TEMPLATE, V-M-TASK-VALIDATION
// END_CONTRACT: extractStarterCode
function extractStarterCode(content) {
  const conditionSection = content.match(
    /^## Условие\r?\n([\s\S]*?)(?=^<details>)/m,
  )?.[1] ?? '';

  return [...conditionSection.matchAll(
    /^```[^\r\n]*\r?\n([\s\S]*?)^```[ \t]*$/gm,
  )].map((match) => match[1]).join('\n');
}

// START_CONTRACT: expectedEditorProfileForCard
//   PURPOSE: Map one card to its unique editor from technology and starter runtime APIs.
//   INPUTS: { technology: string, starterCode: string }
//   OUTPUTS: { string | undefined - Required controlled editor profile }
//   SIDE_EFFECTS: none
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION
// END_CONTRACT: expectedEditorProfileForCard
function expectedEditorProfileForCard(technology, starterCode) {
  const usesBrowserRuntime =
    typeof starterCode === 'string'
    && browserStarterPattern.test(starterCode);

  if (technology === 'JavaScript') {
    return usesBrowserRuntime ? 'CodePen' : 'Programiz';
  }

  if (technology === 'TypeScript') {
    return usesBrowserRuntime ? 'CodePen' : 'TypeScript Playground';
  }

  return fixedEditorByTechnology[technology];
}

// START_CONTRACT: validatePublicationRegistry
//   PURPOSE: Enforce immutable source state, synchronized published-catalog state, and structured publication transitions.
//   INPUTS: { candidates: Army97CandidateRecord[], cards: Army97CardWorkItem[], manifest: object, publishedCatalog: PublishedCatalogState, verifyCatalogGateExecution: function }
//   OUTPUTS: { object - Derived source, publication, catalog, and transition counts }
//   SIDE_EFFECTS: Executes the supplied exact-commit catalog verifier for every published card receipt.
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, DF-ARMY97-CANDIDATE-TO-CARD
// END_CONTRACT: validatePublicationRegistry
export function validatePublicationRegistry({
  candidates,
  cards,
  manifest,
  publishedCatalog,
  verifyCatalogGateExecution,
}) {
  if (!Array.isArray(candidates) || !Array.isArray(cards)) {
    fail('candidate and card registries must be arrays');
  }

  if (publishedCatalog === undefined) {
    fail('current published catalog state is required');
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
  const transitionTaskIds = new Set();
  const verifiedCardIds = new Set();

  // START_BLOCK_VALIDATE_CANDIDATE_CARD_STATE
  for (let index = 0; index < sortedCandidates.length; index += 1) {
    const expectedOrder = index + 1;
    const candidate = sortedCandidates[index];
    const card = sortedCards[index];

    validateCandidateShape(candidate, expectedOrder);
    validateCardShape(card, expectedOrder);
    validateSynchronizedState(candidate, card);

    if (validatePublicationTransition(
      candidate,
      card,
      verifyCatalogGateExecution,
      verifiedCardIds,
    )) {
      transitionCount += 1;
      transitionTaskIds.add(candidate.metadata.targetTaskId);
    }
  }
  // END_BLOCK_VALIDATE_CANDIDATE_CARD_STATE

  const catalogSummary = validatePublishedCatalogState({
    publishedCatalog,
    candidates: sortedCandidates,
    cards: sortedCards,
    transitionTaskIds,
    verifiedCardIds,
    verifyCatalogGateExecution,
  });

  return {
    candidateRegisterSize: sortedCandidates.length,
    immutableSourceCounts: immutableSnapshot.sourceAuditCounts,
    publicationCounts: publicationCounts(sortedCandidates),
    transitionCount,
    immutableCandidateRecordsSha256:
      immutableSnapshot.immutableCandidateRecordsSha256,
    ...catalogSummary,
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

// START_CONTRACT: loadPublishedCatalogState
//   PURPOSE: Derive current ARMY-97 publication identity and thematic membership from tracked Markdown.
//   INPUTS: { cwd: string - Repository root }
//   OUTPUTS: { PublishedCatalogState - Counts, IDs, thematic mapping, and Markdown technology/editor/starter facts }
//   SIDE_EFFECTS: Reads task and controlled thematic Markdown paths.
//   LINKS: M-TASK-LIBRARY, M-CATALOG, V-M-TASK-VALIDATION
// END_CONTRACT: loadPublishedCatalogState
export function loadPublishedCatalogState(cwd = repoRoot) {
  const tasksRoot = resolve(cwd, 'tasks');
  const taskDirectories = readdirSync(tasksRoot, { withFileTypes: true })
    .filter((entry) => (
      entry.isDirectory()
      && existsSync(resolve(tasksRoot, entry.name, 'README.md'))
    ))
    .map((entry) => entry.name)
    .sort();
  const publishedArmyTaskIds = taskDirectories.filter(
    (directory) => taskIdPattern.test(directory),
  );
  const legacyTaskCount =
    taskDirectories.length - publishedArmyTaskIds.length;
  const gateMode = legacyTaskCount > 0 ? 'wave' : 'final';
  const thematicByTaskId = {};
  const cardFactsByTaskId = {};

  for (const collectionPath of allowedTargetCollections) {
    const absoluteCollectionPath = resolve(cwd, collectionPath);

    if (!existsSync(absoluteCollectionPath)) {
      continue;
    }

    const content = readFileSync(absoluteCollectionPath, 'utf8');

    for (const match of content.matchAll(
      /tasks\/(task-[0-9]{4})\/README\.md/g,
    )) {
      const taskId = match[1];

      if (Object.hasOwn(thematicByTaskId, taskId)) {
        fail(`${taskId}: published ARMY-97 card has multiple controlled thematic memberships`);
      }

      thematicByTaskId[taskId] = collectionPath;
    }
  }

  for (const taskId of publishedArmyTaskIds) {
    const content = readFileSync(
      resolve(tasksRoot, taskId, 'README.md'),
      'utf8',
    );
    const technology = content.match(
      /^- Технология: (JavaScript|TypeScript|HTML\/CSS|HTML\/JavaScript|HTML\/CSS\/JavaScript|React\/TypeScript)$/m,
    )?.[1];
    const title = content.match(/^# (.+)$/m)?.[1];
    const metadataCollection = content.match(
      /^- Подборка: (.+)$/m,
    )?.[1];
    const sandboxLine = content.match(
      /^Песочница для выполнения — \[[^\]]+\]\(https?:\/\/[^)]+\)\.$/m,
    )?.[0];
    const starterCode = extractStarterCode(content);

    cardFactsByTaskId[taskId] = {
      title,
      technology,
      editorProfile: editorProfileBySandboxLine.get(sandboxLine),
      starterCode,
      metadataCollection,
    };
  }

  return {
    gateMode,
    legacyTaskCount,
    totalTaskCount: taskDirectories.length,
    publishedArmyTaskIds,
    thematicByTaskId,
    cardFactsByTaskId,
  };
}

// START_CONTRACT: run
//   PURPOSE: Apply the tracked manifest, current Markdown catalog state, and validator to live Beads.
//   INPUTS: { none }
//   OUTPUTS: { object - Validation summary }
//   SIDE_EFFECTS: Reads Beads, tracked Markdown, Git history, and the tracked manifest; writes summary to stdout.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: run
export function run() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const registry = loadLiveRegistry(repoRoot);
  const publishedCatalog = loadPublishedCatalogState(repoRoot);
  const summary = validatePublicationRegistry({
    ...registry,
    manifest,
    publishedCatalog,
    verifyCatalogGateExecution: ({
      cardMigrationEvidence,
      fullCatalogGateEvidence,
    }) => verifyFullCatalogGateEvidence({
      repositoryRoot: repoRoot,
      cardMigrationEvidence,
      fullCatalogGateEvidence,
    }),
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
