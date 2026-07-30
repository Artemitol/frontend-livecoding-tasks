# Цепочка Promise между двумя timer

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите пять чисел в консоли в точном порядке.
// Объясните, почему второй then ждёт завершения первого и почему оба timer выполняются позже цепочки.
// Используйте обычный консольный JavaScript без browser API и ESM.

const promise = Promise.resolve();

setTimeout(() => {
  console.log(1);
}, 0);

promise
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  });

setTimeout(() => {
  console.log(4);
}, 0);

console.log(5);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Отделите синхронный `console.log` от двух продолжений Promise и двух timer callbacks.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Первым завершится текущий стек, поэтому до обработки очередей будет выведено только одно число.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первый `then` ставит следующий `then` в очередь microtask; эта очередь исчерпывается до перехода к timer в порядке их регистрации.

</details>

<details>
<summary>Решение</summary>

```text
5
2
3
1
4
```

Число `5` выводится в текущем стеке. Выполненный Promise запускает первый `then`, после него — продолжение цепочки с `3`. Только затем event loop переходит к двум timer.

Ожидаемый результат: консоль последовательно выводит `5`, `2`, `3`, `1`, `4`.

Ручная проверка: подпишите каждую строку как stack, microtask или timer, затем запустите код и сравните порядок с пятью строками решения.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 10 минут

</details>
