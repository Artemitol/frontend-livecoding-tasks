# Удаление динамической строки через делегирование событий

Откройте [CodePen](https://pen.new), вставьте HTML-фрагмент в панель **HTML**, JavaScript — в панель **JS** и запустите в режиме browser ESM без препроцессора. Код не обращается к сети.

## Условие

Добавьте ровно один обработчик `click` постоянному контейнеру `#todos`. Если клик пришёл от кнопки с `data-action="remove"` внутри списка, удалите принадлежащий ей `li` и выведите ID удалённой строки и число оставшихся строк. Любой другой клик безопасно игнорируйте; отдельные listeners новым кнопкам не назначайте.

```html
<button id="add" type="button">Добавить строку</button>
<ul id="todos" aria-label="Список задач"></ul>
```

```javascript
const addButton = document.querySelector('#add');
const todos = document.querySelector('#todos');
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
}

addButton.addEventListener('click', addTodo);

// Добавьте здесь один delegated click handler на todos.
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Клик кнопки всплывает до `#todos`. Начните с поиска ближайшей кнопки удаления от `event.target`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Назначьте `addEventListener('click', ...)` самому списку и получите кнопку через `closest('button[data-action="remove"]')`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Проверьте, что найденная кнопка принадлежит `todos`, затем найдите ближайший `li`, сохраните его `data-id`, удалите строку и выведите результат.

</details>

<details>
<summary>Решение</summary>

```javascript
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
  console.log({ id, remaining: todos.children.length });
});
```

Обработчик живёт на постоянном `ul`, поэтому получает всплывающие клики и от кнопок, созданных после инициализации. Для ручной проверки добавьте две строки, удалите вторую и убедитесь, что первая остаётся, а консоль показывает ID второй строки и `remaining: 1`. Клик по пустому месту списка не должен ничего менять.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: DOM и события
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 18 минут

</details>
