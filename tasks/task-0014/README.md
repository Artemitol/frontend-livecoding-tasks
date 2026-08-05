# task-0014 — Актуальный счётчик после перехода offline

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: один переход offline запускает один interval с секундным логом актуального count.
// Повторное событие offline не создаёт второй interval; увеличение count сразу отражается в следующих логах.
// Активный listener один раз вызывает onOffline; после размонтирования событие не меняет внешний счётчик и interval остановлен.
// Используйте React 19.2 в браузере; событие можно вызвать через window.dispatchEvent(new Event('offline')).

import { useState } from 'react';

type OfflineCounterProps = {
  onOffline: () => void;
};

function OfflineCounter({ onOffline }: OfflineCounterProps) {
  const [count, setCount] = useState(0);
  const [offline, setOffline] = useState(false);

  window.addEventListener('offline', () => {
    onOffline();
    setOffline(true);
    window.setInterval(() => {
      console.log(`count:${count}`);
    }, 1000);
  });

  return (
    <section>
      <p>{offline ? 'Offline' : 'Online'}</p>
      <output>Счётчик: {count}</output>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
      >
        Увеличить
      </button>
    </section>
  );
}

export default function App() {
  const [showCounter, setShowCounter] = useState(true);
  const [offlineEvents, setOfflineEvents] = useState(0);

  return (
    <main>
      <button
        type="button"
        onClick={() => setShowCounter((current) => !current)}
      >
        {showCounter ? 'Скрыть счётчик' : 'Показать счётчик'}
      </button>
      <output>Обработано offline: {offlineEvents}</output>
      {showCounter && (
        <OfflineCounter
          onOffline={() => {
            setOfflineEvents((current) => current + 1);
          }}
        />
      )}
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Регистрация listener во время рендера повторяется, а callback interval замыкается на снимке `count` того же рендера.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Вынесите подписку в effect с cleanup, а запуск interval — в отдельный effect, который зависит от состояния `offline`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Храните последний count в `useRef`; синхронизируйте ref в отдельном effect с зависимостью от `count`, чтобы стабильный interval читал `countRef.current`.

</details>

<details>
<summary>Решение</summary>

```tsx
import { useEffect, useRef, useState } from 'react';

function OfflineCounter({ onOffline }: OfflineCounterProps) {
  const [count, setCount] = useState(0);
  const [offline, setOffline] = useState(false);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const handleOffline = (): void => {
      onOffline();
      setOffline(true);
    };

    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOffline]);

  useEffect(() => {
    if (!offline) {
      return;
    }

    const intervalId = window.setInterval(() => {
      console.log(`count:${countRef.current}`);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [offline]);

  const increase = (): void => {
    setCount((current) => current + 1);
  };

  return (
    <section>
      <p>{offline ? 'Offline' : 'Online'}</p>
      <output>Счётчик: {count}</output>
      <button type="button" onClick={increase}>
        Увеличить
      </button>
    </section>
  );
}
```

Подписка существует только в жизненном цикле компонента, состояние `offline` разрешает единственный interval, а отдельный effect синхронизирует ref с последним числом без побочного эффекта внутри state updater.

Ожидаемый результат: каждое событие при смонтированном компоненте увеличивает внешний счётчик на один, логи раз в секунду содержат текущий count, а после скрытия не меняется ни счётчик событий, ни консоль.

Ручная проверка: увеличьте count до `2`, вызовите событие, проверьте `Обработано offline: 1` и дождитесь одного лога `count:2`; затем увеличьте count до `3` и убедитесь, что следующий секундный tick того же interval выводит `count:3`. Отдельно повторите событие и проверьте `Обработано offline: 2` без удвоения секундной частоты; скройте счётчик, вызовите событие снова и убедитесь, что значение остаётся `2`, а новые логи не появляются.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Эффекты, таймеры и очистка
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
