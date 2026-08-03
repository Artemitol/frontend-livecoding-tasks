# Объекты как ключи обычного объекта

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите две строки вывода и объясните, почему обе операции чтения возвращают второй объект.
// Укажите, как обычный объект приводит object-ключи к строкам перед записью свойства.
// Используйте консольный JavaScript без ESM и browser API.

const first = { key: 'a' };
const second = { key: 'b' };
const dictionary = {};

dictionary[first] = first;
dictionary[second] = second;

console.log(dictionary[first].key);
console.log(dictionary[second].key);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Обычный объект хранит имена свойств как строки или `Symbol`, а не как ссылочные object-ключи.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сравните результат `String(first)` и `String(second)` перед обеими операциями записи.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оба ключа становятся строкой `"[object Object]"`, поэтому вторая запись заменяет первую.

</details>

<details>
<summary>Решение</summary>

```text
b
b
```

При доступе через квадратные скобки оба объекта приводятся к одному строковому ключу. Вторая запись перезаписывает свойство, поэтому оба чтения получают объект `second`.

Ожидаемый результат: две строки `b`.

Ручная проверка: запустите блок, затем выведите `Object.keys(dictionary)` и сравните результат с использованием `new Map()`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
