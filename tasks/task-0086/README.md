# task-0086 — Группировка анаграмм в порядке входа

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте groupAnagrams: сгруппируйте строки с одинаковым набором символов.
// Группы должны идти по первому появлению их сигнатуры, а слова внутри каждой группы — в исходном порядке.

function groupAnagrams(words) {
  // Напишите решение.
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));
console.log(groupAnagrams(['']));
console.log(groupAnagrams(['a']));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Одинаковая отсортированная строка может быть сигнатурой анаграмм.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните группы в `Map`: порядок его ключей совпадает с первым добавлением каждой сигнатуры.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для каждого слова получите `word.split('').sort().join('')`, создайте массив при первом ключе и добавьте слово в него.

</details>

<details>
<summary>Решение</summary>

```javascript
function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const signature = word.split('').sort().join('');

    if (!groups.has(signature)) {
      groups.set(signature, []);
    }

    groups.get(signature).push(word);
  }

  return [...groups.values()];
}
```

`Map` фиксирует порядок первой сигнатуры, а добавление в массив оставляет порядок слов внутри группы.

Ожидаемый результат: `[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]`, затем `[['']]` и `[['a']]`.

Ручная проверка: добавьте `'tae'` в конец первого набора и проверьте, что он становится последним элементом первой группы.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Строки
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
