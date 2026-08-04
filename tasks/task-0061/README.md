# task-0061 — Сумма с прямым и каррированным вызовом

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте sum: она должна поддерживать вызовы sum(a, b) и sum(a)(b), возвращая сумму двух чисел.
// Ноль — полноценный второй аргумент: проверки ниже должны вывести 3, 3, 5 и 5.

function sum(first, second) {
  if (second) {
    return first + second;
  }

  return (next) => first + next;
}

console.log(sum(1, 2));
console.log(sum(1)(2));
console.log(sum(5, 0));
console.log(sum(0)(5));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Проверка значения через `if (second)` смешивает два разных случая: аргумент не передан и аргумент равен нулю.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Обычная функция может определить количество переданных аргументов через `arguments.length`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

При двух аргументах сразу верните сумму, а при одном — функцию, которая принимает второе слагаемое.

</details>

<details>
<summary>Решение</summary>

```javascript
function sum(first, second) {
  if (arguments.length === 2) {
    return first + second;
  }

  return (next) => first + next;
}
```

Количество аргументов отличает прямой вызов от каррированного независимо от значения `second`, поэтому ноль не переключает функцию в неверную ветвь.

Ожидаемый результат: четыре строки `3`, `3`, `5`, `5`.

Ручная проверка: вставьте решение и сравните четыре строки; затем проверьте `sum(-2, 0)` и `sum(-2)(0)` — оба вызова должны вернуть `-2`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
