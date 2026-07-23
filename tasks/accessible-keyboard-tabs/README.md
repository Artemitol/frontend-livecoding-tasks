# Вкладки с ARIA и клавиатурной навигацией

[← Все подборки](../../README.md)

## Условие

Реализуйте вкладки с автоматической активацией: click, ArrowRight, ArrowLeft, Home и End должны согласованно менять focus, `aria-selected`, roving `tabindex` и видимую панель. Учебная цель — связать вкладки с панелями через `aria-controls` и управлять клавиатурным фокусом без неявной зависимости от индексов панелей. Перед началом нужны HTML `button` и обработчик `keydown`.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Fixture полностью локальный и выполняется как browser ESM. Исходный keyboard-сценарий рассчитан на Google Chrome 150.0.7871.101; проверяйте настоящими клавишами и состоянием DOM, а не jsdom.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Вкладки с ARIA и клавиатурой</title>
    <style>
      body {
        margin: 2rem;
        max-width: 52rem;
        font: 16px/1.5 system-ui;
      }

      [role="tab"] {
        padding: 0.5rem 0.75rem;
      }

      [role="tab"]:focus-visible {
        outline: 3px solid #5b5bd6;
        outline-offset: 2px;
      }

      [role="tabpanel"] {
        margin-top: 0.5rem;
        padding: 1rem;
        border: 1px solid #bbb;
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
    <main>
      <h1>Разделы профиля</h1>
      <div role="tablist" aria-label="Разделы">
        <button
          id="tab-one"
          type="button"
          role="tab"
          aria-controls="panel-one"
          aria-selected="true"
          tabindex="0"
        >
          Первый
        </button>
        <button
          id="tab-two"
          type="button"
          role="tab"
          aria-controls="panel-two"
          aria-selected="false"
          tabindex="-1"
        >
          Второй
        </button>
        <button
          id="tab-three"
          type="button"
          role="tab"
          aria-controls="panel-three"
          aria-selected="false"
          tabindex="-1"
        >
          Третий
        </button>
      </div>

      <section
        id="panel-one"
        role="tabpanel"
        aria-labelledby="tab-one"
      >
        Панель 1
      </section>
      <section
        id="panel-two"
        role="tabpanel"
        aria-labelledby="tab-two"
        hidden
      >
        Панель 2
      </section>
      <section
        id="panel-three"
        role="tabpanel"
        aria-labelledby="tab-three"
        hidden
      >
        Панель 3
      </section>

      <p id="status" aria-live="polite">
        Выберите вкладку мышью или клавиатурой.
      </p>
    </main>

    <script type="module">
      // Учебная цель: реализовать ARIA-вкладки с клавиатурным фокусом.
      // Перед началом нужны HTML button и обработчик keydown.
      //
      // Допишите activate и keydown:
      // - активна ровно одна вкладка и видна ровно одна панель;
      // - панель выбирается по aria-controls;
      // - ArrowRight/ArrowLeft зациклены, Home/End ведут к краям;
      // - поддержанная клавиша переносит focus и selection одновременно;
      // - остальные клавиши ничего не меняют.

      const tabs = Array.from(
        document.querySelectorAll('[role="tab"]'),
      );
      const panels = Array.from(
        document.querySelectorAll('[role="tabpanel"]'),
      );
      const status = document.querySelector('#status');

      function report(tab) {
        const selectedTabs = tabs.filter(
          (item) => item.getAttribute('aria-selected') === 'true',
        );
        const tabbableTabs = tabs.filter((item) => item.tabIndex === 0);
        const visiblePanels = panels.filter((panel) => !panel.hidden);
        const controlledPanel = document.getElementById(
          tab.getAttribute('aria-controls'),
        );
        const pass =
          selectedTabs.length === 1 &&
          selectedTabs[0] === tab &&
          tabbableTabs.length === 1 &&
          tabbableTabs[0] === tab &&
          visiblePanels.length === 1 &&
          visiblePanels[0] === controlledPanel &&
          document.activeElement === tab;

        status.textContent =
          `${pass ? 'PASS' : 'FAIL'}: активна «${tab.textContent.trim()}», ` +
          'ARIA-связь, панель и фокус согласованы.';
        status.className = pass ? 'pass' : 'fail';
        console.log('[accessible-tabs] activate', {
          tab: tab.id,
          panel: controlledPanel?.id,
          pass,
        });
      }

      function activate(tab, focus = true) {
        // TODO: синхронизируйте aria-selected, tabindex и hidden,
        // затем при необходимости перенесите focus и вызовите report(tab).
      }

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (event) => {
          // TODO: обработайте только ArrowRight, ArrowLeft, Home и End.
        });
      });
    </script>
  </body>
