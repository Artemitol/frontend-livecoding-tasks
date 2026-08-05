# task-0025 — then и await в одной очереди

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Не изменяя код, предскажите четыре строки консоли в точном порядке.
// Обе функции вызывают одну фабрику и каждая получает новый сразу разрешённый Promise; сравните регистрацию then и продолжение после await.

const myPromise = () => Promise.resolve('I have resolved!');

function firstFunction() {
  myPromise().then((value) => console.log(value));
  console.log('first');
}

async function secondFunction() {
  console.log(await myPromise());
  console.log('second');
}

firstFunction();
secondFunction();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала отметьте единственный синхронный `console.log`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

`then` и продолжение после `await` ставятся в очередь microtask в порядке регистрации.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сначала выполнится callback `then`, затем async-функция продолжится, выведет значение и только потом `second`.

</details>

<details>
<summary>Решение</summary>

```text
first
I have resolved!
I have resolved!
second
```

`first` печатается до обработки Promise. Затем исполняется зарегистрированный `then`; продолжение `secondFunction` выводит то же значение и следующей строкой `second`.

Ожидаемый результат: `first`, два раза `I have resolved!`, затем `second`.

Ручная проверка: запустите блок и сопоставьте обе строки с одинаковым значением с разными точками продолжения.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Event loop и очереди задач
- Формат: Предсказать результат
- Сложность: Средняя
- Примерное время: 15 минут

</details>
