# task-0029 — Повторный запрос с лимитом попыток

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте runWithRetry: после ошибки она ждёт delayMilliseconds и повторяет request, а после limit неудачных попыток отклоняется последней ошибкой.
// Используйте локальные сценарии и встроенные счётчики: успех требует 2 попытки и 1 завершившееся ожидание, три ошибки — 3 попытки и 2 завершившихся ожидания по 10 мс; сетевой доступ не нужен.

const waitLog = [];

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(() => {
    waitLog.push(milliseconds);
    resolve();
  }, milliseconds);
});

function createRequest(outcomes) {
  let attempts = 0;

  const request = () => {
    const outcome = outcomes[attempts];
    attempts += 1;
    return outcome instanceof Error ? Promise.reject(outcome) : Promise.resolve(outcome);
  };

  request.getAttemptCount = () => attempts;
  return request;
}

async function runWithRetry(request, limit, delayMilliseconds) {
  return request();
}

const successAfterTwo = createRequest([new Error('temporary'), 'ok']);
const alwaysFail = createRequest([new Error('one'), new Error('two'), new Error('three')]);

async function verifyRetries() {
  console.log(await runWithRetry(successAfterTwo, 3, 10));
  console.log(successAfterTwo.getAttemptCount(), [...waitLog]);

  waitLog.length = 0;

  try {
    await runWithRetry(alwaysFail, 3, 10);
  } catch (error) {
    console.log(error.message);
  }

  console.log(alwaysFail.getAttemptCount(), [...waitLog]);
}

verifyRetries();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Лимит относится к общему числу вызовов `request`, включая первый.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Повторите вызов в цикле, перехватывайте ошибку и перед новой попыткой ожидайте `wait`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `catch` сохраняйте ошибку; если это была последняя попытка, выбросьте её, иначе выполните `await wait(delayMilliseconds)`.

</details>

<details>
<summary>Решение</summary>

```javascript
async function runWithRetry(request, limit, delayMilliseconds) {
  let lastError;

  for (let attempt = 1; attempt <= limit; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;

      if (attempt < limit) {
        await wait(delayMilliseconds);
      }
    }
  }

  throw lastError;
}
```

Успешный вызов немедленно завершает функцию. Ошибка ждёт только перед следующей доступной попыткой, а `waitLog` обновляется при завершении timer, непосредственно перед `resolve`. После третьей неудачи наружу передаётся последняя ошибка.

Ожидаемый результат: сценарий `successAfterTwo` выводит `ok`, затем `2` и `[10]`; `alwaysFail` выводит `three`, затем `3` и `[10, 10]`.

Ручная проверка: вставьте решение и сравните четыре строки с `ok`, `2 [10]`, `three`, `3 [10, 10]`; лог подтверждает завершение каждого timer до следующей попытки. Если убрать `await` перед `wait`, обе строки со счётчиками покажут пустой лог `[]`, поэтому такая реализация проверку не проходит.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
