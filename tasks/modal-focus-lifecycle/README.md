# Диалог с удержанием и восстановлением фокуса

Откройте [CodePen](https://pen.new), вставьте HTML, CSS и JavaScript в одноимённые панели и запустите в режиме browser ESM без препроцессора. Сценарий использует native `dialog` и настоящее положение focus.

## Условие

Исправьте lifecycle диалога: после `showModal()` focus должен попасть в поле имени; Tab с последнего элемента и Shift+Tab с первого должны циклически удерживать focus внутри; кнопка закрытия и Escape должны использовать общий `closeDialog`, закрывать диалог и возвращать focus инициатору. Промежуточные элементы оставьте в естественном tab order.

```html
<button id="open" type="button">Открыть диалог</button>
<dialog id="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Подтверждение</h2>
  <label>Имя <input id="name" value="Иван"></label>
  <button id="confirm" type="button">Подтвердить</button>
  <button id="close" type="button">Закрыть</button>
</dialog>
```

```css
:focus-visible {
  outline: 3px solid #5b5bd6;
  outline-offset: 2px;
}
```

```javascript
const opener = document.querySelector('#open');
const dialog = document.querySelector('#dialog');
const nameInput = document.querySelector('#name');
const closeButton = document.querySelector('#close');
let focusReturnTarget = null;

const getFocusable = () =>
  Array.from(
    dialog.querySelectorAll(
      'input:not([disabled]), button:not([disabled])',
    ),
  );

function closeDialog() {
  dialog.close();
  // Верните focus инициатору.
}

opener.addEventListener('click', () => {
  dialog.showModal();
  // Сохраните инициатора и поставьте начальный focus.
});

closeButton.addEventListener('click', closeDialog);

dialog.addEventListener('cancel', (event) => {
  // Отмените native close и используйте closeDialog.
});

dialog.addEventListener('keydown', (event) => {
  // Зациклите Tab только на двух границах.
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите lifecycle на три части: открыть и поставить начальный focus, удерживать focus на границах, закрыть и вернуть focus.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

До `showModal()` сохраните `document.activeElement`, после открытия вызовите `nameInput.focus()`, а после `dialog.close()` сфокусируйте сохранённый элемент.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

При каждом `keydown` заново получите enabled `input` и `button`. Перехватывайте только Tab с последнего и Shift+Tab с первого элемента; в `cancel` отмените native действие и вызовите общий путь закрытия.

</details>

<details>
<summary>Решение</summary>

```javascript
function closeDialog() {
  dialog.close();
  focusReturnTarget?.focus();
}

opener.addEventListener('click', () => {
  focusReturnTarget = document.activeElement;
  dialog.showModal();
  nameInput.focus();
});

dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});

dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') {
    return;
  }

  const focusable = getFocusable();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
```

Явный начальный focus делает открытие детерминированным, trap вмешивается только на границах, а событие `cancel` направляет Escape в общий `closeDialog`. Для ручной проверки откройте диалог, пройдите Tab до «Закрыть», проверьте переход к полю имени и обратный переход по Shift+Tab. Закройте кнопкой и Escape: в обоих случаях focus должен вернуться на «Открыть диалог».

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS/JavaScript
- Подборка: Доступность интерфейсов
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
