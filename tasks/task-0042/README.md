# Сводка товаров по материалу

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите summarizeGoods: для каждого type соберите ids в исходном порядке и числовой totalWeight.
// Вес может быть числом или строкой с числом; функция создаёт новый объект и не изменяет goods.
// Сравните JSON результата и тип суммы с фикстурой; используйте консольный JavaScript без ESM и browser API.

const goods = [
  { id: 'ab', name: 'Имя-01', type: 'сталь', weight: 1 },
  { id: 'bc', name: 'Имя-02', type: 'чугун', weight: 2 },
  { id: 'cd', name: 'Имя-03', type: 'сталь', weight: 3 },
  { id: 'de', name: 'Имя-04', type: 'чугун', weight: 4 },
  { id: 'ef', name: 'Имя-05', type: 'чугун', weight: 5 },
  { id: 'fg', name: 'Имя-06', type: 'сталь', weight: '4' },
];

function summarizeGoods(goods) {
  // Напишите решение.
}

const summary = summarizeGoods(goods);

console.log(JSON.stringify(summary));
console.log(typeof summary['сталь'].totalWeight);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Объект-аккумулятор удобно индексировать значением `type`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

При первом товаре материала создайте `{ ids: [], totalWeight: 0 }`, а затем обновляйте эту запись.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Добавляйте `id` через `push`, а перед сложением преобразуйте `weight` функцией `Number`.

</details>

<details>
<summary>Решение</summary>

```javascript
function summarizeGoods(goods) {
  return goods.reduce((summary, { id, type, weight }) => {
    if (!summary[type]) {
      summary[type] = {
        ids: [],
        totalWeight: 0,
      };
    }

    summary[type].ids.push(id);
    summary[type].totalWeight += Number(weight);
    return summary;
  }, {});
}
```

Отдельная запись создаётся один раз для каждого материала. Явное преобразование веса не даёт строке `'4'` превратить сложение в конкатенацию.

Ожидаемый результат: первая строка — `{"сталь":{"ids":["ab","cd","fg"],"totalWeight":8},"чугун":{"ids":["bc","de","ef"],"totalWeight":11}}`, вторая — `number`.

Ручная проверка: вставьте решение, сравните обе строки с ожидаемыми и затем выведите `goods`; порядок и шесть исходных объектов должны остаться без изменений.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
