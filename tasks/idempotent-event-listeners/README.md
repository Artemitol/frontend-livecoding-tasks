# Повторная инициализация без дублирования listener

Откройте [CodePen](https://pen.new), вставьте HTML-фрагмент в панель **HTML**, JavaScript — в панель **JS** и запустите в режиме browser ESM без препроцессора. Код не обращается к сети.

## Условие

Исправьте `initialize`: каждый вызов должен сначала снять предыдущий обработчик, затем добавить ровно один новый и сохранить его cleanup. Два или три последовательных вызова `initialize()` перед одним кликом по «Действие» должны увеличить счётчик ровно на `1`. В `removeEventListener` передавайте тот же объект функции, который был зарегистрирован.

```html
<button id="initialize" type="button">Инициализировать дважды</button>
<button id="action" type="button">Действие</button>
<p id="status" aria-live="polite">Счётчик: 0.</p>
```

```javascript
const initializeButton = document.querySelector('#initialize');
const action = document.querySelector('#action');
const status = document.querySelector('#status');
let count = 0;
let dispose = () => {};

function initialize() {
  action.addEventListener('click', () => {
    count += 1;
    status.textContent = `Счётчик: ${count}.`;
  });
}

initializeButton.addEventListener('click', () => {
  count = 0;
  status.textContent = 'Счётчик: 0.';
  initialize();
  initialize();
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Новая стрелка в каждом `addEventListener` — новый объект. Снять обработчик можно только по той же ссылке на функцию.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В начале `initialize` вызовите текущий `dispose`, затем создайте локальную функцию `onAction`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Добавьте `onAction` как listener, а в `dispose` сохраните замыкание, которое снимает именно `onAction`.

</details>

<details>
<summary>Решение</summary>

```javascript
function initialize() {
  dispose();

  const onAction = () => {
    count += 1;
    status.textContent = `Счётчик: ${count}.`;
  };

  action.addEventListener('click', onAction);
  dispose = () => {
    action.removeEventListener('click', onAction);
  };
}
```

Сохранённый `dispose` замыкается на тот же `onAction`, который был зарегистрирован. Следующая инициализация снимает прежнюю функцию до добавления новой. Для ручной проверки нажмите «Инициализировать дважды», затем один раз «Действие»: должна появиться строка `Счётчик: 1.`. Повторите сценарий без перезагрузки — результат снова должен быть `1`.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: DOM и события
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
