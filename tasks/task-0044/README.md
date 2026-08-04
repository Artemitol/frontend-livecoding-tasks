# task-0044 — Объект из ключей и значений

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите zipKeysAndValues: первая строка data содержит значения, вторая — ключи для тех же индексов.
// Верните новый объект, где каждый ключ связан со значением на той же позиции; не изменяйте вложенные массивы.
// Сравните JSON результата с примером.

const data = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  ['name1', 'name2', 'name3', 'name4', 'name5', 'name6', 'name7', 'name8'],
];

function zipKeysAndValues(data) {
  // Напишите решение.
}

console.log(JSON.stringify(zipKeysAndValues(data)));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Один и тот же индекс связывает элемент первой строки с элементом второй.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала разделите `data` на `values` и `keys`, не меняя порядок строк.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Пройдите по `keys` через `reduce` и на каждом шаге присвойте `result[key] = values[index]`.

</details>

<details>
<summary>Решение</summary>

```javascript
function zipKeysAndValues(data) {
  const [values, keys] = data;

  return keys.reduce((result, key, index) => {
    result[key] = values[index];
    return result;
  }, {});
}
```

Массив ключей задаёт свойства результата, а индекс выбирает соответствующее значение из первой строки.

Ожидаемый результат: `{"name1":1,"name2":2,"name3":3,"name4":4,"name5":5,"name6":6,"name7":7,"name8":8}`.

Ручная проверка: вставьте решение, сравните строку с ожидаемой и затем выведите `data`; обе строки должны сохранить исходный порядок.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Объекты и коллекции
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
