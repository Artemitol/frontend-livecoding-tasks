# task-0087 — Вычитание значений одного массива из другого

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте subtractValues: верните из first все значения, которых нет в second, сохранив порядок и повторы first.
// Каждое значение second исключает все равные ему вхождения из first; входные массивы не изменяйте.

function subtractValues(first, second) {
  return first.filter((value) => !second.indexOf(value));
}

const first = [1, 4, 3, 2, 4, 5];
const second = [1, 2, 2];

console.log(subtractValues(first, second));
console.log(first);
console.log(second);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`indexOf` возвращает `0` для первого элемента, а это falsy-значение, поэтому его нельзя отрицать напрямую.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Множество значений второго массива даёт быструю проверку присутствия без изменения порядка первого.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Создайте `const excluded = new Set(second)` и оставьте `value`, только если `!excluded.has(value)`.

</details>

<details>
<summary>Решение</summary>

```javascript
function subtractValues(first, second) {
  const excluded = new Set(second);

  return first.filter((value) => !excluded.has(value));
}
```

Контракт удаляет значения, а не отдельные вхождения: оба `4` сохраняются, потому что `4` отсутствует в `second`.

Ожидаемый результат: `[4, 3, 4, 5]`, затем неизменённые `first` и `second`.

Ручная проверка: добавьте `4` в `second` и проверьте, что из результата исчезают оба вхождения `4`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Массивы, поиск и сортировка
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
