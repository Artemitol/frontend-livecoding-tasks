# Максимальные пути ориентированного графа

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте getMaximalPaths(connections) для конечного ориентированного ациклического графа: верните каждый путь от вершины без входящих рёбер до вершины без исходящих рёбер.
// Сохраняйте порядок первых появлений вершин и рёбер во входе, не изменяйте connections и не обрывайте ветви при разветвлении.
// Для данных ниже верните ровно четыре пути в указанном порядке: Q-E, Y-L-A-Z-K, Y-L-A-Z-J-E и Y-L-O.

function getMaximalPaths(connections) {
  // Напишите решение.
}

const connections = [
  ['A', 'Z'],
  ['Z', 'K'],
  ['L', 'A'],
  ['L', 'O'],
  ['J', 'E'],
  ['Z', 'J'],
  ['Q', 'E'],
  ['Y', 'L'],
];

const before = JSON.stringify(connections);
const paths = getMaximalPaths(connections);

console.log(paths.map((path) => path.join('-')).join('\n'));
console.log('inputUnchanged:', before === JSON.stringify(connections));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала постройте список исходящих соседей и множество вершин, у которых есть входящее ребро.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Начальные вершины — те, которые встречаются слева в паре, но отсутствуют в множестве входящих.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Запускайте обход в глубину от каждого начала, создавая новый массив пути для каждого соседа; добавляйте путь в результат только в вершине без продолжения.

</details>

<details>
<summary>Решение</summary>

```javascript
function getMaximalPaths(connections) {
  const outgoing = new Map();
  const incoming = new Set();

  for (const [from, to] of connections) {
    if (!outgoing.has(from)) {
      outgoing.set(from, []);
    }

    outgoing.get(from).push(to);
    incoming.add(to);
  }

  const starts = [...outgoing.keys()].filter((node) => !incoming.has(node));
  const paths = [];

  const visit = (node, path) => {
    const nextNodes = outgoing.get(node) ?? [];

    if (nextNodes.length === 0) {
      paths.push(path);
      return;
    }

    for (const nextNode of nextNodes) {
      visit(nextNode, [...path, nextNode]);
    }
  };

  for (const start of starts) {
    visit(start, [start]);
  }

  return paths;
}
```

`Map` сохраняет порядок первых появлений, а отдельная копия пути на каждой ветви не смешивает результаты соседних обходов. В результат попадают только законченные пути от корня до листа.

Ожидаемый результат: строки `Q-E`, `Y-L-A-Z-K`, `Y-L-A-Z-J-E`, `Y-L-O`, затем `inputUnchanged: true`.

Ручная проверка: вставьте решение и сравните пять строк; затем добавьте ребро `['O', 'P']` и убедитесь, что последний путь становится `Y-L-O-P`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
