# Три timer после Promise

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите восемь строк консоли в точном порядке.
// Объясните синхронность executor, очередь microtask и порядок трёх timer с нулевой задержкой.
// Учтите, что второй timer регистрируется из Promise callback; используйте обычный консольный JavaScript без ESM.

setTimeout(() => {
  console.log('setTimeout 1');
}, 0);

const promise = new Promise((resolve) => {
  console.log('Promise 1');
  resolve();
  console.log('Promise 2');
});

promise.then(() => {
  console.log('Promise 3');

  setTimeout(() => {
    console.log('setTimeout 2');
  }, 0);
});

setTimeout(() => {
  console.log('setTimeout 3');
}, 0);

promise.then(() => {
  console.log('Promise 4');
});

console.log('final');
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала разделите логи на executor и основной стек, Promise callbacks и timer callbacks.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Executor запускается при создании Promise, поэтому обе строки `Promise` из него появляются до `final`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После стека выполняются два `then`; первый из них регистрирует `setTimeout 2` уже после двух timer, созданных основным кодом.

</details>

<details>
<summary>Решение</summary>

```text
Promise 1
Promise 2
final
Promise 3
Promise 4
setTimeout 1
setTimeout 3
setTimeout 2
```

Executor и `final` выполняются синхронно. Затем очередь microtask запускает обработчики `then` в порядке регистрации. Timer callbacks уже стоят как `1`, `3`, а `2` добавляется только из первой microtask, поэтому выполняется последним.

Ожидаемый результат: консоль содержит восемь строк в указанном порядке.

Ручная проверка: сначала запишите прогноз, затем запустите блок в Programiz и построчно сравните фактический вывод, отдельно отметив момент регистрации каждого timer.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
