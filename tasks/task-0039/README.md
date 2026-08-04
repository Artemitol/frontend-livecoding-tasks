# task-0039 — Свой map и метод массива

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите customMap, которая передаёт callback каждый элемент и его индекс и возвращает новый массив в исходном порядке.
// Реализуйте Array.prototype.customMap через готовую customMap; обе формы должны вернуть ["1|0","2|1"] и не изменить items.

function customMap(array, callback) {
  // Напишите решение.
}

Array.prototype.customMap = function(callback) {
  // Напишите решение.
};

const items = [{ id: 1 }, { id: 2 }];
const itemsBeforeMapping = JSON.stringify(items);
const format = (item, index) => `${item.id}|${index}`;

console.log(JSON.stringify(customMap(items, format)));
console.log(JSON.stringify(items.customMap(format)));
console.log(JSON.stringify(items) === itemsBeforeMapping);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Результат должен накапливаться в новом массиве, а исходный массив нужен только для чтения.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Пройдите индексом от `0` до `array.length - 1` и добавляйте `callback(array[index], index)`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В методе массива передайте `this` первым аргументом уже реализованной `customMap`.

</details>

<details>
<summary>Решение</summary>

```javascript
function customMap(array, callback) {
  const result = [];

  for (let index = 0; index < array.length; index += 1) {
    result.push(callback(array[index], index));
  }

  return result;
}

Array.prototype.customMap = function(callback) {
  return customMap(this, callback);
};
```

Обе формы используют один алгоритм: callback получает элемент и индекс, а результат собирается отдельно от исходного массива.

Ожидаемый результат: две строки `["1|0","2|1"]`, затем `true`.

Ручная проверка: вставьте решение и сравните три строки, затем вызовите обе формы с callback `(item, index) => item.id + index` и убедитесь, что они возвращают одинаковые новые массивы.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
