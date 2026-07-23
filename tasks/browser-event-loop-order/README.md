# Порядок синхронного кода, microtask и timer callback

[← Все подборки](../../README.md)

Сначала запишите прогноз. Затем откройте [CodePen](https://pen.new), очистите панели HTML, CSS и JS, вставьте весь блок ниже в панель **HTML** и нажмите **Run**. Важно: здесь используется обычный классический `<script>` в главном потоке браузера, не ESM и не Node.js.

## Условие

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Event loop: порядок вывода</title>
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
    <h1>Порядок вывода</h1>
    <pre id="trace"></pre>

    <script>
      // Учебная цель: предсказывать порядок синхронного кода,
      // microtask и timer callback в браузерном event loop.
      //
      // До запуска запишите четыре строки в точном порядке.
      // Затем объясните, что завершается до microtask
      // и почему timer с задержкой 0 всё равно выполняется позже.
      // Код и порядок вызовов не изменяйте.

      const trace = document.querySelector('#trace');
      const log = (entry) => {
        trace.append(`${entry}\n`);
        console.log(entry);
      };

      log('sync:start');
      Promise.resolve().then(() => log('microtask:promise'));
      setTimeout(() => log('timer:0'), 0);
      log('sync:end');
    </script>
  </body>
</html>
```

## Готово, когда

- До запуска записан порядок `sync:start`, `sync:end`, `microtask:promise`, `timer:0`.
- Объяснено, почему весь текущий синхронный стек завершается до Promise microtask.
- Объяснено, почему `setTimeout(..., 0)` планирует следующую задачу и не обгоняет microtask.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый ответ целиком.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите четыре вызова `log` на синхронные, Promise microtask и timer callback.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала выпишите только синхронные строки в порядке чтения программы. Остальные два callback пока отложите.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После опустошения текущего стека браузер исчерпывает очередь microtask. Только затем он может взять timer callback как следующую задачу.

</details>

<details>
<summary>Решение</summary>

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Event loop: порядок вывода</title>
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
    <h1>Порядок вывода</h1>
    <pre id="trace"></pre>

    <script>
      const trace = document.querySelector('#trace');
      const log = (entry) => {
        trace.append(`${entry}\n`);
        console.log(entry);
      };

      log('sync:start');
      Promise.resolve().then(() => log('microtask:promise'));
      setTimeout(() => log('timer:0'), 0);
      log('sync:end');
    </script>
  </body>
</html>
```

Точный вывод:

```text
sync:start
sync:end
microtask:promise
timer:0
```

### Почему это работает

Оба синхронных `log` завершаются в текущем стеке. Продолжение `then` попадает в очередь microtask, которая исчерпывается после стека. Callback `setTimeout` становится отдельной последующей задачей, поэтому нулевая задержка не делает его синхронным и не ставит перед microtask.

</details>

<details>
<summary>Самопроверка</summary>

- Какая строка завершает текущий синхронный стек?
- Почему задержка `0` не означает немедленный вызов?
- Что изменится в объяснении, если Promise заменить ещё одним синхронным `log`?

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Event loop и асинхронность
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 12 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
