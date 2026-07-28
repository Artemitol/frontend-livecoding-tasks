# Сетка карточек от ширины контейнера

Откройте [CodePen](https://pen.new), вставьте HTML и CSS в одноимённые панели. Код не использует JavaScript; проверка выполняется по описанному в карточке ручному сценарию.

## Условие

Замените viewport `@media` одним правилом `grid-template-columns`, чтобы число равных колонок зависело от ширины `.grid-container`. При ширине контейнера `360px` нужна одна колонка, при `768px` — минимум две. Не используйте `@media`, `ResizeObserver` или JavaScript; минимальная ширина карточки не должна переполнять узкий контейнер.

```html
<h2>Контейнер 360 CSS px</h2>
<div class="grid-container" style="--container-width: 360px">
  <article class="card">Один</article>
  <article class="card">Два</article>
  <article class="card">Три</article>
  <article class="card">Четыре</article>
  <article class="card">Пять</article>
  <article class="card">Шесть</article>
</div>

<h2>Контейнер 768 CSS px</h2>
<div class="grid-container" style="--container-width: 768px">
  <article class="card">Один</article>
  <article class="card">Два</article>
  <article class="card">Три</article>
  <article class="card">Четыре</article>
  <article class="card">Пять</article>
  <article class="card">Шесть</article>
</div>
```

```css
* {
  box-sizing: border-box;
}

.grid-container {
  display: grid;
  gap: 12px;
  width: var(--container-width);
  max-width: 100%;
  padding: 12px;
  border: 2px dashed #777;
}

@media (min-width: 700px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  min-height: 72px;
  padding: 12px;
  border: 1px solid #444;
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

CSS Grid умеет сам добавлять столько дорожек, сколько помещается в доступную ширину; знать ширину viewport не требуется.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Используйте `repeat` с автоматическим количеством колонок и задайте каждой дорожке минимальную и максимальную ширину через `minmax`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Схема `repeat(auto-fit, minmax(..., 1fr))` создаёт равные колонки. Внутренний `min(100%, ...)` не даёт минимальной ширине превысить узкий контейнер.

</details>

<details>
<summary>Решение</summary>

Удалите блок `@media` и добавьте свойство в основное правило:

```css
.grid-container {
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}
```

`auto-fit` создаёт только помещающиеся дорожки и растягивает их на доступное место. `minmax(min(100%, 16rem), 1fr)` не даёт минимальной ширине карточки превысить узкий контейнер. Для ручной проверки разместите оба примера рядом в области шире `1024 CSS px`: контейнер `360px` должен показать одну колонку, а `768px` — минимум две равные колонки с видимым текстом.

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS
- Подборка: Вёрстка
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
