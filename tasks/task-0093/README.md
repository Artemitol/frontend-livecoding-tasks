# task-0093 — Слияние отсортированных списков

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте mergeSortedLists для двух односвязных списков с числами по возрастанию.
// Переиспользуйте исходные узлы, сохраните порядок по возрастанию и верните второй список, если первый пуст.

class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function mergeSortedLists(first, second) {
  // Напишите решение.
}

function valuesOf(head) {
  const values = [];
  for (let current = head; current !== null; current = current.next) values.push(current.value);
  return values;
}

const first = new ListNode(1, new ListNode(3, new ListNode(5)));
const second = new ListNode(2, new ListNode(4, new ListNode(6)));

console.log(valuesOf(mergeSortedLists(first, second)));
console.log(valuesOf(mergeSortedLists(null, new ListNode(7))));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Нужен фиктивный начальный узел, чтобы одинаково присоединять первый и последующие узлы.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сравнивайте `value` у текущих узлов и присоединяйте меньший к хвосту результата.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Когда один список закончился, присоедините к хвосту оставшуюся часть другого списка.

</details>

<details>
<summary>Решение</summary>

```javascript
function mergeSortedLists(first, second) {
  const dummy = new ListNode(null);
  let tail = dummy;

  while (first !== null && second !== null) {
    if (first.value <= second.value) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }

  tail.next = first ?? second;
  return dummy.next;
}
```

Алгоритм меняет только ссылки существующих узлов и проходит каждый список один раз.

Ожидаемый результат: `[ 1, 2, 3, 4, 5, 6 ]`, `[ 7 ]`.

Ручная проверка: передайте два пустых списка; результат должен быть `null`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Связные списки и стек
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
