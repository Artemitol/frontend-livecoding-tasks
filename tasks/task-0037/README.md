# Стоимость проживания по дням недели

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите calculateStay для неотрицательного целого числа ночей: будняя ночь стоит 1500, суббота и воскресенье — 2200.
// Считайте дату заселения первой ночью, используйте UTC-дни для детерминированных примеров и не изменяйте переданный Date; startDate по умолчанию равен текущей дате.
// Для двух фикстур и проверки исходной даты выведите 11900, 5900 и true; используйте консольный JavaScript без ESM и browser API.

const prices = {
  weekday: 1500,
  weekend: 2200,
};

function calculateStay(nights, startDate = new Date()) {
  // Напишите решение.
}

const monday = new Date('2023-11-06T12:00:00.000Z');
const mondayBeforeCalculation = monday.toISOString();

console.log(calculateStay(7, monday));
console.log(calculateStay(3, new Date('2023-11-10T12:00:00.000Z')));
console.log(monday.toISOString() === mondayBeforeCalculation);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Метод `getUTCDay()` возвращает `0` для воскресенья и `6` для субботы.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте копию `startDate`, затем пройдите циклом ровно `nights` календарных дней.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

На каждой итерации прибавляйте нужную цену по `getUTCDay()`, после чего сдвигайте копию через `setUTCDate(getUTCDate() + 1)`.

</details>

<details>
<summary>Решение</summary>

```javascript
function calculateStay(nights, startDate = new Date()) {
  const currentDate = new Date(startDate);
  let total = 0;

  for (let night = 0; night < nights; night += 1) {
    const day = currentDate.getUTCDay();
    const isWeekend = day === 0 || day === 6;

    total += isWeekend ? prices.weekend : prices.weekday;
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return total;
}
```

Копия даты движется от ночи заселения до последней оплачиваемой ночи. Исходный объект `Date` не меняется, а явные UTC-фикстуры не зависят от локального часового пояса.

Ожидаемый результат: `11900`, `5900`, затем `true`.

Ручная проверка: вставьте решение и сравните три строки, затем добавьте `console.log(calculateStay(0, monday))` и убедитесь, что функция возвращает `0`, а `monday` по-прежнему не изменён.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
