# task-0022 — Ветки отклонённого Promise

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите шесть строк консоли в точном порядке.
// Один Promise отклоняется после лога; у трёх веток есть обработчики отклонения, а первая ветка продолжается дальше.

console.log(77);

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('reject');
    reject();
  }, 10);
});

promise
  .then(() => console.log(10), () => console.log(11))
  .then(() => console.log(13), () => console.log(14));

promise.then(() => console.log(18), () => console.log(19));
promise.then(() => console.log(23), () => console.log(24));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У всех трёх `then` один источник — отклонённый `promise`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Второй аргумент `then` обрабатывает отклонение и возвращает обычное завершение своей ветке.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сначала выполните три обработчика отклонения в порядке подписки, затем продолжение только первой восстановленной ветки.

</details>

<details>
<summary>Решение</summary>

```text
77
reject
11
19
24
13
```

После отклонения запускаются обработчики трёх подписок. Первый из них возвращает `undefined`, поэтому его следующий `then` выполняет обработчик успешного завершения и печатает `13`.

Ожидаемый результат: строки идут в порядке `77`, `reject`, `11`, `19`, `24`, `13`.

Ручная проверка: запустите блок и отметьте, какая ветка порождает последнюю строку.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
