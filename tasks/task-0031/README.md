# Привязка отсоединённого метода

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Объясните, почему в строгом режиме отсоединённый вызов теряет receiver и бросает TypeError, затем исправьте только присваивание fn.
// Сохраните отдельный вызов fn(); после исправления он должен вывести `name is: David`.
// Используйте современный консольный JavaScript без ESM и browser API.

'use strict';

const user = {
  name: 'David',
  getName() {
    console.log(`name is: ${this.name}`);
  },
};

const fn = user.getName;

fn();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Значение `this` определяется способом вызова функции, а не местом, где метод был объявлен.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

После присваивания в `fn` вызов выглядит как обычный `fn()`, поэтому связь с `user` теряется.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Создайте новую функцию через `bind`, передав `user` как закреплённый receiver.

</details>

<details>
<summary>Решение</summary>

```javascript
const fn = user.getName.bind(user);
```

`bind` возвращает функцию с закреплённым объектом `user`. Поэтому вызов `fn()` читает поле `user.name`, хотя выполняется без точки.

Ожидаемый результат: единственная строка консоли — `name is: David`.

Ручная проверка: сначала запустите starter и подтвердите `TypeError`, затем замените присваивание `fn` решением и сравните единственную строку с ожидаемой.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
