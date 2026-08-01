# Плоский объект с ключами-путями

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте flatten: она должна записывать каждый не-объектный лист в новый объект по ключу из сегментов через точку.
// Не изменяйте source; для данных ниже выведите JSON с ключами user.name, user.address.city и active.
// Используйте консольный JavaScript без ESM и browser API.

function flatten(source, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object') {
      flatten(value, path);
    } else {
      result[path] = value;
    }
  }

  return result;
}

const source = {
  user: {
    name: 'Mila',
    address: {
      city: 'Kazan',
    },
  },
  active: true,
};

const before = JSON.stringify(source);
console.log(JSON.stringify(flatten(source)));
console.log('inputUnchanged:', before === JSON.stringify(source));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Один и тот же объект-результат должен дойти до всех рекурсивных вызовов.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Передайте `result` третьим аргументом при вызове `flatten` для вложенного значения.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Замените вызов на `flatten(value, path, result)`: тогда присваивания из вложенных уровней попадут в возвращаемый объект.

</details>

<details>
<summary>Решение</summary>

```javascript
function flatten(source, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object') {
      flatten(value, path, result);
    } else {
      result[path] = value;
    }
  }

  return result;
}
```

Общий аккумулятор получает листья каждого уровня, а `source` только читается.

Ожидаемый результат: `{"user.name":"Mila","user.address.city":"Kazan","active":true}` и `inputUnchanged: true`.

Ручная проверка: вставьте решение, затем добавьте `user.address.zip` и убедитесь, что появляется ключ `user.address.zip`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
