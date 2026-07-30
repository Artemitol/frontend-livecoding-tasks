# Значение после finally

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите пять строк консоли в точном порядке.
// Promise начинается со значения 2; then меняет его, catch пропускается, а finally не получает значение выполнения.
// Используйте современный консольный JavaScript с Promise и timer без ESM и browser API.

const a = 2;
const b = 3;
const c = 5;

const promise = Promise.resolve(a);

setTimeout(() => {
  console.log(b);
}, 0);

promise
  .then((value) => {
    console.log(value);
    return value * a;
  })
  .catch(() => {
    console.log('catch');
  })
  .finally((value) => {
    console.log(value);
    return value * a;
  })
  .then((value) => {
    console.log(value);
  });

console.log(c);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Определите, какие строки принадлежат основному стеку, а какие — Promise-цепочке.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`catch` не запускается после успешного `then`, а callback `finally` вызывается без аргумента результата.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Возврат из `finally` не заменяет успешное значение цепочки, поэтому последний `then` получает `4`; timer с `3` выполняется после microtask.

</details>

<details>
<summary>Решение</summary>

```text
5
2
undefined
4
3
```

Основной стек печатает `5`. Первый `then` превращает `2` в `4`; `finally` видит `undefined` и сохраняет успешный результат цепочки, поэтому следующий `then` получает `4`. Timer выполняется последним.

Ожидаемый результат: `5`, `2`, `undefined`, `4`, `3`.

Ручная проверка: запустите блок и отдельно проверьте аргумент callback `finally`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
