# task-0088 — Симметрическая разность отсортированных массивов

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте symmetricDifference: верните отсортированные числа, которые остаются после попарного сокращения равных чисел двух входов.
// Входы уже отсортированы; каждая равная пара сокращается один к одному, поэтому лишние дубликаты сохраняются. Не используйте Set или Map.

function symmetricDifference(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
    } else if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex += 1;
    } else {
      result.push(right[rightIndex]);
      rightIndex += 1;
    }
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

console.log(symmetricDifference([1, 2, 3], [2, 4, 6, 7, 8]));
console.log(symmetricDifference([1, 1, 2, 2, 4], [1, 2, 2, 3]));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

При равных текущих числах нужно сдвинуть оба указателя: сокращается одна пара одинаковых вхождений.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Если одно число меньше другого, оно не может встретиться дальше в противоположном отсортированном массиве и сразу попадает в ответ.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В ветке равенства добавьте `rightIndex += 1`; после цикла присоедините оба неиспользованных хвоста.

</details>

<details>
<summary>Решение</summary>

```javascript
function symmetricDifference(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
    } else if (left[leftIndex] < right[rightIndex]) {
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

Два указателя сокращают совпадения по одному, поэтому исключительные `7` и `8` первого примера не теряются, как и лишний `1` второго.

Ожидаемый результат: `[1, 3, 4, 6, 7, 8]` и `[1, 3, 4]`.

Ручная проверка: передайте `[2, 2]` и `[2]`; результатом должен стать `[2]`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Массивы, поиск и сортировка
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
