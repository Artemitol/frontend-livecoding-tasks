# task-0076 — Максимум на самой глубокой вложенности

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте maxAtDeepestLevel(values): верните наибольшее число среди элементов на максимальной глубине вложенных массивов.
// Не изменяйте values; для примера ниже два вызова должны вернуть 102, а исходный JSON — неизменным.

function maxAtDeepestLevel(values) {
  // Напишите решение.
}

const values = [1, [[20, 1, [101]], 2], [[-2], [[102, 100]]]];
const before = JSON.stringify(values);
console.log(maxAtDeepestLevel(values));
console.log(maxAtDeepestLevel(values));
console.log('inputUnchanged:', before === JSON.stringify(values));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Передавайте текущую глубину вместе с каждым числом.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните максимальную найденную глубину и массив чисел только на этой глубине.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

При большей глубине заменяйте сохранённые числа, при равной добавляйте число, а в конце примените `Math.max`.

</details>

<details>
<summary>Решение</summary>

```javascript
function maxAtDeepestLevel(values) {
  let deepest = -1;
  let numbers = [];

  const visit = (items, depth) => {
    for (const item of items) {
      if (Array.isArray(item)) {
        visit(item, depth + 1);
      } else if (typeof item !== 'number') {
        continue;
      } else if (depth > deepest) {
        deepest = depth;
        numbers = [item];
      } else if (depth === deepest) {
        numbers.push(item);
      }
    }
  };

  visit(values, 0);
  return Math.max(...numbers);
}
```

Обход отделяет глубину от значения и игнорирует нечисловые листья: числа на более мелких уровнях больше не участвуют после найденного более глубокого массива. Состояние создано внутри функции, поэтому второй вызов независим.

Ожидаемый результат: `102`, `102` и `inputUnchanged: true`.

Ручная проверка: вставьте решение, затем добавьте строку `'100'` рядом с `102` и убедитесь, что результат остаётся `102`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Деревья и рекурсия
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>
