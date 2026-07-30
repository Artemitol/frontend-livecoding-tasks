# Вложенная регистрация then

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите шесть букв в консоли в точном порядке.
// Объясните, куда попадает then, зарегистрированный внутри другого then у уже fulfilled Promise.
// Сравните его с ранее зарегистрированным handler и timer; используйте консольный JavaScript без ESM.

const promise = new Promise((resolve) => {
  console.log('A');
  resolve();
});

console.log('B');

promise.then(() => {
  console.log('D');

  promise.then(() => {
    console.log('C');
  });
});

setTimeout(() => {
  console.log('E');
}, 0);

promise.then(() => {
  console.log('F');
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Executor Promise и `console.log('B')` относятся к текущему стеку, а каждый `then` — к очереди microtask.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

До опустошения стека уже зарегистрированы handlers с `D` и `F`, именно в таком порядке.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Handler с `C` появляется только во время выполнения `D`, поэтому добавляется после уже ожидающего `F`, но всё ещё перед timer с `E`.

</details>

<details>
<summary>Решение</summary>

```text
A
B
D
F
C
E
```

`A` и `B` синхронны. Microtasks `D` и `F` уже стоят в очереди; выполнение `D` добавляет `C` в её конец. Очередь microtask полностью завершается до timer callback.

Ожидаемый результат: консоль выводит `A`, `B`, `D`, `F`, `C`, `E`.

Ручная проверка: нарисуйте очередь после основного стека и ещё раз сразу после лога `D`, затем запустите код и сравните шесть строк.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
