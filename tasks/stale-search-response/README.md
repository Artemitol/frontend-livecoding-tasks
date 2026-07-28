# Актуальный результат поиска при гонке ответов

Откройте [CodePen](https://pen.new), вставьте HTML-фрагмент в панель **HTML**, JavaScript — в панель **JS** и запустите в режиме browser ESM без препроцессора. Fixture локальный и не обращается к сети.

## Условие

Исправьте только `search`: каждый непустой запрос должен получать возрастающий ID, а после `await` менять результат может только самый новый запрос. Устаревшие успешный и ошибочный ответы игнорируйте; пустой ввод завершайте до создания ID с сообщением `Введите непустой запрос.`. Текущую ошибку показывайте как `Ошибка поиска: <сообщение>`.

```html
<label>
  Запрос
  <input id="query" value="старый">
</label>
<button id="search" type="button">Искать</button>
<p id="result" aria-live="polite">Результата нет.</p>
```

```javascript
const queryInput = document.querySelector('#query');
const searchButton = document.querySelector('#search');
const result = document.querySelector('#result');
let latestRequestId = 0;

const localFetch = (query) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (query.includes('ошибка')) {
        reject(new Error('Локальная ошибка fixture'));
      } else {
        resolve({ query, items: [`${query}: результат`] });
      }
    }, query.startsWith('старый') ? 80 : 10);
  });

async function search(query) {
  const response = await localFetch(query);
  result.textContent = `Результат: ${response.items[0]}`;
}

searchButton.addEventListener('click', () => {
  void search(queryInput.value);
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Ответы завершаются не в порядке старта. После каждой паузы нужен признак, что текущий вызов всё ещё самый новый.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Обрежьте строку, отдельно обработайте пустой ввод, затем увеличьте общий счётчик и сохраните его значение в локальную константу до `await`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оберните ожидание в `try/catch`. Перед изменением результата и в успешной, и в ошибочной ветке сравнивайте локальный ID с последним ID.

</details>

<details>
<summary>Решение</summary>

```javascript
async function search(query) {
  query = query.trim();
  if (query === '') {
    result.textContent = 'Введите непустой запрос.';
    return;
  }

  const requestId = ++latestRequestId;

  try {
    const response = await localFetch(query);
    if (requestId !== latestRequestId) {
      return;
    }

    result.textContent = `Результат: ${response.items[0]}`;
  } catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    result.textContent = `Ошибка поиска: ${error.message}`;
  }
}
```

Локальный ID сохраняет порядок запусков независимо от порядка ответов. После `await` только ID, равный `latestRequestId`, получает право менять интерфейс. Для ручной проверки запустите `старый`, сразу смените запрос на `новый` и запустите снова: итогом должен остаться `Результат: новый: результат`. Затем повторите с `старый-ошибка` и `новый`: отложенная ошибка не должна заменить `Результат: новый: результат`. Отдельно запустите только `ошибка` и проверьте сообщение `Ошибка поиска: Локальная ошибка fixture`; затем проверьте пустой ввод.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: Event loop и асинхронность
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>
