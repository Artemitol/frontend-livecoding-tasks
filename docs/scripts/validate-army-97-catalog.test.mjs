// FILE: docs/scripts/validate-army-97-catalog.test.mjs
// VERSION: 2.6.1
// START_MODULE_CONTRACT
//   PURPOSE: Prove the production ARMY-97 catalog gate separates valid serialized waves from the strict final inventory certificate.
//   SCOPE: Real Bash 3 production-gate execution against controlled wave/final catalogs plus frozen master/topic registry, visible-ID, wording, three-topic simulation, editor-routing, real-work, malformed, and provenance probes.
//   DEPENDS: node:test, Bash 3+, docs/scripts/validate-army-97-catalog.sh, M-TASK-VALIDATION
//   LINKS: M-TASK-VALIDATION, V-M-TASK-VALIDATION, M-CATALOG
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createInventoryFixture - Create controlled task IDs and thematic projections without full card bodies.
//   createWaveCatalogFixture - Create the closed legacy inventory plus one current ARMY-97 wave and its optional real-work projection.
//   createCompleteTopicCatalogFixture - Create a complete synthetic 118-card catalog with 23 topic pages and 30 simulations.
//   runProductionCatalogGate - Execute the tracked production Bash gate against one fixture.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v2.6.1 - Cover exact master rows, frozen third-task projection, and real-work link titles.
// END_CHANGE_SUMMARY

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
  ['javascript', 'JavaScript', 'event-loop', 'Event loop и очереди задач', [15, 16, 18, 19, 20, 23, 25]],
  ['javascript', 'JavaScript', 'promises-and-async', 'Promise и async/await', [17, 21, 22, 24, 26, 27, 28, 29, 51, 59]],
  ['javascript', 'JavaScript', 'prototypes-inheritance-and-this', 'Прототипы, наследование и `this`', [30, 31, 32, 34, 35, 36]],
  ['javascript', 'JavaScript', 'functions-closures-and-scope', 'Функции, замыкания и область видимости', [39, 47, 52, 60, 61, 62, 65, 66, 68, 69, 70, 71, 72, 113]],
  ['javascript', 'JavaScript', 'objects-and-collections', 'Объекты и коллекции', [33, 40, 41, 42, 43, 44, 45, 50, 118]],
  ['javascript', 'JavaScript', 'dom-and-events', 'DOM и события', [48, 58, 67]],
  ['javascript', 'JavaScript', 'dates-and-time-intervals', 'Даты и временные интервалы', [37, 53, 54]],
  ['javascript', 'JavaScript', 'arrays-search-and-sorting', 'Массивы, поиск и сортировка', [46, 82, 83, 84, 87, 88, 90, 95, 100]],
  ['javascript', 'JavaScript', 'strings', 'Строки', [85, 86, 97, 98, 99]],
  ['javascript', 'JavaScript', 'trees-and-recursion', 'Деревья и рекурсия', [73, 74, 75, 76, 77, 78, 79, 80, 81, 91, 96]],
  ['javascript', 'JavaScript', 'graphs', 'Графы', [55, 56]],
  ['javascript', 'JavaScript', 'linked-lists-and-stack', 'Связные списки и стек', [64, 89, 92, 93, 94]],
  ['javascript', 'JavaScript', 'numbers-types-and-operators', 'Числа, типы и операторы', [109, 110, 111, 112, 114, 115, 116, 117]],
  ['typescript', 'TypeScript', 'generics-and-object-keys', 'Дженерики и ключи объектов', [38, 102, 106]],
  ['typescript', 'TypeScript', 'mapped-and-conditional-types', 'Mapped и conditional types', [101, 103, 105]],
  ['typescript', 'TypeScript', 'recursive-types', 'Рекурсивные типы', [104]],
  ['typescript', 'TypeScript', 'integration-typing', 'Типизация интеграций', [57]],
  ['react', 'React', 'state-and-event-handlers', 'Состояние и обработчики событий', [9, 63]],
  ['react', 'React', 'effects-timers-and-cleanup', 'Эффекты, таймеры и очистка', [1, 5, 14]],
  ['react', 'React', 'rendering-and-memoization', 'Рендеринг и мемоизация', [2, 3, 7]],
  ['react', 'React', 'async-data-and-ui-states', 'Асинхронные данные и состояния интерфейса', [4, 6, 8, 10]],
  ['react', 'React', 'component-composition-and-state-management', 'Композиция компонентов и управление состоянием', [11, 12, 13, 49]],
  ['html-css', 'HTML/CSS', 'cascade-and-selectors', 'Каскад и селекторы', [107, 108]],
].map(([masterSlug, masterName, topicSlug, topicName, taskIds]) => ({
  masterSlug,
  masterName,
  topicSlug,
  topicName,
  name: `${masterName} → ${topicName}`,
  path: `collections/${masterSlug}/${topicSlug}/README.md`,
  technology: masterName === 'React' ? 'React/TypeScript' : masterName,
  taskIds,
}));
const waveCollections = [
  {
    path: 'collections/javascript/interview-practice/README.md',
    name: 'JavaScript interview practice',
    technology: 'JavaScript',
  },
  {
    path: 'collections/typescript/interview-practice/README.md',
    name: 'TypeScript interview practice',
    technology: 'TypeScript',
  },
  {
    path: 'collections/react/interview-practice/README.md',
    name: 'React interview practice',
    technology: 'React/TypeScript',
  },
  {
    path: 'collections/html-css/interview-practice/README.md',
    name: 'HTML/CSS interview practice',
    technology: 'HTML/CSS',
  },
];
const frozenSimulationThirdTasks = [
  33, 16, 30, 65, 87, 98, 109, 67, 74, 89,
  37, 63, 31, 44, 100, 66, 111, 77, 85, 92,
  32, 45, 68, 112, 80, 82, 97, 93, 35, 114,
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
    title = `${taskId(number)} — Task ${String(number).padStart(4, '0')}`,
    description = 'Решите одну изолированную задачу.',
    duration = '15 минут',
    suffix = '',
  } = {},
) {
  const id = taskId(number);

  return `${prefix}1. [${title}](../../../tasks/${id}/README.md) — Базовая · ${duration} — ${description}${suffix}`;
}

