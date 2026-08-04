# task-0047 — Замыкания и переназначенные значения

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите пять строк консоли в точном порядке, включая две итоговые цены.
// Объясните, почему применение скидки читает текущие globalDiscount и regionalDiscount, но сохраняет объект discount конкретного discounter.

function getDiscountedPrice(initialPrice, discounts) {
  return discounts.reduce(
    (price, currentDiscount) =>
      price * (100 - currentDiscount) / 100,
    initialPrice,
  );
}

let globalDiscount = 10;
let regionalDiscount = { value: 20 };
let promoDiscount = { value: 30 };

function createDiscounter(discount) {
  console.log(
    `создан дискаунтер, скидки: ${
      [globalDiscount, regionalDiscount.value, discount.value]
    }`,
  );

  return (price) => {
    const discounts = [
      globalDiscount,
      regionalDiscount.value,
      discount.value,
    ];

    console.log(`применение скидок: ${discounts}`);
    return getDiscountedPrice(price, discounts);
  };
}

const discounterA = createDiscounter(promoDiscount);

regionalDiscount = { value: 60 };
promoDiscount = { value: 70 };

const discounterB = createDiscounter(promoDiscount);

globalDiscount = 50;

const discountedPriceA = discounterA(1000);
const discountedPriceB = discounterB(1000);

console.log(discountedPriceA, discountedPriceB);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Замыкание сохраняет доступ к переменным и переданному объекту, а не копирует все их значения в момент создания.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Первые два лога выполняются сразу при вызовах `createDiscounter`, до изменения `globalDiscount`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Обе функции видят текущие `50` и `60`, но `discounterA` хранит первый promo-объект со значением `30`, а `discounterB` — второй со значением `70`.

</details>

<details>
<summary>Решение</summary>

```text
создан дискаунтер, скидки: 10,20,30
создан дискаунтер, скидки: 10,60,70
применение скидок: 50,60,30
применение скидок: 50,60,70
140 60
```

Глобальная скидка и переменная регионального объекта читаются при применении. Параметр `discount` каждой созданной функции продолжает ссылаться на тот объект, который был передан именно ей.

Ожидаемый результат: четыре строки со списками скидок в указанном порядке и итоговая строка `140 60`.

Ручная проверка: сначала запишите прогноз, затем запустите блок и для каждой строки отметьте, была ли переменная прочитана при создании или при применении.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
