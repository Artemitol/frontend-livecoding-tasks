# Взаимоисключающие состояния загрузки

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала проверьте diagnostics с `noEmit`, затем выключите `noEmit` и нажмите **Run**. Понадобятся базовые union-типы; код не использует Node-specific API.

## Условие

Допишите `getLoadMessage<T>` для discriminated union `LoadState<T>`. Обработайте `idle`, `loading`, `success` и `error` через `state.status`: для успеха верните `Нет данных` либо `Загружено: N`, для ошибки — `Ошибка: message`. Завершите `switch` исчерпывающей проверкой через `never`, не используйте type assertion и не изменяйте `state` или `data`.

```typescript
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: readonly T[] }
  | { status: 'error'; message: string };

function getLoadMessage<T>(state: LoadState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Ожидание';
    case 'loading':
      return 'Загрузка';
    default:
      return 'TODO';
  }
}

const states: readonly LoadState<string>[] = [
  { status: 'idle' },
  { status: 'loading' },
  { status: 'success', data: ['a', 'b'] },
  { status: 'success', data: [] },
  { status: 'error', message: 'Сеть недоступна' },
];

console.log(JSON.stringify(states.map((state) => getLoadMessage(state))));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

После проверки `state.status` TypeScript оставляет только соответствующую ветвь union: `data` доступно в `success`, а `message` — в `error`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавьте отдельные `case` для `success` и `error`; в успешной ветви сначала сравните длину `data` с нулём.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После четырёх `case` в `default` присвойте `state` переменной типа `never`: новый необработанный статус тогда вызовет ошибку типов.

</details>

<details>
<summary>Решение</summary>

```typescript
function getLoadMessage<T>(state: LoadState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Ожидание';
    case 'loading':
      return 'Загрузка';
    case 'success':
      return state.data.length === 0
        ? 'Нет данных'
        : `Загружено: ${state.data.length}`;
    case 'error':
      return `Ошибка: ${state.message}`;
    default: {
      const exhaustiveState: never = state;
      return exhaustiveState;
    }
  }
}
```

Поле `status` разделяет тип на взаимоисключающие ветви, а присваивание `never` контролирует исчерпывающую обработку. Playground не должен показывать ошибок, а после **Run** ожидается `["Ожидание","Загрузка","Загружено: 2","Нет данных","Ошибка: Сеть недоступна"]`. Для ручной проверки добавьте новый статус в union без нового `case`: строка с `never` должна дать diagnostic.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Моделирование типов
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 20 минут

</details>
