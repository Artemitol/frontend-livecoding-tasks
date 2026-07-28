# Порядок синхронного кода, microtask и timer callback

Сначала запишите свой прогноз. Затем откройте [CodePen](https://pen.new), очистите панели, вставьте первый фрагмент в **HTML**, второй — в **JS**, оставьте JavaScript без препроцессора в режиме classic script и нажмите **Run**. Код выполняется в главном потоке браузера, не как ESM или Node.js.

## Условие

Не изменяя код, предскажите четыре строки в точном порядке. Объясните, что выполняется в текущем синхронном стеке, когда запускается Promise microtask и почему timer с задержкой `0` выполняется позже.

```html
<pre id="trace"></pre>
```

```javascript
const trace = document.querySelector('#trace');
const log = (entry) => {
  trace.append(`${entry}\n`);
  console.log(entry);
};

log('sync:start');
Promise.resolve().then(() => log('microtask:promise'));
setTimeout(() => log('timer:0'), 0);
log('sync:end');
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Разделите четыре вызова `log` на синхронные, Promise microtask и timer callback.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала выпишите синхронные строки в порядке чтения программы, временно отложив оба callback.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После опустошения текущего стека браузер исчерпывает очередь microtask и только затем берёт timer callback как следующую задачу.

</details>

<details>
<summary>Решение</summary>

Ожидаемый вывод:

```text
sync:start
sync:end
microtask:promise
timer:0
```

Оба синхронных вызова завершаются в текущем стеке. Продолжение `then` попадает в очередь microtask, которая исчерпывается после стека. Callback `setTimeout` становится отдельной следующей задачей, поэтому нулевая задержка не делает его синхронным и не ставит перед microtask. Для ручной проверки сравните прогноз с четырьмя строками в `<pre>` и консоли CodePen.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: Event loop и асинхронность
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 12 минут

</details>
