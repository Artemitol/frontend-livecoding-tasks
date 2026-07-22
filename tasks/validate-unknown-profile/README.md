# Проверка JSON-профиля без assertion

**Учебная цель:** Проверять unknown JSON во время выполнения и получать типизированный результат без type assertion.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript |
| Тема | Сужение типов |
| Формат | Реализация |
| Уровень | Продвинутый |
| Время | 30 минут |
| Навыки | unknown, type guard, валидация массива, discriminated union |
| Предварительные знания | `unknown`, union-типы и функции-предикаты типов |
| Среда выполнения | TypeScript 5.9, strict mode, Node.js 26.4.0, ECMAScript modules |

<details>
<summary>Теория</summary>

`JSON.parse` возвращает данные неизвестной формы. Безопасный контракт начинается с `unknown`, затем проверяет, что значение — объект, нужные поля имеют тип `string`, а `roles` — массив только строк. Функция-предикат `value is Profile` открывает тип `Profile` только после всех проверок. Ошибки парсинга и неверная форма данных должны стать явными результатами, а не утечь исключением наружу.

</details>

## Условие

Реализуйте `parseProfileJson(source: string): ParseResult<Profile>`. Она должна разобрать JSON, проверить его структуру во время выполнения и вернуть типизированный профиль только после успешной проверки.

### Входы

Строка `source`, которая может содержать:

- JSON-представление профиля `{ id: string, displayName: string, roles: string[] }`;
- синтаксически неверный JSON;
- корректный JSON неверной формы.

### Выходы

`ParseResult<Profile>`:

- `{ ok: true, data: Profile }` для корректного профиля;
- `{ ok: false, error: 'INVALID_JSON' }` для ошибки синтаксического разбора;
- `{ ok: false, error: 'INVALID_PROFILE' }` для неверной формы.

### Ограничения и побочные эффекты

- Присвойте результат `JSON.parse` переменной типа `unknown` и валидируйте объект, все обязательные поля и каждый элемент `roles` type guards.
- Пустой массив `roles` допустим.
- Не используйте `as`, аннотации `any`, мутацию, I/O или исключения, выходящие из `parseProfileJson`.
- Побочные эффекты отсутствуют.

### Стартовый код

```ts
type Profile = {
  id: string;
  displayName: string;
  roles: string[];
};

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: 'INVALID_JSON' | 'INVALID_PROFILE' };

function parseProfileJson(source: string): ParseResult<Profile> {
  const parsed: unknown = JSON.parse(source);

  return { ok: true, data: parsed };
  // Добавьте обработку синтаксической ошибки и проверки unknown-значения.
}
```

### Примеры

#### Обычный сценарий

Вход: `'{"id":"42","displayName":"Лена","roles":["author"]}'`.

Результат: `{ ok: true, data: { id: '42', displayName: 'Лена', roles: ['author'] } }`.

#### Граничный сценарий

Вход: `'{"id":"43","displayName":"Илья","roles":[]}'`.

Результат: успешный профиль с пустым `roles`; пустой массив — допустимое значение.

#### Ошибка или пустой результат

- Вход `'{"id":42,"displayName":"Лена","roles":["author"]}'` возвращает `{ ok: false, error: 'INVALID_PROFILE' }`.
- Вход `'{"id":"42"'` возвращает `{ ok: false, error: 'INVALID_JSON' }`.

## Критерии готовности

- Корректный профиль возвращается только в ветви `ok: true` с типом `Profile`.
- Пустой массив ролей считается корректным.
- Неверный JSON и неверная форма дают разные коды ошибки и не выбрасывают исключение наружу.
- В решении нет `as`, аннотаций `any`, мутации или I/O; у ошибочной ветви нет `data`.

<details>
<summary>Подсказка 1</summary>

Разделите задачу на два шага: ловля ошибки `JSON.parse` и предикат `isProfile(value: unknown): value is Profile`. Для объекта сначала исключите `null` и массив.

</details>

<details>
<summary>Решение</summary>

### Подход

Сначала `try/catch` преобразует только синтаксическую ошибку в `INVALID_JSON`. Далее `isProfile` проверяет структуру `unknown` без assertion: объект, две строки и массив строк. После true-результата predicate переменная `parsed` имеет тип `Profile`, поэтому её можно положить в успешную ветвь.

```ts
type Profile = {
  id: string;
  displayName: string;
  roles: string[];
};

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: 'INVALID_JSON' | 'INVALID_PROFILE' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === 'string');
}

function isProfile(value: unknown): value is Profile {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.displayName === 'string'
    && isStringArray(value.roles);
}

function parseProfileJson(source: string): ParseResult<Profile> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch {
    return { ok: false, error: 'INVALID_JSON' };
  }

  if (!isProfile(parsed)) {
    return { ok: false, error: 'INVALID_PROFILE' };
  }

  return { ok: true, data: parsed };
}
```

### Сложность

- Время: `O(r)`, где `r` — число элементов `roles`.
- Память: `O(1)` дополнительной памяти, не считая объекта, созданного `JSON.parse`.

### Компромиссы и альтернативы

`as Profile` короче, но обещает форму без проверки runtime-данных. Схемная библиотека могла бы дать более богатые сообщения об ошибках, однако для фиксированного маленького контракта локальные guards прозрачны, не требуют зависимости и сохраняют раздельные коды `INVALID_JSON` и `INVALID_PROFILE`.

</details>

## Самопроверка

- Почему результат `JSON.parse` сначала хранится как `unknown`?
- Почему пустой `roles` проходит проверку, а `[1]` — нет?
- Чем полезно различать `INVALID_JSON` и `INVALID_PROFILE` для вызывающего кода?
