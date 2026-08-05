# task-0080 — Чтение значения по точечному пути

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте getByPath(source, path): верните значение по сегментам пути через точку или undefined, если сегмент отсутствует.
// Не изменяйте source; проверки должны вывести Kazan, false, 0, пустую строку и undefined.

function getByPath(source, path) {
  // Напишите решение.
}

const source = {
  user: {
    address: {
      city: 'Kazan',
    },
    active: false,
    retries: 0,
    note: '',
  },
};

console.log(getByPath(source, 'user.address.city'));
console.log(getByPath(source, 'user.active'));
console.log(getByPath(source, 'user.retries'));
console.log(getByPath(source, 'user.note'));
console.log(getByPath(source, 'user.address.zip'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите путь методом `split('.')` и перенесите текущий объект через все сегменты.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Перед чтением следующего ключа проверьте, что текущее значение не равно `null` и является объектом.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Цикл может завершаться ранним `return undefined`, иначе после каждого шага присваивайте `current = current[segment]`.

</details>

<details>
<summary>Решение</summary>

```javascript
function getByPath(source, path) {
  let current = source;

  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object' || !(segment in current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}
```

Проверка существования сегмента отличает отсутствующий путь от существующего свойства со значением `undefined` только при необходимости расширения контракта; здесь она останавливает обход безопасно.

Ожидаемый результат: `Kazan`, `false`, `0`, пустая строка, `undefined`.

Ручная проверка: вставьте решение, затем добавьте `user.address.zip = 420000` и проверьте путь `user.address.zip`; значения `false`, `0` и пустая строка не должны считаться отсутствующими.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Деревья и рекурсия
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
