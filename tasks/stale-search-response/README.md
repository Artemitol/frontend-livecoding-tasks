# Актуальный результат поиска при гонке ответов

**Учебная цель:** Устранять гонку результатов асинхронного поиска так, чтобы устаревший ответ не заменял актуальный.

| Метаданные | Значение |
| --- | --- |
| Технологии | JavaScript, DOM API |
| Тема | Асинхронность |
| Формат | Отладка |
| Уровень | Продвинутый |
| Время | 25 минут |
| Навыки | Идентификация актуального запроса, обработка локальной ошибки, обработка пустого ввода |
| Предварительные знания | Promise и обработчик DOM-события |
| Среда выполнения | Google Chrome 150.0.7871.101, ECMAScript modules, local controlled fetch fixture |

<details>
<summary>Теория</summary>

Асинхронные ответы могут завершаться не в порядке старта. Отображать результат имеет право только ответ, чей идентификатор совпадает с последним начатым запросом; устаревший успешный и устаревший ошибочный ответ нужно одинаково игнорировать.

</details>

## Условие

Исправьте `search`, не меняя local controlled fetch. По сценарию `старый` отвечает через 80 мс, `новый` — через 10 мс. После двух стартов экран обязан показать только новый результат.

### Входы

Локальный fixture без сети:

```html
<label>Запрос <input id="query" value="старый"></label>
<button id="search" type="button">Искать</button>
<button id="scenario" type="button">Запустить сценарий гонки</button>
<button id="failure" type="button">Проверить ошибку</button>
<p id="result" aria-live="polite">Результата нет.</p>
<pre id="trace"></pre>
```

```js
const localFetch = (query) => new Promise((resolve, reject) => setTimeout(() => {
  if (query === 'ошибка') reject(new Error('Локальная ошибка fixture'));
  else resolve({ query, items: [`${query}: результат`] });
}, query === 'старый' ? 80 : 10));

async function search(query) {
  const response = await localFetch(query);
  result.textContent = `Результат: ${response.items[0]}`;
}
```

Внутри того же module script `queryInput`, `result`, `trace` получены через `querySelector`, а `log` пишет trace и console. Fixture полностью локален и не вызывает HTTP.

### Выходы

Для гонки: `Результат: новый: результат — PASS` и trace с игнорированием старого ответа. Для пустого запроса: `Введите непустой запрос.` Для fixture-ошибки: `Ошибка поиска: Локальная ошибка fixture`.

### Ограничения и побочные эффекты

- Нельзя отменять или менять `localFetch`, его задержки и данные.
- Каждый непустой запуск получает монотонно возрастающий request ID.
- Пустой запрос не создаёт request ID; допустимы только запись результата и trace в DOM и console.

### Стартовый код

Замените только тело `search`; сохраняйте fixture и его кнопки. Полный локальный fixture поставляется вместе с задачей по относительному пути [`assets/fixture.html`](assets/fixture.html).

### Примеры

#### Обычный сценарий

«Запустить сценарий гонки» запускает `старый`, затем `новый`. Через 100 мс видны `Результат: новый: результат — PASS` и `ignore stale #<id>: старый`.

#### Граничный сценарий

Запустите сценарий гонки повторно без reload. Номер запроса может быть другим, но старый ответ этого запуска всё равно игнорируется и результат снова PASS.

#### Ошибка или пустой результат

Нажмите «Проверить ошибку»: видна локальная ошибка. Затем очистите `#query` и нажмите «Искать»: видна ровно строка `Введите непустой запрос.`

## Критерии готовности

- Устаревший успешный ответ не меняет результат.
- Устаревшая ошибка также не меняет актуальный результат.
- Пустой `#query` при клике «Искать» не вызывает fixture.
- Сценарий гонки стабильно проходит два раза подряд без reload.

<details>
<summary>Подсказка 1</summary>

Сохраните номер непосредственно перед `await`, а после `await` сравните его с последним номером.

</details>

<details>
<summary>Решение</summary>

### Подход

```js
let latestRequestId = 0;

async function search(query) {
  query = query.trim();
  if (query === '') {
    result.textContent = 'Введите непустой запрос.';
    result.className = 'fail';
    log('reject empty query');
    return;
  }
  const requestId = ++latestRequestId;
  log(`start #${requestId}: ${query}`);
  try {
    const response = await localFetch(query);
    if (requestId !== latestRequestId) {
      log(`ignore stale #${requestId}: ${response.query}`);
      return;
    }
    result.textContent = `Результат: ${response.items[0]}`;
    result.className = '';
    log(`render current #${requestId}: ${response.query}`);
  } catch (error) {
    if (requestId !== latestRequestId) {
      log(`ignore stale failure #${requestId}: ${query}`);
      return;
    }
    result.textContent = `Ошибка поиска: ${error.message}`;
    result.className = 'fail';
    log(`render failure #${requestId}: ${query}`);
  }
}
```

Проверка fixture запоминает `staleRequestId = latestRequestId + 1` перед двумя запусками и сверяет trace с этим ID, поэтому повторный сценарий не зависит от номера `#1`.

### Сложность

- Время: O(1) собственной работы на один ответ, без учёта ожидания fixture.
- Память: O(1) на счётчик и локальные ссылки; trace fixture растёт с числом записей.

### Компромиссы и альтернативы

Request ID не отменяет устаревшую работу, а запрещает ей менять UI. `AbortController` может экономить ресурсы реального HTTP-запроса, но не заменяет проверку актуальности, если ответ уже успел завершиться.

</details>

## Самопроверка

- Почему сравнение должно выполняться после `await`?
- Почему пустой ввод не должен увеличивать request ID?
- Чем ID-guard отличается от отмены запроса?
