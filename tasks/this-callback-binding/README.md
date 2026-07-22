# `this` у метода, стрелки и отделённого callback

**Учебная цель:** Прослеживать привязку this у метода, стрелочной функции и переданного callback.

| Метаданные | Значение |
| --- | --- |
| Технологии | JavaScript |
| Тема | Модель выполнения JavaScript |
| Формат | Разбор |
| Уровень | Средний |
| Время | 15 минут |
| Навыки | receiver метода, лексический `this` стрелки, strict mode |
| Предварительные знания | Нет |
| Среда выполнения | Node.js 26.4.0, ECMAScript modules, strict mode |

<details>
<summary>Теория</summary>

Обычный метод получает `this` из формы вызова: в `toolbox.describeMethod()` получателем является `toolbox`. Стрелочная функция не создаёт собственный `this`, а использует лексический `this` места создания. В ESM верхнеуровневый `this` равен `undefined`; при вызове отделённой обычной функции strict mode также передаёт ей `undefined`.

</details>

## Условие

Разберите программу: укажите точные три строки stdout и объясните причину каждой. Отдельно объясните, почему последний вызов выбрасывает ошибку, но программа продолжает работу.

### Входы

Дана фиксированная ESM-программа. В ответе нужны:

1. три строки stdout в точном порядке;
2. объяснение receiver метода;
3. объяснение лексического `this` стрелочной функции;
4. объяснение `TypeError` при вызове отделённого callback.

### Выходы

Три строки stdout и причинный trace привязки `this`.

### Ограничения и побочные эффекты

- Выполняйте код именно как ESM в Node.js 26.4.0; в этой среде включён strict mode.
- Не меняйте форму вызовов и не добавляйте `bind`, `call` или `apply`.
- Ожидаемый `TypeError` должен быть пойман локально.
- Единственный внешний побочный эффект — вывод в stdout.

### Фикстуры

Фикстура — приведённый ниже локальный объект и три формы вызова.

### Стартовый код

```js
const toolbox = {
  status: 'save',
  describeMethod() {
    console.log(`method:${this.status}`);
  },
  describeArrow: () => {
    console.log(`arrow:${this?.status ?? 'missing'}`);
  },
};

toolbox.describeMethod();
toolbox.describeArrow();

const callback = toolbox.describeMethod;

try {
  callback();
} catch (error) {
  console.log(`error:${error.name}`);
}
```

### Примеры

#### Обычный сценарий

Вызов `toolbox.describeMethod()` имеет receiver `toolbox`, поэтому первая строка — `method:save`.

#### Граничный сценарий

Стрелочная функция не получает `toolbox` как `this`; её лексический ESM `this` равен `undefined`, поэтому вторая строка — `arrow:missing`.

#### Ошибка или пустой результат

`callback()` вызывается без receiver. В strict mode `this` внутри `describeMethod` равен `undefined`, чтение `this.status` выбрасывает `TypeError`, а `catch` печатает `error:TypeError`.

## Критерии готовности

- Указаны строки `method:save`, `arrow:missing`, `error:TypeError` именно в таком порядке.
- Объяснение не приписывает стрелочной функции динамический `this` от `toolbox`.
- Объяснение связывает ошибку с отделённым вызовом в strict ESM, а не с содержимым `status`.
- Указано, что ошибка поймана и не останавливает программу.

<details>
<summary>Подсказка 1</summary>

Смотрите не на место записи функции в объекте, а на вид каждого вызова: `object.method()` и `callback()` создают разные условия для обычной функции.

</details>

<details>
<summary>Решение</summary>

### Подход

Метод вызывается через объект, поэтому `this === toolbox` и доступен `status`. Стрелка создана на верхнем уровне ESM, где `this` равен `undefined`; optional chaining и `??` дают `missing`. После присваивания в `callback` обычная функция вызывается без receiver. Strict mode не подставляет глобальный объект, поэтому чтение `this.status` вызывает пойманный `TypeError`.

```text
method:save
arrow:missing
error:TypeError
```

Полный код не требует исправлений:

```js
const toolbox = {
  status: 'save',
  describeMethod() {
    console.log(`method:${this.status}`);
  },
  describeArrow: () => {
    console.log(`arrow:${this?.status ?? 'missing'}`);
  },
};

toolbox.describeMethod();
toolbox.describeArrow();

const callback = toolbox.describeMethod;

try {
  callback();
} catch (error) {
  console.log(`error:${error.name}`);
}
```

### Сложность

- Время: `O(1)`.
- Память: `O(1)`.

### Компромиссы и альтернативы

Если callback действительно должен работать с `toolbox`, его можно передавать как `toolbox.describeMethod.bind(toolbox)`. Это фиксирует receiver, но создаёт новую функцию. Альтернатива — хранить состояние в замыкании стрелочной функции, если динамический `this` вообще не нужен.

</details>

## Самопроверка

- Почему `toolbox.describeMethod()` и `callback()` дают разный `this`, хотя ссылаются на одну функцию?
- Почему стрелка не печатает `arrow:save`?
- Как изменится третий вызов после `const callback = toolbox.describeMethod.bind(toolbox)`?
