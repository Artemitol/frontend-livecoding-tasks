# task-0091 — Идентичность двоичных деревьев

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте isSameTree: два узла одинаковы, если у них равны value, left и right рекурсивно.
// null равен только null. Верните true для одинаковых tree1/tree3 и false для tree1/tree2.

function isSameTree(first, second) {
  // Напишите решение.
}

const tree1 = { value: 1, left: { value: 2, left: null, right: null }, right: { value: 3, left: null, right: null } };
const tree2 = { value: 1, left: { value: 4, left: null, right: null }, right: { value: 3, left: null, right: null } };
const tree3 = { value: 1, left: { value: 2, left: null, right: null }, right: { value: 3, left: null, right: null } };

console.log(isSameTree(tree1, tree2));
console.log(isSameTree(tree1, tree3));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала отдельно обработайте пару пустых узлов и случай, когда пуст только один из них.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После сравнения value вызовите ту же функцию для левых и правых потомков.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оба рекурсивных сравнения должны вернуть `true`, поэтому соедините их через `&&`.

</details>

<details>
<summary>Решение</summary>

```javascript
function isSameTree(first, second) {
  if (first === null && second === null) return true;
  if (first === null || second === null) return false;
  return first.value === second.value
    && isSameTree(first.left, second.left)
    && isSameTree(first.right, second.right);
}
```

Функция сопоставляет каждую пару узлов в одинаковом положении.

Ожидаемый результат: `false`, `true`.

Ручная проверка: передайте `null, null` и `tree1, null`; ответы должны быть `true` и `false`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Деревья и рекурсия
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
