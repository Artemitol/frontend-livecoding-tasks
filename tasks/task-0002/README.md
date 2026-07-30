# Счётчик без лишнего рендера

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx и не меняйте видимое поведение двух полей состояния.
// Ввод текста не должен заново рендерить CountDisplay, а изменение count должно показать новое значение.
// Сохраните CountDisplay отдельным компонентом и решите задачу средствами React memoization.
// Используйте React 19.2; dev StrictMode может удваивать render-вызовы, поэтому сравнивайте их причину, а не точное число.

import { useState } from 'react';

type CountDisplayProps = {
  count: number;
};

const CountDisplay = ({ count }: CountDisplayProps) => {
  console.count('CountDisplay render');

  return <output>Счётчик: {count}</output>;
};

export default function App() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);

  return (
    <main>
      <label>
        Заметка
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>

      <CountDisplay count={count} />

      <button
        type="button"
        onClick={() => setCount((current) => current + 1)}
      >
        Увеличить
      </button>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`CountDisplay` получает только число, но обычный компонент вызывается при каждом render родителя.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавьте в import React API, которое пропускает render компонента, если его props не изменились.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оберните именованную функцию `CountDisplay` в `memo`; дополнительное сравнение props здесь не требуется.

</details>

<details>
<summary>Решение</summary>

```tsx
import { memo, useState } from 'react';

const CountDisplay = memo(function CountDisplay({
  count,
}: CountDisplayProps) {
  console.count('CountDisplay render');

  return <output>Счётчик: {count}</output>;
});
```

`memo` сравнивает прежний и новый `count`. Изменение `text` оставляет prop прежним, а новый счётчик проходит сравнение и обновляет вывод.

Ожидаемый результат: печать в поле не добавляет `CountDisplay render`, а изменение счётчика обновляет значение и вызывает render дочернего компонента с учётом возможного StrictMode-повтора.

Ручная проверка: откройте консоль, введите несколько символов и убедитесь в отсутствии новых логов дочернего компонента, затем дважды нажмите «Увеличить» и проверьте значения `1` и `2` вместе с новыми render-логами.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
