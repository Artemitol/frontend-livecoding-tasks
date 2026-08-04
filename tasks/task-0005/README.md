# task-0005 — Часы на interval и timeout

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx и реализуйте два независимых варианта часов: setInterval и рекурсивный setTimeout.
// Оба варианта сразу показывают текущее время, затем обновляют его примерно раз в 1000 мс.
// Каждый компонент держит только один активный таймер и отменяет его при размонтировании.
// Используйте React 19.2 в браузере; не добавляйте пакеты и не запускайте таймер во время render.
// Каждый timer callback пишет console.count с label; после скрытия соответствующие tick-логи прекращаются.

import { useEffect, useState } from 'react';

type ClockProps = {
  label: string;
};

function IntervalClock({ label }: ClockProps) {
  const [now] = useState<Date | null>(null);

  useEffect(() => {
    // Реализуйте обновление через setInterval.
  }, []);

  return (
    <p>
      {label}:{' '}
      <time>
        {now ? now.toLocaleTimeString('ru-RU') : '—'}
      </time>
    </p>
  );
}

function TimeoutClock({ label }: ClockProps) {
  const [now] = useState<Date | null>(null);

  useEffect(() => {
    // Реализуйте рекурсивное планирование через setTimeout.
  }, []);

  return (
    <p>
      {label}:{' '}
      <time>
        {now ? now.toLocaleTimeString('ru-RU') : '—'}
      </time>
    </p>
  );
}

export default function App() {
  const [showInterval, setShowInterval] = useState(true);
  const [showTimeout, setShowTimeout] = useState(true);

  return (
    <main>
      <h1>Два способа обновить часы</h1>
      <button
        type="button"
        onClick={() => setShowInterval((current) => !current)}
      >
        Показать или скрыть Interval
      </button>
      <button
        type="button"
        onClick={() => setShowTimeout((current) => !current)}
      >
        Показать или скрыть Timeout
      </button>
      {showInterval && <IntervalClock label="Interval" />}
      {showTimeout && <TimeoutClock label="Timeout" />}
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Таймер — внешний ресурс effect: его идентификатор нужен cleanup, а изменение `now` не должно пересоздавать расписание.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для interval сохраните результат `window.setInterval`; для timeout объявите `tick`, который после обновления планирует следующий вызов.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В timeout-варианте храните последний `timeoutId` в области effect, первый вызов запланируйте один раз, а cleanup передайте этот ID в `clearTimeout`.

</details>

<details>
<summary>Решение</summary>

```tsx
function IntervalClock({ label }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      console.count(`${label} tick`);
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [label]);

  return (
    <p>
      {label}:{' '}
      <time>
        {now ? now.toLocaleTimeString('ru-RU') : '—'}
      </time>
    </p>
  );
}

function TimeoutClock({ label }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeoutId = 0;

    const tick = (): void => {
      console.count(`${label} tick`);
      setNow(new Date());
      timeoutId = window.setTimeout(tick, 1000);
    };

    timeoutId = window.setTimeout(tick, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [label]);

  return (
    <p>
      {label}:{' '}
      <time>
        {now ? now.toLocaleTimeString('ru-RU') : '—'}
      </time>
    </p>
  );
}
```

Interval повторяется сам, а рекурсивный timeout планирует следующий шаг только после текущего. В обоих случаях cleanup отменяет единственный активный идентификатор.

Ожидаемый результат: обе строки показывают время сразу и продолжают обновляться каждую секунду без умножения таймеров.

Ручная проверка: наблюдайте обе строки и tick-логи не меньше трёх секунд, скройте каждый компонент его кнопкой и убедитесь, что соответствующий лог прекратился; после повторного показа частота остаётся раз в секунду.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Эффекты, таймеры и очистка
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
