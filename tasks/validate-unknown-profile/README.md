# Проверка JSON-профиля без assertion

[← Все подборки](../../README.md)

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9 и включите `strict` в **TS Config**. Полностью замените код блоком ниже и после реализации нажмите **Run**. Код сохраняет исходную семантику Node.js 26.4.0 ESM, но использует только стандартные `JSON` и JavaScript API.

## Условие

```ts
// Учебная цель: проверять unknown JSON во время выполнения
// и получать типизированный результат без type assertion.
// Перед началом нужны unknown, union-типы и функции-предикаты типов.
//
// Реализуйте guards и завершите parseProfileJson(source).
// После JSON.parse проверьте, что значение — не null, не массив,
// содержит string-поля id и displayName, а roles — массив строк.
// Пустой roles допустим.
// Неверный JSON должен дать INVALID_JSON, неверная форма
// или нестроковая роль — INVALID_PROFILE.
// Не используйте as, any, мутацию или I/O внутри функций.

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

  // Добавьте runtime-проверки parsed и верните Profile только после них.
  return { ok: false, error: 'INVALID_PROFILE' };
}

const valid = parseProfileJson(
  '{"id":"42","displayName":"Лена","roles":["author"]}',
);
const emptyRoles = parseProfileJson(
  '{"id":"43","displayName":"Илья","roles":[]}',
);
const invalidJson = parseProfileJson('{"id":"42"');
const invalidShape = parseProfileJson(
  '{"id":42,"displayName":"Лена","roles":["author"]}',
);
const invalidRoles = parseProfileJson(
  '{"id":"42","displayName":"Лена","roles":["author",7]}',
);

const validPass =
  valid.ok &&
  valid.data.id === '42' &&
  valid.data.displayName === 'Лена' &&
  valid.data.roles[0] === 'author';
const emptyRolesPass =
  emptyRoles.ok &&
  emptyRoles.data.roles.length === 0;
const invalidJsonPass =
  !invalidJson.ok &&
  invalidJson.error === 'INVALID_JSON';
const invalidShapePass =
  !invalidShape.ok &&
  invalidShape.error === 'INVALID_PROFILE';
const invalidRolesPass =
  !invalidRoles.ok &&
  invalidRoles.error === 'INVALID_PROFILE';

console.log({
  validPass,
  emptyRolesPass,
  invalidJsonPass,
  invalidShapePass,
  invalidRolesPass,
});
```

## Готово, когда

- TypeScript Playground 5.9 с `strict` принимает успешную ветвь как `Profile` без `as` и без аннотаций `any`.
- После **Run** `validPass` и `emptyRolesPass` равны `true`: корректный профиль и пустой массив ролей проходят проверку.
- `invalidJsonPass`, `invalidShapePass` и `invalidRolesPass` равны `true`: синтаксическая ошибка, неверное поле и нестроковая роль различаются и не выбрасывают исключение наружу.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Начинайте каждую проверку с параметра типа `unknown`. Для объекта нужно отдельно исключить `null` и массив, прежде чем TypeScript разрешит читать поля.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Разделите проверки на три predicates: обычная запись со строковыми ключами, массив строк и полный `Profile`. Тогда `parseProfileJson` будет только разбирать JSON и выбирать результат.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сначала преобразуйте `unknown` в `Record<string, unknown>` через predicate, затем проверьте две строки и передайте `roles` в отдельный guard с `Array.isArray` и `every`. Успешную ветвь возвращайте только после общего predicate.

</details>

<details>
<summary>Решение</summary>

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

const valid = parseProfileJson(
  '{"id":"42","displayName":"Лена","roles":["author"]}',
);
const emptyRoles = parseProfileJson(
  '{"id":"43","displayName":"Илья","roles":[]}',
);
const invalidJson = parseProfileJson('{"id":"42"');
const invalidShape = parseProfileJson(
  '{"id":42,"displayName":"Лена","roles":["author"]}',
);
const invalidRoles = parseProfileJson(
  '{"id":"42","displayName":"Лена","roles":["author",7]}',
);

const validPass =
  valid.ok &&
  valid.data.id === '42' &&
  valid.data.displayName === 'Лена' &&
  valid.data.roles[0] === 'author';
const emptyRolesPass =
  emptyRoles.ok &&
  emptyRoles.data.roles.length === 0;
const invalidJsonPass =
  !invalidJson.ok &&
  invalidJson.error === 'INVALID_JSON';
const invalidShapePass =
  !invalidShape.ok &&
  invalidShape.error === 'INVALID_PROFILE';
const invalidRolesPass =
  !invalidRoles.ok &&
  invalidRoles.error === 'INVALID_PROFILE';

console.log({
  validPass,
  emptyRolesPass,
  invalidJsonPass,
  invalidShapePass,
  invalidRolesPass,
});
```

### Почему это работает

Каждый predicate превращает `unknown` в более узкий тип только после runtime-проверки. `parseProfileJson` отделяет синтаксическую ошибку от неверной формы, а в успешную ветвь попадает `parsed`, который компилятор уже знает как `Profile`.

</details>

<details>
<summary>Самопроверка</summary>

- Почему результат `JSON.parse` нужно сразу ограничить типом `unknown`?
- Почему пустой `roles` проходит `every`, а массив со значением `7` — нет?
- Как расширить контракт, чтобы проверять допустимые значения ролей, а не только тип `string`?

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Сужение и проверка данных
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
