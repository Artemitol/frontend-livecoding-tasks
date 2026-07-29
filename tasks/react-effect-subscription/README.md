# Подписка, которая следует за выбранным каналом

Откройте [React TypeScript](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Предполагается React 19.2 в development mode; оставьте стандартный корневой `StrictMode`. Fixture работает локально без сети.

## Условие

Исправьте effect в `SubscriptionPanel`: подписка должна следовать за выбранным `channel`, а перед установкой новой подписки React должен закрывать ресурс предыдущего запуска. После перехода `news → sports` активным должен остаться только `sports`; при возврате к `news` — только `news`. Не меняйте локальный `subscribe` и не отключайте `StrictMode`.

```tsx
import { useEffect, useState } from 'react';

type Subscription = {
  close: () => void;
};

const activeSubscriptions = new Set<string>();
const events: string[] = [];

const subscribe = (
  channel: string,
  onMessage: (message: string) => void,
): Subscription => {
  let closed = false;

  activeSubscriptions.add(channel);
  events.push(`setup:${channel}`);
  onMessage(`Подписка: ${channel}`);

  return {
    close: () => {
      if (closed) {
        return;
      }

      closed = true;
      activeSubscriptions.delete(channel);
      events.push(`cleanup:${channel}`);
    },
  };
};

function SubscriptionPanel() {
  const [channel, setChannel] = useState('news');
  const [message, setMessage] = useState('');
  const [, forceRender] = useState(0);

  useEffect(() => {
    subscribe(channel, (nextMessage) => {
      setMessage(nextMessage);
      forceRender((revision) => revision + 1);
    });
  }, []);

  return (
    <section>
      <label>
        Канал
        <select
          value={channel}
          onChange={(event) => setChannel(event.target.value)}
        >
          <option value="news">news</option>
          <option value="sports">sports</option>
        </select>
      </label>
      <p>{message}</p>
      <p>Активных подписок: {activeSubscriptions.size}</p>
      <p>Активные каналы: {Array.from(activeSubscriptions).join(',') || 'нет'}</p>
      <output aria-live="polite">{events.join(' → ')}</output>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <h1>Локальная подписка</h1>
      <SubscriptionPanel />
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Если `channel` выбирает внешний ресурс, он участвует и в setup, и в зависимостях effect.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`subscribe` возвращает объект с `close`; сохраните его внутри конкретного запуска effect.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните из effect `() => subscription.close()` и замените пустой массив зависимостей на `[channel]`.

</details>

<details>
<summary>Решение</summary>

```tsx
useEffect(() => {
  const subscription = subscribe(channel, (nextMessage) => {
    setMessage(nextMessage);
    forceRender((revision) => revision + 1);
  });

  return () => subscription.close();
}, [channel]);
```

При смене `channel` React сначала вызывает cleanup предыдущего effect, затем запускает новый setup. Для ручной проверки выберите `sports`, затем `news`: каждый раз должен отображаться один активный канал, а трасса должна добавлять `cleanup` перед следующим `setup`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: эффекты и жизненный цикл
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
