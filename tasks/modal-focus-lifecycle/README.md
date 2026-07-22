# Диалог с удержанием и восстановлением фокуса

**Учебная цель:** Исправлять диалог так, чтобы фокус удерживался внутри и возвращался инициатору после закрытия.

| Метаданные | Значение |
| --- | --- |
| Технологии | HTML, JavaScript, DOM API |
| Тема | Доступность интерфейса |
| Формат | Отладка |
| Уровень | Продвинутый |
| Время | 30 минут |
| Навыки | Modal dialog lifecycle, keyboard focus trap, Escape, restoration focus |
| Предварительные знания | HTML dialog, keydown и focus |
| Среда выполнения | Google Chrome 150.0.7871.101, local HTML fixture, keyboard scenario |

<details>
<summary>Теория</summary>

Модальный диалог должен получать начальный фокус, не выпускать Tab за свои интерактивные элементы и после закрытия возвращать фокус элементу, который его открыл. Для крайних элементов trap перехватывает только Tab с последнего и Shift+Tab с первого.

</details>

## Условие

Исправьте lifecycle `dialog`, чтобы `#name`, `#confirm`, `#close` образовывали циклический порядок фокуса, Escape закрывал диалог, а фокус возвращался `#open`.

### Входы

Локальный fixture:

```html
<button id="open" type="button">Открыть диалог</button>
<dialog id="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Подтверждение</h2>
  <label>Имя <input id="name" value="Иван"></label>
  <button id="confirm" type="button">Подтвердить</button>
  <button id="close" type="button">Закрыть</button>
</dialog>
<p id="status"></p>
```

### Выходы

После открытия focus на `#name`; Tab с `#close` переносит focus на `#name`; Shift+Tab с `#name` — на `#close`. Escape закрывает диалог, фокус на `#open`, status начинается с PASS.

### Ограничения и побочные эффекты

- Используйте native `showModal()` и `close()`.
- Не добавляйте внешнюю библиотеку или глобальный document-level trap.
- В список focusable входят только enabled input и button диалога; изменения допустимы только в dialog, focus, status и console.

### Стартовый код

Полный локальный HTML fixture доступен по относительному пути [`assets/fixture.html`](assets/fixture.html). В нём исправьте обработчики открытия, закрытия, `cancel` и `keydown`.

### Примеры

#### Обычный сценарий

Нажмите «Открыть диалог», переведите focus на «Закрыть», нажмите Tab: focus переходит в поле имени.

#### Граничный сценарий

С поля имени нажмите Shift+Tab: focus переходит на «Закрыть», не на страницу за диалогом.

#### Ошибка или пустой результат

Нажмите Escape: событие отменяется, диалог закрыт, а `document.activeElement` — `#open`; закрытый диалог не удерживает focus.

## Критерии готовности

- Начальный focus находится в диалоге.
- Tab и Shift+Tab зациклены на крайних focusable элементах.
- Escape и кнопка «Закрыть» используют единый путь закрытия.
- В Chrome ручной сценарий даёт PASS и возвращает focus #open.

<details>
<summary>Подсказка 1</summary>

Получите массив focusable элементов диалога; переносите focus вручную только на его первом и последнем элементах.

</details>

<details>
<summary>Решение</summary>

### Подход

```js
const focusable = () => Array.from(dialog.querySelectorAll('input,button:not([disabled])'));

function closeDialog() {
  dialog.close();
  opener.focus();
  const pass = document.activeElement === opener;
  status.textContent = `${pass ? 'PASS' : 'FAIL'}: диалог закрыт, фокус возвращён инициатору.`;
  status.className = pass ? 'pass' : 'fail';
}

opener.addEventListener('click', () => {
  dialog.showModal();
  document.querySelector('#name').focus();
});
document.querySelector('#close').addEventListener('click', closeDialog);
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDialog();
    return;
  }
  if (event.key !== 'Tab') return;
  const elements = focusable();
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
```

### Сложность

- Время: O(k) на Tab, где k — число focusable элементов диалога.
- Память: O(k) на временный массив focusable элементов.

### Компромиссы и альтернативы

Пересчёт focusable элементов на Tab корректен при динамических кнопках, но для большого статичного диалога можно кэшировать список и обновлять его при изменении DOM. Native dialog даёт modal semantics, но проверка доступности всё равно требует ручной browser-проверки.

</details>

## Самопроверка

- Почему Escape обрабатывается явно в `keydown`, а `cancel` остаётся страховочным native-путём?
- На каких двух местах Tab требует `preventDefault`?
- Почему после close нужно вернуть focus явно?
