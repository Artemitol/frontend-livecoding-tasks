# Проверка JSON-профиля без assertion

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала проверьте diagnostics с `noEmit`, затем выключите `noEmit` и нажмите **Run**. Понадобятся `unknown`, union-типы и функции-предикаты; код использует только стандартные `JSON` и JavaScript API, поэтому режим Node.js ESM не влияет на результат.

## Условие

Реализуйте runtime-проверки в `parseProfileJson(source)`, чтобы получить `Profile` из неизвестного JSON без `as` и `any`. Профиль — не `null` и не массив, содержит строковые `id` и `displayName`, а также массив строк `roles`; пустой массив ролей допустим. Неверный JSON должен вернуть `INVALID_JSON`, неверная форма или нестроковая роль — `INVALID_PROFILE`. Не изменяйте входные данные и не выполняйте I/O внутри функций.

```typescript
type Profile = {
  id: string;
  displayName: string;
  roles: string[];
};

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: 'INVALID_JSON' | 'INVALID_PROFILE' };

function parseProfileJson(source: string): ParseResult<Profile> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch {
    return { ok: false, error: 'INVALID_JSON' };
  }

  return { ok: false, error: 'INVALID_PROFILE' };
}

const sources = [
  '{"id":"42","displayName":"Лена","roles":["author"]}',
  '{"id":"43","displayName":"Илья","roles":[]}',
  '{"id":"42"',
  '{"id":42,"displayName":"Лена","roles":["author"]}',
  '{"id":"42","displayName":"Лена","roles":["author",7]}',
];

console.log(JSON.stringify(sources.map(parseProfileJson)));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Каждую проверку начинайте со значения типа `unknown`; перед чтением полей отдельно исключите `null` и массив.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Разделите проверки на predicates для обычной записи, массива строк и полного `Profile`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сузьте значение до `Record<string, unknown>`, проверьте две строки и передайте `roles` в guard с `Array.isArray` и `every`; возвращайте успешную ветвь только после общего predicate.

</details>

<details>
<summary>Решение</summary>

```typescript
function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === 'string')
  );
}

function isProfile(value: unknown): value is Profile {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.displayName === 'string' &&
    isStringArray(value.roles)
  );
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

Predicates последовательно сужают `unknown`, поэтому успешная ветвь получает `Profile` без assertion. Playground не должен показывать ошибок, а после **Run** ожидаются две успешные записи, затем `INVALID_JSON` и два результата `INVALID_PROFILE`. Для ручной проверки убедитесь, что пустой `roles` проходит, а `roles` со значением `7` — нет.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Сужение и проверка данных
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