</html>
```

## Готово, когда

- После focus на «Первый» и ArrowRight у `#tab-two` есть focus, `aria-selected="true"` и `tabindex="0"`, только `#panel-two` видима, а status начинается с `PASS`.
- ArrowLeft на «Первый» зацикливается на «Третий»; Home активирует «Первый», End — «Третий». В каждом состоянии ровно одна вкладка selected и ровно одна панель видима.
- Активная панель каждый раз найдена по `aria-controls`; Enter, буква или другая неподдержанная клавиша не меняют focus, ARIA-состояние и панель.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сведите все изменения состояния в одну функцию. Она должна обновить каждую вкладку, найти одну связанную панель и только затем перенести focus.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В `activate` сравните каждую вкладку с целевой: active получает `aria-selected="true"` и `tabIndex = 0`, остальные — противоположные значения. ID панели возьмите из `tab.getAttribute('aria-controls')`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `keydown` сначала отфильтруйте четыре поддержанные клавиши и вызовите `preventDefault`. Для Home и End возьмите крайние индексы, а для стрелок прибавьте `1` или `-1` и заверните результат по длине массива.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Вкладки с ARIA и клавиатурой</title>
    <style>
      body {
        margin: 2rem;
        max-width: 52rem;
        font: 16px/1.5 system-ui;
      }

      [role="tab"] {
        padding: 0.5rem 0.75rem;
      }

      [role="tab"]:focus-visible {
        outline: 3px solid #5b5bd6;
        outline-offset: 2px;
      }

      [role="tabpanel"] {
        margin-top: 0.5rem;
        padding: 1rem;
        border: 1px solid #bbb;
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
    <main>
      <h1>Разделы профиля</h1>
      <div role="tablist" aria-label="Разделы">
        <button
          id="tab-one"
          type="button"
          role="tab"
          aria-controls="panel-one"
          aria-selected="true"
          tabindex="0"
        >
          Первый
        </button>
        <button
          id="tab-two"
          type="button"
          role="tab"
          aria-controls="panel-two"
          aria-selected="false"
          tabindex="-1"
        >
          Второй
        </button>
        <button
          id="tab-three"
          type="button"
          role="tab"
          aria-controls="panel-three"
          aria-selected="false"
          tabindex="-1"
        >
          Третий
        </button>
      </div>

      <section
        id="panel-one"
        role="tabpanel"
        aria-labelledby="tab-one"
      >
        Панель 1
      </section>
      <section
        id="panel-two"
        role="tabpanel"
        aria-labelledby="tab-two"
        hidden
      >
        Панель 2
      </section>
      <section
        id="panel-three"
        role="tabpanel"
        aria-labelledby="tab-three"
        hidden
      >
        Панель 3
      </section>

      <p id="status" aria-live="polite">
        Выберите вкладку мышью или клавиатурой.
      </p>
    </main>

    <script type="module">
      const tabs = Array.from(
        document.querySelectorAll('[role="tab"]'),
      );
      const panels = Array.from(
        document.querySelectorAll('[role="tabpanel"]'),
      );
      const status = document.querySelector('#status');

      function report(tab) {
        const selectedTabs = tabs.filter(
          (item) => item.getAttribute('aria-selected') === 'true',
        );
        const tabbableTabs = tabs.filter((item) => item.tabIndex === 0);
        const visiblePanels = panels.filter((panel) => !panel.hidden);
        const controlledPanel = document.getElementById(
          tab.getAttribute('aria-controls'),
        );
        const pass =
          selectedTabs.length === 1 &&
          selectedTabs[0] === tab &&
          tabbableTabs.length === 1 &&
          tabbableTabs[0] === tab &&
          visiblePanels.length === 1 &&
          visiblePanels[0] === controlledPanel &&
          document.activeElement === tab;

        status.textContent =
          `${pass ? 'PASS' : 'FAIL'}: активна «${tab.textContent.trim()}», ` +
          'ARIA-связь, панель и фокус согласованы.';
        status.className = pass ? 'pass' : 'fail';
        console.log('[accessible-tabs] activate', {
          tab: tab.id,
          panel: controlledPanel?.id,
          pass,
        });
      }

      function activate(tab, focus = true) {
        tabs.forEach((item) => {
          const active = item === tab;
          item.setAttribute('aria-selected', String(active));
          item.tabIndex = active ? 0 : -1;
        });

        const controlledPanelId = tab.getAttribute('aria-controls');
        panels.forEach((panel) => {
          panel.hidden = panel.id !== controlledPanelId;
        });

        if (focus) {
          tab.focus();
        }
        report(tab);
      }

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (event) => {
          const supportedKeys = [
            'ArrowRight',
            'ArrowLeft',
            'Home',
            'End',
          ];
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
            nextIndex =
              (index + direction + tabs.length) % tabs.length;
          }

          activate(tabs[nextIndex]);
        });
      });
    </script>
  </body>
</html>
```

### Почему это работает

`activate` — единственная точка изменения selection, roving `tabindex`, видимости панели и focus, поэтому состояния не расходятся. Панель выбирается по объявленной ARIA-связи, а не по совпадению позиций в двух массивах. Модульный обработчик отменяет browser default только для четырёх поддержанных клавиш и зацикливает стрелки через остаток от деления.

</details>

<details>
<summary>Самопроверка</summary>

- Почему у неактивных вкладок `tabindex="-1"`, хотя они остаются кнопками?
- Зачем использовать `aria-controls`, если панели сейчас стоят в том же порядке, что и вкладки?
- Когда автоматическую активацию стрелками стоило бы заменить ручной активацией через Space или Enter?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS/JavaScript
- Подборка: Доступность интерфейсов
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 30 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
