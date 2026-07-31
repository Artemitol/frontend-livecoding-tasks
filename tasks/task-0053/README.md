# Общие свободные интервалы

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте findFreeMeetingSlots: объедините занятость всех участников и верните общие свободные интервалы внутри суток [0, 24].
// Все интервалы полуоткрытые [start, end), 0 <= start < end <= 24; касающиеся и пересекающиеся занятые интервалы сливаются, входные массивы не изменяются.
// Для двух точных наборов ниже верните соответственно [[0,10],[13,14],[18,24]] и [[0,10],[13,14.54],[19.13,19.3],[20,24]].

function findFreeMeetingSlots(schedules) {
  const busySlots = schedules.flat().sort();
  const freeSlots = [];
  let lastEnd = 0;

  for (const [start, end] of busySlots) {
    freeSlots.push([lastEnd, start]);
    lastEnd = end;
  }

  return freeSlots;
}

const firstSchedules = [
  [[16, 18], [11, 12], [14, 15]],
  [[15, 17]],
  [[10, 13]],
];

const decimalSchedules = [
  [[11, 12.34], [14.54, 19], [19.3, 20]],
  [[15.45, 16], [17, 19.13]],
  [[10, 13]],
];

const before = JSON.stringify({
  firstSchedules,
  decimalSchedules,
});

console.log(JSON.stringify(findFreeMeetingSlots(firstSchedules)));
console.log(JSON.stringify(findFreeMeetingSlots(decimalSchedules)));
console.log('inputUnchanged:', before === JSON.stringify({
  firstSchedules,
  decimalSchedules,
}));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сортировать нужно плоскую копию списка интервалов по числовому началу, а не по строковому представлению массива.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните правую границу уже объединённой занятости. Свободный промежуток возникает только когда следующий `start` строго больше этой границы.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После каждого интервала обновляйте границу через `Math.max`, а после цикла добавьте хвост до `24`, если он непустой.

</details>

<details>
<summary>Решение</summary>

```javascript
function findFreeMeetingSlots(schedules) {
  const busySlots = schedules
    .flat()
    .slice()
    .sort((left, right) => left[0] - right[0]);
  const freeSlots = [];
  let lastEnd = 0;

  for (const [start, end] of busySlots) {
    if (start > lastEnd) {
      freeSlots.push([lastEnd, start]);
    }

    lastEnd = Math.max(lastEnd, end);
  }

  if (lastEnd < 24) {
    freeSlots.push([lastEnd, 24]);
  }

  return freeSlots;
}
```

Отсортированный проход строит объединение занятых интервалов без изменения исходных расписаний. Разница между следующей левой границей и `lastEnd` образует общий свободный интервал.

Ожидаемый результат: выводятся `[[0,10],[13,14],[18,24]]`, `[[0,10],[13,14.54],[19.13,19.3],[20,24]]` и `inputUnchanged: true`.

Ручная проверка: вставьте решение и сравните три строки с ожидаемыми; затем добавьте занятый интервал `[13, 14]` и убедитесь, что касание не создаёт нулевой свободный интервал.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
