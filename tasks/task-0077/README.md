# Рекурсивное раскрытие объекта

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте flattenObject: она должна вернуть новый объект с путями через точку для всех примитивных листьев.
// Обрабатывайте null как лист и не изменяйте source; проверки должны вывести JSON с profile.name, profile.city, active, extra и true.
// Используйте консольный JavaScript без ESM и browser API.

function flattenObject(source, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}

const source = {
  profile: {
    name: 'Ira',
    city: 'Perm',
  },
  active: false,
  extra: null,
};

const before = JSON.stringify(source);
console.log(JSON.stringify(flattenObject(source)));
console.log('inputUnchanged:', before === JSON.stringify(source));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`typeof null` тоже возвращает `'object'`, хотя у `null` нельзя читать пары ключей.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Рекурсивно обходите только значение, которое не равно `null` и действительно является объектом.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Измените условие на `value !== null && typeof value === 'object'`; в ветке `else` сохраните `null` по текущему пути.

</details>

<details>
<summary>Решение</summary>

```javascript
function flattenObject(source, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object') {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}
```

`null` остаётся примитивным листом в результате, поэтому рекурсия не вызывает `Object.entries(null)`.

Ожидаемый результат: `{"profile.name":"Ira","profile.city":"Perm","active":false,"extra":null}` и `inputUnchanged: true`.

Ручная проверка: вставьте решение, затем добавьте глубже вложенный объект и проверьте полный путь его листа.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
