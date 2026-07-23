# Повторная инициализация без дублирования listener

[← Все подборки](../../README.md)

## Условие

Учебная цель — устранять повторную обработку DOM-событий из-за неснятых слушателей при повторной инициализации. Нужны знания `addEventListener` и `removeEventListener`: повторная инициализация должна заменить старый обработчик, сохранив правильный cleanup.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Fixture выполняется в браузере как `<script type="module">` и не обращается к сети.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Идемпотентная инициализация</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      button {
        margin-right: 0.5rem;
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
    <h1>Один активный listener</h1>
    <button id="initialize" type="button">Инициализировать дважды</button>
    <button id="action" type="button">Действие</button>
    <p id="status" aria-live="polite">Счётчик: 0.</p>

    <script type="module">
      // Исправьте initialize.
      // Каждая инициализация сначала снимает предыдущий listener,
      // затем добавляет ровно один новый и сохраняет его cleanup.
      // Два или три последовательных initialize перед одним click
      // должны увеличить count ровно на 1.

      const initializeButton = document.querySelector('#initialize');
      const action = document.querySelector('#action');
      const status = document.querySelector('#status');
      let count = 0;
      let dispose = () => {};

      function initialize() {
        action.addEventListener('click', () => {
          count += 1;
          status.textContent = `Счётчик: ${count}.`;
          console.log('[idempotent-listener] action', { count });
        });
      }

      initializeButton.addEventListener('click', () => {
        count = 0;
        status.textContent = 'Счётчик: 0. Нажмите «Действие».';
        status.className = '';
        initialize();
        initialize();
      });
    </script>
  </body>
</html>
```

## Готово, когда

- После «Инициализировать дважды» и одного «Действие» видна строка `Счётчик: 1. PASS: один активный слушатель.` и один console event.
- Повторный запуск того же сценария без перезагрузки снова даёт счётчик `1`, а не накапливает старые listeners.
- Cleanup передаёт в `removeEventListener` тот же объект функции, который был передан в `addEventListener`.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Новая стрелка в каждом `addEventListener` — новый объект. Снять обработчик можно только по той же ссылке на функцию.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В начале `initialize` вызовите текущий `dispose`, затем создайте именованную локальную функцию `onAction`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Добавьте `onAction` как listener, а в `dispose` сохраните замыкание, которое снимает именно `onAction`. Следующий вызов `initialize` начнётся с этого cleanup.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Идемпотентная инициализация</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      button {
        margin-right: 0.5rem;
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
    <h1>Один активный listener</h1>
    <button id="initialize" type="button">Инициализировать дважды</button>
    <button id="action" type="button">Действие</button>
    <p id="status" aria-live="polite">Счётчик: 0.</p>

    <script type="module">
      const initializeButton = document.querySelector('#initialize');
      const action = document.querySelector('#action');
      const status = document.querySelector('#status');
      let count = 0;
      let dispose = () => {};

      function initialize() {
        dispose();

        const onAction = () => {
          count += 1;
          const pass = count === 1;
          status.textContent =
            `Счётчик: ${count}. ` +
            (pass
              ? 'PASS: один активный слушатель.'
              : 'FAIL: обработчик вызван повторно.');
          status.className = pass ? 'pass' : 'fail';
          console.log('[idempotent-listener] action', { count });
        };

        action.addEventListener('click', onAction);
        dispose = () => {
          action.removeEventListener('click', onAction);
        };
      }

      initializeButton.addEventListener('click', () => {
        count = 0;
        status.textContent = 'Счётчик: 0. Нажмите «Действие».';
        status.className = '';
        initialize();
        initialize();
      });
    </script>
  </body>
</html>
```

### Почему это работает

Сохранённый `dispose` замыкается на тот же `onAction`, который был зарегистрирован. Следующая инициализация сначала снимает прежнюю функцию, затем создаёт и сохраняет cleanup для новой. Поэтому после любого числа последовательных инициализаций активен один listener.

</details>

<details>
<summary>Самопроверка</summary>

- Почему новая анонимная функция не снимает ранее добавленную анонимную функцию?
- Как повторный запуск сценария обнаруживает listener, оставшийся от прошлого запуска?
- Когда одного флага «уже инициализировано» недостаточно по сравнению с cleanup?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: DOM и события
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
