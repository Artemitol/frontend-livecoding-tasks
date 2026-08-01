# Разбор CSS-селекторов

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```html
<!-- Укажите элементы, которые выберут .some div > p и .some_div__p.
     Первый селектор должен примениться только к direct-child p у div внутри .some, второй — к любому элементу с точным классом.
     Выполняйте в браузере через CodePen. -->

<div class="some">
  <div>
    <p id="direct">Первый</p>
    <section><p id="nested">Второй</p></section>
  </div>
</div>
<span class="some_div__p" id="class-match">Третий</span>
```

```css
.some div > p { color: red; }
.some_div__p { color: blue; }
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Символ `>` означает прямого потомка, а пробел — любого потомка.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Проверьте путь от `.some` до каждого `p` по одной связи за раз.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первый селектор выберет `#direct`, второй — `#class-match`; `#nested` не является прямым ребёнком `div`.

</details>

<details>
<summary>Решение</summary>

```css
.some div > p { color: red; }
.some_div__p { color: blue; }
```

`.some div > p` выбирает `#direct`, а `.some_div__p` выбирает элемент с этим точным классом независимо от тега.

Ожидаемый результат: `#direct` красный, `#class-match` синий, `#nested` без цвета от этих правил.

Ручная проверка: перенесите `#nested` непосредственно в `div`; он должен стать красным.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS
- Подборка: HTML/CSS: практика к собеседованию
- Формат: Разобрать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
