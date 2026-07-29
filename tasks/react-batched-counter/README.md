# Три обновления счётчика в одном событии

Откройте [React TypeScript](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Предполагается React 19.2 в браузере; другие файлы и сеть не нужны.

## Условие

Исправьте `increaseByThree`: один клик должен увеличить счётчик ровно на `3`, второй — довести его до `6`. Сохраните три отдельных вызова `setCount`, но сделайте каждое обновление зависимым от результата предыдущего. Не используйте таймеры, ручной flush или состояние вне React.

```tsx
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

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`count` внутри одного render — снимок: три выражения `count + 1` читают одинаковое значение.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Передайте в `setCount` функцию, которая получает актуальный результат предыдущего updater из очереди.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Каждый из трёх вызовов должен иметь форму `setCount((previous) => previous + 1)`.

</details>

<details>
<summary>Решение</summary>

```tsx
const increaseByThree = (): void => {
  setCount((previous) => previous + 1);
  setCount((previous) => previous + 1);
  setCount((previous) => previous + 1);
};
```

React последовательно передаёт updater-функциям значения `0`, `1` и `2`, поэтому очередь завершается значением `3`; следующий клик начинает с `3` и заканчивается на `6`. Для ручной проверки нажмите кнопку дважды и сравните вывод после каждого клика.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: состояние и производные данные
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 15 минут

</details>
