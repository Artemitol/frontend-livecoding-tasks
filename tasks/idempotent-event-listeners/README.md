# Повторная инициализация без дублирования listener

**Учебная цель:** Устранять повторную обработку DOM-событий из-за неснятых слушателей при повторной инициализации.

| Метаданные | Значение |
| --- | --- |
| Технологии | JavaScript, DOM API |
| Тема | DOM-события |
| Формат | Отладка |
| Уровень | Средний |
| Время | 20 минут |
| Навыки | Парный lifecycle listener, cleanup, идемпотентная инициализация |
| Предварительные знания | addEventListener и removeEventListener |
| Среда выполнения | Google Chrome 150.0.7871.101, ECMAScript modules, local DOM fixture |

<details>
<summary>Теория</summary>

Повторный `addEventListener` с новой функцией создаёт несколько активных обработчиков. Инициализация должна сначала снять предыдущий listener, а затем сохранить cleanup именно для нового listener.

</details>

## Условие

Исправьте `initialize`, чтобы две последовательные инициализации перед одним click увеличивали счётчик ровно на 1.

### Входы

Локальный fixture содержит `#initialize`, `#action`, `#status`. Проблемный код:

```html
<button id="initialize" type="button">Инициализировать дважды</button>
<button id="action" type="button">Действие</button>
<p id="status" aria-live="polite">Счётчик: 0.</p>
```

```js
function initialize() {
  action.addEventListener('click', () => {
    count += 1;
    status.textContent = `Счётчик: ${count}.`;
  });
}
```

### Выходы

После «Инициализировать дважды» и одного «Действие» видны `Счётчик: 1. PASS: один активный слушатель.` и ровно один console event action.

### Ограничения и побочные эффекты

- Повторная инициализация обязана снять listener предыдущей инициализации.
- Не используйте глобальное удаление всех listeners и не клонируйте кнопку.
- Счётчик сбрасывает только кнопка сценария, не `initialize`.

### Стартовый код

```js
let dispose = () => {};
document.querySelector('#initialize').addEventListener('click', () => {
  count = 0;
  initialize();
  initialize();
});

function initialize() {
  // Сначала вызвать cleanup, затем зарегистрировать один listener.
}
```

### Примеры

#### Обычный сценарий

Две инициализации и один click дают счётчик 1.

#### Граничный сценарий

Три инициализации и один click также дают счётчик 1: активен только последний listener.

#### Ошибка или пустой результат

До click отсутствует результат действия; после click не должно возникать `FAIL: обработчик вызван повторно.`

## Критерии готовности

- Один click после повторной инициализации вызывает обработчик ровно раз.
- Cleanup ссылается на ту же функцию, что была добавлена.
- Повторный запуск сценария без reload остаётся корректным.
- В Chrome status и console подтверждают один action event.

<details>
<summary>Подсказка 1</summary>

`removeEventListener` работает только с тем же объектом функции, который передали в `addEventListener`.

</details>

<details>
<summary>Решение</summary>

### Подход

```js
let dispose = () => {};

function initialize() {
  dispose();
  const onAction = () => {
    count += 1;
    status.textContent = `Счётчик: ${count}. ${count === 1 ? 'PASS: один активный слушатель.' : 'FAIL: обработчик вызван повторно.'}`;
    status.className = count === 1 ? 'pass' : 'fail';
    console.log('[candidate-012] action', { count });
  };
  action.addEventListener('click', onAction);
  dispose = () => action.removeEventListener('click', onAction);
}
```

### Сложность

- Время: O(1) на инициализацию и click.
- Память: O(1), потому что хранится один cleanup и один активный listener.

### Компромиссы и альтернативы

Флаг «уже инициализировано» предотвращает повторную регистрацию, но не подходит, если инициализация должна заменить зависимость или конфигурацию. Cleanup-подход корректно поддерживает замену.

</details>

## Самопроверка

- Почему анонимную функцию из проблемного кода нельзя снять новой анонимной функцией?
- Что произойдёт после трёх инициализаций без cleanup?
- Когда флаг инициализации может быть недостаточен?
