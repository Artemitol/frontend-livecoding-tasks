# Итоги по категориям без мутаций

[← Все подборки](../../README.md)

Откройте [Programiz JavaScript Online Compiler](https://www.programiz.com/javascript/online-compiler/), замените код в редакторе полным блоком ниже и нажмите **Run**. Код рассчитан на консольный JavaScript без browser API; исходное выполнение как Node.js ESM не влияло на результат этой задачи.

## Условие

```js
// Учебная цель: преобразовывать и агрегировать коллекцию данных
// без изменения исходного массива.
//
// Реализуйте sumByCategory(entries).
// Верните новый объект: ключ — непустая строка category,
// значение — сумма всех конечных неотрицательных amount этой категории.
// Для пустого массива верните пустой объект.
// Если entries не массив или хотя бы одна запись некорректна,
// выбросьте TypeError. Не изменяйте массив и его элементы.

function sumByCategory(entries) {
  // Ваш код здесь.
}

const entries = [
  { category: 'books', amount: 12 },
  { category: 'games', amount: 25 },
  { category: 'books', amount: 8 },
];
const sourceSnapshot = JSON.stringify(entries);

function verify() {
  try {
    const totals = sumByCategory(entries);
    const regularPass =
      totals?.books === 20 &&
      totals?.games === 25;
    const emptyPass =
      JSON.stringify(sumByCategory([])) === '{}';

    let invalidPass = false;
    try {
      sumByCategory([{ category: 'books', amount: -1 }]);
    } catch (error) {
      invalidPass = error instanceof TypeError;
    }

    const unchangedPass = JSON.stringify(entries) === sourceSnapshot;
    console.log({
      totals,
      regularPass,
      emptyPass,
      invalidPass,
      unchangedPass,
    });
  } catch (error) {
    console.log(`Пока не готово: ${error.name}: ${error.message}`);
  }
}

verify();
```

## Готово, когда

- В консоли `totals` содержит `books: 20` и `games: 25`, а `regularPass` равен `true`.
- Для пустого массива `emptyPass` равен `true`, а для отрицательного `amount` — `invalidPass: true`.
- После всех вызовов `unchangedPass` равен `true`: исходный массив и его элементы не изменились.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Отделите проверку входа от агрегации. Для каждой записи проверьте объект, непустую `category` и конечный неотрицательный `amount`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала отклоните весь вход одним условием с `Array.isArray` и `every`, затем запустите `reduce` с новым пустым аккумулятором.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

На каждой итерации берите текущую сумму категории через `?? 0`, прибавляйте `amount` и возвращайте тот же новый аккумулятор. Входные записи при этом только читайте.

</details>

<details>
<summary>Решение</summary>

```js
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

const entries = [
  { category: 'books', amount: 12 },
  { category: 'games', amount: 25 },
  { category: 'books', amount: 8 },
];
const sourceSnapshot = JSON.stringify(entries);

function verify() {
  try {
    const totals = sumByCategory(entries);
    const regularPass =
      totals?.books === 20 &&
      totals?.games === 25;
    const emptyPass =
      JSON.stringify(sumByCategory([])) === '{}';

    let invalidPass = false;
    try {
      sumByCategory([{ category: 'books', amount: -1 }]);
    } catch (error) {
      invalidPass = error instanceof TypeError;
    }

    const unchangedPass = JSON.stringify(entries) === sourceSnapshot;
    console.log({
      totals,
      regularPass,
      emptyPass,
      invalidPass,
      unchangedPass,
    });
  } catch (error) {
    console.log(`Пока не готово: ${error.name}: ${error.message}`);
  }
}

verify();
```

### Почему это работает

Проверка не пропускает значения вне контракта. `reduce` начинает с нового объекта без прототипа и только читает `entries`, поэтому результат не связан с исходным массивом. `?? 0` отличает отсутствующую категорию от уже накопленной суммы `0`.

</details>

<details>
<summary>Самопроверка</summary>

- Почему аккумулятор не должен быть самим входным массивом?
- Что произойдёт с категорией, если первая сумма для неё равна `0`?
- Когда для такой агрегации удобнее вернуть `Map`, а не объект?

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Массивы и объекты
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
