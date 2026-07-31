# Калькулятор в обратной польской записи

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте evaluateRpn(expression) для чисел и операций +, -, *, /, разделённых пробелами.
// Пустая строка возвращает 0; вход корректен, деления на ноль и нехватки операндов нет.
// Проверки ниже должны вывести 0, 6 и 14; используйте консольный JavaScript без ESM и browser API.

function evaluateRpn(expression) {
  // Напишите решение.
}

console.log(evaluateRpn(''));
console.log(evaluateRpn('2 3 *'));
console.log(evaluateRpn('5 1 2 + 4 * + 3 -'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Стек хранит ещё не использованные числа: число кладётся наверх, а оператор снимает два последних операнда.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала обработайте пустую строку, затем разделите остальные токены по пробелам и проходите их слева направо.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первым снимайте правый операнд, вторым — левый: для `-` и `/` порядок влияет на результат. Результат операции верните в стек.

</details>

<details>
<summary>Решение</summary>

```javascript
function evaluateRpn(expression) {
  if (expression.trim() === '') {
    return 0;
  }

  const stack = [];
  const operations = {
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '*': (left, right) => left * right,
    '/': (left, right) => left / right,
  };

  for (const token of expression.trim().split(/\s+/)) {
    const operation = operations[token];

    if (!operation) {
      stack.push(Number(token));
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();
    stack.push(operation(left, right));
  }

  return stack.pop();
}
```

Каждый оператор сворачивает два верхних значения стека в одно. После обработки корректного выражения в стеке остаётся единственный результат.

Ожидаемый результат: строки `0`, `6`, `14`.

Ручная проверка: вставьте решение и сравните три строки; затем проверьте `evaluateRpn('8 2 /')` — порядок операндов должен дать `4`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
