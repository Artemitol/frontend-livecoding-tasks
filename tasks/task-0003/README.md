# task-0003 — Стабильная кнопка инкремента

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: ввод текста не должен рендерить memo-компонент CounterControl.
// Каждый клик CounterControl увеличивает count от его последнего значения, включая серию быстрых кликов.
// Стабилизируйте callback и примените функциональный setCount без замыкания на устаревший count.
// Не переносите text в другой компонент и сохраните существующее видимое поведение.
// Используйте React 19.2; начальный dev StrictMode render может быть записан в консоль дважды.

import { memo, useState } from 'react';

type CounterControlProps = {
  count: number;
  onIncrement: () => void;
};

const CounterControl = memo(function CounterControl({
  count,
  onIncrement,
}: CounterControlProps) {
  console.count('CounterControl render');

  return (
    <section>
      <output>Счётчик: {count}</output>
      <button type="button" onClick={onIncrement}>
        +1
      </button>
    </section>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const increment = (): void => {
    setCount(count + 1);
  };

  return (
    <main>
      <label>
        Комментарий
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>

      <CounterControl count={count} onIncrement={increment} />
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

При изменении `text` значение `count` прежнее, но prop `onIncrement` получает новую функцию.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Стабилизируйте callback через `useCallback`, а чтение предыдущего счётчика передайте самому `setCount`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Пустые зависимости безопасны для callback вида `setCount((current) => current + 1)`: он не читает `count` из render.

</details>

<details>
<summary>Решение</summary>

```tsx
import { memo, useCallback, useState } from 'react';

// Внутри App:
const increment = useCallback((): void => {
  setCount((current) => current + 1);
}, []);
```

Функциональное обновление получает актуальное значение из очереди React, поэтому callback не зависит от снимка `count` и сохраняет identity между render.

Ожидаемый результат: ввод текста не меняет счётчик render дочернего компонента, а клики последовательно показывают `1`, `2`, `3` и далее.

Ручная проверка: после загрузки введите текст, сравните `CounterControl render`, затем быстро нажмите `+1` пять раз и убедитесь, что вывод равен `5`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Рендеринг и мемоизация
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
