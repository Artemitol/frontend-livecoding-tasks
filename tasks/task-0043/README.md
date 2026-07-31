# Операции по годам в хронологическом порядке

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите groupOperationDates: отсортируйте операции по ISO-дате и сгруппируйте строки MM-DD по годам.
// Не изменяйте исходный operations; внутри каждого года даты должны идти хронологически и сохранять ведущие нули.
// Сравните полный результат и исходный массив с фикстурами; используйте консольный JavaScript без ESM и browser API.

const operations = [
  { date: '2017-07-31', amount: '5422' },
  { date: '2017-06-30', amount: '5220' },
  { date: '2017-05-31', amount: '5365' },
  { date: '2017-08-31', amount: '5451' },
  { date: '2017-09-30', amount: '5303' },
  { date: '2018-03-31', amount: '5654' },
  { date: '2017-10-31', amount: '5509' },
  { date: '2017-12-31', amount: '5567' },
  { date: '2018-01-31', amount: '5597' },
  { date: '2017-11-30', amount: '5359' },
  { date: '2018-02-28', amount: '5082' },
  { date: '2018-04-14', amount: '2567' },
];

const operationsBeforeGrouping = JSON.stringify(operations);

function groupOperationDates(operations) {
  // Напишите решение.
}

console.log(JSON.stringify(groupOperationDates(operations)));
console.log(JSON.stringify(operations) === operationsBeforeGrouping);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

ISO-даты вида `YYYY-MM-DD` можно сравнивать как строки: их лексикографический и хронологический порядок совпадают.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте копию массива через spread и сортируйте именно её.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После сортировки берите год через `date.slice(0, 4)`, а готовую строку `MM-DD` — через `date.slice(5)`.

</details>

<details>
<summary>Решение</summary>

```javascript
function groupOperationDates(operations) {
  return [...operations]
    .sort((left, right) => left.date.localeCompare(right.date))
    .reduce((groups, operation) => {
      const year = operation.date.slice(0, 4);

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(operation.date.slice(5));
      return groups;
    }, {});
}
```

Копия защищает порядок исходного массива. Фиксированные срезы ISO-строки сразу дают год и нуль-дополненный месяц с днём без зависимости от часового пояса.

Ожидаемый результат: первая строка — `{"2017":["05-31","06-30","07-31","08-31","09-30","10-31","11-30","12-31"],"2018":["01-31","02-28","03-31","04-14"]}`, вторая — `true`.

Ручная проверка: вставьте решение, сравните обе строки с ожидаемыми и отдельно убедитесь, что первым элементом `operations` по-прежнему остаётся запись с датой `2017-07-31`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
