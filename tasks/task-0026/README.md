# task-0026 — Promise с задержкой

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите delay, которая возвращает Promise, успешно завершающийся после переданного числа миллисекунд.
// Не вызывайте callback раньше времени и завершите Promise ровно один раз.

function delay(milliseconds) {
  // Напишите решение.
}

const startedAt = Date.now();

delay(20).then(() => {
  console.log(Date.now() - startedAt >= 20);
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Функция должна сразу вернуть объект `Promise`, а не результат timer.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Передайте `resolve` в callback `setTimeout` с нужной задержкой.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Создайте `new Promise((resolve) => { ... })` и вызовите `resolve` из timer без значения.

</details>

<details>
<summary>Решение</summary>

```javascript
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
```

`delay` создаёт Promise сразу, а его callback выполняется timer после запрошенной задержки.

Ожидаемый результат: через 20 мс в консоль выводится `true`.

Ручная проверка: вставьте решение, запустите блок и убедитесь, что `true` появляется после паузы.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 10 минут

</details>
