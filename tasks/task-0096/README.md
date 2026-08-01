# Подсчёт цветных областей

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте countRegions для прямоугольной сетки символов.
// Область образуют одинаковые символы, соединённые только по сторонам; для пустой сетки верните 0.
// Используйте консольный JavaScript без ESM и browser API.

function countRegions(picture) {
  // Напишите решение.
}

console.log(countRegions([
  ['a', 'a', 'a'],
  ['a', 'b', 'a'],
  ['a', 'a', 'a'],
]));
console.log(countRegions([]));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

После посещения клетки помечайте её, чтобы не начать обход той же области повторно.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для каждой ещё не посещённой клетки запустите обход в четырёх направлениях.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Увеличивайте счётчик перед обходом новой клетки, а в стек добавляйте соседей того же символа.

</details>

<details>
<summary>Решение</summary>

```javascript
function countRegions(picture) {
  if (picture.length === 0) return 0;
  const visited = new Set();
  let regions = 0;

  for (let row = 0; row < picture.length; row += 1) {
    for (let column = 0; column < picture[row].length; column += 1) {
      const key = `${row}:${column}`;
      if (visited.has(key)) continue;

      regions += 1;
      const color = picture[row][column];
      const stack = [[row, column]];
      visited.add(key);

      while (stack.length > 0) {
        const [currentRow, currentColumn] = stack.pop();
        for (const [rowStep, columnStep] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nextRow = currentRow + rowStep;
          const nextColumn = currentColumn + columnStep;
          const nextKey = `${nextRow}:${nextColumn}`;
          if (picture[nextRow]?.[nextColumn] === color && !visited.has(nextKey)) {
            visited.add(nextKey);
            stack.push([nextRow, nextColumn]);
          }
        }
      }
    }
  }

  return regions;
}
```

Каждый запуск обхода соответствует одной ещё не посчитанной области.

Ожидаемый результат: `2`, `0`.

Ручная проверка: замените центральный `b` на `a`; результат должен стать `1`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
