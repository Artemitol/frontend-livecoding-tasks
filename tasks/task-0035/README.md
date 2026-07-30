# Собственные и унаследованные свойства

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите четыре boolean в точном порядке.
// Объясните разницу между hasOwnProperty и оператором in для поля экземпляра и унаследованного метода.
// Используйте современный консольный JavaScript с class без ESM и browser API.

class Animal {
  constructor(name) {
    this.name = name;
  }

  sound() {
    return 'some sound';
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}

const dog = new Dog('Buddy', 'Labrador');

console.log(dog.hasOwnProperty('name'));
console.log(dog.hasOwnProperty('sound'));
console.log('name' in dog);
console.log('sound' in dog);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Поле `name` создаётся конструктором на самом экземпляре, а метод `sound` находится выше в цепочке prototype.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`hasOwnProperty` не проходит по цепочке prototype и поэтому видит только собственные ключи `dog`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Оператор `in` находит оба ключа, а собственным из этой пары является только `name`.

</details>

<details>
<summary>Решение</summary>

```text
true
false
true
true
```

`name` записан непосредственно в `dog`. Метод `sound` унаследован через `Animal.prototype`, поэтому `hasOwnProperty` его не видит, а `in` находит.

Ожидаемый результат: `true`, `false`, `true`, `true` в указанном порядке.

Ручная проверка: запустите блок и сравните четыре строки с прогнозом, затем выведите `Object.keys(dog)` и убедитесь, что среди собственных перечисляемых ключей есть `name`, но нет `sound`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Базовая
- Примерное время: 15 минут

</details>
