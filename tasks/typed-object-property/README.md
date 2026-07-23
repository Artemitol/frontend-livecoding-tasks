# Точный тип значения по ключу настройки

[← Все подборки](../../README.md)

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала исправьте diagnostics как в исходном режиме `noEmit`, затем оставьте `noEmit` выключенным и нажмите **Run**.

## Условие

```ts
// Учебная цель: сохранять связь между ключом объекта и типом
// возвращаемого значения в обобщённой функции.
// Перед началом нужны обобщённые функции и keyof.
//
// Исправьте getPreference одной generic-сигнатурой.
// Key должен оставаться допустимым ключом Preferences,
// а результат — иметь точный тип Preferences[Key].
// Не используйте overloads, type assertion или runtime-проверки.

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

const theme: string = getPreference(preferences, 'theme');
const retryCount: number = getPreference(preferences, 'retryCount');
const isBeta: boolean = getPreference(preferences, 'isBeta');

// @ts-expect-error locale не является ключом Preferences.
getPreference(preferences, 'locale');

const runtimePass =
  theme === 'dark' &&
  retryCount === 3 &&
  isBeta === false;

console.log({ theme, retryCount, isBeta, runtimePass });
```

## Готово, когда

- TypeScript Playground 5.9 в режиме `strict` принимает присваивания результата `theme` в `string`, `retryCount` в `number` и `isBeta` в `boolean`.
- Вызов с `locale` остаётся ошибкой компиляции, которую подтверждает `@ts-expect-error`.
- После **Run** видны `theme: "dark"`, `retryCount: 3`, `isBeta: false` и `runtimePass: true`.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`keyof Preferences` ограничивает допустимые ключи, но обычный параметр с таким типом не запоминает, какой именно ключ пришёл в конкретный вызов.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавьте функции один параметр типа `Key`, ограниченный ключами `Preferences`, и используйте `Key` как тип второго аргумента.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Свяжите выход с входом через indexed access type: подставьте generic-ключ в квадратные скобки после `Preferences`. Тело функции по-прежнему только читает `preferences[key]`.

</details>

<details>
<summary>Решение</summary>

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

const runtimePass =
  theme === 'dark' &&
  retryCount === 3 &&
  isBeta === false;

console.log({ theme, retryCount, isBeta, runtimePass });
```

### Почему это работает

`Key` сохраняет литеральный ключ каждого вызова. Indexed access type `Preferences[Key]` вычисляет связанный тип свойства, поэтому один generic-контракт одновременно запрещает неизвестные ключи и не расширяет результат до union всех значений.

</details>

<details>
<summary>Самопроверка</summary>

- Почему параметр `key: keyof Preferences` без generic даёт широкий тип результата?
- Почему значение `false` для `isBeta` остаётся обычным результатом, а не признаком отсутствия значения?
- Как эта сигнатура изменится, если функция должна работать с объектом произвольного типа?

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Моделирование типов
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
