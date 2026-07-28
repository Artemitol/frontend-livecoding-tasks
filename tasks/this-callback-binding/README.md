# `this` у метода, стрелки и отделённого callback

Сначала запишите прогноз. Затем откройте [CodePen](https://pen.new), вставьте HTML-фрагмент в панель **HTML**, JavaScript — в панель **JS** и запустите как browser ESM. Верхнеуровневый `this` в этом режиме равен `undefined`.

## Условие

Не изменяя код, предскажите три строки в точном порядке. Объясните, откуда берётся `this` у вызванного через объект метода, у стрелочной функции и у того же метода после отделения от объекта.

```html
<pre id="trace"></pre>
```

```javascript
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
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Смотрите на форму каждого вызова: `object.method()` и `callback()` задают разные условия для обычной функции.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для каждой строки определите, создаёт ли функция собственный `this` и есть ли объект слева от точки в момент вызова.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Метод получает receiver из вызова, стрелка захватывает верхнеуровневый `this`, а отделённый strict-mode callback вызывается без receiver.

</details>

<details>
<summary>Решение</summary>

Ожидаемый вывод:

```text
method:save
arrow:missing
error:TypeError
```

`toolbox.describeMethod()` передаёт методу receiver `toolbox`. Стрелка не создаёт собственный `this` и получает верхнеуровневое значение browser ESM — `undefined`. После присваивания метода в `callback` receiver исчезает; strict mode не подставляет глобальный объект, поэтому чтение `this.status` выбрасывает пойманный `TypeError`. Для ручной проверки сравните прогноз с тремя строками в `<pre>` и консоли.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: `this` и замыкания
- Формат: Разобрать код
- Сложность: Средняя
- Примерное время: 15 минут

</details>
