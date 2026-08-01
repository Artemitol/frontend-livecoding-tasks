# Комбинации с заданной суммой

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте combinationsForSum для уникальных положительных чисел и target.
// Каждое число можно взять не более одного раза; верните комбинации с числами по возрастанию и в лексикографическом порядке.
// Используйте консольный JavaScript без ESM и browser API.

function combinationsForSum(numbers, target) {
  // Напишите решение.
}

console.log(combinationsForSum([2, 3, 5, 7], 10));
console.log(combinationsForSum([2, 3, 5, 7], 1));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Отсортируйте копию массива: так проще отсекать слишком большие частичные суммы.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Рекурсивной функции передавайте индекс, оставшуюся сумму и текущую комбинацию.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После выбора числа продолжайте только со следующего индекса, чтобы не использовать его повторно.

</details>

<details>
<summary>Решение</summary>

```javascript
function combinationsForSum(numbers, target) {
  const sorted = [...numbers].sort((left, right) => left - right);
  const result = [];

  function visit(start, remaining, combination) {
    if (remaining === 0) {
      result.push(combination);
      return;
    }

    for (let index = start; index < sorted.length; index += 1) {
      const value = sorted[index];
      if (value > remaining) break;
      visit(index + 1, remaining - value, [...combination, value]);
    }
  }

  visit(0, target, []);
  return result;
}
```

Порядок обхода отсортированного массива задаёт порядок чисел внутри каждой комбинации и самих комбинаций.

Ожидаемый результат: `[ [ 2, 3, 5 ], [ 3, 7 ] ]`, `[]`.

Ручная проверка: передайте `[2, 4, 6]` и `6`; результат должен быть `[ [ 6 ] ]`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
