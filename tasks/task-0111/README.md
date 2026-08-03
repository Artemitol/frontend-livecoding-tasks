# NaN и сравнение с самим собой

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите три строки вывода и объясните результат сравнения через особое значение NaN.
// Укажите, почему нестрогое равенство не делает два NaN равными.
// Используйте консольный JavaScript без ESM и browser API.

const left = Math.sqrt(-1);
const right = Math.sqrt(-1);
const expression = left == right;

console.log(expression);
console.log(Number.isNaN(left));
console.log(Number.isNaN(right));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`Math.sqrt(-1)` не возвращает обычное числовое значение.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала отдельно проверьте оба операнда через `Number.isNaN`, а затем сравнение между ними.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

`NaN` не равно ни одному значению, включая другой результат `NaN` и самого себя.

</details>

<details>
<summary>Решение</summary>

```text
false
true
true
```

Оба вызова создают `NaN`, однако спецификация сравнения считает `NaN` неравным любому значению. Нестрогое равенство не меняет это правило.

Ожидаемый результат: сначала `false`, затем два значения `true`.

Ручная проверка: сначала запишите прогноз, затем запустите блок и отдельно сравните `left === left`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 15 минут

</details>
