# Глубокое клонирование данных

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте deepClone: создайте независимую копию вложенных массивов, объектов, null и примитивов.
// После изменения clone.user.tags[0] и clone.settings.theme исходный source должен сохранить 'js' и 'light'.
// Используйте консольный JavaScript без ESM и browser API.

function deepClone(value) {
  // Напишите решение.
}

const source = {
  user: {
    tags: ['js', null],
  },
  settings: {
    theme: 'light',
  },
};

const clone = deepClone(source);
clone.user.tags[0] = 'ts';
clone.settings.theme = 'dark';

console.log(source.user.tags[0]);
console.log(source.settings.theme);
console.log(clone.user.tags[0]);
console.log(clone.settings.theme);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Примитивы и `null` можно вернуть как есть: они не содержат изменяемых вложенных ссылок.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для массива примените `map(deepClone)`, а для объекта создайте новый объект и клонируйте каждую пару.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Проверьте `Array.isArray(value)` раньше обычного объекта и используйте `Object.fromEntries` для рекурсивно преобразованных записей.

</details>

<details>
<summary>Решение</summary>

```javascript
function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepClone);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, deepClone(item)]),
  );
}
```

Каждый массив и объект получает новую ссылку, поэтому изменение `clone` не может пройти к соответствующему вложенному контейнеру `source`.

Ожидаемый результат: `js`, `light`, `ts`, `dark`.

Ручная проверка: вставьте решение, затем добавьте вложенный объект в массив и измените его поле только в клоне.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
