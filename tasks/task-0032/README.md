# task-0032 — Повторная привязка функции

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите две строки консоли в точном порядке.
// Объясните, какой receiver закрепляет первый bind и может ли второй bind заменить его.

const firstUser = {
  name: 'User 1',
  getName() {
    return `name is: ${this.name}`;
  },
};

const secondUser = {
  name: 'User 2',
};

const detached = firstUser.getName;
const onceBound = detached.bind(secondUser);
const twiceBound = onceBound.bind(firstUser);

console.log(onceBound());
console.log(twiceBound());
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сравните поведение исходной функции и уже связанной функции, которую возвращает `bind`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Вызов `detached.bind(secondUser)` создаёт функцию, у которой receiver уже закреплён.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Повторный `bind(firstUser)` не меняет receiver связанной функции, поэтому оба вызова читают одно и то же имя.

</details>

<details>
<summary>Решение</summary>

```text
name is: User 2
name is: User 2
```

Первый `bind` закрепляет `secondUser`. Второй `bind` создаёт ещё одну связанную функцию, но не заменяет уже зафиксированный receiver.

Ожидаемый результат: обе строки содержат `User 2`.

Ручная проверка: запустите блок и сравните обе строки с прогнозом, затем поменяйте только аргумент второго `bind` и убедитесь, что результат остаётся прежним.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Прототипы, наследование и `this`
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 15 минут

</details>
