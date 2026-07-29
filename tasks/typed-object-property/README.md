# Точный тип значения по ключу настройки

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала проверьте diagnostics с `noEmit`, затем выключите `noEmit` и нажмите **Run**. Понадобятся обобщённые функции и `keyof`.

## Условие

Исправьте `getPreference` одной generic-сигнатурой: параметр ключа должен принимать только ключи `Preferences`, а результат — сохранять точный тип `Preferences[Key]` для переданного ключа. Не используйте overloads, type assertion или runtime-проверки.

```typescript
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

console.log(theme, retryCount, isBeta);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`keyof Preferences` ограничивает ключи, но обычный параметр не запоминает, какой именно ключ пришёл в конкретный вызов.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавьте параметр типа `Key`, ограниченный ключами `Preferences`, и используйте `Key` как тип второго аргумента.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Свяжите выход с входом через indexed access type: подставьте generic-ключ в `Preferences[Key]`.

</details>

<details>
<summary>Решение</summary>

```typescript
function getPreference<Key extends keyof Preferences>(
  preferences: Preferences,
  key: Key,
): Preferences[Key] {
  return preferences[key];
}
```

`Key` сохраняет литеральный ключ каждого вызова, а `Preferences[Key]` вычисляет связанный тип свойства. Playground не должен показывать ошибок, а после **Run** ожидается `dark 3 false`. Для ручной проверки добавьте вызов с ключом `'locale'`: TypeScript должен отклонить его.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Моделирование типов
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
