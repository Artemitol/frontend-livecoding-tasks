# task-0112 — Пустые Math.max и Math.min

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите три строки вывода для Math.max и Math.min без аргументов.
// Объясните, почему результат сравнения не зависит от отсутствия чисел в вызовах.

const maximum = Math.max();
const minimum = Math.min();
const expression = maximum > minimum;

console.log(maximum);
console.log(minimum);
console.log(expression);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Для пустых вызовов эти функции возвращают специальные бесконечные числовые значения.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Вспомните нейтральные начальные значения для поиска максимума и минимума.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Пустой `Math.max()` даёт `-Infinity`, а пустой `Math.min()` — `Infinity`, поэтому первое значение не больше второго.

</details>

<details>
<summary>Решение</summary>

```text
-Infinity
Infinity
false
```

`Math.max` начинает поиск с нижней границы, а `Math.min` — с верхней. Без аргументов эти значения остаются `-Infinity` и `Infinity`.

Ожидаемый результат: `-Infinity`, `Infinity`, затем `false`.

Ручная проверка: запустите блок, затем сравните `Math.max(5)` и `Math.min(5)` с их пустыми вызовами.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Числа, типы и операторы
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 15 минут

</details>
