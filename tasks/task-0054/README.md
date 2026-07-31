# Пиковое число зрителей

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте findMaxViewers: найдите максимальное число одновременно активных зрителей по интервалам подключения.
// Интервалы полуоткрытые [start, end): зритель уже отключён в end, поэтому при одинаковом времени отключение обрабатывается раньше подключения; вход не изменяется.
// Верните 3 для [[1,5],[2,6],[3,4]], 2 для [[10,20],[15,25],[20,30]] и 0 для пустого массива.

function findMaxViewers(stream) {
  const events = stream.flatMap(([start, end]) => [
    [start, 1],
    [end, -1],
  ]);

  events.sort((left, right) => left[0] - right[0] || right[1] - left[1]);

  let current = 0;
  let maximum = 0;

  for (const [, delta] of events) {
    current += delta;
    maximum = Math.max(maximum, current);
  }

  return maximum;
}

console.log(findMaxViewers([[1, 5], [2, 6], [3, 4]]));
console.log(findMaxViewers([[10, 20], [15, 25], [20, 30]]));
console.log(findMaxViewers([]));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Каждый интервал можно заменить двумя событиями: `+1` в начале и `-1` в конце.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Основная ошибка находится в сортировке событий с одинаковым временем.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

При равном времени отрицательная дельта должна стоять перед положительной, то есть сортироваться по `delta` по возрастанию.

</details>

<details>
<summary>Решение</summary>

```javascript
function findMaxViewers(stream) {
  const events = stream.flatMap(([start, end]) => [
    [start, 1],
    [end, -1],
  ]);

  events.sort((left, right) => left[0] - right[0] || left[1] - right[1]);

  let current = 0;
  let maximum = 0;

  for (const [, delta] of events) {
    current += delta;
    maximum = Math.max(maximum, current);
  }

  return maximum;
}
```

Сортировка по времени превращает интервалы в линейный поток событий. Вторичный порядок `-1` перед `+1` реализует полуоткрытую границу и не считает двух зрителей одновременно в момент передачи слота.

Ожидаемый результат: три строки `3`, `2` и `0`.

Ручная проверка: вставьте решение и сравните вывод; затем проверьте `[[1, 2], [2, 3]]` — функция должна вернуть `1`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
