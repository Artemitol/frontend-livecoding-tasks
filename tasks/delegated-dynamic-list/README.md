# Удаление динамической строки через делегирование событий

[← Все подборки](../../README.md)

## Условие

Учебная цель — обрабатывать действия динамически добавленных элементов через делегирование событий. Нужны базовые знания обработчика `click`: назначьте один обработчик удаления постоянному контейнеру `#todos`, а не каждой новой кнопке.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Fixture выполняется в браузере как `<script type="module">` и не обращается к сети.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Делегирование событий</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      li {
        margin: 0.5rem 0;
      }

      .pass {
        color: #087f23;
      }
    </style>
  </head>
  <body>
    <h1>Динамический список</h1>
    <button id="add" type="button">Добавить строку</button>
    <ul id="todos" aria-label="Список задач"></ul>
    <p id="status" aria-live="polite">Добавьте строку.</p>

    <script type="module">
      // Реализуйте один click handler на #todos.
      // Если click пришёл от кнопки data-action="remove" внутри списка,
      // удалите принадлежащий ей li.
      // Покажите PASS с ID удалённой строки и запишите в console
      // ID и число оставшихся строк.
      // Любой другой click безопасно игнорируйте.

      const addButton = document.querySelector('#add');
      const todos = document.querySelector('#todos');
      const status = document.querySelector('#status');
      let nextId = 1;

      function addTodo() {
        const id = nextId;
        nextId += 1;
        todos.insertAdjacentHTML(
          'beforeend',
          `<li data-id="${id}">
            Задача ${id}
            <button type="button" data-action="remove">Удалить</button>
          </li>`,
        );
        console.log('[delegated-list] added', { id });
      }

      addButton.addEventListener('click', addTodo);

      // Добавьте здесь один delegated click handler на todos.
    </script>
  </body>
</html>
```

## Готово, когда

- После «Добавить строку» новая кнопка «Удалить» работает без назначения ей отдельного listener, а status начинается с `PASS`.
- После добавления двух строк можно удалить вторую: первая остаётся, а status содержит ID второй строки.
- Click по пустому месту списка или элементу без `data-action="remove"` не меняет список и не показывает новый PASS.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`click` кнопки всплывает до `#todos`. В обработчике контейнера начните с поиска ближайшей кнопки удаления от `event.target`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Назначьте `addEventListener('click', ...)` самому списку и получите кнопку через `closest('button[data-action="remove"]')`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После поиска кнопки проверьте, что она существует и всё ещё принадлежит `todos`. Затем найдите ближайший `li`, сохраните его `data-id`, удалите строку и обновите status и console.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Делегирование событий</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      li {
        margin: 0.5rem 0;
      }

      .pass {
        color: #087f23;
      }
    </style>
  </head>
  <body>
    <h1>Динамический список</h1>
    <button id="add" type="button">Добавить строку</button>
    <ul id="todos" aria-label="Список задач"></ul>
    <p id="status" aria-live="polite">Добавьте строку.</p>

    <script type="module">
      const addButton = document.querySelector('#add');
      const todos = document.querySelector('#todos');
      const status = document.querySelector('#status');
      let nextId = 1;

      function addTodo() {
        const id = nextId;
        nextId += 1;
        todos.insertAdjacentHTML(
          'beforeend',
          `<li data-id="${id}">
            Задача ${id}
            <button type="button" data-action="remove">Удалить</button>
          </li>`,
        );
        console.log('[delegated-list] added', { id });
      }

      addButton.addEventListener('click', addTodo);

      todos.addEventListener('click', (event) => {
        const button = event.target.closest(
          'button[data-action="remove"]',
        );
        if (!button || !todos.contains(button)) {
          return;
        }

        const item = button.closest('li');
        const id = item.dataset.id;
        item.remove();
        status.textContent =
          `PASS: динамически добавленная задача ${id} ` +
          'удалена делегированным обработчиком.';
        status.className = 'pass';
        console.log('[delegated-list] removed', {
          id,
          remaining: todos.children.length,
        });
      });
    </script>
  </body>
</html>
```

### Почему это работает

Обработчик живёт на постоянном `ul`, поэтому получает всплывающие клики и от кнопок, созданных после инициализации. `closest` находит действие, а `todos.contains` ограничивает обработку текущим fixture. Один listener обслуживает любое число строк.

</details>

<details>
<summary>Самопроверка</summary>

- Почему listener остаётся рабочим для кнопок, добавленных позже?
- Зачем после `closest` дополнительно проверять принадлежность контейнеру?
- Когда делегирование событий удобнее отдельных listeners на каждом элементе?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: DOM и события
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 18 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
