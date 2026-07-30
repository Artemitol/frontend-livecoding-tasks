# Замена prototype после создания объекта

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите результат первого лога и точный тип ошибки второго вызова.
// Один экземпляр создан до полной замены Person.prototype, второй — после неё; объясните, почему они ссылаются на разные объекты prototype.
// Используйте современный консольный JavaScript с constructor functions и prototype без ESM и browser API.

function Person(name) {
  this.name = name;
}

const juan = new Person('Juan');

Person.prototype = {
  getName() {
    return this.name;
  },
};

const pedro = new Person('Pedro');

console.log(pedro.getName());
console.log(juan.getName());
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Экземпляр сохраняет ссылку на объект, который был `Person.prototype` во время `new`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`pedro` создан после замены и находит `getName`, а `juan` продолжает использовать прежний пустой prototype.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первый лог — `Pedro`; второй вызов пытается вызвать отсутствующий метод и бросает `TypeError`. У исходного prototype всё ещё есть свойство `constructor`, но метода `getName` в нём нет.

</details>

<details>
<summary>Решение</summary>

```text
Pedro
TypeError: juan.getName is not a function
```

`pedro` ссылается на новый объект `Person.prototype`, где определён `getName`. `juan` создан раньше и ссылается на исходный prototype; его свойство `constructor` сохраняется, но `getName` там отсутствует, поэтому вызов бросает `TypeError`.

Ожидаемый результат: сначала `Pedro`, затем `TypeError` при вызове `juan.getName()`.

Ручная проверка: запустите блок, затем отдельно проверьте `juan.constructor === Person` и `typeof juan.getName`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
