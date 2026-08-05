# task-0084 — Индексы пары с заданной суммой

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте twoSum: верните индексы двух разных элементов, сумма которых равна target.
// Возвращайте первую пару, найденную при обходе слева направо, и null, если пары нет; один индекс нельзя использовать дважды.

function twoSum(numbers, target) {
  const indexes = new Map();

  for (let index = 0; index < numbers.length; index += 1) {
    indexes.set(numbers[index], index);
    const pairIndex = indexes.get(target - numbers[index]);

    if (pairIndex !== undefined) {
      return [pairIndex, index];
    }
  }
}

console.log(twoSum([2, 7, 11, 5, 9, 10, 15], 26));
console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 2, 4], 6));
console.log(twoSum([3, 3], 6));
console.log(twoSum([1, 2, 3], 10));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Текущий элемент нельзя сначала записывать в таблицу: иначе он сможет образовать пару сам с собой.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для каждого числа ищите в `Map` дополнение `target - number`, встреченное раньше.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Проверяйте дополнение до `indexes.set(number, index)`, а после всего цикла явно верните `null`.

</details>

<details>
<summary>Решение</summary>

```javascript
function twoSum(numbers, target) {
  const indexes = new Map();

  for (let index = 0; index < numbers.length; index += 1) {
    const pairIndex = indexes.get(target - numbers[index]);

    if (pairIndex !== undefined) {
      return [pairIndex, index];
    }

    indexes.set(numbers[index], index);
  }

  return null;
}
```

Проверка до записи гарантирует разные индексы; первый пример корректно даёт индексы `2` и `6` для чисел `11` и `15`.

Ожидаемый результат: `[2, 6]`, `[0, 1]`, `[1, 2]`, `[0, 1]`, `null`.

Ручная проверка: вызовите `twoSum([4], 8)` и убедитесь, что ответом будет `null`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Массивы, поиск и сортировка
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
