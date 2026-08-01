# Разворот каждого второго слова

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте reverseEverySecondWord: разворачивайте каждое второе слово только из латинских букв.
// Числа, пробелы и символы оставляйте на прежних местах; счётчик слов не меняется на несловных токенах.
// Используйте консольный JavaScript без ESM и browser API.

function reverseEverySecondWord(text) {
  // Напишите решение.
}

console.log(reverseEverySecondWord('Look at the sky'));
console.log(reverseEverySecondWord('21 plus 22 = sorok tri'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите строку на чередующиеся последовательности букв и все остальные фрагменты.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Увеличивайте счётчик только когда очередной фрагмент состоит из букв.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для чётного номера слова разверните его через `split('').reverse().join('')`.

</details>

<details>
<summary>Решение</summary>

```javascript
function reverseEverySecondWord(text) {
  let wordCount = 0;

  return text.replace(/[A-Za-z]+/g, (word) => {
    wordCount += 1;
    return wordCount % 2 === 0
      ? word.split('').reverse().join('')
      : word;
  });
}
```

Регулярное выражение заменяет только слова, поэтому пробелы, числа и `=` сохраняются без изменений.

Ожидаемый результат: `'Look ta the yks'`, `'21 plus 22 = koros tri'`.

Ручная проверка: передайте `'one  two!'`; результат должен быть `'one  owt!'` с двумя пробелами.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