function writeControlledCollections(repositoryRoot, collections) {
  for (const collection of collections) {
    writeFixtureFile(
      repositoryRoot,
      collection.path,
      [
        `# ${collection.name}`,
        '',
        `[Главная](../../../README.md) → [${collection.masterName}](../README.md) → ${collection.topicName}`,
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
    `# task-${paddedNumber} — Task ${paddedNumber}`,
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
  armyCollection = waveCollections[2],
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
    const duplicateCollection = waveCollections[0];

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

// START_CONTRACT: createCompleteTopicCatalogFixture
//   PURPOSE: Create the smallest complete synthetic catalog accepted by every production-gate layer.
//   INPUTS: { nestedProvenance?: string }
//   OUTPUTS: { string - Temporary repository root }
//   SIDE_EFFECTS: Creates 118 cards, four master indexes, 23 topic projections, 30 simulations, and local indexes.
//   LINKS: V-M-TASK-VALIDATION, M-TASK-LIBRARY, M-CATALOG
// END_CONTRACT: createCompleteTopicCatalogFixture
function createCompleteTopicCatalogFixture({ nestedProvenance = '' } = {}) {
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
  const masters = [...new Map(
    controlledCollections.map((collection) => [
      collection.masterSlug,
      collection,
    ]),
  ).values()];

  for (const master of masters) {
    const topics = controlledCollections.filter((collection) => (
      collection.masterSlug === master.masterSlug
    ));

    writeFixtureFile(
      repositoryRoot,
      `collections/${master.masterSlug}/README.md`,
      [
        `[Главная](../../README.md) → ${master.masterName}`,
        '',
        ...topics.map((collection) => (
          `- [${collection.topicName}](${collection.topicSlug}/README.md) — ${collection.taskIds.length} задач — Краткое описание темы.`
        )),
        '',
      ].join('\n'),
    );
  }
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
  const simulationTopics = [controlledCollections[0], controlledCollections[1], controlledCollections[3]];

  for (let index = 0; index < 30; index += 1) {
    const simulationNumber = index + 1;
    const simulationId = String(simulationNumber).padStart(3, '0');
    const thirdTaskNumber = frozenSimulationThirdTasks[index];
    const thirdCollection = controlledCollections.find((collection) => (
      collection.taskIds.includes(thirdTaskNumber)
    ));
    const baseTopics = simulationTopics.filter((collection) => (
      collection !== thirdCollection
    ));
    const taskNumbers = [
      baseTopics[0].taskIds[index % baseTopics[0].taskIds.length],
      baseTopics[1].taskIds[index % baseTopics[1].taskIds.length],
      thirdTaskNumber,
    ];
    const taskLinks = taskNumbers.map((number) => {
      const id = taskId(number);

      return `[${id} — Task ${String(number).padStart(4, '0')}](../../../tasks/${id}/README.md) — 15 минут`;
    });

    simulationIndex.push(
      `[Симуляция собеседования №${simulationNumber}](simulation-${simulationId}/README.md) — 45 минут`,
    );
    writeFixtureFile(
      repositoryRoot,
      `collections/interviews/simulation-${simulationId}/README.md`,
      [
        `# Симуляция собеседования №${simulationNumber}`,
        '',
        'Реализм: Три задания из разных тематических подборок создают реалистичную последовательность.',
        '',
        'Общее время: 45 минут',
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

const createCompleteCatalogFixture = createCompleteTopicCatalogFixture;

function replaceFile(repositoryRoot, relativePath, content) {
  writeFixtureFile(repositoryRoot, relativePath, content);
}

function writeSimulation(repositoryRoot, number, taskIds) {
  const id = String(number).padStart(3, '0');
  const links = taskIds.map((taskIdentifier) => {
    const taskNumber = taskIdentifier.slice(-4);

    return `[${taskIdentifier} — Task ${taskNumber}](../../../tasks/${taskIdentifier}/README.md) — 15 минут`;
  });

  writeFixtureFile(
    repositoryRoot,
    `collections/interviews/simulation-${id}/README.md`,
    [
      `# Симуляция собеседования №${number}`,
      '',
      'Реализм: Три задания проверяют разные механизмы.',
      '',
      'Общее время: 45 минут',
      '',
      ...links,
      '',
    ].join('\n'),
  );
}

function assertCatalogFails(repositoryRoot, expectedMessage) {
  const result = runProductionCatalogGate(repositoryRoot);

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, new RegExp(expectedMessage));
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
    armyCollection: waveCollections[1],
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
    armyCollection: waveCollections[1],
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
    armyCollection: waveCollections[1],
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
    armyCollection: waveCollections[1],
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
      armyCollection: waveCollections[1],
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
    armyCollection: waveCollections[1],
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
    armyCollection: waveCollections[0],
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
    armyCollection: waveCollections[0],
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
    armyCollection: waveCollections[0],
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
    armyCollection: waveCollections[0],
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
    armyCollection: waveCollections[0],
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
  const root = createCompleteTopicCatalogFixture();
  const path = 'collections/javascript/event-loop/README.md';
  replaceFile(root, path, readFileSync(join(root, path), 'utf8').replace(
    /^1\. \[task-0025.+\n/m,
    '',
  ));
  assertCatalogFails(root, 'expected 7 task links');
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
  const repositoryRoot = createCompleteTopicCatalogFixture();

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

test('rejects a card whose visible task ID differs from its immutable path', () => {
  const root = createCompleteTopicCatalogFixture();
  replaceFile(root, 'tasks/task-0015/README.md', '# task-0016 — Task 0015');
  assertCatalogFails(root, 'task H1 must use its immutable task ID');
});

test('rejects a simulation with three cards from fewer than three topics', () => {
  const root = createCompleteTopicCatalogFixture();
  writeSimulation(root, 1, ['task-0001', 'task-0005', 'task-0014']);
  assertCatalogFails(root, 'at least three topic collections');
});

test('rejects a simulation whose frozen third task drifts', () => {
  const root = createCompleteTopicCatalogFixture();
  writeSimulation(root, 1, ['task-0015', 'task-0017', 'task-0040']);
  assertCatalogFails(root, 'frozen third task must be task-0033');
});

test('rejects master topic-count drift', () => {
  const root = createCompleteTopicCatalogFixture();
  replaceFile(root, 'collections/react/README.md', [
    '[Главная](../../README.md) → React',
    '',
    '- [Состояние и обработчики событий](state-and-event-handlers/README.md) — 3 задач — Краткое описание темы.',
    '',
  ].join('\n'));
  assertCatalogFails(root, 'master topic count');
});

test('rejects an extra topic entry on a master page', () => {
  const root = createCompleteTopicCatalogFixture();
  const path = 'collections/react/README.md';
  replaceFile(root, path, `${readFileSync(join(root, path), 'utf8')}- [Лишняя тема](extra/README.md) — 1 задач — Лишняя строка.\n`);
  assertCatalogFails(root, 'must list exactly its registered topic rows');
});

test('rejects a direct task row on a master page', () => {
  const root = createCompleteTopicCatalogFixture();
  const path = 'collections/react/README.md';
  replaceFile(root, path, `${readFileSync(join(root, path), 'utf8')}1. [task-0001 — Task 0001](../../tasks/task-0001/README.md) — Базовая · 15 минут — Лишняя строка.\n`);
  assertCatalogFails(root, 'must list exactly its registered topic rows');
});

test('rejects topic rows with non-ascending initial IDs', () => {
  const root = createCompleteTopicCatalogFixture();
  replaceFile(root, 'collections/react/effects-timers-and-cleanup/README.md', [
    '[Главная](../../../README.md) → [React](../README.md) → Эффекты, таймеры и очистка',
    '',
    collectionEntry(5),
    collectionEntry(1),
    collectionEntry(14),
    '',
  ].join('\n'));
  assertCatalogFails(root, 'ascending initial task IDs');
});

test('rejects a broad interview-practice page link', () => {
  const root = createCompleteTopicCatalogFixture();
  replaceFile(root, 'README.md', '[JavaScript](collections/javascript/interview-practice/README.md)\n');
  assertCatalogFails(root, 'broad interview-practice');
});

test('rejects forbidden fixture vocabulary in a task card', () => {
  const root = createCompleteTopicCatalogFixture();
  const path = 'tasks/task-0015/README.md';
  replaceFile(root, path, `${readFileSync(join(root, path), 'utf8')}\nfixture\n`);
  assertCatalogFails(root, 'forbidden student vocabulary');
});

for (const [label, phrase] of [
  ['ESM', 'ESM'],
  ['browser API', 'browser API'],
  ['console JavaScript', 'консольный JavaScript'],
  ['pure TypeScript instruction', 'используйте чистый TypeScript'],
  ['CodePen absence instruction', 'CodePen без ESM'],
]) {
  test(`rejects forbidden environment wording: ${label}`, () => {
    const root = createCompleteTopicCatalogFixture();
    const path = 'tasks/task-0015/README.md';
    replaceFile(root, path, `${readFileSync(join(root, path), 'utf8')}\n${phrase}\n`);
    assertCatalogFails(root, 'forbidden environment wording');
  });
}

test('rejects metadata collection that differs from the registered topic', () => {
  const root = createCompleteTopicCatalogFixture();
  const path = 'tasks/task-0015/README.md';
  replaceFile(root, path, readFileSync(join(root, path), 'utf8').replace(
    '- Подборка: JavaScript → Event loop и очереди задач',
    '- Подборка: JavaScript → Promise и async/await',
  ));
  assertCatalogFails(root, 'metadata collection does not match');
});

test('rejects a real-work row whose visible title differs from the card H1', () => {
  const root = createCompleteTopicCatalogFixture();
  const cardPath = 'tasks/task-0015/README.md';
  replaceFile(root, cardPath, readFileSync(join(root, cardPath), 'utf8').replace(
    '- Формат: Написать код',
    '- Формат: Приближённая к реальной работе',
  ));
  replaceFile(root, 'collections/real-work/README.md', [
    '# Real-work tasks',
    '',
    '[task-0015 — Wrong title](../../tasks/task-0015/README.md) — 15 минут',
    '',
  ].join('\n'));
  assertCatalogFails(root, 'real-work row title must match the card title');
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
