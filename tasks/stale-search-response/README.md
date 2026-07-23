# Актуальный результат поиска при гонке ответов

[← Все подборки](../../README.md)

## Условие

Учебная цель — устранять гонку результатов асинхронного поиска так, чтобы устаревший ответ не заменял актуальный. Только самый новый запрос может менять интерфейс, а устаревшие успешный и ошибочный ответы должны игнорироваться. Нужны базовые знания Promise и обработчиков DOM-событий.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Fixture полностью локальный, работает без сети и выполняется в браузере как `<script type="module">`.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Актуальный результат поиска</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
        max-width: 54rem;
      }

      label,
      button {
        margin: 0 0.5rem 0.5rem 0;
      }

      pre {
        min-height: 6rem;
        padding: 1rem;
        background: #f4f4f4;
        white-space: pre-wrap;
      }

      .pass {
        color: #087f23;
      }

      .fail {
        color: #b00020;
      }
    </style>
  </head>
  <body>
    <h1>Актуальный результат поиска</h1>
    <p>
      <code>старый</code> отвечает через 80 мс, остальные запросы —
      через 10 мс. Запрос <code>ошибка</code> завершается ошибкой.
    </p>
    <label>
      Запрос
      <input id="query" value="старый">
    </label>
    <button id="search" type="button">Искать</button>
    <button id="success-race" type="button">Гонка успешных ответов</button>
    <button id="failure-race" type="button">Гонка с устаревшей ошибкой</button>
    <button id="failure" type="button">Текущая ошибка</button>
    <p id="result" aria-live="polite">Результата нет.</p>
    <pre id="trace"></pre>

    <script type="module">
      // Исправьте только search.
      // Нельзя менять localFetch, его задержки и данные.
      // Каждый непустой запуск получает возрастающий request ID.
      // Пустой запрос не создаёт ID и показывает понятное сообщение.
      // После await менять UI может только самый новый запрос.

      const queryInput = document.querySelector('#query');
      const result = document.querySelector('#result');
      const trace = document.querySelector('#trace');
      const entries = [];
      let latestRequestId = 0;

      const log = (entry) => {
        entries.push(entry);
        trace.textContent = entries.join('\n');
        console.log('[stale-search]', entry);
      };

      const localFetch = (query) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (query === 'ошибка') {
              reject(new Error('Локальная ошибка fixture'));
            } else {
              resolve({ query, items: [`${query}: результат`] });
            }
          }, query === 'старый' ? 80 : 10);
        });

      async function search(query) {
        const response = await localFetch(query);
        result.textContent = `Результат: ${response.items[0]}`;
      }

      const resetScenario = () => {
        entries.length = 0;
        trace.textContent = '';
        result.textContent = 'Ожидание ответов…';
        result.className = '';
      };

      document.querySelector('#search').addEventListener('click', () => {
        void search(queryInput.value);
      });

      document.querySelector('#failure').addEventListener('click', () => {
        void search('ошибка');
      });

      document
        .querySelector('#success-race')
        .addEventListener('click', async () => {
          resetScenario();
          void search('старый');
          void search('новый');
          await new Promise((resolve) => setTimeout(resolve, 100));

          const pass =
            result.textContent === 'Результат: новый: результат' &&
            entries.some((entry) => entry.includes('ignore stale') && entry.includes('старый'));
          result.textContent += ` — ${pass ? 'PASS' : 'FAIL'}`;
          result.className = pass ? 'pass' : 'fail';
        });

      document
        .querySelector('#failure-race')
        .addEventListener('click', async () => {
          resetScenario();
          void search('ошибка');
          void search('новый');
          await new Promise((resolve) => setTimeout(resolve, 40));

          const pass =
            result.textContent === 'Результат: новый: результат' &&
            entries.some((entry) => entry.includes('ignore stale failure'));
          result.textContent += ` — ${pass ? 'PASS' : 'FAIL'}`;
          result.className = pass ? 'pass' : 'fail';
        });
    </script>
  </body>
