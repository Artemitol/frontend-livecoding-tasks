# task-0008 — Конвертер BTC с обновлением курсов

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: заполните selector валютами из встроенного снимка и принимайте неотрицательное число BTC.
// Показывайте read-only результат BTC * текущий курс с двумя знаками; сумма, валюта и новый курс пересчитывают его.
// Раз в 60 секунд и по кнопке переходите к следующему локальному снимку по кругу, не обращаясь к сети.
// Используйте React 19.2; interval должен быть один и очищаться при размонтировании.

import { useEffect, useState } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP';
type Rates = Record<Currency, number>;

const RATE_EXAMPLES: readonly Rates[] = [
  { USD: 64000, EUR: 59000, GBP: 50500 },
  { USD: 64500, EUR: 59400, GBP: 50800 },
  { USD: 63800, EUR: 58700, GBP: 50100 },
];

export default function App() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [currency] = useState<Currency>('USD');
  const [btcInput] = useState('1');
  const rates = RATE_EXAMPLES[snapshotIndex];
  const converted = 0;

  useEffect(() => {
    // Настройте минутное обновление и cleanup.
  }, []);

  return (
    <main>
      <h1>Конвертер BTC</h1>

      <label>
        Валюта
        <select
          value={currency}
          onChange={() => undefined}
        />
      </label>

      <label>
        BTC
        <input
          type="number"
          min="0"
          step="any"
          value={btcInput}
          readOnly
        />
      </label>

      <label>
        Результат
        <input
          value={converted.toFixed(2)}
          readOnly
        />
      </label>

      <p>Текущий курс: {rates[currency]}</p>
      <button
        type="button"
        onClick={() => setSnapshotIndex(snapshotIndex)}
      >
        Обновить курсы
      </button>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Курсы уже находятся в массиве: состояние должно хранить только индекс снимка, выбранную валюту и текст суммы.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Получите варианты selector через `Object.keys(rates)`, а следующий индекс вычисляйте по модулю длины `RATE_EXAMPLES`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Один и тот же функциональный переход `(current + 1) % RATE_EXAMPLES.length` используйте в interval и кнопке; результат равен `Number(btcInput) * rates[currency]`.

</details>

<details>
<summary>Решение</summary>

```tsx
export default function App() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [btcInput, setBtcInput] = useState('1');
  const rates = RATE_EXAMPLES[snapshotIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSnapshotIndex(
        (current) => (current + 1) % RATE_EXAMPLES.length,
      );
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const btc = btcInput === '' ? 0 : Number(btcInput);
  const converted = btc * rates[currency];

  const handleBtcChange = (value: string): void => {
    const numericValue = Number(value);

    if (
      value === ''
      || (Number.isFinite(numericValue) && numericValue >= 0)
    ) {
      setBtcInput(value);
    }
  };

  const showNextRates = (): void => {
    setSnapshotIndex(
      (current) => (current + 1) % RATE_EXAMPLES.length,
    );
  };

  return (
    <main>
      <h1>Конвертер BTC</h1>

      <label>
        Валюта
        <select
          value={currency}
          onChange={(event) => {
            setCurrency(event.target.value as Currency);
          }}
        >
          {(Object.keys(rates) as Currency[]).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        BTC
        <input
          type="number"
          min="0"
          step="any"
          value={btcInput}
          onChange={(event) => handleBtcChange(event.target.value)}
        />
      </label>

      <label>
        Результат
        <input value={converted.toFixed(2)} readOnly />
      </label>

      <p>Текущий курс: {rates[currency]}</p>
      <button type="button" onClick={showNextRates}>
        Обновить курсы
      </button>
    </main>
  );
}
```

Вычисляемое значение не дублируется в state, поэтому любое изменение входов сразу даёт согласованный результат. Функциональный переход одинаково работает для ручного и минутного обновления.

Ожидаемый результат: `2 BTC` при первом USD-снимке дают `128000.00`, после кнопки — `129000.00`; selector переключает расчёт на EUR и GBP.

Ручная проверка: введите `2`, переберите валюты, трижды обновите курсы до возврата первого снимка и убедитесь, что отрицательное значение не принимается.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Асинхронные данные и состояния интерфейса
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 50 минут

</details>
