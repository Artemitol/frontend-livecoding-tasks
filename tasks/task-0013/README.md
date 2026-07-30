# Интерактивное дерево файлов

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: рекурсивно покажите всё дерево, папки изначально закрыты и переключаются независимо.
// У папки отображайте ▸ или ▾; после переключения вызывайте onExpand с узлом и новым значением expanded.
// Для файлов используйте ⚛️ у .tsx, 🟦 у .ts и 📄 у остальных; клик вызывает onSelect с выбранным узлом.
// Выбранный файл отмечайте префиксом ✓ и aria-current; используйте React 19.2 и только локальные данные ниже.

import { useState } from 'react';

type FileNode = {
  id: string;
  kind: 'file';
  name: string;
};

type FolderNode = {
  id: string;
  kind: 'folder';
  name: string;
  children: TreeNode[];
};

type TreeNode = FileNode | FolderNode;

const TREE: TreeNode[] = [
  {
    id: 'src',
    kind: 'folder',
    name: 'src',
    children: [
      {
        id: 'app',
        kind: 'file',
        name: 'App.tsx',
      },
      {
        id: 'utils',
        kind: 'folder',
        name: 'utils',
        children: [
          {
            id: 'format',
            kind: 'file',
            name: 'format.ts',
          },
          {
            id: 'readme',
            kind: 'file',
            name: 'README.md',
          },
        ],
      },
    ],
  },
  {
    id: 'package',
    kind: 'file',
    name: 'package.json',
  },
];

type FileTreeProps = {
  nodes: TreeNode[];
  selectedId: string | null;
  onSelect: (node: FileNode) => void;
  onExpand: (node: FolderNode, expanded: boolean) => void;
};

function FileTree({
  nodes,
  selectedId,
  onSelect,
  onExpand,
}: FileTreeProps) {
  return <ul />;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState('Действий пока нет');

  return (
    <main>
      <FileTree
        nodes={TREE}
        selectedId={selectedId}
        onSelect={(node) => {
          setSelectedId(node.id);
          setLastEvent(`Выбран файл: ${node.name}`);
        }}
        onExpand={(node, expanded) => {
          setLastEvent(
            `${expanded ? 'Открыта' : 'Закрыта'} папка: ${node.name}`,
          );
        }}
      />
      <output>{lastEvent}</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Различайте узлы по `kind`: только папке нужны состояние раскрытия и рекурсивный обход `children`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните множество раскрытых `id` в корневом `FileTree`, чтобы вложенная ветка не создавала отдельный несвязанный источник состояния.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Передайте рекурсивному `TreeItems` общее множество, обработчик переключения и selection props; для файла выберите icon через `endsWith`.

</details>

<details>
<summary>Решение</summary>

```tsx
type TreeItemsProps = FileTreeProps & {
  expandedIds: Set<string>;
  onToggle: (node: FolderNode) => void;
};

function getFileIcon(name: string): string {
  if (name.endsWith('.tsx')) {
    return '⚛️';
  }

  if (name.endsWith('.ts')) {
    return '🟦';
  }

  return '📄';
}

function TreeItems({
  nodes,
  selectedId,
  onSelect,
  onExpand,
  expandedIds,
  onToggle,
}: TreeItemsProps) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          {node.kind === 'folder' ? (
            <>
              <button type="button" onClick={() => onToggle(node)}>
                {expandedIds.has(node.id) ? '▾' : '▸'} {node.name}
              </button>
              {expandedIds.has(node.id) && (
                <TreeItems
                  nodes={node.children}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onExpand={onExpand}
                  expandedIds={expandedIds}
                  onToggle={onToggle}
                />
              )}
            </>
          ) : (
            <button
              type="button"
              aria-current={
                selectedId === node.id ? 'true' : undefined
              }
              onClick={() => onSelect(node)}
            >
              {selectedId === node.id ? '✓ ' : ''}
              {getFileIcon(node.name)} {node.name}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function FileTree({
  nodes,
  selectedId,
  onSelect,
  onExpand,
}: FileTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleFolder = (node: FolderNode): void => {
    const expanded = !expandedIds.has(node.id);
    const nextIds = new Set(expandedIds);

    if (expanded) {
      nextIds.add(node.id);
    } else {
      nextIds.delete(node.id);
    }

    setExpandedIds(nextIds);
    onExpand(node, expanded);
  };

  return (
    <TreeItems
      nodes={nodes}
      selectedId={selectedId}
      onSelect={onSelect}
      onExpand={onExpand}
      expandedIds={expandedIds}
      onToggle={toggleFolder}
    />
  );
}
```

Единое множество раскрытых идентификаторов сохраняет состояние всех видимых уровней, а discriminated union отделяет действия папок от действий файлов.

Ожидаемый результат: папки раскрываются независимо, файлы получают icon по расширению, выбранный файл видимо отмечен, а `output` отражает каждое раскрытие, закрытие и выделение.

Ручная проверка: раскройте `src`, выберите `App.tsx` и проверьте `✓ ⚛️ App.tsx`; затем раскройте `utils`, выберите по очереди `format.ts` и `README.md` и проверьте `✓ 🟦 format.ts` и `✓ 📄 README.md`. Закройте и снова откройте `utils` и убедитесь, что выбранный файл остаётся отмечен, а `output` на каждом шаге называет правильный узел и действие.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
