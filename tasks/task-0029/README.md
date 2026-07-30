# Повторный запрос с лимитом попыток

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте runWithRetry: после ошибки она ждёт delayMilliseconds и повторяет request, а после limits неудачных попыток отклоняется последней ошибкой.
// Используйте локальный request: сценарий successAfterTwo возвращает успех на второй попытке, а alwaysFail всегда отклоняется; сетевой доступ не нужен.
// Используйте современный консольный JavaScript с async, await, Promise и timer без ESM и browser API.

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

function createRequest(outcomes) {
  let attempts = 0;

  return () => {
    const outcome = outcomes[attempts];
    attempts += 1;
    return outcome instanceof Error ? Promise.reject(outcome) : Promise.resolve(outcome);
  };
}

async function runWithRetry(request, limit, delayMilliseconds) {
  return request();
}

const successAfterTwo = createRequest([new Error('temporary'), 'ok']);
const alwaysFail = createRequest([new Error('one'), new Error('two'), new Error('three')]);

runWithRetry(successAfterTwo, 3, 0).then(console.log);
runWithRetry(alwaysFail, 3, 0).catch((error) => console.log(error.message));
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

Успешный вызов немедленно завершает функцию. Ошибка ждёт только перед следующей доступной попыткой, а после третьей неудачи наружу передаётся последняя ошибка.

Ожидаемый результат: сценарий `successAfterTwo` выводит `ok`, а `alwaysFail` выводит `three` после ровно трёх попыток.

Ручная проверка: вставьте решение, запустите блок и добавьте счётчик вызовов в `createRequest`, чтобы проверить два и три вызова для обоих сценариев.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
