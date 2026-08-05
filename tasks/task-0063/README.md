# task-0063 — Игра «Память» с перезапуском

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// FILE: src/App.tsx
// Соберите игру из 10 перемешанных пар: при старте покажите все 20 карточек на 3 секунды, затем скройте значения.
// После preview разрешайте открыть не более двух разных карточек: пара остаётся видимой, несовпадение закрывается через 800 мс, а во время ожидания новые ходы запрещены.
// После нахождения всех пар покажите завершение; «Начать заново» очищает pending-таймер, создаёт новую колоду и снова запускает полный preview.
// Используйте только локальный src/cards.ts, React 19.2 и browser timers; оба стартовых файла должны быть полными и copy-ready.

import { useEffect, useState } from 'react';

import { createDeck, type CardItem } from './cards';

const PREVIEW_MS = 3000;
const MISMATCH_MS = 800;

export default function App() {
  const [cards, setCards] = useState<CardItem[]>(() => createDeck());
  const [preview, setPreview] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => setPreview(false), PREVIEW_MS);
    return () => window.clearTimeout(timerId);
  }, []);

  function handleCardClick(cardId: string) {
    if (preview || selectedIds.includes(cardId)) {
      return;
    }

    const nextSelectedIds = [...selectedIds, cardId];
    setSelectedIds(nextSelectedIds);

    if (nextSelectedIds.length === 2) {
      const [firstId, secondId] = nextSelectedIds;
      const first = cards.find((card) => card.id === firstId);
      const second = cards.find((card) => card.id === secondId);

      if (first?.symbol === second?.symbol) {
        setMatchedIds(new Set([...matchedIds, firstId, secondId]));
      }

      window.setTimeout(() => setSelectedIds([]), MISMATCH_MS);
    }
  }

  function restartGame() {
    setCards(createDeck());
    setPreview(true);
    setSelectedIds([]);
    setMatchedIds(new Set());
  }

  const isComplete = matchedIds.size === cards.length;

  return (
    <main>
      <h1>Игра «Память»</h1>
      <p>{preview ? 'Запоминайте карточки' : 'Найдите все пары'}</p>
      <section aria-label="Игровое поле">
        {cards.map((card) => {
          const isVisible = preview
            || selectedIds.includes(card.id)
            || matchedIds.has(card.id);

          return (
            <button
              key={card.id}
              type="button"
              aria-label={isVisible ? `Карточка ${card.symbol}` : 'Закрытая карточка'}
              disabled={preview || selectedIds.length >= 2}
              onClick={() => handleCardClick(card.id)}
            >
              {isVisible ? card.symbol : '?'}
            </button>
          );
        })}
      </section>
      {isComplete && <p role="status">Все пары найдены!</p>}
      <button type="button" onClick={restartGame}>Начать заново</button>
    </main>
  );
}
```

```typescript
// FILE: src/cards.ts

export type CardItem = {
  id: string;
  symbol: string;
};

const symbols = ['🍎', '🚀', '🎸', '🌙', '🐳', '⚽', '🌵', '🎁', '🧩', '☕'];

export function createDeck(random = Math.random): CardItem[] {
  const cards = symbols.flatMap((symbol, pairIndex) => [
    { id: `${pairIndex}-a`, symbol },
    { id: `${pairIndex}-b`, symbol },
  ]);

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [cards[index], cards[targetIndex]] = [cards[targetIndex], cards[index]];
  }

  return cards;
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите видимость карточки на три независимых причины: идёт preview, карточка выбрана в текущем ходе или её пара уже найдена.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Храните идентификаторы выбранных и найденных карточек отдельно. Для несовпадения оставляйте два выбранных ID до завершения таймера.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сохраните mismatch timer в `useRef`, очищайте его общей функцией перед restart и при unmount, а preview запускайте эффектом от номера новой игры.

</details>

<details>
<summary>Решение</summary>

```tsx
// FILE: src/App.tsx

import { useCallback, useEffect, useRef, useState } from 'react';

import { createDeck, type CardItem } from './cards';

const PREVIEW_MS = 3000;
const MISMATCH_MS = 800;

export default function App() {
  const [cards, setCards] = useState<CardItem[]>(() => createDeck());
  const [preview, setPreview] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [gameNumber, setGameNumber] = useState(0);
  const mismatchTimerRef = useRef<number | null>(null);

  const clearPendingMismatch = useCallback(() => {
    if (mismatchTimerRef.current !== null) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setPreview(true);
    const timerId = window.setTimeout(() => setPreview(false), PREVIEW_MS);
    return () => window.clearTimeout(timerId);
  }, [gameNumber]);

  useEffect(() => clearPendingMismatch, [clearPendingMismatch]);

  function handleCardClick(cardId: string) {
    if (
      preview
      || selectedIds.length >= 2
      || selectedIds.includes(cardId)
      || matchedIds.has(cardId)
    ) {
      return;
    }

    const nextSelectedIds = [...selectedIds, cardId];
    setSelectedIds(nextSelectedIds);

    if (nextSelectedIds.length < 2) {
      return;
    }

    const [firstId, secondId] = nextSelectedIds;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);

    if (first?.symbol === second?.symbol) {
      setMatchedIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(firstId);
        nextIds.add(secondId);
        return nextIds;
      });
      setSelectedIds([]);
      return;
    }

    mismatchTimerRef.current = window.setTimeout(() => {
      setSelectedIds([]);
      mismatchTimerRef.current = null;
    }, MISMATCH_MS);
  }

  function restartGame() {
    clearPendingMismatch();
    setCards(createDeck());
    setSelectedIds([]);
    setMatchedIds(new Set());
    setPreview(true);
    setGameNumber((currentNumber) => currentNumber + 1);
  }

  const isComplete = matchedIds.size === cards.length;

  return (
    <main>
      <h1>Игра «Память»</h1>
      <p>{preview ? 'Запоминайте карточки' : 'Найдите все пары'}</p>
      <section aria-label="Игровое поле">
        {cards.map((card) => {
          const isVisible = preview
            || selectedIds.includes(card.id)
            || matchedIds.has(card.id);
          const isLocked = preview
            || selectedIds.length >= 2
            || matchedIds.has(card.id);

          return (
            <button
              key={card.id}
              type="button"
              aria-label={isVisible ? `Карточка ${card.symbol}` : 'Закрытая карточка'}
              disabled={isLocked}
              onClick={() => handleCardClick(card.id)}
            >
              {isVisible ? card.symbol : '?'}
            </button>
          );
        })}
      </section>
      {isComplete && <p role="status">Все пары найдены!</p>}
      <button type="button" onClick={restartGame}>Начать заново</button>
    </main>
  );
}
```

Колода содержит десять локальных пар и перемешивается при каждом старте. Отдельные состояния preview, текущего хода и совпадений задают видимость, а сохранённый timer не может закрыть карточки уже после перезапуска.

Ожидаемый результат: сначала все 20 карточек видны 3 секунды; затем открываются максимум две, совпадения остаются, несовпадения закрываются через 800 мс, после десятой пары появляется `Все пары найдены!`, а restart создаёт новую колоду и повторяет preview.

Ручная проверка: перенесите оба starter-файла, замените только `src/App.tsx` решением и дождитесь скрытия через 3 секунды. Проверьте совпавшую и несовпавшую пары, блокировку третьего клика, завершение всех пар и restart во время 800-миллисекундного ожидания — старый timer не должен изменить новую игру.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Состояние и обработчики событий
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