</html>
```

## Готово, когда

- Кнопка «Гонка успешных ответов» два раза подряд без перезагрузки показывает `Результат: новый: результат — PASS`, а trace содержит `ignore stale ... старый`.
- Кнопка «Гонка с устаревшей ошибкой» показывает новый результат с `PASS`, а trace содержит `ignore stale failure`.
- «Текущая ошибка» показывает `Ошибка поиска: Локальная ошибка fixture`; пустой ввод через «Искать» показывает `Введите непустой запрос.` и не запускает fixture.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Результаты завершаются не по порядку старта. Нужен признак, который после каждого `await` отвечает: этот запрос всё ещё самый новый?

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала обрежьте строку и отдельно обработайте пустой ввод. Для непустого запроса увеличьте общий счётчик и сохраните его значение в локальную константу перед `await`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оберните ожидание в `try/catch`. И в успешной, и в ошибочной ветке сначала сравнивайте локальный ID с последним ID; при несовпадении записывайте `ignore stale...` и выходите до изменения результата.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Актуальный результат поиска</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
        max-width: 54rem;
      }

      label,
      button {
        margin: 0 0.5rem 0.5rem 0;
      }

      pre {
        min-height: 6rem;
        padding: 1rem;
        background: #f4f4f4;
        white-space: pre-wrap;
      }

      .pass {
        color: #087f23;
      }

      .fail {
        color: #b00020;
      }
    </style>
  </head>
  <body>
    <h1>Актуальный результат поиска</h1>
    <p>
      <code>старый</code> отвечает через 80 мс, остальные запросы —
      через 10 мс. Запрос <code>ошибка</code> завершается ошибкой.
    </p>
    <label>
      Запрос
      <input id="query" value="старый">
    </label>
    <button id="search" type="button">Искать</button>
    <button id="success-race" type="button">Гонка успешных ответов</button>
    <button id="failure-race" type="button">Гонка с устаревшей ошибкой</button>
    <button id="failure" type="button">Текущая ошибка</button>
    <p id="result" aria-live="polite">Результата нет.</p>
    <pre id="trace"></pre>

    <script type="module">
      const queryInput = document.querySelector('#query');
      const result = document.querySelector('#result');
      const trace = document.querySelector('#trace');
      const entries = [];
      let latestRequestId = 0;

      const log = (entry) => {
        entries.push(entry);
        trace.textContent = entries.join('\n');
        console.log('[stale-search]', entry);
      };

      const localFetch = (query) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (query === 'ошибка') {
              reject(new Error('Локальная ошибка fixture'));
            } else {
              resolve({ query, items: [`${query}: результат`] });
            }
          }, query === 'старый' ? 80 : 10);
        });

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

      const resetScenario = () => {
        entries.length = 0;
        trace.textContent = '';
        result.textContent = 'Ожидание ответов…';
        result.className = '';
      };

      document.querySelector('#search').addEventListener('click', () => {
        void search(queryInput.value);
      });

      document.querySelector('#failure').addEventListener('click', () => {
        void search('ошибка');
      });

      document
        .querySelector('#success-race')
        .addEventListener('click', async () => {
          resetScenario();
          void search('старый');
          void search('новый');
          await new Promise((resolve) => setTimeout(resolve, 100));

          const pass =
            result.textContent === 'Результат: новый: результат' &&
            entries.some((entry) => entry.includes('ignore stale') && entry.includes('старый'));
          result.textContent += ` — ${pass ? 'PASS' : 'FAIL'}`;
          result.className = pass ? 'pass' : 'fail';
        });

      document
        .querySelector('#failure-race')
        .addEventListener('click', async () => {
          resetScenario();
          void search('ошибка');
          void search('новый');
          await new Promise((resolve) => setTimeout(resolve, 40));

          const pass =
            result.textContent === 'Результат: новый: результат' &&
            entries.some((entry) => entry.includes('ignore stale failure'));
          result.textContent += ` — ${pass ? 'PASS' : 'FAIL'}`;
          result.className = pass ? 'pass' : 'fail';
        });
    </script>
  </body>
</html>
```

### Почему это работает

Каждый непустой вызов сохраняет свой request ID до паузы. После `await` только ID, равный `latestRequestId`, получает право менять UI. Одинаковая проверка в `try` и `catch` не даёт ни устаревшему успеху, ни устаревшей ошибке заменить состояние более нового запроса. Пустой ввод завершается до создания ID.

</details>

<details>
<summary>Самопроверка</summary>

- Почему проверка request ID должна выполняться после `await`?
- Почему guard нужен и для успешного ответа, и для ошибки?
- Чем запрет устаревшему ответу менять UI отличается от отмены запроса?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: Event loop и асинхронность
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
