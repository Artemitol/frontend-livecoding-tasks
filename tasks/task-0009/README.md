# task-0009 — Счётчик с изменяемым шагом

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: обе memo-кнопки используют последнее значение step для изменения count.
// Перемещение range не должно рендерить StepButton; клики после него сразу применяют новый шаг.
// Стабилизируйте callback кнопок и обновляйте count от предыдущего значения.
// Используйте React 19.2; начальные console.count в dev StrictMode могут выполниться дважды.

import { memo, useState } from 'react';

type StepButtonProps = {
  label: string;
  onClick?: () => void;
};

const StepButton = memo(function StepButton({
  label,
  onClick,
}: StepButtonProps) {
  console.count(`${label} render`);

  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
});

export default function App() {
  const [count] = useState(0);
  const [step] = useState(1);

  return (
    <main>
      <output>Счётчик: {count}</output>
      <label>
        Шаг: {step}
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          readOnly
        />
      </label>
      <StepButton label="Уменьшить" />
      <StepButton label="Увеличить" />
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Пустые зависимости сохранят identity callback, но обычное замыкание тогда навсегда запомнит начальный `step`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните актуальный шаг в `useRef`, обновляя ref одновременно с `step`, а callback меняйте только через стабильные React API.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оба `useCallback` могут иметь пустые зависимости, если используют `stepRef.current` и функциональный `setCount((current) => ...)`.

</details>

<details>
<summary>Решение</summary>

```tsx
import {
  memo,
  useCallback,
  useRef,
  useState,
} from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const stepRef = useRef(step);

  const handleStepChange = (value: number): void => {
    stepRef.current = value;
    setStep(value);
  };

  const increase = useCallback((): void => {
    setCount((current) => current + stepRef.current);
  }, []);

  const decrease = useCallback((): void => {
    setCount((current) => current - stepRef.current);
  }, []);

  return (
    <main>
      <output>Счётчик: {count}</output>
      <label>
        Шаг: {step}
        <input
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(event) => {
            handleStepChange(Number(event.target.value));
          }}
        />
      </label>
      <StepButton label="Уменьшить" onClick={decrease} />
      <StepButton label="Увеличить" onClick={increase} />
    </main>
  );
}
```

Ref предоставляет обработчикам последнее значение без новой function identity. Функциональный `setCount` так же исключает устаревший снимок счётчика.

Ожидаемый результат: смена шага не добавляет логи кнопок, а следующий клик изменяет число ровно на выбранный шаг.

Ручная проверка: установите шаг `5`, нажмите «Увеличить» дважды и «Уменьшить» один раз; итог должен быть `5`, а счётчики render кнопок не должны вырасти после загрузки.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Состояние и обработчики событий
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>
