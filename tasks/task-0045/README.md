# task-0045 — Разделение игроков по командам

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте groupPlayersBySquad: первым элементом результата верните игроков с squad !== null, вторым — игроков с squad === null.
// Сохраните исходный порядок внутри обеих групп, считайте squad: 0 существующей командой и не изменяйте players.
// Сравните оба массива id с точными примерами.

const players = [
  { id: 2, squad: 1 },
  { id: 3, squad: 1 },
  { id: 4, squad: null },
  { id: 5, squad: 2 },
  { id: 6, squad: 1 },
  { id: 7, squad: 2 },
  { id: 8, squad: 0 },
];

function groupPlayersBySquad(players) {
  const playersWithSquad = [];
  const playersWithoutSquad = [];

  for (const player of players) {
    if (player.squad !== null) {
      playersWithoutSquad.push(player);
    } else {
      playersWithSquad.push(player);
    }
  }

  return [playersWithSquad, playersWithoutSquad];
}

const [playersWithSquad, playersWithoutSquad] =
  groupPlayersBySquad(players);

console.log(JSON.stringify(playersWithSquad.map((player) => player.id)));
console.log(JSON.stringify(playersWithoutSquad.map((player) => player.id)));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Порядок кортежа уже задан именами `playersWithSquad` и `playersWithoutSquad`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Проверьте, в какой массив сейчас попадает ветка `player.squad !== null`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Поменяйте местами только массивы в двух `push`; условие и порядок массива в `return` оставьте прежними.

</details>

<details>
<summary>Решение</summary>

```javascript
function groupPlayersBySquad(players) {
  const playersWithSquad = [];
  const playersWithoutSquad = [];

  for (const player of players) {
    if (player.squad !== null) {
      playersWithSquad.push(player);
    } else {
      playersWithoutSquad.push(player);
    }
  }

  return [playersWithSquad, playersWithoutSquad];
}
```

Явная проверка на `null` не теряет команду с номером `0`. Исправление меняет только направления записи и сохраняет порядок игроков.

Ожидаемый результат: первая строка — `[2,3,5,6,7,8]`, вторая — `[4]`.

Ручная проверка: вставьте решение, сравните обе строки с ожидаемыми и убедитесь, что игрок `8` находится в первой группе, а исходный `players` содержит семь записей в прежнем порядке.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Объекты и коллекции
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
