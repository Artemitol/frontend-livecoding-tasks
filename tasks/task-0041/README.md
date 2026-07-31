# Вложенный индекс записей

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте omit и groupBy: сгруппируйте записи по groupKey, а внутри группы индексируйте их по indexKey.
// В индексированной записи сохраняйте все исходные поля, кроме динамического indexKey; не изменяйте data и не зашивайте имена country или id.
// Сравните полный результат и исходный массив с фикстурами; используйте консольный JavaScript без ESM и browser API.

const data = [
  { id: 1, age: 20, name: 'Иван', country: 'Russia' },
  { id: 2, age: 20, name: 'Дмитрий', country: 'USA' },
  { id: 3, age: 20, name: 'Алексей', country: 'Russia' },
  { id: 4, age: 20, name: 'Александр', country: 'USA' },
  { id: 5, age: 20, name: 'Иван', country: 'Russia' },
];

const dataBeforeGrouping = JSON.stringify(data);

function omit(record, omittedKey) {
  return Object.keys(record).reduce((result, key) => {
    if (key === omittedKey || key === 'age') {
      result[key] = record[key];
    }

    return result;
  }, {});
}

function groupBy(records, groupKey, indexKey) {
  return records.reduce((groups, record) => {
    const groupName = record.country;

    if (!groups[groupName]) {
      groups[groupName] = {};
    }

    groups[groupName][record.id] = omit(record, indexKey);
    return groups;
  }, {});
}

console.log(JSON.stringify(groupBy(data, 'country', 'id')));
console.log(JSON.stringify(data) === dataBeforeGrouping);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Значения полей с динамическими именами читаются через квадратные скобки: `record[groupKey]` и `record[indexKey]`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

При первом появлении значения `groupKey` создайте для него пустой объект, а затем добавляйте запись по значению `indexKey`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `omit` копируйте ключ только тогда, когда он не равен `omittedKey`; в `groupBy` передавайте туда именно `indexKey`.

</details>

<details>
<summary>Решение</summary>

```javascript
function omit(record, omittedKey) {
  return Object.keys(record).reduce((result, key) => {
    if (key !== omittedKey) {
      result[key] = record[key];
    }

    return result;
  }, {});
}

function groupBy(records, groupKey, indexKey) {
  return records.reduce((groups, record) => {
    const groupName = record[groupKey];

    if (!groups[groupName]) {
      groups[groupName] = {};
    }

    groups[groupName][record[indexKey]] = omit(record, indexKey);
    return groups;
  }, {});
}
```

Обе функции создают новые объекты. `omit` исключает только переданный ключ, а `groupBy` использует оба имени полей как данные, поэтому алгоритм не зависит от `country` и `id`.

Ожидаемый результат: первая строка — `{"Russia":{"1":{"age":20,"name":"Иван","country":"Russia"},"3":{"age":20,"name":"Алексей","country":"Russia"},"5":{"age":20,"name":"Иван","country":"Russia"}},"USA":{"2":{"age":20,"name":"Дмитрий","country":"USA"},"4":{"age":20,"name":"Александр","country":"USA"}}}`, вторая — `true`.

Ручная проверка: вставьте решение, сравните обе строки с ожидаемыми, затем вызовите `groupBy([{ code: 'x', team: 'red', score: 1 }], 'team', 'code')` и убедитесь, что результат равен `{ red: { x: { team: 'red', score: 1 } } }`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
