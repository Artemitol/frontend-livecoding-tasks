# Диалог с удержанием и восстановлением фокуса

[← Все подборки](../../README.md)

## Условие

Исправьте lifecycle модального `dialog`: после открытия focus должен попасть в поле имени, Tab и Shift+Tab — циклически удерживаться внутри, а Escape и кнопка закрытия — возвращать focus инициатору. Учебная цель — согласовать открытие, focus trap и единый путь закрытия native dialog. Перед началом нужны HTML `dialog`, `keydown` и `focus`.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Fixture полностью локальный и выполняется как browser ESM. Исходный keyboard-сценарий рассчитан на Google Chrome 150.0.7871.101; проверяйте настоящее положение focus клавишами Tab, Shift+Tab и Escape, а не jsdom.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Диалог с удержанием фокуса</title>
    <style>
      body {
        margin: 2rem;
        max-width: 52rem;
        font: 16px/1.5 system-ui;
      }

      dialog {
        width: min(28rem, calc(100vw - 2rem));
        padding: 1.25rem;
        box-sizing: border-box;
      }

      dialog label,
      dialog button {
        display: block;
        margin: 0.75rem 0;
      }

      :focus-visible {
        outline: 3px solid #5b5bd6;
        outline-offset: 2px;
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
      <h1>Подтверждение профиля</h1>
      <button id="open" type="button">Открыть диалог</button>

      <dialog id="dialog" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Подтверждение</h2>
        <label>
          Имя
          <input id="name" value="Иван">
        </label>
        <button id="confirm" type="button">Подтвердить</button>
        <button id="close" type="button">Закрыть</button>
      </dialog>

      <p id="status" aria-live="polite">Диалог закрыт.</p>
    </main>

    <script type="module">
      // Учебная цель: исправить полный focus lifecycle native dialog.
      // Перед началом нужны HTML dialog, keydown и focus.
      //
      // Исправьте open, closeDialog, cancel и keydown:
      // - после showModal focus находится на #name;
      // - Tab с #close переносит focus на #name;
      // - Shift+Tab с #name переносит focus на #close;
      // - Escape и кнопка #close используют closeDialog;
      // - после закрытия focus возвращается на #open.

      const opener = document.querySelector('#open');
      const dialog = document.querySelector('#dialog');
      const nameInput = document.querySelector('#name');
      const closeButton = document.querySelector('#close');
      const status = document.querySelector('#status');

      const getFocusable = () =>
        Array.from(
          dialog.querySelectorAll(
            'input:not([disabled]), button:not([disabled])',
          ),
        );

      function closeDialog() {
        dialog.close();
        // TODO: верните focus инициатору и покажите PASS/FAIL.
      }

      opener.addEventListener('click', () => {
        dialog.showModal();
        document.querySelector('#confirm').focus();
        // TODO: начальный focus должен быть на #name.
      });

      closeButton.addEventListener('click', closeDialog);

      dialog.addEventListener('cancel', (event) => {
        // TODO: отмените native close и используйте closeDialog.
      });

      dialog.addEventListener('keydown', (event) => {
        // TODO: обработайте Escape и две границы циклического Tab.
      });
    </script>
  </body>
</html>
```

## Готово, когда

- После «Открыть диалог» native `showModal()` открывает modal, `document.activeElement` равен `#name`, а status подтверждает начальный focus.
- Tab с `#close` переносит focus на `#name`, Shift+Tab с `#name` — на `#close`; промежуточные элементы остаются в естественном порядке.
- Escape закрывает dialog, возвращает focus на `#open` и показывает `PASS`; повторное открытие и кнопка «Закрыть» дают тот же результат через общий `closeDialog`.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите lifecycle на три части: открыть и поставить начальный focus, удерживать focus на двух границах, закрыть и вернуть focus. Закрытие должно быть одной функцией для всех путей.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После `showModal()` явно вызовите `focus()` у `#name`. В `closeDialog()` сначала закройте dialog, затем сфокусируйте сохранённую кнопку `#open` и проверьте `document.activeElement`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Получите текущий массив enabled `input` и `button`. Перехватывайте только Tab с последнего и Shift+Tab с первого элемента. Для Escape и события `cancel` отмените native действие и вызовите общий `closeDialog`.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Диалог с удержанием фокуса</title>
    <style>
      body {
        margin: 2rem;
        max-width: 52rem;
        font: 16px/1.5 system-ui;
      }

      dialog {
        width: min(28rem, calc(100vw - 2rem));
        padding: 1.25rem;
        box-sizing: border-box;
      }

      dialog label,
      dialog button {
        display: block;
        margin: 0.75rem 0;
      }

      :focus-visible {
        outline: 3px solid #5b5bd6;
        outline-offset: 2px;
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
      <h1>Подтверждение профиля</h1>
      <button id="open" type="button">Открыть диалог</button>

      <dialog id="dialog" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Подтверждение</h2>
        <label>
          Имя
          <input id="name" value="Иван">
        </label>
        <button id="confirm" type="button">Подтвердить</button>
        <button id="close" type="button">Закрыть</button>
      </dialog>

      <p id="status" aria-live="polite">Диалог закрыт.</p>
    </main>

    <script type="module">
      const opener = document.querySelector('#open');
      const dialog = document.querySelector('#dialog');
      const nameInput = document.querySelector('#name');
      const closeButton = document.querySelector('#close');
      const status = document.querySelector('#status');

      const getFocusable = () =>
        Array.from(
          dialog.querySelectorAll(
            'input:not([disabled]), button:not([disabled])',
          ),
        );

      function closeDialog() {
        dialog.close();
        opener.focus();
        const pass =
          !dialog.open && document.activeElement === opener;
        status.textContent =
          `${pass ? 'PASS' : 'FAIL'}: диалог закрыт, ` +
          'фокус возвращён инициатору.';
        status.className = pass ? 'pass' : 'fail';
        console.log('[modal-focus] closed', {
          pass,
          activeId: document.activeElement.id,
        });
      }

      opener.addEventListener('click', () => {
        dialog.showModal();
        nameInput.focus();
        const pass =
          dialog.open && document.activeElement === nameInput;
        status.textContent =
          `${pass ? 'PASS' : 'FAIL'}: диалог открыт, ` +
          'начальный фокус на поле имени.';
        status.className = pass ? 'pass' : 'fail';
        console.log('[modal-focus] opened', {
          pass,
          activeId: document.activeElement.id,
        });
      });

      closeButton.addEventListener('click', closeDialog);

      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeDialog();
      });

      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeDialog();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        let expectedTarget = null;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
          expectedTarget = last;
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
          expectedTarget = first;
        }

        if (expectedTarget) {
          const pass =
            dialog.contains(document.activeElement) &&
            document.activeElement === expectedTarget;
          status.textContent =
            `${pass ? 'PASS' : 'FAIL'}: фокус циклически ` +
            `переведён на #${expectedTarget.id}.`;
          status.className = pass ? 'pass' : 'fail';
          console.log('[modal-focus] trap', {
            pass,
            activeId: document.activeElement.id,
          });
        }
      });
    </script>
  </body>
</html>
```

### Почему это работает

`showModal()` создаёт native modal semantics, а явный `nameInput.focus()` делает начальную точку детерминированной. Trap вмешивается только на двух границах, поэтому обычный порядок Tab внутри сохраняется. `closeDialog` объединяет кнопку, Escape и событие `cancel`: dialog закрывается до явного возврата focus инициатору.

</details>

<details>
<summary>Самопроверка</summary>

- Почему focusable-элементы полезно получать заново при каждом граничном Tab?
- На каких двух состояниях `document.activeElement` нужен `preventDefault` для Tab?
- Зачем обрабатывать и `keydown` Escape, и native `cancel`, если оба вызывают одну функцию?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS/JavaScript
- Подборка: Доступность интерфейсов
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
