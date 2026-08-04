# task-0020 — Возобновление async после await

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите восемь строк консоли в точном порядке.
// Объясните синхронную часть async-функции, timer callback и microtask возобновления после await.
// Учтите логи до и после resolve и момент settlement внешнего Promise.

async function run() {
  console.log(1);

  const result = await new Promise((resolve) => {
    console.log(2);

    setTimeout(() => {
      console.log(3);
      resolve('готово!');
      console.log(4);
    }, 0);
  });

  console.log(6);
  return result;
}

const resultPromise = run();

console.log(5);

resultPromise.then((result) => {
  console.log(result);
});

console.log(7);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Вызов `run()` выполняется синхронно до первого незавершённого `await`, после чего управление возвращается основному коду.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

До timer успевают появиться четыре строки: две внутри `run` и две после её вызова.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В timer сначала выводится `3`, затем `resolve` планирует возобновление `run`, но текущий callback ещё выводит `4`; после `6` завершается внешний Promise и запускается его `then`.

</details>

<details>
<summary>Решение</summary>

```text
1
2
5
7
3
4
6
готово!
```

До `await` функция выполняется синхронно. Основной стек продолжает строки `5` и `7`, затем timer выводит `3` и `4`. Разрешение внутреннего Promise ставит возобновление `run` в microtask; после `6` возвращаемое значение разрешает `resultPromise`, и его handler выводит `готово!`.

Ожидаемый результат: консоль содержит восемь строк именно в указанном порядке.

Ручная проверка: отметьте границы основного стека, timer callback и двух последовательных microtasks, затем запустите код и сравните каждую строку.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Event loop и очереди задач
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
