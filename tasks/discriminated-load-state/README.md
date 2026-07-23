# Взаимоисключающие состояния загрузки

[← Все подборки](../../README.md)

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9 и включите `strict` в **TS Config**. Полностью замените код в редакторе блоком ниже. Сначала проверьте diagnostics как в исходном режиме `noEmit`, затем оставьте `noEmit` выключенным и нажмите **Run**. Исходный запуск в Node.js 26.4.0 не использовал Node-specific API и не меняет результат.

## Условие

```ts
// Учебная цель: моделировать взаимоисключающие состояния загрузки
// через discriminated union.
// Перед началом нужны базовые union-типы TypeScript.
//
// Допишите getLoadMessage<T>.
// Обработайте idle, loading, success и error через state.status.
// Для success верните «Нет данных» или «Загружено: N».
// Для error верните «Ошибка: message».
// Завершите switch исчерпывающей проверкой state через never.
// Не используйте type assertion и не изменяйте state или data.

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

const messages = states.map(getLoadMessage);
const expectedMessages = [
  'Ожидание',
  'Загрузка',
  'Загружено: 2',
  'Нет данных',
  'Ошибка: Сеть недоступна',
];
const runtimePass =
  JSON.stringify(messages) === JSON.stringify(expectedMessages);

const invalidState: LoadState<string> = {
  status: 'error',
  message: 'Сеть недоступна',
  // @ts-expect-error error-состояние не может содержать data.
  data: [],
};

console.log({ messages, runtimePass });
```

## Готово, когда

- TypeScript Playground 5.9 при включённом `strict` не показывает неожиданных diagnostics; `@ts-expect-error` подтверждает, что у `error` нельзя добавить `data`.
- После **Run** `messages` точно содержит `Ожидание`, `Загрузка`, `Загружено: 2`, `Нет данных`, `Ошибка: Сеть недоступна`, а `runtimePass` равен `true`.
- `switch` проверяет все четыре состояния через дискриминант `status`, а недостижимая ветвь присваивает `state` переменной типа `never`.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

После каждой проверки `state.status` TypeScript оставляет только соответствующую ветвь union. Поэтому `data` доступно лишь в `success`, а `message` — лишь в `error`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавьте в `switch` отдельные ветви `success` и `error`. В успешной ветви сначала сравните длину `data` с нулём.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Когда четыре `case` готовы, в `default` объявите переменную типа `never` и присвойте ей `state`. Если появится новый статус без собственного `case`, эта строка даст ошибку типов.

</details>

<details>
<summary>Решение</summary>

```ts
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

const states: readonly LoadState<string>[] = [
  { status: 'idle' },
  { status: 'loading' },
  { status: 'success', data: ['a', 'b'] },
  { status: 'success', data: [] },
  { status: 'error', message: 'Сеть недоступна' },
];

const messages = states.map(getLoadMessage);
const expectedMessages = [
  'Ожидание',
  'Загрузка',
  'Загружено: 2',
  'Нет данных',
  'Ошибка: Сеть недоступна',
];
const runtimePass =
  JSON.stringify(messages) === JSON.stringify(expectedMessages);

const invalidState: LoadState<string> = {
  status: 'error',
  message: 'Сеть недоступна',
  // @ts-expect-error error-состояние не может содержать data.
  data: [],
};

console.log({ messages, runtimePass });
```

### Почему это работает

`status` делит `LoadState<T>` на четыре несовместимые ветви, поэтому поля успеха и ошибки нельзя смешать. После обработки всех вариантов `state` в `default` имеет тип `never`; новый статус сделает исчерпывающую проверку красной ещё до запуска.

</details>

<details>
<summary>Самопроверка</summary>

- Почему `data` доступно без дополнительной проверки только в ветви `success`?
- Чем пустой успешный массив отличается от состояния `error`?
- Как изменится diagnostic в `default`, если добавить пятый статус и забыть новый `case`?

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Моделирование типов
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
