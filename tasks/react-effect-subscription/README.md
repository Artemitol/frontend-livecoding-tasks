# Подписка, которая следует за выбранным каналом

[← Все подборки](../../README.md)

Откройте [Vite React TypeScript в StackBlitz](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Сценарий рассчитан на React 19.2 в development mode и браузер Google Chrome 150.0.7871.101. Оставьте стандартный `src/main.tsx`: он оборачивает `<App />` в корневой `<StrictMode>`, который нужен для наблюдаемой начальной трассы. Другие файлы менять не нужно; fixture работает локально без сети.

## Условие

```tsx
// Учебная цель: синхронизировать effect с выбранным ресурсом
// и освобождать предыдущую подписку до установки новой.
// Перед началом нужны useState и useEffect.
//
// Исправьте effect в SubscriptionPanel:
// 1. Подписка должна следовать за channel.
// 2. Cleanup должен закрывать ресурс текущей установки.
// 3. После news → sports активен только sports.
// 4. Не меняйте локальный fixture и не отключайте StrictMode.

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
  console.log(`[subscription] setup:${channel}`);
  onMessage(`Подписка: ${channel}`);

  return {
    close: () => {
      if (closed) {
        return;
      }

      closed = true;
      activeSubscriptions.delete(channel);
      events.push(`cleanup:${channel}`);
      console.log(`[subscription] cleanup:${channel}`);
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
      <p>
        Активные каналы:{' '}
        {Array.from(activeSubscriptions).join(',') || 'нет'}
      </p>
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

## Готово, когда

- На чистом development-запуске показаны `Подписка: news`, `Активных подписок: 1` и канал `news`. Корневой StrictMode оставляет в трассе окончание `setup:news → cleanup:news → setup:news`.
- После выбора `sports` трасса добавляет `cleanup:news → setup:sports`, сообщение меняется на `Подписка: sports`, а активен только один канал `sports`.
- После возврата к `news` сначала записан `cleanup:sports`, затем `setup:news`; активная подписка по-прежнему одна.
- Effect возвращает cleanup и зависит от `channel`; сети, таймеров и скрытых ресурсов нет.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Effect синхронизирует компонент с внешним ресурсом. Если выбор канала меняет ресурс, `channel` участвует и в setup, и в зависимостях effect.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`subscribe` уже возвращает объект с `close`. Сохраните этот объект внутри конкретного запуска effect и верните функцию, вызывающую `close`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Внутри effect создайте `const subscription = subscribe(...)`, верните `() => subscription.close()`, а массив зависимостей замените на `[channel]`.

</details>

<details>
<summary>Решение</summary>

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
  console.log(`[subscription] setup:${channel}`);
  onMessage(`Подписка: ${channel}`);

  return {
    close: () => {
      if (closed) {
        return;
      }

      closed = true;
      activeSubscriptions.delete(channel);
      events.push(`cleanup:${channel}`);
      console.log(`[subscription] cleanup:${channel}`);
    },
  };
};

function SubscriptionPanel() {
  const [channel, setChannel] = useState('news');
  const [message, setMessage] = useState('');
  const [, forceRender] = useState(0);

  useEffect(() => {
    const subscription = subscribe(channel, (nextMessage) => {
      setMessage(nextMessage);
      forceRender((revision) => revision + 1);
    });

    return () => subscription.close();
  }, [channel]);

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
      <p>
        Активные каналы:{' '}
        {Array.from(activeSubscriptions).join(',') || 'нет'}
      </p>
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

### Почему это работает

`channel` входит в зависимости, поэтому при смене значения React сначала вызывает cleanup предыдущего effect и только затем устанавливает новую подписку. Каждый `close` замыкает свой канал и свой флаг `closed`, поэтому повторный вызов безопасен. Дополнительный development-цикл StrictMode проверяет ту же симметрию и не оставляет лишний ресурс.

</details>

<details>
<summary>Самопроверка</summary>

- Почему пустой массив зависимостей оставляет сообщение и ресурс на `news`?
- В каком порядке React вызывает cleanup и новый setup при смене `channel`?
- Почему флаг `closed` должен принадлежать одной подписке, а не быть общим?

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: эффекты и жизненный цикл
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
