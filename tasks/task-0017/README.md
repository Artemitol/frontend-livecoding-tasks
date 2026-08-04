# task-0017 — Восстановление двух отклонённых Promise

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите две строки и проследите settlement каждой цепочки.
// Явно укажите пропущенные fulfillment handlers, значения внутри catch и результаты следующих then.
// Для secondChain объясните: первый catch получает a, возвращает a5, а финальный then получает a5.

const firstChain = Promise.reject('a')
  .then((value) => `${value}x`)
  .catch((reason) => `${reason}b`)
  .then((value) => {
    throw value;
  })
  .catch((reason) => `${reason}d`);

const secondChain = Promise.reject('a')
  .then(() => {
    throw new Error('4');
  })
  .catch((reason) => `${reason}5`)
  .then((value) => `${value}8`);

Promise.all([firstChain, secondChain]).then((results) => {
  console.log(results[0]);
  console.log(results[1]);
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

У отклонённого Promise fulfillment handler из `then` не выполняется: причина переходит к ближайшему обработчику отклонения.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для каждой цепочки выпишите после каждого звена два факта: fulfilled или rejected и переносимое значение.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В первой цепочке первый `catch` превращает `a` в `ab`, следующий handler бросает `ab`, а второй `catch` добавляет `d`; во второй код с `Error 4` пропускается.

</details>

<details>
<summary>Решение</summary>

```text
abd
a58
```

У `firstChain` первый fulfillment handler пропущен, `catch` возвращает `ab`, брошенное затем значение снова отклоняет цепочку, а второй `catch` восстанавливает её как `abd`. У `secondChain` handler с `Error 4` тоже пропущен: `catch` получает исходную строку `a`, возвращает `a5`, и последний `then` добавляет `8`. `Promise.all` сохраняет порядок входного массива.

Ожидаемый результат: первая строка равна `abd`, вторая — `a58`; необработанного отклонения нет.

Ручная проверка: составьте таблицу состояний обоих Promise после каждого звена, затем запустите код и сравните две итоговые строки.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
