# task-0052 — Шпион для метода без подмены поведения

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте spyOn(object, methodName): замените выбранный метод обёрткой, которая сохраняет исходное поведение, return value и текущий receiver.
// Возвращённый spy содержит массив calls; каждый вызов метода добавляет в него отдельный массив переданных аргументов в исходном порядке.
// Для двух вызовов ниже должны обновиться разные объекты, вернуться две строки и накопиться calls: [['Иван Иванов', 31], ['Пётр Петров', 28]].

function spyOn(object, methodName) {
  // Напишите решение.
}

const person = {
  firstName: '',
  lastName: '',
  age: 0,
  update(fullName, age) {
    const [firstName, lastName] = fullName.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    return `${this.firstName} ${this.lastName}: ${this.age}`;
  },
};

const spy = spyOn(person, 'update');
const firstResult = person.update('Иван Иванов', 31);

const colleague = Object.create(person);
colleague.firstName = '';
colleague.lastName = '';
colleague.age = 0;
const secondResult = colleague.update('Пётр Петров', 28);

console.log(firstResult);
console.log(secondResult);
console.log(person.firstName, colleague.firstName);
console.log(spy.calls);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сохраните ссылку на исходный метод до того, как присвоите объекту обёртку.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Обёртка должна быть обычной функцией: её `this` определяется объектом слева от точки в конкретном вызове.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сначала добавьте `args` в `calls`, затем верните результат `original.apply(this, args)`.

</details>

<details>
<summary>Решение</summary>

```javascript
function spyOn(object, methodName) {
  const original = object[methodName];
  const calls = [];

  object[methodName] = function (...args) {
    calls.push(args);
    return original.apply(this, args);
  };

  return {
    calls,
  };
}
```

Обычная функция сохраняет receiver конкретного вызова, а `apply` передаёт исходному методу тот же `this` и тот же список аргументов. Возвращаемое значение не теряется.

Ожидаемый результат: выводятся `Иван Иванов: 31`, `Пётр Петров: 28`, затем `Иван Пётр` и массив `[['Иван Иванов', 31], ['Пётр Петров', 28]]`.

Ручная проверка: вставьте решение и сравните вывод с ожидаемым; затем добавьте третий вызов с другим количеством аргументов и убедитесь, что новая запись в `calls` совпадает с фактически переданными значениями.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
