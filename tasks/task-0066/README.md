# Актуальное сообщение в замыкании

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Сначала объясните, почему исходная log после трёх increment выводит Count is 0, затем исправьте её так, чтобы сообщение читало актуальный count.
// Не меняйте публичный результат [increment, log] и последовательность вызовов ниже; исправленная версия должна вывести Count is 3.
// Используйте консольный JavaScript без ESM и browser API.

function createIncrement() {
  let count = 0;

  function increment() {
    count += 1;
  }

  const message = `Count is ${count}`;

  function log() {
    console.log(message);
  }

  return [increment, log];
}

const [increment, log] = createIncrement();
increment();
increment();
increment();
log();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Строка `message` вычисляется один раз до вызовов `increment`, когда `count` ещё равен нулю.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Функция `log` уже замыкает переменную `count`, поэтому отдельный сохранённый снимок ей не нужен.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Перенесите шаблонную строку непосредственно в `console.log`, чтобы интерполяция выполнялась во время каждого вызова `log`.

</details>

<details>
<summary>Решение</summary>

```javascript
function log() {
  console.log(`Count is ${count}`);
}
```

Теперь `count` читается при вызове `log`, а не во время создания `createIncrement`. Неиспользуемую константу `message` после замены можно удалить.

Ожидаемый результат: строка `Count is 3`.

Ручная проверка: замените функцию `log`, запустите блок и сравните строку; затем вызовите `increment()` ещё раз и `log()` — новое сообщение должно быть `Count is 4`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
