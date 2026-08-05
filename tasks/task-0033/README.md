# task-0033 — Опечатка во вложенном свойстве

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, назовите тип ошибки на строке присваивания salary и объясните причину.
// Укажите, выполнятся ли два console.log; опечатка `postion` оставлена намеренно как единственный дефект.

const person = {
  name: 'Vasya',
  age: 22,
};

const position = {
  title: 'Software Engineer',
};

person.position = position;
person.postion.salary = 120;

console.log(person.position);
console.log(position);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сравните написание свойства в двух соседних присваиваниях.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

У объекта `person` есть `position`, но чтение `person.postion` возвращает `undefined`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Присвоить `salary` через `undefined` невозможно: выполнение останавливается с `TypeError` до обоих логов.

</details>

<details>
<summary>Решение</summary>

```text
TypeError
```

Опечатка обращается к отсутствующему `person.postion`. Попытка записать свойство `salary` у `undefined` бросает `TypeError`, поэтому ни один `console.log` не выполняется.

Ожидаемый результат: выполнение останавливается на присваивании `salary` с `TypeError`; строк с объектами в консоли нет.

Ручная проверка: запустите блок и найдите первую строку stack trace; подтвердите тип `TypeError`, строку с `postion` и отсутствие двух последующих логов.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Объекты и коллекции
- Формат: Разобрать код
- Сложность: Базовая
- Примерное время: 10 минут

</details>
