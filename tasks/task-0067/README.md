# Индексы DOM-обработчиков в цикле

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```html
<!-- Исправьте регистрацию трёх click-обработчиков: один программный клик должен вывести 0, 1 и 2 в точном порядке. -->
<!-- Каждый обработчик сохраняет индекс своей итерации; HTML, button.click() и browser JavaScript без ESM не меняются. -->
<button id="button" type="button">Проверить обработчики</button>
```

```javascript
const button = document.getElementById('button');

for (var index = 0; index < 3; index += 1) {
  button.addEventListener('click', function handleClick() {
    console.log(index);
  });
}

button.click();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

`var` создаёт одну function-scoped переменную, которую после завершения цикла читают все три обработчика.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Нужна отдельная привязка значения для каждой итерации, а не один общий `index`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Замените `var` на `let`: цикл `for` создаст новую привязку `index` для каждого зарегистрированного callback.

</details>

<details>
<summary>Решение</summary>

```javascript
for (let index = 0; index < 3; index += 1) {
  button.addEventListener('click', function handleClick() {
    console.log(index);
  });
}
```

У `let` блочная область видимости, а цикл создаёт отдельную привязку для каждой итерации. Поэтому callbacks читают три разных значения после окончания регистрации.

Ожидаемый результат: строки `0`, `1`, `2`.

Ручная проверка: перенесите HTML и JavaScript в соответствующие панели CodePen, замените цикл решением и сравните три строки консоли; затем нажмите кнопку вручную и убедитесь, что порядок повторяется.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Базовая
- Примерное время: 20 минут

</details>
