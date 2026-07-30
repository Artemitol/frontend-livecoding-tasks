# Общие и собственные поля prototype

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите шесть строк консоли в точном порядке.
// Объясните общую мутацию массива из prototype, собственное поле color, эффект delete для унаследованного names и последующее затенение names у fruit2.
// Используйте современный консольный JavaScript с class и prototype без ESM и browser API.

class Fruit {}

Object.assign(Fruit.prototype, {
  color: 'red',
  names: [],
  addName(name) {
    this.names.push(name);
  },
});

const fruit1 = new Fruit();
const fruit2 = new Fruit();

fruit1.color = 'yellow';
fruit1.addName('banana');
fruit1.addName('coconut');

console.log('1:', fruit1.color, fruit2.color);
console.log('2:', JSON.stringify(fruit1.names), JSON.stringify(fruit2.names));

delete fruit2.names;

console.log('3:', JSON.stringify(fruit2.names), JSON.stringify(Fruit.prototype.names));

fruit2.names = [];
fruit2.addName('apple');

console.log('4:', JSON.stringify(fruit1.names), JSON.stringify(fruit2.names));
console.log('5:', Object.hasOwn(fruit1, 'color'), Object.hasOwn(fruit2, 'color'));
console.log('6:', Object.hasOwn(fruit1, 'names'), Object.hasOwn(fruit2, 'names'));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

До собственных присваиваний оба экземпляра находят `color` и `names` в одном объекте `Fruit.prototype`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Запись скалярного `color` создаёт собственное поле, а `push` меняет уже найденный унаследованный массив.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

`delete` не удаляет унаследованное поле, но присваивание `fruit2.names = []` создаёт собственный массив и отделяет дальнейший `push`.

</details>

<details>
<summary>Решение</summary>

```text
1: yellow red
2: ["banana","coconut"] ["banana","coconut"]
3: ["banana","coconut"] ["banana","coconut"]
4: ["banana","coconut"] ["apple"]
5: true false
6: false true
```

Оба первых вызова `addName` мутируют массив из prototype. `fruit1.color` затеняет скалярное поле только у первого экземпляра. У `fruit2` нет собственного `names`, поэтому `delete` ничего не меняет; последующее присваивание создаёт отдельный массив.

Ожидаемый результат: шесть строк полностью совпадают с блоком решения.

Ручная проверка: запустите блок, сравните все шесть строк, затем отдельно выведите `fruit1.names === Fruit.prototype.names` и `fruit2.names === Fruit.prototype.names`; результаты должны быть `true` и `false`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 20 минут

</details>
