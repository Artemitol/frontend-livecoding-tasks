// FILE: docs/scripts/validate-army-97-catalog.test.mjs
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Prove the production ARMY-97 catalog gate certifies the exact final inventory and scans nested collection content.
//   SCOPE: Real Bash 3 production-gate execution against controlled partial, malformed, complete, and provenance-tainted catalogs.
//   DEPENDS: node:test, Bash 3+, docs/scripts/validate-army-97-catalog.sh, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createInventoryFixture - Create controlled task IDs and thematic projections without full card bodies.
//   createCompleteCatalogFixture - Create a complete synthetic 118-card and 30-simulation catalog.
//   runProductionCatalogGate - Execute the tracked production Bash gate against one fixture.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v1.0.0 - Add exact-inventory and nested-provenance production-gate regressions.
// END_CHANGE_SUMMARY

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const productionCatalogGate = fileURLToPath(
  new URL('./validate-army-97-catalog.sh', import.meta.url),
);
const temporaryRoots = [];
const controlledCollections = [
  {
    path: 'collections/javascript/interview-practice/README.md',
    name: 'JavaScript interview practice',
    technology: 'JavaScript',
    taskIds: range(1, 92),
  },
  {
    path: 'collections/typescript/interview-practice/README.md',
    name: 'TypeScript interview practice',
    technology: 'TypeScript',
    taskIds: range(93, 100),
  },
  {
    path: 'collections/react/interview-practice/README.md',
    name: 'React interview practice',
    technology: 'React/TypeScript',
    taskIds: range(101, 116),
  },
  {
    path: 'collections/html-css/interview-practice/README.md',
    name: 'HTML/CSS interview practice',
    technology: 'HTML/CSS',
    taskIds: range(117, 118),
  },
];

function range(first, last) {
  return Array.from(
    { length: last - first + 1 },
    (_, index) => first + index,
  );
}

function taskId(number) {
  return `task-${String(number).padStart(4, '0')}`;
}

