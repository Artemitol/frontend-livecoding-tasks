# task-0060 — Мемоизация по кортежу аргументов

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте memoize(fn): кэшируйте результат по упорядоченному кортежу аргументов и повторно не вызывайте fn для того же кортежа.
// Различайте число и строку, порядок аргументов и все falsy-значения; объекты сравнивайте по ссылке, поэтому одна ссылка даёт hit, а равный по структуре новый объект — miss.
// Для проверок ниже должно быть calls: 4, firstHit: true, objectHit: true, differentObject: true; функция должна поддерживать любое число аргументов.

function memoize(fn) {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (!cache.get(key)) {
      cache.set(key, fn(...args));
    }

    return cache.get(key);
  };
}

let calls = 0;
const calculate = memoize((...args) => ({
  call: ++calls,
  args,
}));

const firstObject = { id: 1 };
const secondObject = { id: 1 };

const first = calculate(1, '1');
const firstAgain = calculate(1, '1');
calculate('1', 1);
const withObject = calculate(firstObject, 0, false, '', null, undefined);
const withObjectAgain = calculate(firstObject, 0, false, '', null, undefined);
const withDifferentObject = calculate(
  secondObject,
  0,
  false,
  '',
  null,
  undefined,
);

console.log('calls:', calls);
console.log('firstHit:', first === firstAgain);
console.log('objectHit:', withObject === withObjectAgain);
console.log('differentObject:', withObject !== withDifferentObject);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Строковая сериализация не сохраняет ссылочную идентичность объектов и может смешивать некоторые значения.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Постройте дерево из `Map`: каждый уровень соответствует одной позиции аргумента, а ключом служит само значение.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В конечном узле храните отдельные `hasValue` и `value`; флаг нужен, потому что корректный закэшированный результат сам может быть falsy.

</details>

<details>
<summary>Решение</summary>

```javascript
function memoize(fn) {
  const root = {
    children: new Map(),
    hasValue: false,
    value: undefined,
  };

  return (...args) => {
    let node = root;

    for (const argument of args) {
      if (!node.children.has(argument)) {
        node.children.set(argument, {
          children: new Map(),
          hasValue: false,
          value: undefined,
        });
      }

      node = node.children.get(argument);
    }

    if (!node.hasValue) {
      node.value = fn(...args);
      node.hasValue = true;
    }

    return node.value;
  };
}
```

Последовательность уровней кодирует и порядок, и длину аргументов. Нативные ключи `Map` различают примитивные типы и используют ссылочную идентичность для объектов без строкового преобразования.

Ожидаемый результат: `calls: 4`, затем `firstHit: true`, `objectHit: true` и `differentObject: true`.

Ручная проверка: вставьте решение и сравните четыре строки; затем мемоизируйте функцию, возвращающую `0`, и дважды вызовите её без аргументов — исходная функция должна выполниться один раз.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Функции, замыкания и область видимости
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
