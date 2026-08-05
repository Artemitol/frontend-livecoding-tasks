# task-0040 — Группировка и сводка по типу

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите groupByType: ключ — type, значение — массив остальных полей элементов этого типа с сохранением исходного порядка.
// Напишите summarizeByType: для каждого type верните count и суммарный weight; обе функции создают новые объекты и не изменяют items.
// Сравните результаты с двумя ожидаемыми JSON-строками.

const items = [
  { type: 'banana', weight: 32 },
  { type: 'apple', weight: 24 },
  { type: 'kiwi', weight: 55 },
  { type: 'banana', weight: 44 },
  { type: 'orange', weight: 5 },
];

function groupByType(items) {
  // Напишите решение.
}

function summarizeByType(items) {
  // Напишите решение.
}

console.log(JSON.stringify(groupByType(items)));
console.log(JSON.stringify(summarizeByType(items)));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

В обеих функциях удобно накапливать результат в объекте, используя `type` как вычисляемый ключ.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для группировки отделите `type` через деструктуризацию и создавайте массив при первом появлении ключа.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В сводке при первом элементе запишите `{ count: 1, weight }`, а при следующих увеличивайте оба числа.

</details>

<details>
<summary>Решение</summary>

```javascript
function groupByType(items) {
  return items.reduce((groups, item) => {
    const { type, ...payload } = item;

    if (!groups[type]) {
      groups[type] = [];
    }

    groups[type].push(payload);
    return groups;
  }, {});
}

function summarizeByType(items) {
  return items.reduce((summary, { type, weight }) => {
    if (!summary[type]) {
      summary[type] = {
        count: 0,
        weight: 0,
      };
    }

    summary[type].count += 1;
    summary[type].weight += weight;
    return summary;
  }, {});
}
```

Первая функция хранит payload каждого элемента в массиве нужного типа. Вторая обновляет независимую числовую сводку, поэтому повторная `banana` увеличивает количество до `2`, а вес — до `76`.

Ожидаемый результат: первая строка — `{"banana":[{"weight":32},{"weight":44}],"apple":[{"weight":24}],"kiwi":[{"weight":55}],"orange":[{"weight":5}]}`, вторая — `{"banana":{"count":2,"weight":76},"apple":{"count":1,"weight":24},"kiwi":{"count":1,"weight":55},"orange":{"count":1,"weight":5}}`.

Ручная проверка: вставьте решение, сравните обе строки с ожидаемыми и затем выведите исходный `items`; его пять объектов должны остаться без изменений.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Объекты и коллекции
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
