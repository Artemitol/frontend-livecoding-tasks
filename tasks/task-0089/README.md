# Проверка вложенных скобок

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте areBracketsValid: для строк из (), [], {}, <> верните true только при корректной вложенности и балансе.
// Пустая строка валидна; любой неподдерживаемый символ делает строку невалидной.
// Используйте консольный JavaScript без ESM и browser API.

function areBracketsValid(text) {
  // Напишите решение.
}

console.log(areBracketsValid('[[((]]))'));
console.log(areBracketsValid('[)'));
console.log(areBracketsValid('))[[(<>)()]]'));
console.log(areBracketsValid('[[<<>>]](((([[]]))))'));
console.log(areBracketsValid('([])'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Незакрытые открывающие скобки удобно хранить в стеке.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для закрывающей скобки сравните её с парой для последнего элемента стека.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После обхода верните `stack.length === 0`: лишняя открывающая скобка тоже делает строку невалидной.

</details>

<details>
<summary>Решение</summary>

```javascript
function areBracketsValid(text) {
  const pairs = { '(': ')', '[': ']', '{': '}', '<': '>' };
  const openings = new Set(Object.keys(pairs));
  const stack = [];

  for (const character of text) {
    if (openings.has(character)) {
      stack.push(character);
    } else if (pairs[stack.at(-1)] === character) {
      stack.pop();
    } else {
      return false;
    }
  }

  return stack.length === 0;
}
```

Стек требует закрывать именно последнюю ещё не закрытую скобку и поэтому обнаруживает пересечения и ранние закрытия.

Ожидаемый результат: `false`, `false`, `false`, `true`, `true`.

Ручная проверка: проверьте пустую строку и строку `'([)]'`; ответы должны быть `true` и `false`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
