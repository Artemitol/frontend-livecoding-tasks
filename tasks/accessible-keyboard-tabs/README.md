# Вкладки с ARIA и клавиатурной навигацией

Откройте [CodePen](https://pen.new), вставьте HTML, CSS и JavaScript в одноимённые панели и запустите в режиме browser ESM без препроцессора. Сценарий использует настоящие клавиши и состояние DOM; CSS задаёт только видимый focus indicator.

## Условие

Реализуйте вкладки с автоматической активацией. Клик, ArrowRight, ArrowLeft, Home и End должны согласованно менять focus, `aria-selected`, roving `tabindex` и видимую панель. Стрелки зацикливаются, Home и End ведут к краям, а неподдержанная клавиша ничего не меняет. Связанную панель выбирайте по `aria-controls`, а не по её позиции.

```html
<div role="tablist" aria-label="Разделы">
  <button id="tab-one" type="button" role="tab" aria-controls="panel-one" aria-selected="true" tabindex="0">Первый</button>
  <button id="tab-two" type="button" role="tab" aria-controls="panel-two" aria-selected="false" tabindex="-1">Второй</button>
  <button id="tab-three" type="button" role="tab" aria-controls="panel-three" aria-selected="false" tabindex="-1">Третий</button>
</div>
<section id="panel-one" role="tabpanel" aria-labelledby="tab-one">Панель 1</section>
<section id="panel-two" role="tabpanel" aria-labelledby="tab-two" hidden>Панель 2</section>
<section id="panel-three" role="tabpanel" aria-labelledby="tab-three" hidden>Панель 3</section>
```

```css
[role="tab"]:focus-visible {
  outline: 3px solid #5b5bd6;
  outline-offset: 2px;
}
```

```javascript
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(
  document.querySelectorAll('[role="tabpanel"]'),
);

function activate(tab) {
  // Синхронизируйте aria-selected, tabindex, hidden и focus.
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (event) => {
    // Обработайте ArrowRight, ArrowLeft, Home и End.
  });
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сведите все изменения состояния в одну функцию: она обновляет каждую вкладку, находит одну связанную панель и затем переносит focus.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В `activate` сравните каждую вкладку с целевой. ID нужной панели получите из `tab.getAttribute('aria-controls')`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `keydown` сначала отфильтруйте четыре поддержанные клавиши. Для стрелок прибавьте `1` или `-1` и заверните индекс по длине массива; для Home и End возьмите крайние индексы.

</details>

<details>
<summary>Решение</summary>

```javascript
function activate(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });

  const controlledPanelId = tab.getAttribute('aria-controls');
  panels.forEach((panel) => {
    panel.hidden = panel.id !== controlledPanelId;
  });

  tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (event) => {
    const supportedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!supportedKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex;
    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      nextIndex = (index + direction + tabs.length) % tabs.length;
    }

    activate(tabs[nextIndex]);
  });
});
```

`activate` становится единственной точкой изменения selection, roving `tabindex`, видимости панели и focus. Для ручной проверки поставьте focus на «Первый»: ArrowRight должен активировать «Второй», ArrowLeft на «Первый» — «Третий», Home — «Первый», End — «Третий». После каждого шага должна быть выбрана ровно одна вкладка и видна панель из её `aria-controls`; Enter и буквы ничего не меняют.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS/JavaScript
- Подборка: Доступность интерфейсов
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
