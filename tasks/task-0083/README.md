# task-0083 — Единственное значение среди пар

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте findLoneValue: верните число, встречающееся ровно один раз, если все остальные числа встречаются чётное число раз.
// Если такого единственного числа нет или условие о чётности нарушено, верните null.

function findLoneValue(numbers) {
  return numbers.reduce((result, number) => result ^ number, 0);
}

console.log(findLoneValue([2, 2, 1, 1, 3, 3, 5]));
console.log(findLoneValue([5, 5, 5, 5, 1]));
console.log(findLoneValue([2, 2, 2, 2]));
console.log(findLoneValue([1, 1, 1, 2]));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

XOR находит кандидата только при выполненном предусловии, но не проверяет само предусловие.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала посчитайте вхождения каждого числа и найдите значения с количеством `1`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните единственного кандидата, только если он один и количество каждого другого значения делится на два без остатка.

</details>

<details>
<summary>Решение</summary>

```javascript
function findLoneValue(numbers) {
  const counts = new Map();

  for (const number of numbers) {
    counts.set(number, (counts.get(number) ?? 0) + 1);
  }

  const loneValues = [...counts].filter(([, count]) => count === 1);
  const otherCountsAreEven = [...counts].every(([, count]) => count === 1 || count % 2 === 0);

  return loneValues.length === 1 && otherCountsAreEven ? loneValues[0][0] : null;
}
```

Явный контракт для недопустимого входа не позволяет принять нулевой результат XOR за найденное значение.

Ожидаемый результат: `5`, `1`, `null`, `null`.

Ручная проверка: добавьте `0` как единственное значение к парным числам и убедитесь, что функция возвращает именно `0`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Массивы, поиск и сортировка
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
