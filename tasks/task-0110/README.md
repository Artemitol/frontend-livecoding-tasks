# Граница безопасных целых чисел

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Предскажите значение expression и выведите оба вычисленных операнда.
// Объясните результат расстоянием между представимыми IEEE 754 числами около Number.MAX_SAFE_INTEGER, а не «жёстким лимитом» чисел.
// Используйте консольный JavaScript без ESM и browser API.

const left = Number.MAX_SAFE_INTEGER + 1;
const right = Number.MAX_SAFE_INTEGER + 2;
const expression = left === right;

console.log(left, right, expression);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Выведите `left` и `right` отдельно, прежде чем делать вывод о сравнении.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После максимального безопасного целого расстояние между соседними representable числами становится больше единицы.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оба выражения округляются к `9007199254740992`, поэтому строгое сравнение даёт `true`; далее существуют и другие representable числа.

</details>

<details>
<summary>Решение</summary>

```javascript
const left = Number.MAX_SAFE_INTEGER + 1;
const right = Number.MAX_SAFE_INTEGER + 2;
const expression = left === right;

console.log(left, right, expression);
```

Около этой величины IEEE 754 не представляет каждое целое: шаг между соседними представимыми значениями равен двум, поэтому оба операнда округляются к одному значению. Это не фиксированный верхний предел чисел.

Ожидаемый результат: `9007199254740992 9007199254740992 true`.

Ручная проверка: выведите `Number.MAX_SAFE_INTEGER + 3`; оно представится как следующее доступное число `9007199254740994`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
