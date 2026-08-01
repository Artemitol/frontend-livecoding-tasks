# Собственная реализация Partial

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Опишите NewPartial<T>: каждое свойство T должно стать необязательным, сохраняя исходный тип значения.
// PartialUser должен принимать объект без id и объект с числовым id.
// Используйте чистый TypeScript без browser API.

type User = {
  id: number;
  name: string;
};

type NewPartial<T> = never;
type PartialUser = NewPartial<User>;

const withoutId: PartialUser = { name: 'Ира' };
const withId: PartialUser = { id: 7 };
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Вспомните mapped type с обходом `keyof T`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте свойство для каждого ключа `T` и обратитесь к `T[K]`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Суффикс `?` после имени mapped-свойства делает его необязательным.

</details>

<details>
<summary>Решение</summary>

```typescript
type NewPartial<T> = {
  [K in keyof T]?: T[K];
};
```

Mapped type сохраняет типы значений и меняет только обязательность полей.

Ожидаемый результат: оба объявления проходят проверку типов.

Ручная проверка: присвойте `id: '7'`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript: практика к собеседованию
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 20 минут

</details>