function writeFixtureFile(repositoryRoot, relativePath, content) {
  const absolutePath = join(repositoryRoot, relativePath);

  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function createFixtureRoot() {
  const repositoryRoot = mkdtempSync(
    join(tmpdir(), 'army97-production-catalog-test-'),
  );

  temporaryRoots.push(repositoryRoot);
  return repositoryRoot;
}

function collectionEntry(number) {
  const id = taskId(number);

  return `[Task ${String(number).padStart(4, '0')}](../../../tasks/${id}/README.md) — 15 минут`;
}

function writeControlledCollections(repositoryRoot, collections) {
  for (const collection of collections) {
    writeFixtureFile(
      repositoryRoot,
      collection.path,
      [
        `# ${collection.name}`,
        '',
        ...collection.taskIds.map(collectionEntry),
        '',
      ].join('\n'),
    );
  }
}

// START_CONTRACT: createInventoryFixture
//   PURPOSE: Create an inventory that reaches one exact production preflight predicate.
//   INPUTS: { taskNumbers: number[], collections?: object[], unexpectedThematicPath?: string }
//   OUTPUTS: { string - Temporary repository root }
//   SIDE_EFFECTS: Creates temporary task and collection files.
//   LINKS: V-M-TASK-VALIDATION, M-CATALOG
// END_CONTRACT: createInventoryFixture
function createInventoryFixture({
  taskNumbers,
  collections = [],
  unexpectedThematicPath,
}) {
  const repositoryRoot = createFixtureRoot();

  for (const number of taskNumbers) {
    writeFixtureFile(
      repositoryRoot,
      `tasks/${taskId(number)}/README.md`,
      '# Incomplete test card\n',
    );
  }

  writeControlledCollections(repositoryRoot, collections);

  if (unexpectedThematicPath) {
    writeFixtureFile(
      repositoryRoot,
      unexpectedThematicPath,
      '# Unexpected thematic projection\n',
    );
  }

  return repositoryRoot;
}

function cardFixture(number, collection) {
  const paddedNumber = String(number).padStart(4, '0');
  const language = collection.technology === 'TypeScript'
    ? 'typescript'
    : collection.technology === 'React/TypeScript'
      ? 'tsx'
      : collection.technology === 'HTML/CSS'
        ? 'html'
        : 'javascript';
  const starterComment = language === 'html'
    ? '<!-- Complete the fragment. -->'
    : '// Complete the value.';
  const starterValue = language === 'html'
    ? '<button>Task</button>'
    : 'const value = 1;';

  return [
    `# Task ${paddedNumber}`,
    '',
    'Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).',
    '',
    '## Условие',
    `\`\`\`${language}`,
    starterComment,
    starterValue,
    '```',
    '',
    '<details>',
    '<summary>Подсказка 1 — куда смотреть</summary>',
    '',
    'Проверьте исходное значение.',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Подсказка 2 — с чего начать</summary>',
    '',
    'Сначала измените одну строку.',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Подсказка 3 — почти решение</summary>',
    '',
    'Используйте значение `2`.',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Решение</summary>',
    '',
    `\`\`\`${language}`,
    language === 'html' ? '<button>Ready</button>' : 'const value = 2;',
    '```',
    '',
    'Ожидаемый результат: значение изменено.',
    '',
    'Проверка: сравните результат с условием.',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>О задаче</summary>',
    '',
    `- Технология: ${collection.technology}`,
    `- Подборка: ${collection.name}`,
    '- Формат: Написать код',
    '- Сложность: Базовая',
    '- Примерное время: 15',
    '',
    '</details>',
    '',
  ].join('\n');
}

// START_CONTRACT: createCompleteCatalogFixture
//   PURPOSE: Create the smallest complete synthetic catalog accepted by every production-gate layer.
//   INPUTS: { nestedProvenance?: string }
//   OUTPUTS: { string - Temporary repository root }
//   SIDE_EFFECTS: Creates 118 cards, four thematic projections, 30 simulations, and local indexes.
//   LINKS: V-M-TASK-VALIDATION, M-TASK-LIBRARY, M-CATALOG
// END_CONTRACT: createCompleteCatalogFixture
function createCompleteCatalogFixture({ nestedProvenance = '' } = {}) {
  const repositoryRoot = createFixtureRoot();

  writeFixtureFile(
    repositoryRoot,
    'README.md',
    [
      '# Test catalog',
      '',
      '[Симуляции собеседований](collections/interviews/README.md)',
      '',
    ].join('\n'),
  );
  writeControlledCollections(repositoryRoot, controlledCollections);
  writeFixtureFile(
    repositoryRoot,
    'collections/real-work/README.md',
    '# Real-work tasks\n',
  );

  for (const collection of controlledCollections) {
    for (const number of collection.taskIds) {
      writeFixtureFile(
        repositoryRoot,
        `tasks/${taskId(number)}/README.md`,
        cardFixture(number, collection),
      );
    }
  }

  const simulationIndex = ['# Симуляции собеседований', ''];
  const nonJavaScriptTasks = range(93, 118);

  for (let index = 0; index < 30; index += 1) {
    const simulationNumber = index + 1;
    const simulationId = String(simulationNumber).padStart(3, '0');
    const taskNumbers = [
      simulationNumber,
      nonJavaScriptTasks[index % nonJavaScriptTasks.length],
    ];
    const taskLinks = taskNumbers.map((number) => {
      const id = taskId(number);

      return `[Task ${String(number).padStart(4, '0')}](../../../tasks/${id}/README.md) — 15 минут`;
    });

    simulationIndex.push(
      `[Симуляция собеседования №${simulationNumber}](simulation-${simulationId}/README.md) — 30 минут`,
    );
    writeFixtureFile(
      repositoryRoot,
      `collections/interviews/simulation-${simulationId}/README.md`,
      [
        `# Симуляция собеседования №${simulationNumber}`,
        '',
        'Реализм: x+ два задания из разных тематических подборок.',
        '',
        'Общее время: 30 минут',
        '',
        ...taskLinks,
        '',
        simulationNumber === 1 ? nestedProvenance : '',
        '',
      ].join('\n'),
    );
  }

  writeFixtureFile(
    repositoryRoot,
    'collections/interviews/README.md',
    `${simulationIndex.join('\n')}\n`,
  );

  return repositoryRoot;
}

// START_CONTRACT: runProductionCatalogGate
//   PURPOSE: Execute the tracked production Bash gate in one controlled catalog root.
//   INPUTS: { repositoryRoot: string }
//   OUTPUTS: { SpawnSyncReturns<string> }
//   SIDE_EFFECTS: Executes Bash without mutating the fixture.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: runProductionCatalogGate
function runProductionCatalogGate(repositoryRoot) {
  return spawnSync('bash', [productionCatalogGate], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
}

test.after(() => {
  for (const repositoryRoot of temporaryRoots) {
    rmSync(repositoryRoot, { recursive: true, force: true });
  }
});

// START_BLOCK_PRODUCTION_CATALOG_GATE_PROBES
test('rejects a partial task catalog at the exact inventory boundary', () => {
  const repositoryRoot = createInventoryFixture({
    taskNumbers: [1],
  });

  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /expected exactly 118 task cards; found 1/,
  );
});

test('rejects a 118-card catalog whose immutable task range has a gap', () => {
  const repositoryRoot = createInventoryFixture({
    taskNumbers: [...range(1, 117), 119],
  });

  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /expected contiguous task-0001 through task-0118/,
  );
});

test('rejects thematic counts that drift from the frozen registry', () => {
  const driftedCollections = structuredClone(controlledCollections);

  driftedCollections[0].taskIds = range(1, 91);
  driftedCollections[1].taskIds = range(92, 100);

  const repositoryRoot = createInventoryFixture({
    taskNumbers: range(1, 118),
    collections: driftedCollections,
  });

  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /expected 92 task links in collections\/javascript\/interview-practice\/README\.md; found 91/,
  );
});

test('rejects an unexpected thematic collection path', () => {
  const repositoryRoot = createInventoryFixture({
    taskNumbers: range(1, 118),
    collections: controlledCollections,
    unexpectedThematicPath: 'collections/javascript/legacy/README.md',
  });

  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /unexpected thematic collection paths/,
  );
});

test('accepts a complete controlled production catalog fixture', () => {
  const repositoryRoot = createCompleteCatalogFixture();

  const result = runProductionCatalogGate(repositoryRoot);

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
  assert.equal(result.stdout, '{"catalogGate":"PASS"}\n');
});

test('rejects prohibited provenance in a nested simulation under Bash 3', () => {
  const repositoryRoot = createCompleteCatalogFixture({
    nestedProvenance: 'imported from a source repository',
  });

  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /imported from a source repository/,
  );
});
// END_BLOCK_PRODUCTION_CATALOG_GATE_PROBES
