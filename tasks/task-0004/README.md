# Асинхронное дерево с поиском

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: загрузка локального дерева через loadTree не зависит от поиска и показывает loading до ответа.
// Применяйте введённый запрос только после 300 мс тишины; пустой запрос возвращает всё дерево.
// Совпавший узел сохраняет всё поддерево, а совпавший потомок сохраняется вместе со всей цепочкой предков.
// Покажите «Ничего не найдено» для пустого результата; используйте React 19.2 без сети и очищайте таймер debounce.

import { useEffect, useMemo, useState } from 'react';

type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

const TREE_FIXTURE: TreeNode[] = [
  {
    id: 'products',
    name: 'Продукты',
    children: [
      {
        id: 'web',
        name: 'Веб-приложения',
        children: [
          { id: 'checkout', name: 'Корзина' },
          { id: 'profile', name: 'Профиль пользователя' },
        ],
      },
      {
        id: 'mobile',
        name: 'Мобильные приложения',
        children: [
          { id: 'notifications', name: 'Уведомления' },
        ],
      },
    ],
  },
  {
    id: 'support',
    name: 'Поддержка',
    children: [
      { id: 'faq', name: 'Частые вопросы' },
      { id: 'contacts', name: 'Контакты' },
    ],
  },
];

function loadTree(): Promise<TreeNode[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(TREE_FIXTURE), 350);
  });
}

function filterTree(
  nodes: TreeNode[],
  query: string,
): TreeNode[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');

  if (normalizedQuery === '') {
    return nodes;
  }

  return nodes.filter((node) => (
    node.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
  ));
}

function TreeBranch({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          {node.name}
          {node.children && <TreeBranch nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    void loadTree().then((data) => {
      setTree(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setDebouncedQuery(query);
  }, [query]);

  const visibleTree = useMemo(
    () => filterTree(tree, debouncedQuery),
    [tree, debouncedQuery],
  );

  return (
    <main>
      <label>
        Поиск
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {loading && <p>Загрузка…</p>}
      {!loading && visibleTree.length === 0 && (
        <p>Ничего не найдено</p>
      )}
      {!loading && visibleTree.length > 0 && (
        <TreeBranch nodes={visibleTree} />
      )}
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Обычный `filter` видит только текущий уровень. Для цепочки предков результат нужно собирать при возврате из рекурсивного вызова.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала обработайте два простых случая: пустой запрос возвращает `nodes`, а совпадение имени возвращает исходный узел целиком.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для несовпавшего узла отфильтруйте `children`; добавляйте копию узла только при непустом результате. Debounce реализуйте через `setTimeout` и `clearTimeout` в effect.

</details>

<details>
<summary>Решение</summary>

```tsx
function filterTree(
  nodes: TreeNode[],
  query: string,
): TreeNode[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');

  if (normalizedQuery === '') {
    return nodes;
  }

  return nodes.flatMap((node) => {
    const matches = node.name
      .toLocaleLowerCase('ru-RU')
      .includes(normalizedQuery);

    if (matches) {
      return [node];
    }

    const children = filterTree(
      node.children ?? [],
      normalizedQuery,
    );

    return children.length > 0
      ? [{ ...node, children }]
      : [];
  });
}

export default function App() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    let active = true;

    void loadTree().then((data) => {
      if (active) {
        setTree(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const visibleTree = useMemo(
    () => filterTree(tree, debouncedQuery),
    [tree, debouncedQuery],
  );

  return (
    <main>
      <label>
        Поиск
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {loading && <p>Загрузка…</p>}
      {!loading && visibleTree.length === 0 && (
        <p>Ничего не найдено</p>
      )}
      {!loading && visibleTree.length > 0 && (
        <TreeBranch nodes={visibleTree} />
      )}
    </main>
  );
}
```

Рекурсивная функция возвращает совпавшее поддерево либо реконструированную цепочку к совпавшему потомку. Cleanup debounce не даёт промежуточным запросам стать активными.

Ожидаемый результат: после локальной задержки видна вся вложенность; запрос `Профиль` оставляет «Продукты → Веб-приложения → Профиль пользователя», а `Продукты` сохраняет обе ветки этого узла.

Ручная проверка: дождитесь дерева, быстро введите `Про`, затем `Профиль`, проверьте обновление только после паузы и очистите поле для возврата полного дерева.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
