# task-0092 — Односвязный список

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте класс ListNode с value и next, а также printValues для обхода списка без рекурсии.
// printValues выводит значения в порядке узлов; для null не выводите ничего.

class ListNode {
  // Напишите решение.
}

function printValues(head) {
  // Напишите решение.
}

const first = new ListNode(2, new ListNode(4, new ListNode(3)));
const second = new ListNode(5, new ListNode(6, new ListNode(4)));

printValues(first);
printValues(second);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Конструктор может принимать `next` со значением по умолчанию `null`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для обхода заведите переменную `current`, начинающуюся с головы списка.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Пока `current !== null`, выводите `current.value` и переходите к `current.next`.

</details>

<details>
<summary>Решение</summary>

```javascript
class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function printValues(head) {
  let current = head;

  while (current !== null) {
    console.log(current.value);
    current = current.next;
  }
}
```

Указатель `current` последовательно проходит по ссылкам `next`.

Ожидаемый результат: `2`, `4`, `3`, `5`, `6`, `4` — каждое число с новой строки.

Ручная проверка: вызовите `printValues(null)`; консоль должна остаться без нового вывода.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Связные списки и стек
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 20 минут

</details>
