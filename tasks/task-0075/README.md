# Распаковка типизированных значений

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте unwrap: объект вида { type: '...', value: ... } заменяется своим value на любой глубине, включая массивы.
// Верните новые объекты и массивы, не изменяя source; сохраните null и обычный объект с полем value без type, а вложенный wrapper распакуйте до листа.
// Используйте консольный JavaScript без ESM и browser API.

function unwrap(value) {
  if (value && typeof value === 'object' && 'value' in value) {
    return value.value;
  }

  if (Array.isArray(value)) {
    return value.map(unwrap);
  }

  if (value && typeof value === 'object') {
    return value;
  }

  return value;
}

const source = {
  person: { type: 'text', value: { type: 'text', value: 'Mila' } },
  tags: [
    { type: 'text', value: 'js' },
    { type: 'text', value: 'ts' },
  ],
  settings: {
    enabled: { type: 'boolean', value: true },
    note: { value: 'keep' },
    empty: null,
  },
};

const before = JSON.stringify(source);
const result = unwrap(source);
console.log(result.person);
console.log(result.tags[0]);
console.log(result.settings.enabled);
console.log(result.settings.note.value);
console.log(result.settings.empty);
console.log('inputUnchanged:', before === JSON.stringify(source));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Распаковка `value` не должна завершать обход: само значение wrapper тоже может быть объектом или массивом.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Верните `unwrap(value.value)` для wrapper, а для обычного объекта соберите новый объект из его пар.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для обычного объекта используйте `Object.fromEntries(Object.entries(value).map(([key, item]) => [key, unwrap(item)]))`.

</details>

<details>
<summary>Решение</summary>

```javascript
function unwrap(value) {
  if (value && typeof value === 'object' && 'type' in value && 'value' in value) {
    return unwrap(value.value);
  }

  if (Array.isArray(value)) {
    return value.map(unwrap);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, unwrap(item)]),
    );
  }

  return value;
}
```

Проверка `type` отличает wrapper от обычного объекта с полем `value`; каждый контейнер создаётся заново и рекурсивно преобразуется.

Ожидаемый результат: `Mila`, `js`, `true`, `keep`, `null`, `inputUnchanged: true`.

Ручная проверка: вставьте решение и замените обычный `note` на wrapper, чтобы сравнить сохранение объекта с повторной распаковкой.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
