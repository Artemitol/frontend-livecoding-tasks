# Сетка карточек от ширины контейнера

[← Все подборки](../../README.md)

## Условие

Постройте сетку шести карточек, количество колонок которой зависит от ширины самого контейнера, а не от viewport breakpoint. Учебная цель — использовать возможности CSS Grid для container-driven layout без JavaScript и фиксированного числа колонок. Перед началом нужны CSS Grid и `fr`-единицы.

Откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Код не обращается к сети. Исходный ручной сценарий рассчитан на Google Chrome 150.0.7871.101: для одновременной проверки контейнеров `360` и `768 CSS px` сделайте viewport результата не уже `1024 CSS px` и измеряйте именно `.grid-container`, а не окно.

## Код — вставьте его в редактор

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Сетка от ширины контейнера</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 2rem;
        font: 16px/1.5 system-ui;
      }

      /*
       * Учебная цель: менять число колонок по ширине контейнера,
       * а не по ширине viewport.
       * Перед началом нужны CSS Grid и fr-единицы.
       *
       * Замените viewport media query одним grid-template-columns.
       * При 360 px нужна одна колонка, при 768 px — минимум две
       * равные колонки. Не используйте JavaScript или @media.
       */
      .grid-container {
        display: grid;
        gap: 12px;
        width: var(--container-width);
        max-width: 100%;
        margin-bottom: 2rem;
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
        background: #f4f4f4;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Сетка карточек</h1>

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
    </main>
  </body>
</html>
```

## Готово, когда

- При viewport результата не уже `1024 CSS px` DevTools показывает ширину первого `.grid-container` ровно `360px` и одну колонку из шести карточек.
- Второй `.grid-container` имеет измеренную ширину `768px`, минимум две равные колонки и видимый текст всех карточек.
- В стилях нет viewport `@media`, `ResizeObserver` или JavaScript-вычисления числа колонок: одинаковое Grid-правило следует ширине каждого контейнера.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

CSS Grid умеет сам добавлять столько дорожек, сколько помещается в доступную ширину. Для этого не нужно знать ширину viewport.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Используйте `repeat` с автоматическим количеством колонок и задайте каждой дорожке минимальную и максимальную ширину через `minmax`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Схема `repeat(auto-fit, minmax(..., 1fr))` создаёт равные колонки. Внутренняя минимальная ширина должна учитывать `100%`, чтобы одна карточка никогда не оказалась шире узкого контейнера.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Сетка от ширины контейнера</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 2rem;
        font: 16px/1.5 system-ui;
      }

      .grid-container {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
        gap: 12px;
        width: var(--container-width);
        max-width: 100%;
        margin-bottom: 2rem;
        padding: 12px;
        border: 2px dashed #777;
      }

      .card {
        min-height: 72px;
        padding: 12px;
        border: 1px solid #444;
        background: #f4f4f4;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Сетка карточек</h1>

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
    </main>
  </body>
</html>
```

### Почему это работает

`auto-fit` создаёт только помещающиеся дорожки и растягивает их на доступное место. `minmax(min(100%, 16rem), 1fr)` не даёт минимальной ширине карточки превысить узкий контейнер, а `1fr` делает созданные колонки равными. При `360px` помещается одна дорожка, при `768px` — несколько, независимо от ширины viewport.

</details>

<details>
<summary>Самопроверка</summary>

- Почему viewport `640 CSS px` не может доказать сценарий контейнера шириной `768 CSS px`?
- Что делает `min(100%, 16rem)` в узком контейнере?
- Чем `auto-fit` отличается от `auto-fill`, если карточек не хватает на последнюю строку?

</details>

<details>
<summary>О задаче</summary>

- Технология: HTML/CSS
- Подборка: Вёрстка
- Формат: Написать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
