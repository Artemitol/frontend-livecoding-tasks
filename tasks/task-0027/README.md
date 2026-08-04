# task-0027 — Агрегаторы Promise в порядке входа

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Напишите promiseAll и promiseAllSettled для массива Promise или обычных значений.
// promiseAll возвращает значения в порядке входа, отклоняется при первой ошибке и для пустого массива возвращает []; promiseAllSettled всегда возвращает упорядоченные записи { status, value } или { status, reason } и для пустого массива возвращает [].

const fulfillAfter = (value, milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds, value);
});

const rejectAfter = (reason, milliseconds) => new Promise((resolve, reject) => {
  setTimeout(reject, milliseconds, reason);
});

function promiseAll(values) {
  // Напишите решение.
}

function promiseAllSettled(values) {
  // Напишите решение.
}

const values = [fulfillAfter('first', 30), fulfillAfter('second', 10), 3];

promiseAll(values).then(console.log);
promiseAllSettled([values[0], rejectAfter('no', 5), values[2]]).then(console.log);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Счётчик завершений и массив фиксированной длины отделяют порядок входа от порядка завершения.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Нормализуйте каждый элемент через `Promise.resolve`, сохраняйте результат по исходному индексу и отдельно обработайте пустой массив.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для `promiseAll` сразу вызывайте `reject`; для `promiseAllSettled` в обоих исходах заполните запись и завершите общий Promise, когда счётчик достигнет длины.

</details>

<details>
<summary>Решение</summary>

```javascript
function promiseAll(values) {
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(values.length);
    let completed = 0;

    values.forEach((value, index) => {
      Promise.resolve(value).then((result) => {
        results[index] = result;
        completed += 1;

        if (completed === values.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

function promiseAllSettled(values) {
  return new Promise((resolve) => {
    if (values.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(values.length);
    let completed = 0;

    values.forEach((value, index) => {
      Promise.resolve(value).then((result) => {
        results[index] = { status: 'fulfilled', value: result };
      }, (reason) => {
        results[index] = { status: 'rejected', reason };
      }).then(() => {
        completed += 1;

        if (completed === values.length) {
          resolve(results);
        }
      });
    });
  });
}
```

Индексы фиксируют порядок входного массива, хотя Promise завершаются в другом порядке. `promiseAllSettled` записывает оба исхода и потому не отклоняется.

Ожидаемый результат: `promiseAll` выдаёт `['first', 'second', 3]`; `promiseAllSettled` выдаёт записи `fulfilled`, `rejected`, `fulfilled` в этом порядке; обе функции возвращают `[]` для пустого массива.

Ручная проверка: вставьте решение, запустите блок, затем добавьте `promiseAll([]).then(console.log)`, `promiseAllSettled([]).then(console.log)` и `promiseAll([rejectAfter('no', 0)]).catch(console.log)`; сравните два пустых массива и строку `no`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
