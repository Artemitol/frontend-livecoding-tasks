// FILE: docs/scripts/run-army-97-catalog-gate.mjs
// VERSION: 2.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Execute the tracked wave or final catalog gate at an exact Git commit before emitting FullCatalogGateEvidence.
//   SCOPE: Explicit gate-mode selection, exact-commit archive execution, card-file presence, causal PASS receipts, current-HEAD enforcement, and receipt verification.
//   DEPENDS: Git, Bash, tar, docs/scripts/validate-army-97-catalog.sh, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, Army97PublicationDecisionTransition
//   ROLE: SCRIPT
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   runCatalogGateAtCommit - Execute the catalog gate from an isolated archive of one commit.
//   assertCardPublishedAtCommit - Bind card evidence to a task file in the executed commit.
//   emitFullCatalogGateEvidence - Emit PASS evidence only after a successful current-HEAD gate.
//   verifyFullCatalogGateEvidence - Re-execute the exact gate and compare its causal receipt.
//   run - Execute the command-line verify-only or evidence-emission workflow.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v2.0.0 - Bind every receipt to explicit mode, exact current commit, successful execution, and the published card file.
// END_CHANGE_SUMMARY

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const FULL_CATALOG_GATE_EVIDENCE_FIELDS = [
  'policyPath',
  'catalogGatePath',
  'catalogCommit',
  'catalogTree',
  'catalogGateBlob',
  'gateMode',
  'gateOutputSha256',
  'verdict',
  'evidenceSha256',
];

const policyPath = 'docs/task-validation-policy.md';
const catalogGatePath = 'docs/scripts/validate-army-97-catalog.sh';
const commitPattern = /^[0-9a-f]{40}$/;
const objectPattern = /^[0-9a-f]{40,64}$/;
const digestPattern = /^[0-9a-f]{64}$/;
const allowedGateModes = new Set(['wave', 'final']);
const maxBuffer = 256 * 1024 * 1024;
const modulePath = fileURLToPath(import.meta.url);
const defaultRepositoryRoot = resolve(dirname(modulePath), '..', '..');

function fail(message) {
  throw new Error(message);
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

function sameKeys(value, expectedKeys) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }

  return JSON.stringify(Object.keys(value).sort())
    === JSON.stringify([...expectedKeys].sort());
}

