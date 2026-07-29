# Стабильная сортировка товаров по двум ключам

Откройте [Programiz JavaScript Online Compiler](https://www.programiz.com/javascript/online-compiler/), полностью замените код блоком ниже и нажмите **Run**. Используйте консольный JavaScript; режим ESM для этой задачи не нужен.

## Условие

Исправьте `sortProducts(products)`: верните новый массив товаров, отсортированный сначала по `price` по возрастанию, затем по `rating` по убыванию. Товары с одинаковыми `price` и `rating` должны сохранить исходный порядок. Не изменяйте входной массив и его объекты; для пустого массива верните новый пустой массив, а для не-массива или товара с пустым `id`, отрицательной либо неконечной `price` или неконечным `rating` выбросьте `TypeError`.

```javascript
function sortProducts(products) {
  return products.sort((left, right) => left.price - right.price);
}

const products = [
  { id: 'p1', price: 20, rating: 4 },
  { id: 'p2', price: 20, rating: 4 },
  { id: 'p3', price: 10, rating: 3 },
  { id: 'p4', price: 20, rating: 5 },
];

console.log(sortProducts(products).map(({ id }) => id).join(','));
console.log(products.map(({ id }) => id).join(','));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У исходной функции две независимые проблемы: `sort` меняет массив, а компаратор учитывает только цену.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После проверки товаров создайте служебный массив, в котором рядом с каждым товаром хранится его исходный индекс.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сравните цену, затем рейтинг в обратном направлении, а при полном равенстве — исходные индексы; после сортировки уберите индексы.

</details>

<details>
<summary>Решение</summary>

```javascript
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
```

Служебный массив защищает `products` от мутации, два первых сравнения задают ключи, а исходный индекс явно сохраняет порядок равных товаров. После запуска ожидаются строки `p3,p4,p1,p2` и `p1,p2,p3,p4`. Для ручной проверки также передайте `[]` и товар с `price: Number.NaN`: получите новый пустой массив и `TypeError`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Массивы и объекты
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
