# Слияние двух отсортированных массивов

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте mergeSorted: объедините два массива чисел, уже отсортированные по возрастанию, за один проход.
// Не сортируйте объединённый массив и не изменяйте left или right.
// Используйте консольный JavaScript без ESM и browser API.

function mergeSorted(left, right) {
  // Напишите решение.
}

const left = [1, 3, 5];
const right = [2, 4, 6, 7];

console.log(mergeSorted(left, right));
console.log(left);
console.log(right);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Достаточно двух индексов: по одному для текущего элемента каждого массива.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Пока оба индекса в границах, добавляйте меньшее из двух текущих чисел и двигайте только его индекс.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После основного цикла добавьте к результату неиспользованный хвост `left` или `right`.

</details>

<details>
<summary>Решение</summary>

```javascript
function mergeSorted(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex += 1;
    } else {
      result.push(right[rightIndex]);
      rightIndex += 1;
    }
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}
```

Два указателя сравнивают только текущие элементы, поэтому время работы линейно относительно общей длины входов.

Ожидаемый результат: `[1, 2, 3, 4, 5, 6, 7]`, а исходные массивы остаются без изменений.

Ручная проверка: замените `left` на `[1, 2, 2]`, а `right` на `[2, 3]` и проверьте все пять чисел в результате.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
