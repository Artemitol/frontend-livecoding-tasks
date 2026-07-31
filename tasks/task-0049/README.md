# Небольшой store для React

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```typescript
// FILE: src/store.ts
// Реализуйте независимый от React Store: getState возвращает текущее состояние, setState сливает patch и уведомляет всех listeners.
// subscribe добавляет точный listener и возвращает cleanup для него; unsubscribe удаляет переданную функцию, getSubscriberCount возвращает размер набора.
// Реализуйте useStore во втором файле: два потребителя должны синхронно видеть оба счётчика, менять нужное поле и удалять ровно свою подписку при unmount.
// После стабилизации страницы проверка подписок показывает 2, после скрытия второго потребителя — 1; используйте React 19.2 и только локальное состояние.

type Listener<T> = (state: T) => void;

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => this.state;

  setState(patch: Partial<T>): void {
    // Напишите решение.
  }

  subscribe(listener: Listener<T>): () => void {
    // Напишите решение.
    return () => {};
  }

  unsubscribe(listener: Listener<T>): void {
    // Напишите решение.
  }

  getSubscriberCount(): number {
    return this.listeners.size;
  }
}
```

```tsx
// FILE: src/App.tsx

import { useEffect, useState } from 'react';

import { Store } from './store';

type CounterState = {
  value1: number;
  value2: number;
};

const store = new Store<CounterState>({
  value1: 0,
  value2: 0,
});

function useStore(store: Store<CounterState>): CounterState {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    // Подключите подписку и cleanup.
  }, [store]);

  return state;
}

function FirstCounter() {
  const state = useStore(store);

  return (
    <section>
      <p>Первый потребитель: {state.value1}:{state.value2}</p>
      <button
        type="button"
        onClick={() => store.setState({ value1: state.value1 + 1 })}
      >
        + value1
      </button>
    </section>
  );
}

function SecondCounter() {
  const state = useStore(store);

  return (
    <section>
      <p>Второй потребитель: {state.value1}:{state.value2}</p>
      <button
        type="button"
        onClick={() => store.setState({ value2: state.value2 + 1 })}
      >
        + value2
      </button>
    </section>
  );
}

export default function App() {
  const [showSecond, setShowSecond] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  return (
    <main>
      <FirstCounter />
      {showSecond && <SecondCounter />}
      <button
        type="button"
        onClick={() => setShowSecond((visible) => !visible)}
      >
        {showSecond ? 'Скрыть второго' : 'Показать второго'}
      </button>
      <button
        type="button"
        onClick={() => setSubscriberCount(store.getSubscriberCount())}
      >
        Проверить подписки
      </button>
      <output>Подписок: {subscriberCount}</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Store не должен знать о React: ему достаточно состояния и набора функций, которым передаётся новое значение.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В `setState` создайте новый объект через spread, сохраните его и передайте каждому listener. В `subscribe` добавьте функцию в `Set`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните из `subscribe` функцию `() => this.unsubscribe(listener)`, а из эффекта `useStore` — результат `store.subscribe(setState)`.

</details>

<details>
<summary>Решение</summary>

```typescript
// FILE: src/store.ts

type Listener<T> = (state: T) => void;

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => this.state;

  setState(patch: Partial<T>): void {
    this.state = {
      ...this.state,
      ...patch,
    };

    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  getSubscriberCount(): number {
    return this.listeners.size;
  }
}
```

```tsx
// FILE: src/App.tsx

import { useEffect, useState } from 'react';

import { Store } from './store';

type CounterState = {
  value1: number;
  value2: number;
};

const store = new Store<CounterState>({
  value1: 0,
  value2: 0,
});

function useStore(store: Store<CounterState>): CounterState {
  const [state, setState] = useState(store.getState());

  useEffect(() => store.subscribe(setState), [store]);

  return state;
}

function FirstCounter() {
  const state = useStore(store);

  return (
    <section>
      <p>Первый потребитель: {state.value1}:{state.value2}</p>
      <button
        type="button"
        onClick={() => store.setState({ value1: state.value1 + 1 })}
      >
        + value1
      </button>
    </section>
  );
}

function SecondCounter() {
  const state = useStore(store);

  return (
    <section>
      <p>Второй потребитель: {state.value1}:{state.value2}</p>
      <button
        type="button"
        onClick={() => store.setState({ value2: state.value2 + 1 })}
      >
        + value2
      </button>
    </section>
  );
}

export default function App() {
  const [showSecond, setShowSecond] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  return (
    <main>
      <FirstCounter />
      {showSecond && <SecondCounter />}
      <button
        type="button"
        onClick={() => setShowSecond((visible) => !visible)}
      >
        {showSecond ? 'Скрыть второго' : 'Показать второго'}
      </button>
      <button
        type="button"
        onClick={() => setSubscriberCount(store.getSubscriberCount())}
      >
        Проверить подписки
      </button>
      <output>Подписок: {subscriberCount}</output>
    </main>
  );
}
```

Store обновляет объект один раз и рассылает его всем текущим listeners. Каждый hook передаёт в `subscribe` собственный `setState` и возвращает cleanup именно для этой функции.

Ожидаемый результат: оба потребителя начинают с `0:0`, после двух разных кнопок показывают `1:1`; проверка подписок показывает `2`, а после скрытия второго потребителя — `1`.

Ручная проверка: дождитесь завершения эффектов и нажмите «Проверить подписки»; получите `2`. Измените `value1` и `value2` и проверьте `1:1` в обоих блоках. Скройте второй блок, снова проверьте подписки и получите `1`; первый счётчик должен продолжить обновляться.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
