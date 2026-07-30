# Цепочки с задержками и finally

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите порядок восьми строк консоли.
// Сопоставьте синхронный executor, Promise callback, timer на 100 мс, цепочку на 500 мс и timer, созданный в finally.
// Используйте современный консольный JavaScript с Promise и timer без ESM и browser API.

setTimeout(() => {
  console.log('setTimeout 100');
  new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    console.log('sleep 1000 then');
  });
}, 100);

const promise = new Promise((resolve) => {
  console.log('in promise');
  resolve('Promise then');
});

new Promise((resolve) => setTimeout(resolve, 500))
  .then(() => console.log('sleep 2000 then'))
  .finally(() => {
    console.log('sleep 2000 finally');
    setTimeout(() => console.log('finally setTimeout 1000'), 1000);
  });

console.log('log1');
promise.then((value) => console.log(value));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала расположите синхронные логи и единственный уже разрешённый Promise.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Timer на 100 мс создаёт свой вложенный timer на 1000 мс раньше, чем `finally` создаёт свой.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После timer на 500 мс его `then` и `finally` идут подряд как microtask; затем остаётся сравнить два timer на 1000 мс по моменту регистрации.

</details>

<details>
<summary>Решение</summary>

```text
in promise
log1
Promise then
setTimeout 100
sleep 2000 then
sleep 2000 finally
sleep 1000 then
finally setTimeout 1000
```

Executor и основной стек завершаются до microtask. Timer на 100 мс первым ставит вложенную работу на 1000 мс; `finally` создаёт второй такой timer только после завершения цепочки на 2000 мс.

Ожидаемый результат: восемь строк в указанном порядке.

Ручная проверка: выполните блок и сравните порядок, не меняя задержки.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>