function gitValue(repositoryRoot, args) {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function resolveCommit(repositoryRoot, commit) {
  const resolvedCommit = gitValue(
    repositoryRoot,
    ['rev-parse', '--verify', `${commit}^{commit}`],
  );

  if (!commitPattern.test(resolvedCommit)) {
    fail(`catalog commit did not resolve to a forty-character SHA: ${commit}`);
  }

  return resolvedCommit;
}

function evidenceDigest(execution, cardMigrationEvidence) {
  return sha256(JSON.stringify(canonicalize({
    ...execution,
    cardMigrationEvidence,
  })));
}

// START_CONTRACT: assertCardPublishedAtCommit
//   PURPOSE: Require CardMigrationEvidence to identify a task card present in the exact executed catalog commit.
//   INPUTS: { repositoryRoot: string, catalogCommit: string, cardMigrationEvidence: object }
//   OUTPUTS: { string - Git blob ID of the published task card }
//   SIDE_EFFECTS: Reads one Git object.
//   LINKS: CardMigrationEvidence, Army97PublicationDecisionTransition
// END_CONTRACT: assertCardPublishedAtCommit
function assertCardPublishedAtCommit(
  repositoryRoot,
  catalogCommit,
  cardMigrationEvidence,
) {
  const slug = cardMigrationEvidence?.slug;

  if (
    typeof slug !== 'string'
    || !/^task-[0-9]{4}$/.test(slug)
  ) {
    fail('CardMigrationEvidence slug must be one immutable task-NNNN ID');
  }

  try {
    return gitValue(
      repositoryRoot,
      ['rev-parse', `${catalogCommit}:tasks/${slug}/README.md`],
    );
  } catch {
    fail(`${slug} is not published at catalog commit ${catalogCommit}`);
  }
}

function requireEvidenceShape(fullCatalogGateEvidence) {
  if (!sameKeys(
    fullCatalogGateEvidence,
    FULL_CATALOG_GATE_EVIDENCE_FIELDS,
  )) {
    fail(`FullCatalogGateEvidence must contain exactly ${FULL_CATALOG_GATE_EVIDENCE_FIELDS.join(', ')}`);
  }

  for (const field of FULL_CATALOG_GATE_EVIDENCE_FIELDS) {
    const value = fullCatalogGateEvidence[field];

    if (
      typeof value !== 'string'
      || value.trim() === ''
    ) {
      fail(`FullCatalogGateEvidence has an empty ${field}`);
    }
  }

  if (
    fullCatalogGateEvidence.policyPath !== policyPath
    || fullCatalogGateEvidence.catalogGatePath !== catalogGatePath
    || !allowedGateModes.has(fullCatalogGateEvidence.gateMode)
    || fullCatalogGateEvidence.verdict !== 'PASS'
  ) {
    fail('FullCatalogGateEvidence must identify the tracked policy, catalog gate, gate mode, and PASS');
  }

  if (
    !commitPattern.test(fullCatalogGateEvidence.catalogCommit)
    || !objectPattern.test(fullCatalogGateEvidence.catalogTree)
    || !objectPattern.test(fullCatalogGateEvidence.catalogGateBlob)
    || !digestPattern.test(fullCatalogGateEvidence.gateOutputSha256)
    || !digestPattern.test(fullCatalogGateEvidence.evidenceSha256)
  ) {
    fail('FullCatalogGateEvidence contains a malformed Git object or digest');
  }
}

// START_CONTRACT: runCatalogGateAtCommit
//   PURPOSE: Execute the selected wave or final catalog gate from an isolated archive of one exact commit.
//   INPUTS: { repositoryRoot: string, catalogCommit: string, gateMode: wave | final }
//   OUTPUTS: { CatalogGateExecution - Commit, tree, gate blob, mode, output digest, and PASS }
//   SIDE_EFFECTS: Creates and removes a narrow temporary archive directory; executes Git, tar, and Bash.
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION
// END_CONTRACT: runCatalogGateAtCommit
export function runCatalogGateAtCommit({
  repositoryRoot = defaultRepositoryRoot,
  catalogCommit,
  gateMode,
}) {
  if (!allowedGateModes.has(gateMode)) {
    fail(`unsupported catalog gate mode: ${String(gateMode)}`);
  }

  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const resolvedCommit = resolveCommit(
    resolvedRepositoryRoot,
    catalogCommit,
  );
  const catalogTree = gitValue(
    resolvedRepositoryRoot,
    ['rev-parse', `${resolvedCommit}^{tree}`],
  );
  const catalogGateBlob = gitValue(
    resolvedRepositoryRoot,
    ['rev-parse', `${resolvedCommit}:${catalogGatePath}`],
  );

  gitValue(
    resolvedRepositoryRoot,
    ['rev-parse', `${resolvedCommit}:${policyPath}`],
  );

  const archiveDirectory = mkdtempSync(
    join(tmpdir(), 'army97-catalog-gate-'),
  );

  try {
    const archive = execFileSync(
      'git',
      ['archive', '--format=tar', resolvedCommit],
      {
        cwd: resolvedRepositoryRoot,
        maxBuffer,
      },
    );
    const extract = spawnSync(
      'tar',
      ['-xf', '-', '-C', archiveDirectory],
      {
        input: archive,
        encoding: 'utf8',
        maxBuffer,
      },
    );

    if (extract.status !== 0) {
      fail(`catalog archive extraction failed: ${extract.stderr.trim()}`);
    }

    const archivedGatePath = join(archiveDirectory, catalogGatePath);

    if (!existsSync(archivedGatePath)) {
      fail(`catalog gate is missing from ${resolvedCommit}`);
    }

    let gateOutput;

    try {
      gateOutput = execFileSync(
        'bash',
        [catalogGatePath, '--mode', gateMode],
        {
          cwd: archiveDirectory,
          encoding: 'utf8',
          maxBuffer,
        },
      );
    } catch (error) {
      const details = [
        error.stdout?.toString().trim(),
        error.stderr?.toString().trim(),
      ].filter(Boolean).join('\n');

      fail(`catalog gate failed for ${resolvedCommit}${details ? `: ${details}` : ''}`);
    }

    let gateResult;

    try {
      gateResult = JSON.parse(gateOutput);
    } catch {
      fail(`catalog gate returned non-JSON output for ${resolvedCommit}`);
    }

    if (
      gateResult.catalogGate !== 'PASS'
      || gateResult.gateMode !== gateMode
    ) {
      fail(`catalog gate output does not certify ${gateMode} mode at ${resolvedCommit}`);
    }

    return {
      policyPath,
      catalogGatePath,
      catalogCommit: resolvedCommit,
      catalogTree,
      catalogGateBlob,
      gateMode,
      gateOutputSha256: sha256(gateOutput),
      verdict: 'PASS',
    };
  } finally {
    rmSync(archiveDirectory, { recursive: true, force: true });
  }
}

// START_CONTRACT: emitFullCatalogGateEvidence
//   PURPOSE: Emit durable evidence only after the current HEAD catalog gate succeeds.
//   INPUTS: { repositoryRoot: string, catalogCommit: string, gateMode: wave | final, cardMigrationEvidence: object }
//   OUTPUTS: { FullCatalogGateEvidence }
//   SIDE_EFFECTS: Executes the exact-commit catalog gate.
//   LINKS: Army97PublicationDecisionTransition, CardMigrationEvidence
// END_CONTRACT: emitFullCatalogGateEvidence
export function emitFullCatalogGateEvidence({
  repositoryRoot = defaultRepositoryRoot,
  catalogCommit,
  gateMode,
  cardMigrationEvidence,
}) {
  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const resolvedCommit = resolveCommit(
    resolvedRepositoryRoot,
    catalogCommit,
  );
  const headCommit = resolveCommit(resolvedRepositoryRoot, 'HEAD');

  if (resolvedCommit !== headCommit) {
    fail(`FullCatalogGateEvidence must be emitted for current HEAD ${headCommit}, not ancestor ${resolvedCommit}`);
  }

  const execution = runCatalogGateAtCommit({
    repositoryRoot: resolvedRepositoryRoot,
    catalogCommit: resolvedCommit,
    gateMode,
  });
  assertCardPublishedAtCommit(
    resolvedRepositoryRoot,
    resolvedCommit,
    cardMigrationEvidence,
  );

  return {
    ...execution,
    evidenceSha256: evidenceDigest(execution, cardMigrationEvidence),
  };
}

// START_CONTRACT: verifyFullCatalogGateEvidence
//   PURPOSE: Re-execute the current HEAD catalog gate and compare its causal receipt.
//   INPUTS: { repositoryRoot: string, cardMigrationEvidence: object, fullCatalogGateEvidence: object }
//   OUTPUTS: { true }
//   SIDE_EFFECTS: Executes the exact-commit catalog gate.
//   LINKS: V-M-TASK-VALIDATION, Army97PublicationDecisionTransition
// END_CONTRACT: verifyFullCatalogGateEvidence
export function verifyFullCatalogGateEvidence({
  repositoryRoot = defaultRepositoryRoot,
  cardMigrationEvidence,
  fullCatalogGateEvidence,
}) {
  requireEvidenceShape(fullCatalogGateEvidence);

  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const headCommit = resolveCommit(resolvedRepositoryRoot, 'HEAD');

  if (fullCatalogGateEvidence.catalogCommit !== headCommit) {
    fail(`FullCatalogGateEvidence catalogCommit must equal current HEAD ${headCommit}`);
  }

  const execution = runCatalogGateAtCommit({
    repositoryRoot: resolvedRepositoryRoot,
    catalogCommit: fullCatalogGateEvidence.catalogCommit,
    gateMode: fullCatalogGateEvidence.gateMode,
  });
  assertCardPublishedAtCommit(
    resolvedRepositoryRoot,
    fullCatalogGateEvidence.catalogCommit,
    cardMigrationEvidence,
  );

  for (const field of FULL_CATALOG_GATE_EVIDENCE_FIELDS.slice(0, -1)) {
    if (fullCatalogGateEvidence[field] !== execution[field]) {
      fail(`FullCatalogGateEvidence ${field} does not match the executed catalog gate`);
    }
  }

  const expectedDigest = evidenceDigest(
    execution,
    cardMigrationEvidence,
  );

  if (fullCatalogGateEvidence.evidenceSha256 !== expectedDigest) {
    fail('FullCatalogGateEvidence evidenceSha256 does not match the executed gate and CardMigrationEvidence');
  }

  return true;
}

function parseArguments(args) {
  const parsed = {
    repositoryRoot: defaultRepositoryRoot,
    catalogCommit: undefined,
    cardEvidenceFile: undefined,
    gateMode: undefined,
    verifyOnly: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--repository') {
      parsed.repositoryRoot = args[index + 1];
      index += 1;
    } else if (argument === '--commit') {
      parsed.catalogCommit = args[index + 1];
      index += 1;
    } else if (argument === '--mode') {
      parsed.gateMode = args[index + 1];
      index += 1;
    } else if (argument === '--card-evidence-file') {
      parsed.cardEvidenceFile = args[index + 1];
      index += 1;
    } else if (argument === '--verify-only') {
      parsed.verifyOnly = true;
    } else {
      fail(`unsupported argument: ${argument}`);
    }
  }

  if (!parsed.catalogCommit) {
    fail('--commit is required');
  }

  if (!allowedGateModes.has(parsed.gateMode)) {
    fail('--mode must be wave or final');
  }

  if (!parsed.verifyOnly && !parsed.cardEvidenceFile) {
    fail('use --verify-only or provide --card-evidence-file');
  }

  if (parsed.verifyOnly && parsed.cardEvidenceFile) {
    fail('--verify-only and --card-evidence-file are mutually exclusive');
  }

  return parsed;
}

// START_CONTRACT: run
//   PURPOSE: Run the exact-commit wave or final catalog gate and print a verification or card evidence receipt.
//   INPUTS: { args: string[] - CLI arguments }
//   OUTPUTS: { CatalogGateExecution | FullCatalogGateEvidence }
//   SIDE_EFFECTS: Executes the catalog gate and writes one JSON record to stdout.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: run
export function run(args = process.argv.slice(2)) {
  const parsed = parseArguments(args);
  const result = parsed.verifyOnly
    ? runCatalogGateAtCommit({
      repositoryRoot: parsed.repositoryRoot,
      catalogCommit: parsed.catalogCommit,
      gateMode: parsed.gateMode,
    })
    : emitFullCatalogGateEvidence({
      repositoryRoot: parsed.repositoryRoot,
      catalogCommit: parsed.catalogCommit,
      gateMode: parsed.gateMode,
      cardMigrationEvidence: JSON.parse(
        readFileSync(resolve(parsed.cardEvidenceFile), 'utf8'),
      ),
    });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === modulePath) {
  try {
    run();
  } catch (error) {
    process.stderr.write(`ARMY-97 catalog gate failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
