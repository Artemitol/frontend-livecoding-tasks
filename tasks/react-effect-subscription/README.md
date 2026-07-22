# Подписка, которая следует за выбранным каналом

**Учебная цель:** Исправлять React-эффект подписки, синхронизируя зависимости и cleanup с внешним ресурсом.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript, React |
| Тема | Эффекты React |
| Формат | Отладка |
| Уровень | Средний |
| Время | 25 минут |
| Навыки | useEffect, зависимости, cleanup, внешняя подписка |
| Предварительные знания | useState, useEffect |
| Среда выполнения | React 19.2, TypeScript 5.9, Google Chrome 150.0.7871.101, development mode, local subscription fixture |

<details>
<summary>Теория</summary>

Effect синхронизирует React с внешней системой. Если ресурс зависит от `channel`, это значение входит в зависимости. Перед новой установкой React вызывает cleanup старой подписки, поэтому одновременно активен только ресурс текущего канала.

</details>

## Условие

Исправьте `SubscriptionPanel`. При смене `news` на `sports` старая подписка должна закрыться, новая — открыться, а сообщение и fixture должны показывать только `sports`.

### Входы

- Выбор `news` или `sports`.
- Локальная функция `subscribe`, возвращающая `close`.

### Выходы

- Сообщение `Подписка: sports` после переключения.
- Активное количество `1` и единственный активный канал `sports`.

### Ограничения и побочные эффекты

- Подписка создаётся только локальным fixture, без сети.
- Effect возвращает cleanup `close`.
- `channel` — зависимость effect.
- Других активных подписок после переключения быть не должно.

### Локальный fixture

```tsx
type Subscription = { close: () => void };
const activeSubscriptions = new Set<string>();

const subscribe = (channel: string, onMessage: (message: string) => void): Subscription => {
  activeSubscriptions.add(channel);
  onMessage(`Подписка: ${channel}`);
  return { close: () => activeSubscriptions.delete(channel) };
};
```

### Стартовый код

```tsx
import { useEffect, useState } from 'react';

export function SubscriptionPanel() {
  const [channel, setChannel] = useState('news');
  const [message, setMessage] = useState('');

  useEffect(() => {
    subscribe(channel, setMessage);
  }, []);

  return <select value={channel} onChange={(event) => setChannel(event.target.value)} />;
}
```

### Примеры

#### Обычный сценарий

При первом render fixture сообщает `Подписка: news`, активен `news`.

#### Граничный сценарий

После `news → sports` активен только `sports`, количество равно `1`.

#### Ошибка или пустой результат

У fixture нет сетевой ошибки. Неправильный результат — сохранённый `news` после выбора `sports` или количество активных подписок больше `1`.

## Критерии готовности

- Effect зависит от `channel`.
- Cleanup возвращён из effect.
- После смены выбранный канал, сообщение и активная подписка согласованы.
- Локальный fixture показывает одно активное значение.

<details>
<summary>Подсказка 1</summary>

Подписка создаёт ресурс. Где React должен получить функцию его освобождения?

</details>

<details>
<summary>Решение</summary>

### Подход

При изменении `channel` React сначала закрывает ресурс прошлого effect, затем запускает effect для нового значения.

```tsx
import { useEffect, useState } from 'react';

export function SubscriptionPanel() {
  const [channel, setChannel] = useState('news');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const subscription = subscribe(channel, setMessage);
    return () => subscription.close();
  }, [channel]);

  return (
    <section>
      <select value={channel} onChange={(event) => setChannel(event.target.value)}>
        <option value="news">news</option><option value="sports">sports</option>
      </select>
      <output>{message}</output>
      <output>{activeSubscriptions.size}</output>
      <output>{Array.from(activeSubscriptions).join(',')}</output>
    </section>
  );
}
```

### Сложность

- Время: `O(1)` на переключение при fixture с константными операциями.
- Память: `O(1)` для одной активной подписки.

### Компромиссы и альтернативы

Если внешний API не возвращает cleanup, нужен адаптер, который его предоставляет. Не следует подавлять зависимость: это создаёт устаревшую подписку. Для нескольких ресурсов можно разделить effects по ответственности.

</details>

## Самопроверка

- Почему `[]` оставляет подписку на старом канале?
- В каком порядке происходят cleanup и новая установка при смене `channel`?
- Почему Set fixture помогает увидеть утечку подписки?
