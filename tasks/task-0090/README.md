# Сжатие последовательных числовых диапазонов

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте compressRanges: отсортируйте копию массива уникальных целых чисел и верните последовательные диапазоны через запятую.
// Одиночное число пишите без дефиса, для пустого массива верните '', а исходный numbers не изменяйте.
// Используйте консольный JavaScript без ESM и browser API.

function compressRanges(numbers) {
  numbers.sort((first, second) => first - second);
  const ranges = [];
  let start = numbers[0];
  let end = numbers[0];

  for (let index = 1; index < numbers.length; index += 1) {
    if (numbers[index] === end + 1) {
      end = numbers[index];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = numbers[index];
      end = numbers[index];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(',');
}

const numbers = [1, 2, 5, 10, 9, 11, 6, 8, 0, 13];
const before = JSON.stringify(numbers);

console.log(compressRanges(numbers));
console.log(compressRanges([]));
console.log(before === JSON.stringify(numbers));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

До обращения к первому элементу отдельно обработайте пустой массив.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`sort()` меняет массив, поэтому сортируйте копию через `[...numbers]`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Ведите `start` и `end` текущего диапазона; при разрыве сохраните его строку и начните следующий диапазон.

</details>

<details>
<summary>Решение</summary>

```javascript
function compressRanges(numbers) {
  if (numbers.length === 0) {
    return '';
  }

  const sorted = [...numbers].sort((first, second) => first - second);
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index] === end + 1) {
      end = sorted[index];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[index];
      end = sorted[index];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(',');
}
```

Сортировка копии сохраняет входной массив, а пустой вход не создаёт несуществующий диапазон.

Ожидаемый результат: `0-2,5-6,8-11,13`, пустая строка и `true` для неизменённого входа.

Ручная проверка: добавьте `16` в копию fixture и проверьте, что в конце результата появляется `,16`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
