# Поллинг статуса ресурса

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```javascript
// Исправьте createStatusPoller(options, dependencies): верните poller, который последовательно отправляет POST на options.url с JSON {"resourceId":...}, Content-Type и Authorization: Bearer <authToken>.
// status processing означает ровно одну delay-паузу и повтор; status done вызывает onSuccess(data) один раз и resolve(data), а HTTP, network или status error вызывает onError(error) один раз и reject тем же Error.
// Используйте только fetchImpl и sleepImpl: успешная фикстура даёт 3 одинаковых запроса, задержки 25,25 и success: 1 error: 0; ошибочная — 1 запрос и failedErrors: 1, без работы после settlement.

function createStatusPoller(options, dependencies) {
  return async () => {
    const response = await dependencies.fetchImpl(options.url, {
      method: 'GET',
    });
    const data = response.json();

    if (data.status === 'processing') {
      createStatusPoller(options, dependencies)();
    }

    if (data.status === 'done') {
      options.onSuccess();
    }

    return data;
  };
}

const createFetchMock = (responses, requests) => async (url, request) => {
  requests.push({
    url,
    method: request.method,
    body: request.body,
    authorization: request.headers.Authorization,
  });

  return {
    ok: true,
    async json() {
      return responses.shift();
    },
  };
};

async function runChecks() {
  const requests = [];
  const delays = [];
  const calls = {
    success: 0,
    error: 0,
  };

  const poll = createStatusPoller(
    {
      resourceId: '42',
      url: '/jobs/status',
      authToken: 'local-token',
      onSuccess: () => {
        calls.success += 1;
      },
      onError: () => {
        calls.error += 1;
      },
    },
    {
      delay: 25,
      fetchImpl: createFetchMock([
        { status: 'processing' },
        { status: 'processing' },
        { status: 'done', result: 'ready' },
      ], requests),
      sleepImpl: async (delay) => {
        delays.push(delay);
      },
    },
  );

  const result = await poll();

  console.log(result.result);
  console.log(requests.map((request) => request.method).join(','));
  console.log(requests.map((request) => request.body).join(','));
  console.log(requests.map(
    (request) => request.authorization,
  ).join(','));
  console.log(calls);
  console.log(delays.join(','));

  const failedRequests = [];
  let failedCalls = 0;

  try {
    const failedPoll = createStatusPoller(
      {
        resourceId: 'broken',
        url: '/jobs/status',
        authToken: 'failed-token',
        onSuccess: () => {},
        onError: () => {
          failedCalls += 1;
        },
      },
      {
        delay: 25,
        fetchImpl: createFetchMock([
          { status: 'error', message: 'Job failed' },
        ], failedRequests),
        sleepImpl: async () => {},
      },
    );
    await failedPoll();
  } catch (error) {
    console.log(error.message);
  }

  console.log('failedRequests:', failedRequests.length, 'errors:', failedCalls);
}

document.body.innerHTML = '<pre>Результат смотрите в консоли</pre>';
window.runPollerDemo = runChecks;
runChecks();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Один цикл `while` проще контролировать, чем рекурсивный вызов без `return`: после каждого ответа можно явно выбрать единственную ветвь.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Соберите request один раз: `method: 'POST'`, JSON-заголовок, bearer-токен и `JSON.stringify({ resourceId })`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните `async`-функцию с циклом: после `processing` дождитесь `sleepImpl(delay)` и сделайте `continue`, а terminal-ветви сразу возвращают или бросают ошибку.

</details>

<details>
<summary>Решение</summary>

```javascript
function createStatusPoller(options, dependencies) {
  const {
    resourceId,
    url,
    authToken,
    onSuccess,
    onError,
  } = options;
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      resourceId,
    }),
  };

  return async () => {
    while (true) {
      let data;

      try {
        const response = await dependencies.fetchImpl(url, request);

        if (!response.ok) {
          throw new Error('Request failed');
        }

        data = await response.json();
      } catch (error) {
        onError(error);
        throw error;
      }

      if (data.status === 'processing') {
        await dependencies.sleepImpl(dependencies.delay);
        continue;
      }

      if (data.status === 'done') {
        onSuccess(data);
        return data;
      }

      const error = new Error(data.message ?? 'Resource failed');
      onError(error);
      throw error;
    }
  };
}
```

Фабрика замыкает идентификатор, URL, токен и callbacks в одном poller. Последовательный цикл исключает перекрывающиеся запросы, а terminal-ветви немедленно завершают функцию.

Ожидаемый результат: выводятся `ready`, `POST,POST,POST`, три одинаковых тела `{"resourceId":"42"}`, три значения `Bearer local-token`, `{ success: 1, error: 0 }`, `25,25`, `Job failed`, затем `failedRequests: 1 errors: 1`.

Ручная проверка: вставьте решение и сравните восемь строк; проверьте у каждого request точные body и Authorization, затем сделайте первый mock-response с `ok: false` и убедитесь, что выполняется один запрос, только `onError` и ни одной задержки.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
