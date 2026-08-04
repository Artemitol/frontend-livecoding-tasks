# task-0056 — Кратчайший маршрут в графе

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте findPath(from, to, graph): верните массив вершин кратчайшего направленного маршрута, найденного обходом в ширину.
// Если from === to, верните [from] даже для вершины без исходящих рёбер; если маршрут отсутствует, во всех случаях верните точную строку «Flights not found».
// Для графа ниже результаты должны быть ['A','B','N'], ['A','D','F','S'], «Flights not found», ['X'] и «Flights not found»; граф не изменяется.

function findPath(from, to, graph) {
  // Напишите решение.
}

const graph = {
  A: ['B', 'D'],
  B: ['C', 'N', 'Z'],
  D: ['E', 'F'],
  F: ['S'],
};

const before = JSON.stringify(graph);

console.log(findPath('A', 'N', graph));
console.log(findPath('A', 'S', graph));
console.log(findPath('B', 'S', graph));
console.log(findPath('X', 'X', graph));
console.log(findPath('X', 'A', graph));
console.log('inputUnchanged:', before === JSON.stringify(graph));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Очередь обхода может хранить не только вершину, но и весь маршрут до неё.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Проверьте `from === to` до проверки наличия исходящих рёбер, затем положите `[from]` в очередь.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Извлекайте первый маршрут, добавляйте к нему каждого ещё не посещённого соседа и сразу возвращайте новый маршрут, если сосед равен `to`.

</details>

<details>
<summary>Решение</summary>

```javascript
function findPath(from, to, graph) {
  if (from === to) {
    return [from];
  }

  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length > 0) {
    const path = queue.shift();
    const lastNode = path[path.length - 1];
    const nextNodes = graph[lastNode] ?? [];

    for (const nextNode of nextNodes) {
      if (visited.has(nextNode)) {
        continue;
      }

      const nextPath = [...path, nextNode];

      if (nextNode === to) {
        return nextPath;
      }

      visited.add(nextNode);
      queue.push(nextPath);
    }
  }

  return 'Flights not found';
}
```

Обход в ширину рассматривает маршруты по возрастанию длины, поэтому первое достижение цели даёт кратчайший путь. `visited` не допускает повторной обработки вершин и защищает от циклов.

Ожидаемый результат: выводятся `['A', 'B', 'N']`, `['A', 'D', 'F', 'S']`, `Flights not found`, `['X']`, `Flights not found` и `inputUnchanged: true`.

Ручная проверка: вставьте решение и сравните шесть строк; затем добавьте ребро `C: ['A']` и убедитесь, что отсутствующий маршрут по-прежнему завершается строкой `Flights not found`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Графы
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
