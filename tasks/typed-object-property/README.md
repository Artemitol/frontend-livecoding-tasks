# Точный тип значения по ключу настройки

**Учебная цель:** Сохранять связь между ключом объекта и типом возвращаемого значения в обобщённой функции.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript |
| Тема | Моделирование типов |
| Формат | Отладка |
| Уровень | Средний |
| Время | 20 минут |
| Навыки | generic, keyof, indexed access type |
| Предварительные знания | Обобщённые функции и `keyof` |
| Среда выполнения | TypeScript 5.9, strict mode, noEmit |

<details>
<summary>Теория</summary>

Тип `keyof Preferences` описывает все допустимые ключи, но сам по себе теряет связь между конкретным ключом и его значением: результат становится широким union-типом. Параметр типа `Key extends keyof Preferences` сохраняет конкретный литеральный ключ, а `Preferences[Key]` вычисляет связанный с ним тип значения.

</details>

## Условие

Исправьте сигнатуру и реализацию `getPreference`, чтобы вызов с каждым допустимым ключом возвращал его точный тип. Не добавляйте перегрузки: связь должна быть выражена одним обобщённым параметром.

### Входы

- `preferences` — объект типа `Preferences` с обязательными полями `theme`, `retryCount` и `isBeta`;
- `key` — один из ключей этого объекта.

### Выходы

Функция возвращает:

- `string` для ключа `theme`;
- `number` для ключа `retryCount`;
- `boolean` для ключа `isBeta`.

### Ограничения и побочные эффекты

- Сигнатура должна иметь вид `getPreference<Key extends keyof Preferences>(preferences: Preferences, key: Key): Preferences[Key]`.
- Не добавляйте overloads, type assertion или runtime-проверки ошибок.
- Все поля обязательны, поэтому пустого результата нет; недопустимый ключ — ошибка компиляции.
- Не мутируйте объект и не выполняйте I/O.
- Побочные эффекты отсутствуют.

### Стартовый код

```ts
type Preferences = {
  theme: string;
  retryCount: number;
  isBeta: boolean;
};

function getPreference(
  preferences: Preferences,
  key: keyof Preferences,
): string | number | boolean {
  return preferences[key];
}

const preferences: Preferences = {
  theme: 'dark',
  retryCount: 3,
  isBeta: false,
};

const theme = getPreference(preferences, 'theme');
// Исправьте функцию так, чтобы theme имел тип string, а не string | number | boolean.
```

### Примеры

#### Обычный сценарий

Вход: `getPreference(preferences, 'theme')` при `theme: 'dark'`.

Результат: значение `'dark'` типа `string`.

#### Граничный сценарий

Вход: `getPreference(preferences, 'isBeta')` при `isBeta: false`.

Результат: `false` типа `boolean`. Ложное Boolean-значение не является пустым результатом.

#### Ошибка или пустой результат

Вызов `getPreference(preferences, 'locale')` должен быть ошибкой компиляции. Пустого результата нет: все поля `Preferences` обязательны.

## Критерии готовности

- Тип `getPreference(preferences, 'theme')` — `string`.
- Типы результатов для `retryCount` и `isBeta` — соответственно `number` и `boolean`.
- Ключа `locale` нет среди допустимых ключей.
- Решение не содержит перегрузок, assertion, мутации, I/O и runtime-обработки ошибок.

<details>
<summary>Подсказка 1</summary>

Сделайте ключ параметром типа, а не просто значением типа `keyof Preferences`. Тип результата можно получить индексированием типа объекта этим параметром.

</details>

<details>
<summary>Решение</summary>

### Подход

`Key` сохраняет литерал, переданный вторым аргументом. Поэтому индексированный тип `Preferences[Key]` не расширяется до union всех свойств и точно соответствует `preferences[key]`.

```ts
type Preferences = {
  theme: string;
  retryCount: number;
  isBeta: boolean;
};

function getPreference<Key extends keyof Preferences>(
  preferences: Preferences,
  key: Key,
): Preferences[Key] {
  return preferences[key];
}

const preferences: Preferences = {
  theme: 'dark',
  retryCount: 3,
  isBeta: false,
};

const theme: string = getPreference(preferences, 'theme');
const retryCount: number = getPreference(preferences, 'retryCount');
const isBeta: boolean = getPreference(preferences, 'isBeta');

// @ts-expect-error locale не является ключом Preferences.
getPreference(preferences, 'locale');
```

### Сложность

- Время: `O(1)`.
- Память: `O(1)`.

### Компромиссы и альтернативы

Перегрузки могут описать небольшой фиксированный набор ключей, но дублируют контракт и плохо масштабируются. Широкий `keyof Preferences` корректно ограничивает ключ, но возвращает union. Обобщённый ключ одновременно ограничивает вход и сохраняет точный выходной тип.

</details>

## Самопроверка

- Почему `keyof Preferences` без параметра типа даёт широкий результат?
- Как тип `Key` связан с `Preferences[Key]`?
- Почему `false` для `isBeta` — обычное значение, а не пустой результат?
