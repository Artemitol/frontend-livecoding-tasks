# Параллельные ветки одного Promise

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите семь чисел в консоли в точном порядке.
// Проследите две двухшаговые ветки и отдельный handler от одного fulfilled Promise.
// Объясните порядок продолжений веток относительно timer; используйте консольный JavaScript без ESM.

const promise = new Promise((resolve) => {
  console.log(2);
  resolve();
});

setTimeout(() => {
  console.log(1);
}, 0);

promise
  .then(() => {
    console.log(4);
  })
  .then(() => {
    console.log(6);
  });

promise
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(8);
  });

promise.then(() => {
  console.log(7);
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Executor выводит одно число синхронно, а три первых handlers получают места в очереди microtask по порядку регистрации.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала выпишите первый уровень веток: callbacks с `4`, `5` и `7` уже привязаны к одному fulfilled Promise.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После `4` в конец очереди добавляется `6`, после `5` — `8`; поэтому оба продолжения идут после `7`, но перед timer.

</details>

<details>
<summary>Решение</summary>

```text
2
4
5
7
6
8
1
```

Executor синхронно выводит `2`. Затем первый уровень всех веток выполняется как `4`, `5`, `7`; продолжения `6` и `8` добавляются во время этих microtasks. Timer становится следующей задачей только после опустошения очереди.

Ожидаемый результат: семь строк идут в порядке `2`, `4`, `5`, `7`, `6`, `8`, `1`.

Ручная проверка: отдельно запишите начальную очередь microtask и элементы, добавленные во время её обработки, затем сравните прогноз с Programiz.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
