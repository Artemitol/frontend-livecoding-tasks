# Поллинг статуса ресурса

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```javascript
// Исправьте createStatusPoller(options, dependencies): верните poller, который последовательно отправляет POST на options.url с JSON {"resourceId":...}, Content-Type и Authorization: Bearer <authToken>.
// status processing означает ровно одну delay-паузу и повтор; status done вызывает onSuccess(data) один раз и resolve(data), а HTTP, network или status error вызывает onError(error) один раз и reject тем же Error.
// Используйте только fetchImpl и sleepImpl: успешная фикстура даёт 3 одинаковых полных request { url, method, body, headers }, задержки 25,25, исходный done-payload в onSuccess и success: 1 error: 0; ошибочная — 1 request, 0 задержек, один и тот же Error в onError и reject.

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
    headers: {
      contentType: request.headers['Content-Type'],
      authorization: request.headers.Authorization,
    },
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
  let successPayload;

  const poll = createStatusPoller(
    {
      resourceId: '42',
      url: '/jobs/status',
      authToken: 'local-token',
      onSuccess: (data) => {
        calls.success += 1;
        successPayload = data;
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

  console.log(JSON.stringify(requests));
  console.log(JSON.stringify(result));
  console.log('successPayload:', successPayload === result);
  console.log(JSON.stringify(calls));
  console.log('delays:', delays.join(','));

  const failedRequests = [];
  const failedDelays = [];
  const failedCalls = {
    success: 0,
    error: 0,
  };
  let failedSuccessPayload;
  let failedCallbackError;

  try {
    const failedPoll = createStatusPoller(
      {
        resourceId: 'broken',
        url: '/jobs/status',
        authToken: 'failed-token',
        onSuccess: (data) => {
          failedCalls.success += 1;
          failedSuccessPayload = data;
        },
        onError: (error) => {
          failedCalls.error += 1;
          failedCallbackError = error;
        },
      },
      {
        delay: 25,
        fetchImpl: createFetchMock([
          { status: 'error', message: 'Job failed' },
        ], failedRequests),
        sleepImpl: async (delay) => {
          failedDelays.push(delay);
        },
      },
    );
    await failedPoll();
  } catch (error) {
    console.log(JSON.stringify(failedRequests));
    console.log(
      'failedCallbacks:',
      JSON.stringify(failedCalls),
      'failedSuccessPayload:',
      failedSuccessPayload === undefined,
      'failedCallbackError:',
      failedCallbackError === error,
    );
    console.log(error.message);
  }

  console.log(
    'failedRequests:',
    failedRequests.length,
    'failedDelays:',
    failedDelays.length,
    'errors:',
    failedCalls.error,
  );
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

Фабрика замыкает идентификатор, URL, токен и callbacks в одном poller. Последовательный цикл исключает перекрывающиеся запросы, а terminal-ветви немедленно завершают функцию: `onSuccess` получает тот же объект, с которым завершается Promise, а `onError` — тот же `Error`, который отклоняет Promise. Ошибочная фикстура отдельно подтверждает, что `onSuccess` не вызывался.

Ожидаемый результат: выводится один массив из трёх одинаковых записей `[{"url":"/jobs/status","method":"POST","body":"{\\"resourceId\\":\\"42\\"}","headers":{"contentType":"application/json","authorization":"Bearer local-token"}}, ...]`, затем `{"status":"done","result":"ready"}`, `successPayload: true`, `{"success":1,"error":0}`, `delays: 25,25`; далее одна запись `[{"url":"/jobs/status","method":"POST","body":"{\\"resourceId\\":\\"broken\\"}","headers":{"contentType":"application/json","authorization":"Bearer failed-token"}}]`, `failedCallbacks: {"success":0,"error":1} failedSuccessPayload: true failedCallbackError: true`, `Job failed`, затем `failedRequests: 1 failedDelays: 0 errors: 1`.

Ручная проверка: вставьте решение и сравните все девять строк; в первом массиве проверьте у каждого из трёх request точные URL, method, body, оба headers и `successPayload: true`, затем у ошибочного request — URL и headers, `failedCallbacks: {"success":0,"error":1}`, отсутствие success-payload, тот же Error, один request и ноль задержек. После этого сделайте первый mock-response с `ok: false` и убедитесь, что `onSuccess` не вызывается, а `onError` получает тот же Error, которым Promise отклоняется.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
