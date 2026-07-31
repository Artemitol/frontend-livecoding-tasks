// FILE: docs/scripts/validate-army-97-catalog.test.mjs
// VERSION: 2.5.0
// START_MODULE_CONTRACT
//   PURPOSE: Prove the production ARMY-97 catalog gate separates valid serialized waves from the strict final inventory certificate.
//   SCOPE: Real Bash 3 production-gate execution against controlled wave/final catalogs plus duration, starter-only pure/browser TypeScript editor routing, exact thematic-row grammar, format-driven real-work membership, malformed, and bounded provenance probes.
//   DEPENDS: node:test, Bash 3+, docs/scripts/validate-army-97-catalog.sh, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createInventoryFixture - Create controlled task IDs and thematic projections without full card bodies.
//   createWaveCatalogFixture - Create the closed legacy inventory plus one current ARMY-97 wave and its optional real-work projection.
//   createCompleteCatalogFixture - Create a complete synthetic 118-card and 30-simulation catalog.
//   runProductionCatalogGate - Execute the tracked production Bash gate against one fixture.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v2.5.0 - Cover extended browser TypeScript globals, prose-only browser words, and literal authorization headers.
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
const legacyTaskSlugs = [
  'accessible-keyboard-tabs',
  'browser-event-loop-order',
  'container-responsive-grid',
  'delegated-dynamic-list',
  'discriminated-load-state',
  'flex-long-text-overflow',
  'idempotent-event-listeners',
  'immutable-category-totals',
  'loop-closure-bindings',
  'modal-focus-lifecycle',
  'react-batched-counter',
  'react-derived-list',
  'react-effect-subscription',
  'react-strictmode-cleanup',
  'response-union-narrowing',
  'stable-product-sort',
  'stale-search-response',
  'this-callback-binding',
  'typed-object-property',
  'users-api-list',
  'validate-unknown-profile',
];
const legacyThematicPaths = [
  'collections/html-css/accessibility/README.md',
  'collections/html-css/layout/README.md',
  'collections/javascript/arrays-and-objects/README.md',
  'collections/javascript/dom-and-events/README.md',
  'collections/javascript/event-loop-and-async/README.md',
  'collections/javascript/this-and-closures/README.md',
  'collections/react/effects-and-lifecycle/README.md',
  'collections/react/state-and-derived-data/README.md',
  'collections/typescript/narrowing-and-validation/README.md',
  'collections/typescript/type-modeling/README.md',
];
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
const editorProfiles = {
  Programiz: {
    name: 'Programiz',
    url: 'https://www.programiz.com/javascript/online-compiler/',
  },
  CodePen: {
    name: 'CodePen',
    url: 'https://pen.new',
  },
  TypeScriptPlayground: {
    name: 'TypeScript Playground',
    url: 'https://www.typescriptlang.org/play/',
  },
  ReactTypeScript: {
    name: 'React TypeScript',
    url: 'https://vite.new/react-ts',
  },
};

function range(first, last) {
  return Array.from(
    { length: last - first + 1 },
    (_, index) => first + index,
  );
}

function taskId(number) {
  return `task-${String(number).padStart(4, '0')}`;
}

