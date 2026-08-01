# TDZ и затенение переменной

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите четыре строки вывода: внешнее значение, результат внутреннего let, ошибка const и значение после блока.
// Объясните, почему внутренние объявления не меняют внешнюю переменную и почему обращение до инициализации не читает её.
// Используйте консольный JavaScript без ESM и browser API.

let label = 'outer';
console.log(label);

{
  try {
    console.log(label);
  } catch (error) {
    console.log(error.name);
  }

  let label = 'inner';
  console.log(label);
}

console.log(label);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Область видимости внутреннего `let` начинается с начала блока, а не со строки инициализации.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

До инициализации внутренняя переменная находится в temporal dead zone, поэтому внешнее значение не подставляется.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первый и последний лог читают внешний `label`, попытка внутри `try` печатает имя `ReferenceError`, а после инициализации доступен `inner`.

</details>

<details>
<summary>Решение</summary>

```text
outer
ReferenceError
inner
outer
```

Внутренний `let label` затеняет внешнее имя во всём блоке. До его инициализации чтение запрещено, а после завершения блока снова видно внешнее значение.

Ожидаемый результат: четыре строки `outer`, `ReferenceError`, `inner`, `outer`.

Ручная проверка: сначала запишите прогноз, затем запустите блок и поменяйте внутренний `let` на `var`, чтобы сравнить область видимости.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
