# Снимок и актуальное значение в замыкании

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите две строки консоли в точном порядке.
// Объясните, почему message сохраняет результат первой интерполяции, а второй лог читает текущее значение number.
// Используйте консольный JavaScript без ESM и browser API.

let number = 0;

const increment = () => {
  number += 1;
  const message = `Incremented to ${number}`;

  return () => {
    console.log(message);
    console.log(`Number: ${number}`);
  };
};

const log = increment();
increment();
increment();
log();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`message` создаётся как готовая строка во время конкретного вызова `increment`, а не вычисляется заново при каждом чтении.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После первого вызова `number` равен `1`, и именно тогда создаётся функция, сохранённая в `log`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Два последующих вызова увеличивают общую переменную до `3`, но их возвращённые функции нигде не сохраняются.

</details>

<details>
<summary>Решение</summary>

```text
Incremented to 1
Number: 3
```

Замыкание `log` хранит строку `message`, сформированную при первом увеличении. Переменная `number` находится во внешней области и читается только при вызове `log`, поэтому используется её актуальное значение.

Ожидаемый результат: сначала `Incremented to 1`, затем `Number: 3`.

Ручная проверка: сначала запишите прогноз, затем запустите блок; после этого сохраните функцию из второго вызова и сравните её `message` с тем же актуальным `number`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 15 минут

</details>
