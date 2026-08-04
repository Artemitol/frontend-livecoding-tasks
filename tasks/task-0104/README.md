# task-0104 — Пути к строковым листьям

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Опишите StringLeafPaths<T>: верните объединение точечных путей только к строковым листьям вложенного объекта.
// Объявите исходный объект с `as const`; допустимы только greeting.hello, greeting.goodbye, user.profile и user.settings.
// Непромежуточные пути greeting и user не должны проходить проверку.

const dictionary = {
  greeting: {
    hello: 'Hello',
    goodbye: 'Goodbye',
  },
  user: {
    profile: 'Profile',
    settings: 'Settings',
  },
} as const;

type StringLeafPaths<T> = never;
type DictionaryPath = StringLeafPaths<typeof dictionary>;

const validPath: DictionaryPath = 'greeting.hello';
const anotherValidPath: DictionaryPath = 'user.settings';
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите случай строкового значения и случай вложенного объекта.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для ключа `K` формируйте шаблонную строку `${K}.${...}` при рекурсивном обходе.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В mapped type возвращайте `K`, если `T[K] extends string`, иначе добавляйте `K.` к рекурсивному результату.

</details>

<details>
<summary>Решение</summary>

```typescript
type StringLeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${Extract<StringLeafPaths<T[K]>, string>}`
      : never;
}[keyof T & string];
```

Тип рекурсивно соединяет ключи, но возвращает путь только у строкового листа.

Ожидаемый результат: `DictionaryPath` равен `'greeting.hello' | 'greeting.goodbye' | 'user.profile' | 'user.settings'`.

Ручная проверка: присвойте `const invalidPath: DictionaryPath = 'greeting'`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript → Рекурсивные типы
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
