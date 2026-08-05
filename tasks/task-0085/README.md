# task-0085 — Проверка двух строк на анаграмму

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте isAnagram: верните true, если две строки содержат одинаковое количество каждого символа с тем же регистром.
// Пробелы и другие символы считаются обычными символами.

function isAnagram(first, second) {
  // Напишите решение.
}

console.log(isAnagram('finder', 'friend'));
console.log(isAnagram('test', 'sets'));
console.log(isAnagram('abc', 'aaa'));
console.log(isAnagram('abb', 'aab'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Строки разной длины уже не могут быть анаграммами.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Соберите счётчик символов первой строки, а при обходе второй уменьшайте соответствующий счётчик.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Если у символа второй строки нет положительного счётчика, сразу верните `false`; в конце все счётчики должны стать нулевыми.

</details>

<details>
<summary>Решение</summary>

```javascript
function isAnagram(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  const counts = new Map();

  for (const character of first) {
    counts.set(character, (counts.get(character) ?? 0) + 1);
  }

  for (const character of second) {
    const count = counts.get(character) ?? 0;

    if (count === 0) {
      return false;
    }

    counts.set(character, count - 1);
  }

  return true;
}
```

Счётчики проверяют не только наличие символа, но и точное число его повторений.

Ожидаемый результат: `true`, `false`, `false`, `false`.

Ручная проверка: сравните `'aab'` и `'aba'`, затем `'aab'` и `'abb'`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Строки
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
