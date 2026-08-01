# Поиск строк с подстрокой

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте findSubstring: верните строки, в которых есть подстрока с тем же регистром и непрерывными символами.
// Сохраните порядок входного массива; используйте те же данные для проверки, включая перекрывающийся префикс.
// Используйте консольный JavaScript без ESM и browser API.

function findSubstring(substring, strings) {
  // Напишите решение.
}

const strings = ['fuzzy', 'maskva', 'mama', 'search', 'algorithm', 'utility', 'aam'];

console.log(findSubstring('am', strings));
console.log(findSubstring('Aa', ['Aa', 'aa', 'BAaB']));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У строк уже есть метод, который ищет непрерывную подстроку.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Отфильтруйте массив и для каждой строки проверьте результат `includes`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Условие фильтра — `value.includes(substring)`; этот метод чувствителен к регистру и находит `am` в `aam`.

</details>

<details>
<summary>Решение</summary>

```javascript
function findSubstring(substring, strings) {
  return strings.filter((value) => value.includes(substring));
}
```

`includes` ищет соседние символы в указанном порядке и не меняет входной массив.

Ожидаемый результат: `[ 'mama', 'aam' ]`, `[ 'Aa', 'BAaB' ]`.

Ручная проверка: вызовите `findSubstring('AM', strings)`; результатом должен быть `[]`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
