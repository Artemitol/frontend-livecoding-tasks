# task-0028 — Параллельная загрузка записей

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```javascript
// Исправьте loadRecords: все запросы должны стартовать до ожидания результата, успешный результат должен сохранять порядок ids, а ошибка одного запроса должна отклонять общий Promise.
// Используйте только локальный requestRecord: он записывает старт в requestLog и возвращает контролируемую запись или ошибку, поэтому сетевой доступ не нужен.

const recordsById = {
  1: { delay: 30, value: { id: 1, title: 'first' } },
  2: { delay: 10, value: { id: 2, title: 'second' } },
  3: { delay: 20, value: { id: 3, title: 'third' } },
  404: { delay: 5, error: new Error('not found') },
};

const requestLog = [];

function requestRecord(id) {
  requestLog.push(id);
  const record = recordsById[id];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (record.error) {
        reject(record.error);
        return;
      }

      resolve(record.value);
    }, record.delay);
  });
}

async function loadRecords(ids) {
  const result = [];

  for (const id of ids) {
    result.push(await requestRecord(id));
  }

  return result;
}

const pendingRecords = loadRecords([1, 2, 3]);
console.log(requestLog);

pendingRecords.then((records) => {
  console.log(records.map((record) => record.title));
  document.body.dataset.requestOrder = requestLog.join(',');
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`await` внутри цикла ждёт один запрос до старта следующего.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала создайте массив Promise через `ids.map`, не ожидая каждый элемент.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните `Promise.all(ids.map((id) => requestRecord(id)))`: он запускает все вызовы сразу, сохраняет порядок входа и передаёт отклонение наружу.

</details>

<details>
<summary>Решение</summary>

```javascript
async function loadRecords(ids) {
  return Promise.all(ids.map((id) => requestRecord(id)));
}
```

`map` создаёт все запросы в одном синхронном проходе. `Promise.all` возвращает записи по индексам `ids`, даже если второй запрос завершится первым, и отклоняется при первой ошибке.

Ожидаемый результат: синхронный лог сразу после `loadRecords` равен `[1, 2, 3]`, а заголовки после завершения — `['first', 'second', 'third']`; атрибут `data-request-order` у `body` равен `1,2,3`; вызов с `404` отклоняется с `not found`.

Ручная проверка: вставьте решение и убедитесь, что первый, синхронный лог уже содержит `[1, 2, 3]`, хотя заголовки появляются позже; затем вызовите `loadRecords([1, 404])` и проверьте `not found` через `catch`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
