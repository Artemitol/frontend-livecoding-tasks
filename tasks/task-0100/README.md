# Упорядоченная подпоследовательность

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте isOrderedSubsequence: все символы needle должны встретиться в haystack в том же порядке, но не обязательно рядом.
// Учитывайте повторы символов; пустая needle считается подходящей.
// Используйте консольный JavaScript без ESM и browser API.

function isOrderedSubsequence(needle, haystack) {
  // Напишите решение.
}

console.log(isOrderedSubsequence('whe', 'cartwheel'));
console.log(isOrderedSubsequence('crt', 'cartwheel'));
console.log(isOrderedSubsequence('ctr', 'cartwheel'));
console.log(isOrderedSubsequence('weee', 'cartwheel'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Достаточно хранить индекс следующего символа из `needle`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Пройдите `haystack` слева направо и увеличивайте индекс только при совпадении.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После обхода сравните индекс с `needle.length`; повторяющиеся буквы потребуют столько же совпадений.

</details>

<details>
<summary>Решение</summary>

```javascript
function isOrderedSubsequence(needle, haystack) {
  let needleIndex = 0;

  for (const character of haystack) {
    if (character === needle[needleIndex]) needleIndex += 1;
  }

  return needleIndex === needle.length;
}
```

Один указатель отмечает, какая буква подпоследовательности ещё ожидается.

Ожидаемый результат: `true`, `true`, `false`, `false`.

Ручная проверка: вызовите `isOrderedSubsequence('', 'cartwheel')`; результат должен быть `true`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
