# task-0021 — Гонка двух Promise

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите две строки консоли в точном порядке.
// Учтите, что executor первого Promise выполняется синхронно, а второй timer завершается раньше.

const slow = new Promise((resolve) => {
  console.log(5);
  setTimeout(resolve, 50, 1);
});

const fast = new Promise((resolve) => {
  setTimeout(resolve, 10, 2);
});

Promise.race([slow, fast]).then((value) => {
  console.log(value);
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите создание Promise и выполнение callbacks после timer.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Executor запускается сразу при создании `slow`, поэтому первый лог не ждёт 50 мс.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

`Promise.race` завершится значением timer с задержкой 10 мс; позднее завершение уже не изменит результат.

</details>

<details>
<summary>Решение</summary>

```text
5
2
```

Первое число печатает синхронный executor. Затем быстрее завершается `fast`, поэтому `Promise.race` передаёт в `then` число `2`.

Ожидаемый результат: сначала `5`, затем `2`.

Ручная проверка: запустите блок и сравните две строки консоли с прогнозом.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
