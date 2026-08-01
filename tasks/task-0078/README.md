# Инверсия двоичных листьев без рекурсии

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте invertBinary: обходите вложенные массивы итеративно и меняйте каждый числовой 0 на 1, а 1 на 0.
// Верните новый массив, сохраните исходный data и не изменяйте строку '1'; проверки должны вывести [1,[0,[1,0]],0,"1"] и true.
// Используйте консольный JavaScript без ESM и browser API.

function invertBinary(data) {
  const result = [...data];
  const stack = [result];

  while (stack.length > 0) {
    const current = stack.pop();

    for (let index = 0; index < current.length; index += 1) {
      if (Array.isArray(current[index])) {
        stack.push(current[index]);
      } else {
        current[index] = current[index] === 0 ? 1 : 0;
      }
    }
  }

  return result;
}

const data = [0, [1, [0, 1]], 1, '1'];
const before = JSON.stringify(data);
console.log(JSON.stringify(invertBinary(data)));
console.log('inputUnchanged:', before === JSON.stringify(data));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Поверхностная копия сохраняет внутренние массивы общими с исходными данными.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

При встрече массива сначала создайте его копию и подставьте её в родительский результат, только затем положите копию в стек.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Инвертируйте только числа через `item === 0 || item === 1`; строки и другие листья переносите без изменения.

</details>

<details>
<summary>Решение</summary>

```javascript
function invertBinary(data) {
  const result = [...data];
  const stack = [result];

  while (stack.length > 0) {
    const current = stack.pop();

    for (let index = 0; index < current.length; index += 1) {
      const item = current[index];

      if (Array.isArray(item)) {
        const copy = [...item];
        current[index] = copy;
        stack.push(copy);
      } else if (item === 0 || item === 1) {
        current[index] = item === 0 ? 1 : 0;
      }
    }
  }

  return result;
}
```

Стек обходит все уровни без рекурсивных вызовов, а копирование каждого вложенного массива не даёт изменить исходный `data`.

Ожидаемый результат: `[1,[0,[1,0]],0,"1"]` и `inputUnchanged: true`.

Ручная проверка: вставьте решение, затем добавьте глубже `[0]` и убедитесь, что он становится `[1]`, а исходный JSON не меняется.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 25 минут

</details>
