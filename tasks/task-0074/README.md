# Сумма числовых листьев

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте sumNumbers(source): рекурсивно сложите все числовые значения в объектах любой глубины и пропустите остальные значения.
// Не изменяйте source; проверки должны вывести -5 и true.
// Используйте консольный JavaScript без ESM и browser API.

function sumNumbers(source) {
  // Напишите решение.
}

const source = {
  first: 2,
  group: {
    second: 3,
    skipped: '4',
    nested: {
      third: -10,
    },
  },
};

const before = JSON.stringify(source);
console.log(sumNumbers(source));
console.log('inputUnchanged:', before === JSON.stringify(source));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Начните с нулевой суммы и переберите `Object.values(source)`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для числа прибавьте само значение, а для объекта вызовите эту же функцию.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Проверяйте `typeof value === 'number'` отдельно от `value && typeof value === 'object'`, чтобы строка `'4'` не участвовала в сумме.

</details>

<details>
<summary>Решение</summary>

```javascript
function sumNumbers(source) {
  let total = 0;

  for (const value of Object.values(source)) {
    if (typeof value === 'number') {
      total += value;
    } else if (value && typeof value === 'object') {
      total += sumNumbers(value);
    }
  }

  return total;
}
```

Рекурсивный вызов возвращает сумму вложенного объекта, а нечисловые листья пропускаются.

Ожидаемый результат: `-5` и `inputUnchanged: true`.

Ручная проверка: вставьте решение, затем добавьте числовой лист со значением `0` и убедитесь, что результат не меняется.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
