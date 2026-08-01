# Сложение чисел в связанных списках

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте addReversedNumbers: цифры неотрицательных чисел хранятся от младшей к старшей.
// Верните новый список цифр суммы; обработайте перенос после последней цифры и списки разной длины.
// Используйте консольный JavaScript без ESM и browser API.

class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function addReversedNumbers(first, second) {
  // Напишите решение.
}

function valuesOf(head) {
  const values = [];
  for (let current = head; current !== null; current = current.next) values.push(current.value);
  return values;
}

console.log(valuesOf(addReversedNumbers(new ListNode(9, new ListNode(9)), new ListNode(1))));
console.log(valuesOf(addReversedNumbers(new ListNode(2, new ListNode(4, new ListNode(3))), new ListNode(5, new ListNode(6)))));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Перенос храните в отдельной переменной и включите его в условие цикла.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для отсутствующего узла используйте цифру `0`, не обращаясь к его `value`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Новый узел получает `sum % 10`, а следующий перенос равен `Math.floor(sum / 10)`.

</details>

<details>
<summary>Решение</summary>

```javascript
function addReversedNumbers(first, second) {
  const dummy = new ListNode(null);
  let tail = dummy;
  let carry = 0;

  while (first !== null || second !== null || carry !== 0) {
    const sum = (first?.value ?? 0) + (second?.value ?? 0) + carry;
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);
    first = first?.next ?? null;
    second = second?.next ?? null;
  }

  return dummy.next;
}
```

Сумма формируется по разрядам, поэтому заключительный перенос становится отдельным узлом.

Ожидаемый результат: `[ 0, 0, 1 ]`, `[ 7, 0, 4 ]`.

Ручная проверка: сложите `new ListNode(0)` и `new ListNode(0)`; результат должен быть `[ 0 ]`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
