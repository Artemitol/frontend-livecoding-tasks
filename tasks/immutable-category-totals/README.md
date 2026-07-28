# Итоги по категориям без мутаций

Откройте [Programiz JavaScript Online Compiler](https://www.programiz.com/javascript/online-compiler/), полностью замените код блоком ниже и нажмите **Run**. Используйте консольный JavaScript без browser API; режим ESM для этой задачи не нужен.

## Условие

Реализуйте `sumByCategory(entries)`: верните новый объект с суммой `amount` для каждой непустой строковой `category`, не изменяя входной массив и его элементы. Для пустого массива верните пустой объект. Если `entries` не массив или хотя бы одна запись содержит некорректные `category` либо `amount`, выбросьте `TypeError`; корректный `amount` — конечное неотрицательное число.

```javascript
function sumByCategory(entries) {
  // Верните новый объект с суммами по категориям.
}

const entries = [
  { category: 'books', amount: 12 },
  { category: 'games', amount: 25 },
  { category: 'books', amount: 8 },
];

console.log(JSON.stringify(sumByCategory(entries)));
console.log(JSON.stringify(entries));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала отделите проверку всего массива от накопления результата: у каждой записи должны быть подходящие `category` и `amount`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Проверьте массив через `Array.isArray` и `every`, затем запустите `reduce` с новым пустым аккумулятором.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

На каждой итерации берите текущую сумму через `totals[category] ?? 0`, прибавляйте `amount` и возвращайте аккумулятор.

</details>

<details>
<summary>Решение</summary>

```javascript
function isValidEntry(entry) {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof entry.category === 'string' &&
    entry.category.length > 0 &&
    Number.isFinite(entry.amount) &&
    entry.amount >= 0
  );
}

function sumByCategory(entries) {
  if (!Array.isArray(entries) || !entries.every(isValidEntry)) {
    throw new TypeError('entries must contain valid category amounts');
  }

  return entries.reduce((totals, { category, amount }) => {
    totals[category] = (totals[category] ?? 0) + amount;
    return totals;
  }, Object.create(null));
}
```

Проверка входа не пропускает значения вне контракта, а `reduce` читает записи и накапливает суммы в новом объекте. После запуска первая строка должна быть `{"books":20,"games":25}`, а вторая — неизменённый массив. Для ручной проверки также вызовите функцию с `[]` и с записью, где `amount` равен `-1`: получите `{}` и `TypeError`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Массивы и объекты
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
