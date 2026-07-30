# Обычные и стрелочные функции с this

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите все шесть чисел в точном порядке.
// Объясните, когда regular читает receiver места вызова, а arrow сохраняет receiver вызова createPair.
// Все вызовы receiver заданы явно, поэтому результат не зависит от strict mode; используйте консольный JavaScript без ESM и browser API.

function createPair() {
  return {
    value: 20,
    regular() {
      return this.value;
    },
    arrow: () => this.value,
  };
}

const first = createPair.call({ value: 10 });
const second = createPair.call({ value: 30 });

const detachedRegular = second.regular;
const detachedArrow = second.arrow;

console.log(first.regular());
console.log(first.arrow());
console.log(detachedRegular.call({ value: 40 }));
console.log(detachedArrow.call({ value: 40 }));
console.log(second.regular());
console.log(second.arrow());
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У обычной функции `this` определяется при вызове, а стрелочная функция получает его из внешней области.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для `first.regular()` receiver — объект `first`; для `first.arrow()` — объект из `createPair.call`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

`call({ value: 40 })` меняет receiver только у `detachedRegular`. Стрелка из `second` продолжает читать значение `30`.

</details>

<details>
<summary>Решение</summary>

```text
20
10
40
30
20
30
```

Обычные методы читают `value` у объекта места вызова. Каждая стрелка замыкает `this` соответствующего вызова `createPair`, поэтому последующий `call` на неё не влияет.

Ожидаемый результат: числа `20`, `10`, `40`, `30`, `20`, `30` в указанном порядке.

Ручная проверка: запустите блок, сопоставьте каждую строку с конкретным вызовом и отдельно подтвердите, что оба последних лога относятся к одному объекту `second`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
