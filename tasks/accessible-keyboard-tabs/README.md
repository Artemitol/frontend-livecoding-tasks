# Вкладки с ARIA и клавиатурной навигацией

**Учебная цель:** Реализовывать вкладки с корректными ARIA-связями и клавиатурным перемещением фокуса.

| Метаданные | Значение |
| --- | --- |
| Технологии | HTML, JavaScript, DOM API |
| Тема | Доступность интерфейса |
| Формат | Реализация |
| Уровень | Средний |
| Время | 30 минут |
| Навыки | ARIA selected и controls, roving tabindex, Arrow keys, Home и End |
| Предварительные знания | HTML button и обработчик keydown |
| Среда выполнения | Google Chrome 150.0.7871.101, local HTML fixture, keyboard scenario |

<details>
<summary>Теория</summary>

У одной вкладки `aria-selected="true"` и `tabindex="0"`; у остальных — `false` и `-1`. `aria-controls` связывает вкладку с панелью. При автоматической активации клавиша переносит фокус и меняет видимую панель одновременно.

</details>

## Условие

Завершите `activate(tab)` и обработчик клавиатуры. Поддержите click, ArrowRight, ArrowLeft, Home и End; стрелки зацикливаются.

### Входы

Полный локальный fixture:

```html
<div role="tablist" aria-label="Разделы">
  <button id="tab-one" role="tab" aria-controls="panel-one" aria-selected="true" tabindex="0">Первый</button>
  <button id="tab-two" role="tab" aria-controls="panel-two" aria-selected="false" tabindex="-1">Второй</button>
  <button id="tab-three" role="tab" aria-controls="panel-three" aria-selected="false" tabindex="-1">Третий</button>
</div>
<section id="panel-one" role="tabpanel" aria-labelledby="tab-one">Панель 1</section>
<section id="panel-two" role="tabpanel" aria-labelledby="tab-two" hidden>Панель 2</section>
<section id="panel-three" role="tabpanel" aria-labelledby="tab-three" hidden>Панель 3</section>
<p id="status" aria-live="polite">Выберите вкладку.</p>
```

```js
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
function activate(tab, focus = true) {
  // Обновить selected, tabindex, hidden и фокус.
}
```

### Выходы

После ArrowRight на «Первый» `#tab-two` имеет `aria-selected="true"`, `tabindex="0"`, фокус; только `#panel-two` не hidden. Status начинается с PASS.

### Ограничения и побочные эффекты

- В каждый момент активна ровно одна вкладка и видна ровно одна панель.
- Используйте данные `aria-controls`, не индексы панелей как неявную связь.
- Иные клавиши не меняют вкладку; допустимы изменения ARIA, `hidden`, focus, status и console.

### Стартовый код

Используйте полный локальный fixture [`assets/fixture.html`](assets/fixture.html); разметка является частью условия, внешние библиотеки не разрешены.

### Примеры

#### Обычный сценарий

Сфокусируйте «Первый», нажмите ArrowRight. Активируются «Второй» и «Панель 2».

#### Граничный сценарий

На «Первый» ArrowLeft активирует «Третий»; Home активирует «Первый», End — «Третий».

#### Ошибка или пустой результат

Нажатие Enter или буквы не меняет ARIA-состояние, панель и focus.

## Критерии готовности

- Ровно одна вкладка selected и с `tabindex=0`.
- Активная вкладка связана с единственной видимой панелью через `aria-controls`.
- Arrow keys, Home и End перемещают focus и selection.
- Ручная проверка Chrome подтверждает состояние tab-two и сценарии Home и End.

<details>
<summary>Подсказка 1</summary>

Сначала вычислите target index, затем вызовите одну функцию `activate` для click и всех поддержанных клавиш.

</details>

<details>
<summary>Решение</summary>

### Подход

```js
function activate(tab, focus = true) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute('aria-controls');
  });
  if (focus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    activate(tabs[next]);
  });
});
```

### Сложность

- Время: O(n) на активацию, где n — число вкладок и панелей.
- Память: O(n) на локальные массивы tabs и panels.

### Компромиссы и альтернативы

Автоматическая активация по стрелкам быстрее для небольшого набора вкладок. Для тяжёлых панелей можно перемещать только focus, а активацию делать Space или Enter, но тогда контракт клавиатуры будет другим.

</details>

## Самопроверка

- Почему у неактивной вкладки `tabindex=-1`?
- Почему `aria-controls` надёжнее параллельных индексов?
- Когда стоит выбрать ручную, а не автоматическую активацию?