function editorProfileForTechnology(technology) {
  if (technology === 'TypeScript') {
    return editorProfiles.TypeScriptPlayground;
  }

  if (technology === 'React/TypeScript') {
    return editorProfiles.ReactTypeScript;
  }

  if (technology.startsWith('HTML/')) {
    return editorProfiles.CodePen;
  }

  return editorProfiles.Programiz;
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

function collectionEntry(
  number,
  {
    prefix = '',
    title = `Task ${String(number).padStart(4, '0')}`,
    description = 'Решите одну изолированную задачу.',
    duration = '15 минут',
    suffix = '',
  } = {},
) {
  const id = taskId(number);

  return `${prefix}1. [${title}](../../../tasks/${id}/README.md) — ${description} — ${duration}${suffix}`;
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

function cardFixture(
  number,
  collection,
  {
    duration = '15 минут',
    editorProfile = editorProfileForTechnology(collection.technology),
    format = 'Написать код',
    starterOverride,
    solutionExplanation = '',
  } = {},
) {
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
  const starterValue = starterOverride ?? (language === 'html'
    ? '<button>Task</button>'
    : 'const value = 1;');

  return [
    `# Task ${paddedNumber}`,
    '',
    `Песочница для выполнения — [${editorProfile.name}](${editorProfile.url}).`,
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
    solutionExplanation,
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
    `- Формат: ${format}`,
    '- Сложность: Базовая',
    `- Примерное время: ${duration}`,
    '',
    '</details>',
    '',
  ].join('\n');
}

// START_CONTRACT: createWaveCatalogFixture
//   PURPOSE: Create the closed legacy catalog plus one controlled ARMY-97 wave prefix.
//   INPUTS: { armyTaskNumbers?: number[], referencedArmyTaskNumbers?: number[], realWorkTaskNumbers?: number[], malformedTaskNumber?: number, duplicateArmyTaskNumber?: number }
//   OUTPUTS: { string - Temporary repository root }
//   SIDE_EFFECTS: Creates legacy cards, current-wave cards, thematic projections, and the real-work projection.
//   LINKS: V-M-TASK-VALIDATION, M-TASK-LIBRARY, M-CATALOG
// END_CONTRACT: createWaveCatalogFixture
function createWaveCatalogFixture({
  armyTaskNumbers = range(1, 10),
  referencedArmyTaskNumbers = armyTaskNumbers,
  realWorkTaskNumbers = [],
  malformedTaskNumber,
  duplicateArmyTaskNumber,
  cardDuration = '15 минут',
  cardDurationByNumber = {},
  armyCollection = controlledCollections[2],
  defaultCardOptions = {},
  cardOptionsByNumber = {},
  collectionEntryOptionsByNumber = {},
} = {}) {
  const repositoryRoot = createFixtureRoot();

  writeFixtureFile(repositoryRoot, 'README.md', '# Wave catalog\n');
  writeFixtureFile(
    repositoryRoot,
    'collections/real-work/README.md',
    [
      '# Real-work tasks',
      '',
      ...realWorkTaskNumbers.map((number) => (
        `1. [Task ${String(number).padStart(4, '0')}](../../tasks/${taskId(number)}/README.md) — 15 минут`
      )),
      '',
    ].join('\n'),
  );

  for (const slug of legacyTaskSlugs) {
    writeFixtureFile(
      repositoryRoot,
      `tasks/${slug}/README.md`,
      `# Legacy ${slug}\n`,
    );
  }

  legacyThematicPaths.forEach((collectionPath, index) => {
    const assignedSlugs = legacyTaskSlugs.filter(
      (_, taskIndex) => taskIndex % legacyThematicPaths.length === index,
    );

    writeFixtureFile(
      repositoryRoot,
      collectionPath,
      [
        `# Legacy collection ${index + 1}`,
        '',
        ...assignedSlugs.map(
          (slug) => `[${slug}](../../../tasks/${slug}/README.md) — 15 минут`,
        ),
        '',
      ].join('\n'),
    );
  });

  for (const number of armyTaskNumbers) {
    writeFixtureFile(
      repositoryRoot,
      `tasks/${taskId(number)}/README.md`,
      number === malformedTaskNumber
        ? '# Malformed ARMY-97 card\n'
        : cardFixture(number, armyCollection, {
          ...defaultCardOptions,
          ...cardOptionsByNumber[number],
          duration: cardDurationByNumber[number] ?? cardDuration,
        }),
    );
  }

  writeFixtureFile(
    repositoryRoot,
    armyCollection.path,
    [
      `# ${armyCollection.name}`,
      '',
      ...referencedArmyTaskNumbers.map((number) => collectionEntry(
        number,
        collectionEntryOptionsByNumber[number],
      )),
      '',
    ].join('\n'),
  );

  if (duplicateArmyTaskNumber !== undefined) {
    const duplicateCollection = controlledCollections[0];

    writeFixtureFile(
      repositoryRoot,
      duplicateCollection.path,
      [
        `# ${duplicateCollection.name}`,
        '',
        collectionEntry(duplicateArmyTaskNumber),
        '',
      ].join('\n'),
    );
  }

  return repositoryRoot;
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
//   INPUTS: { repositoryRoot: string, gateMode?: wave | final }
//   OUTPUTS: { SpawnSyncReturns<string> }
//   SIDE_EFFECTS: Executes Bash without mutating the fixture.
//   LINKS: V-M-TASK-VALIDATION
// END_CONTRACT: runProductionCatalogGate
function runProductionCatalogGate(repositoryRoot, gateMode = 'final') {
  return spawnSync('bash', [productionCatalogGate, '--mode', gateMode], {
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
test('accepts the exact legacy catalog plus one complete serialized wave', () => {
  const repositoryRoot = createWaveCatalogFixture();

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
  assert.equal(
    result.stdout,
    '{"catalogGate":"PASS","gateMode":"wave","tasks":31,"legacyCards":21,"publishedArmyCards":10,"covered":31,"orphans":0,"thematicErrors":0}\n',
  );
});

test('rejects a partial serialized wave prefix', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyTaskNumbers: range(1, 9),
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /complete serialized ARMY-97 wave prefix/,
  );
});

test('rejects a malformed published ARMY-97 card during a wave', () => {
  const repositoryRoot = createWaveCatalogFixture({
    malformedTaskNumber: 5,
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /failed ARMY-97 card contract/,
  );
});

test('accepts the canonical N минут card duration', () => {
  const repositoryRoot = createWaveCatalogFixture();

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects a digits-only card duration', () => {
  const repositoryRoot = createWaveCatalogFixture({
    cardDuration: '15',
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /failed ARMY-97 card contract/,
  );
});

test('accepts the exact editor profile mapped from card technology', () => {
  const repositoryRoot = createWaveCatalogFixture();

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects React TypeScript published with Programiz', () => {
  const repositoryRoot = createWaveCatalogFixture({
    cardOptionsByNumber: {
      1: {
        editorProfile: editorProfiles.Programiz,
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /technology and editor profile/);
});

test('accepts TypeScript Playground for pure TypeScript', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[1],
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects CodePen for pure TypeScript without browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[1],
    defaultCardOptions: {
      editorProfile: editorProfiles.CodePen,
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /technology and editor profile/);
});

test('accepts CodePen for TypeScript that uses browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[1],
    defaultCardOptions: {
      editorProfile: editorProfiles.CodePen,
      starterOverride: "const value: HTMLElement | null = document.querySelector('#value');",
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects TypeScript Playground for TypeScript that uses browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[1],
    defaultCardOptions: {
      editorProfile: editorProfiles.TypeScriptPlayground,
      starterOverride: "const value: HTMLElement | null = document.querySelector('#value');",
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /technology and editor profile/);
});

for (const [browserGlobal, starterOverride] of [
  ['EventTarget', 'declare const target: EventTarget;'],
  ['Document', 'declare const page: Document;'],
  ['WebSocket', 'declare const socket: WebSocket;'],
]) {
  test(`accepts CodePen for TypeScript starter using ${browserGlobal}`, () => {
    const repositoryRoot = createWaveCatalogFixture({
      armyCollection: controlledCollections[1],
      defaultCardOptions: {
        editorProfile: editorProfiles.CodePen,
        starterOverride,
      },
    });

    const result = runProductionCatalogGate(repositoryRoot, 'wave');

    assert.equal(
      result.status,
      0,
      `${result.stdout}\n${result.stderr}`.slice(-8_000),
    );
  });
}

test('keeps prose-only document and window references in TypeScript Playground', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[1],
    defaultCardOptions: {
      editorProfile: editorProfiles.TypeScriptPlayground,
      solutionExplanation:
        'В объяснении упомянуты document и window, но starter остаётся pure TypeScript.',
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('accepts CodePen for JavaScript that uses browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[0],
    defaultCardOptions: {
      editorProfile: editorProfiles.CodePen,
      starterOverride: "const value = document.querySelector('#value');",
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects Programiz for JavaScript that uses browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[0],
    defaultCardOptions: {
      editorProfile: editorProfiles.Programiz,
      starterOverride: "const value = document.querySelector('#value');",
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /technology and editor profile/);
});

test('rejects CodePen for console JavaScript without browser APIs', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[0],
    defaultCardOptions: {
      editorProfile: editorProfiles.CodePen,
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /technology and editor profile/);
});

test('accepts one CodePen JavaScript real-work card in the real-work collection', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[0],
    realWorkTaskNumbers: [1],
    cardOptionsByNumber: {
      1: {
        editorProfile: editorProfiles.CodePen,
        format: 'Приближённая к реальной работе',
        starterOverride: "const value = document.querySelector('#value');",
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects a focused card referenced by the real-work collection', () => {
  const repositoryRoot = createWaveCatalogFixture({
    realWorkTaskNumbers: [1],
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /focused card must not appear in the real-work collection/);
});

test('rejects duplicate real-work rows for one real-work card', () => {
  const repositoryRoot = createWaveCatalogFixture({
    armyCollection: controlledCollections[0],
    realWorkTaskNumbers: [1, 1],
    cardOptionsByNumber: {
      1: {
        editorProfile: editorProfiles.CodePen,
        format: 'Приближённая к реальной работе',
        starterOverride: "const value = document.querySelector('#value');",
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /real-work format must appear exactly once/);
});

test('accepts exact collection row grammar with a substantive Russian sentence', () => {
  const repositoryRoot = createWaveCatalogFixture();

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
});

test('rejects an arbitrary prefix before a collection row', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        prefix: 'Injected prefix ',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects a punctuation-only collection description', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        description: '.',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects an extra field in a collection row', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        description: 'Решите задачу — лишнее поле.',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects a suffix after a collection row', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        suffix: ' trailing suffix',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects a collection row with a missing description', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        description: '',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects a collection row whose linked title differs from the card title', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        title: 'Wrong student title',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects a collection row whose time differs from card metadata', () => {
  const repositoryRoot = createWaveCatalogFixture({
    collectionEntryOptionsByNumber: {
      1: {
        duration: '20 минут',
      },
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collection row/);
});

test('rejects duplicate thematic membership across the current catalog', () => {
  const repositoryRoot = createWaveCatalogFixture({
    duplicateArmyTaskNumber: 1,
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /exactly one thematic collection/,
  );
});

test('rejects an orphaned task across the current thematic catalog', () => {
  const repositoryRoot = createWaveCatalogFixture({
    referencedArmyTaskNumbers: range(1, 9),
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /exactly one thematic collection/,
  );
});

test('rejects a collection reference to an unpublished ARMY-97 ID', () => {
  const repositoryRoot = createWaveCatalogFixture({
    referencedArmyTaskNumbers: [...range(1, 10), 11],
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /unpublished task card/,
  );
});

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
  assert.equal(
    result.stdout,
    '{"catalogGate":"PASS","gateMode":"final","tasks":118,"legacyCards":0,"publishedArmyCards":118,"covered":118,"orphans":0,"thematicErrors":0}\n',
  );
});

test('accepts a literal Authorization header without treating it as provenance', () => {
  const repositoryRoot = createWaveCatalogFixture({
    defaultCardOptions: {
      starterOverride:
        "const headers = { Authorization: 'Bearer local-token' };",
    },
  });

  const result = runProductionCatalogGate(repositoryRoot, 'wave');

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`.slice(-8_000),
  );
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
