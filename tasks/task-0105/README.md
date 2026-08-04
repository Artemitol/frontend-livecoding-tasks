# task-0105 — Ключи по разрешаемому типу

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Опишите ResolvableKeysOf<T, Value>: ключ подходит, если его прямое значение, Promise-значение или результат функции разрешается в Value.
// NumberKeys должен быть 'a' | 'b' | 'c' | 'd' | 'e', а StringOrNullKeys — 'x' | 'y'.
// Все проверки ниже должны компилироваться.

class Test {
  a = 1;
  b = 2;
  c = Promise.resolve(3);
  d = () => 5;
  e = () => Promise.resolve(6);
  x = 'not';
  y = Promise.resolve(null);
  z = () => true;
}

type ResolvableKeysOf<T, Value> = never;
type NumberKeys = ResolvableKeysOf<Test, number>;
type StringOrNullKeys = ResolvableKeysOf<Test, string | null>;

const numberKey: NumberKeys = 'e';
const stringOrNullKey: StringOrNullKeys = 'y';
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала получите значение свойства, затем отдельно обработайте функцию.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Условный тип может извлечь `R` из `() => R`, а `Awaited` раскрывает Promise.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сравните `Awaited<...>` с `Value` для каждого `K in keyof T` и верните `K` или `never`.

</details>

<details>
<summary>Решение</summary>

```typescript
type ResolvedValue<T> = T extends () => infer Result
  ? Awaited<Result>
  : Awaited<T>;

type ResolvableKeysOf<T, Value> = {
  [K in keyof T]: ResolvedValue<T[K]> extends Value ? K : never;
}[keyof T];
```

Сначала раскрывается результат функции, затем прямое или Promise-значение; после этого выбираются подходящие ключи.

Ожидаемый результат: `'e'` подходит для `NumberKeys`, а `'y'` — для `StringOrNullKeys`.

Ручная проверка: присвойте `const invalid: NumberKeys = 'x'`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript → Mapped и conditional types
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
