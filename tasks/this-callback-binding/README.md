# `this` у метода, стрелки и отделённого callback

[← Все подборки](../../README.md)

Сначала запишите прогноз. Затем откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Код выполняется в браузере как `<script type="module">`: это сохраняет strict mode и верхнеуровневый `this === undefined`, как в исходном Node.js ESM-сценарии.

## Условие

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>this у трёх форм вызова</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      pre {
        padding: 1rem;
        background: #f4f4f4;
      }
    </style>
  </head>
  <body>
    <h1>Три формы вызова</h1>
    <pre id="trace"></pre>

    <script type="module">
      // Учебная цель: прослеживать привязку this у метода,
      // стрелочной функции и переданного callback.
      //
      // До запуска предскажите три строки в точном порядке.
      // Объясните receiver метода, лексический this стрелки
      // и TypeError отделённого вызова. Код не изменяйте.

      const trace = document.querySelector('#trace');
      const print = (entry) => {
        trace.append(`${entry}\n`);
        console.log(entry);
      };

      const toolbox = {
        status: 'save',
        describeMethod() {
          print(`method:${this.status}`);
        },
        describeArrow: () => {
          print(`arrow:${this?.status ?? 'missing'}`);
        },
      };

      toolbox.describeMethod();
      toolbox.describeArrow();

      const callback = toolbox.describeMethod;

      try {
        callback();
      } catch (error) {
        print(`error:${error.name}`);
      }
    </script>
  </body>
</html>
```

## Готово, когда

- До запуска записаны строки `method:save`, `arrow:missing`, `error:TypeError` именно в таком порядке.
- Объяснение связывает первую строку с receiver `toolbox`, а вторую — с лексическим верхнеуровневым `this` браузерного ESM.
- Объяснено, что отделённый strict-mode вызов получает `this === undefined`, а пойманный `TypeError` не останавливает программу.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый ответ целиком.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Смотрите на форму каждого вызова, а не только на место, где функция записана: `object.method()` и `callback()` задают разные условия.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для каждой строки отдельно ответьте на вопрос: создаёт ли функция собственный `this`, и есть ли объект слева от точки в момент вызова?

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

У обычного метода receiver берётся из вызова. У стрелки `this` приходит из места создания. После присваивания метода в `callback` receiver исчезает, а ESM уже работает в strict mode.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>this у трёх форм вызова</title>
    <style>
      body {
        font: 16px/1.5 system-ui;
        margin: 2rem;
      }

      pre {
        padding: 1rem;
        background: #f4f4f4;
      }
    </style>
  </head>
  <body>
    <h1>Три формы вызова</h1>
    <pre id="trace"></pre>

    <script type="module">
      const trace = document.querySelector('#trace');
      const print = (entry) => {
        trace.append(`${entry}\n`);
        console.log(entry);
      };

      const toolbox = {
        status: 'save',
        describeMethod() {
          print(`method:${this.status}`);
        },
        describeArrow: () => {
          print(`arrow:${this?.status ?? 'missing'}`);
        },
      };

      toolbox.describeMethod();
      toolbox.describeArrow();

      const callback = toolbox.describeMethod;

      try {
        callback();
      } catch (error) {
        print(`error:${error.name}`);
      }
    </script>
  </body>
</html>
```

Точный вывод:

```text
method:save
arrow:missing
error:TypeError
```

### Почему это работает

`toolbox.describeMethod()` передаёт методу receiver `toolbox`. Стрелка не создаёт собственный `this` и берёт верхнеуровневое значение browser ESM — `undefined`. Отделённая обычная функция вызывается без receiver; strict mode не подставляет глобальный объект, поэтому чтение `this.status` выбрасывает локально пойманный `TypeError`.

</details>

<details>
<summary>Самопроверка</summary>

- Почему ссылка на одну функцию даёт разный `this` в `toolbox.describeMethod()` и `callback()`?
- Почему стрелка не печатает `arrow:save`?
- Как изменится третий вызов после `bind(toolbox)`?

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: `this` и замыкания
- Формат: Разобрать код
- Сложность: Средняя
- Примерное время: 15 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
