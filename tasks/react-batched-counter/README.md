# Три обновления счётчика в одном событии

[← Все подборки](../../README.md)

Откройте [Vite React TypeScript в StackBlitz](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Сценарий проверяет поведение React 19.2 в браузере Google Chrome 150.0.7871.101. Другие файлы менять не нужно.

## Условие

```tsx
// Учебная цель: исправлять серию batched-обновлений,
// когда каждый следующий шаг зависит от предыдущего состояния.
// Перед началом нужны useState и обработчики событий.
//
// Исправьте increaseByThree так, чтобы один click увеличивал count
// ровно на 3, а второй click доводил его до 6.
// Оставьте три отдельных вызова setCount: не заменяйте их одним +3.
// Не используйте таймеры, ручной flush или переменную вне React state.

import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const increaseByThree = (): void => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <main>
      <h1>Счётчик с очередью обновлений</h1>
      <output aria-live="polite">Счётчик: {count}</output>
      <button type="button" onClick={increaseByThree}>
        Увеличить на 3
      </button>
    </main>
  );
}
```

## Готово, когда

- До взаимодействия показано `Счётчик: 0`.
- Первый клик по «Увеличить на 3» показывает `Счётчик: 3`.
- Второй клик без перезагрузки показывает `Счётчик: 6`.
- Все три обновления используют функциональную форму `setCount`, без таймеров, ручного flush и состояния вне React.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Значение `count` внутри одного render — снимок. Три выражения `count + 1` читают один и тот же снимок, а не результаты предыдущих вызовов.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Передайте в `setCount` функцию. React вызовет её со значением, уже полученным после предыдущего updater в очереди.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сохраните три вызова, но каждый запишите в форме `setCount((previous) => previous + 1)`.

</details>

<details>
<summary>Решение</summary>

```tsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const increaseByThree = (): void => {
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
  };

  return (
    <main>
      <h1>Счётчик с очередью обновлений</h1>
      <output aria-live="polite">Счётчик: {count}</output>
      <button type="button" onClick={increaseByThree}>
        Увеличить на 3
      </button>
    </main>
  );
}
```

### Почему это работает

React ставит updater-функции в очередь. Они последовательно получают значения `0`, `1` и `2`, поэтому первый event завершает очередь значением `3`. Следующий event начинает уже с нового снимка и получает `6`. Batching объединяет render, но не теряет зависимые функциональные переходы.

</details>

<details>
<summary>Самопроверка</summary>

- Почему три выражения `count + 1` читают одно значение?
- Какой результат даст третий клик без перезагрузки?
- Когда один updater `previous + 3` уместен, хотя здесь он не выполняет учебное условие?

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: состояние и производные данные
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 15 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
