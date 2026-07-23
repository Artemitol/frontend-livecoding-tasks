# Стабильная сортировка товаров по двум ключам

[← Все подборки](../../README.md)

Откройте [Programiz JavaScript Online Compiler](https://www.programiz.com/javascript/online-compiler/), замените код в редакторе полным блоком ниже и нажмите **Run**. Код использует только консольный JavaScript; исходное выполнение как Node.js ESM не влияло на сортировку.

## Условие

```js
// Учебная цель: исправлять многокритериальную сортировку, сохраняя
// исходный массив и корректно обрабатывая равные ключи.
//
// Исправьте sortProducts(products).
// Сортируйте по price по возрастанию, затем по rating по убыванию.
// Товары с равными price и rating должны сохранить исходный порядок.
// Верните новый массив, не меняйте products и его объекты.
// Для пустого массива верните новый пустой массив.
// Некорректный вход должен выбрасывать TypeError.

function sortProducts(products) {
  return products.sort((left, right) => left.price - right.price);
}

const products = [
  { id: 'p1', price: 20, rating: 4 },
  { id: 'p2', price: 20, rating: 4 },
  { id: 'p3', price: 10, rating: 3 },
  { id: 'p4', price: 20, rating: 2 },
];
const ratingProducts = [
  { id: 'r1', price: 20, rating: 2 },
  { id: 'r2', price: 20, rating: 5 },
];
const sourceOrder = products.map(({ id }) => id).join(',');

function verify() {
  try {
    const sorted = sortProducts(products);
    const sortedOrder = sorted.map(({ id }) => id).join(',');
    const orderPass = sortedOrder === 'p3,p1,p2,p4';
    const ratingOrder = sortProducts(ratingProducts)
      .map(({ id }) => id)
      .join(',');
    const bothKeysPass = ratingOrder === 'r2,r1';
    const unchangedPass =
      products.map(({ id }) => id).join(',') === sourceOrder;
    const equalOrderPass =
      sorted.findIndex(({ id }) => id === 'p1') <
      sorted.findIndex(({ id }) => id === 'p2');
    const empty = sortProducts([]);
    const emptyPass = Array.isArray(empty) && empty.length === 0;

    let invalidPass = false;
    try {
      sortProducts([{ id: 'p1', price: Number.NaN, rating: 4 }]);
    } catch (error) {
      invalidPass = error instanceof TypeError;
    }

    console.log({
      sortedOrder,
      orderPass,
      ratingOrder,
      bothKeysPass,
      unchangedPass,
      equalOrderPass,
      emptyPass,
      invalidPass,
    });
  } catch (error) {
    console.log(`Пока не готово: ${error.name}: ${error.message}`);
  }
}

verify();
```

## Готово, когда

- В консоли `sortedOrder` равен `p3,p1,p2,p4`, `ratingOrder` равен `r2,r1`, а `bothKeysPass` равен `true`: используются оба ключа.
- `unchangedPass` и `equalOrderPass` равны `true`: вход не изменён, а `p1` остаётся раньше `p2`.
- `emptyPass` и `invalidPass` равны `true`: пустой массив поддержан, некорректный товар отклонён.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У исходного варианта две независимые проблемы: `sort` меняет массив и компаратор сравнивает только `price`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала проверьте все товары, затем создайте новую служебную коллекцию, в которой вместе с товаром хранится его исходный индекс.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Компаратор последовательно возвращает разницу цен, затем обратную разницу рейтингов, а при полном равенстве — разницу исходных индексов. После сортировки уберите служебные индексы.

</details>

<details>
<summary>Решение</summary>

```js
function isValidProduct(product) {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.id === 'string' &&
    product.id.length > 0 &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    Number.isFinite(product.rating)
  );
}

function sortProducts(products) {
  if (!Array.isArray(products) || !products.every(isValidProduct)) {
    throw new TypeError('products must contain valid products');
  }

  return products
    .map((product, index) => ({ product, index }))
    .sort((left, right) => {
      const byPrice = left.product.price - right.product.price;
      if (byPrice !== 0) {
        return byPrice;
      }

      const byRating = right.product.rating - left.product.rating;
      if (byRating !== 0) {
        return byRating;
      }

      return left.index - right.index;
    })
    .map(({ product }) => product);
}

const products = [
  { id: 'p1', price: 20, rating: 4 },
  { id: 'p2', price: 20, rating: 4 },
  { id: 'p3', price: 10, rating: 3 },
  { id: 'p4', price: 20, rating: 2 },
];
const ratingProducts = [
  { id: 'r1', price: 20, rating: 2 },
  { id: 'r2', price: 20, rating: 5 },
];
const sourceOrder = products.map(({ id }) => id).join(',');

function verify() {
  try {
    const sorted = sortProducts(products);
    const sortedOrder = sorted.map(({ id }) => id).join(',');
    const orderPass = sortedOrder === 'p3,p1,p2,p4';
    const ratingOrder = sortProducts(ratingProducts)
      .map(({ id }) => id)
      .join(',');
    const bothKeysPass = ratingOrder === 'r2,r1';
    const unchangedPass =
      products.map(({ id }) => id).join(',') === sourceOrder;
    const equalOrderPass =
      sorted.findIndex(({ id }) => id === 'p1') <
      sorted.findIndex(({ id }) => id === 'p2');
    const empty = sortProducts([]);
    const emptyPass = Array.isArray(empty) && empty.length === 0;

    let invalidPass = false;
    try {
      sortProducts([{ id: 'p1', price: Number.NaN, rating: 4 }]);
    } catch (error) {
      invalidPass = error instanceof TypeError;
    }

    console.log({
      sortedOrder,
      orderPass,
      ratingOrder,
      bothKeysPass,
      unchangedPass,
      equalOrderPass,
      emptyPass,
      invalidPass,
    });
  } catch (error) {
    console.log(`Пока не готово: ${error.name}: ${error.message}`);
  }
}

verify();
```

### Почему это работает

Валидация сохраняет прежний входной контракт. Служебный массив отделяет сортировку от `products`, первый ненулевой критерий задаёт нужный порядок, а исходный индекс явно фиксирует стабильность элементов с равными ключами.

</details>

<details>
<summary>Самопроверка</summary>

- Почему прямой вызов `products.sort(...)` нарушает контракт?
- Почему рейтинг сравнивается в обратном направлении?
- Когда можно безопасно полагаться на стабильность встроенного `sort` без исходного индекса?

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Массивы и объекты
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
