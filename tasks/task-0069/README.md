# task-0069 — Числовые функции и каррированное сложение

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте one, two и plus: вызов one() возвращает 1, two() возвращает 2, а переданная операция применяется к соответствующему числу.
// plus(right) должна вернуть операцию, которая прибавляет right к полученному левому числу.
// Проверки ниже должны вывести 1, 2, 3 и 3.

function one(operation) {
  // Напишите решение.
}

function plus(right) {
  // Напишите решение.
}

function two(operation) {
  // Напишите решение.
}

console.log(one());
console.log(two());
console.log(one(plus(two())));
console.log(two(plus(one())));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`one` и `two` выполняют одинаковый выбор: вернуть своё число или передать его функции `operation`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Проверьте, является ли аргумент функцией; это отделяет простой числовой вызов от вызова с операцией.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

`plus(right)` возвращает `(left) => left + right`, поэтому внешний `one` или `two` подставит левый операнд последним.

</details>

<details>
<summary>Решение</summary>

```javascript
function one(operation) {
  return typeof operation === 'function' ? operation(1) : 1;
}

function plus(right) {
  return (left) => left + right;
}

function two(operation) {
  return typeof operation === 'function' ? operation(2) : 2;
}
```

Числовые функции возвращают значение без операции и становятся левым операндом, когда операция передана. `plus` заранее замыкает правый операнд.

Ожидаемый результат: строки `1`, `2`, `3`, `3`.

Ручная проверка: вставьте решение и сравните четыре строки; затем вызовите `plus(5)(2)` и убедитесь, что результат равен `7`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
