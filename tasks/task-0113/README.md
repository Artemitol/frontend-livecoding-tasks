# task-0113 — parseInt как callback map

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите содержимое result и объясните роль второго аргумента parseInt.
// Укажите, почему первый и третий элементы преобразуются по разным основаниям, а второй становится NaN.

const values = ['1', '7', '11'];
const result = values.map(parseInt);

console.log(result);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`map` передаёт callback не только значение, но и индекс элемента.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сопоставьте вызовы с формой `parseInt(value, radix)` для индексов `0`, `1` и `2`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Основание `0` выбирает обычный десятичный разбор, основание `1` недопустимо, а строка `'11'` в основании `2` равна `3`.

</details>

<details>
<summary>Решение</summary>

```text
[ 1, NaN, 3 ]
```

`map` вызывает `parseInt('1', 0)`, `parseInt('7', 1)` и `parseInt('11', 2)`. Второй аргумент функции становится основанием системы счисления, а не игнорируется.

Ожидаемый результат: массив `[1, NaN, 3]`.

Ручная проверка: сначала запишите прогноз, затем запустите блок и сравните с `values.map((value) => parseInt(value, 10))`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
