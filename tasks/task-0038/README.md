# Типизированный выбор полей объекта

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Замените сигнатуру и тело pick: ключи должны быть ограничены keyof исходного объекта, а результат — содержать только выбранные поля с исходными типами значений.
// Верните новый объект и не изменяйте source; для фикстуры результат равен {"a":1,"c":true}, selected !== source и исходный JSON сохраняется.
// Используйте чистый современный TypeScript без DOM, ESM и дополнительных библиотек.

function pick(object: object, ...keys: string[]): object {
  return {};
}

const source = {
  a: 1,
  b: 'two',
  c: true,
};

const sourceBeforePicking = JSON.stringify(source);
const selected = pick(source, 'a', 'c');

console.log(JSON.stringify(selected));
console.log(selected !== source);
console.log(JSON.stringify(source) === sourceBeforePicking);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Свяжите тип ключей с типом объекта через `K extends keyof T`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Возвращаемый тип можно выразить встроенным `Pick<T, K>`, а накопитель привести к этому типу перед заполнением.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Создайте пустой `Pick<T, K>`, пройдите по `keys` и для каждого `key` присвойте `result[key] = object[key]`.

</details>

<details>
<summary>Решение</summary>

```typescript
function pick<T extends object, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  keys.forEach((key) => {
    result[key] = object[key];
  });

  return result;
}
```

Параметр `K` допускает только ключи `T`, а `Pick<T, K>` сохраняет тип значения каждого выбранного поля. Новый накопитель не меняет исходный объект.

Ожидаемый результат: консоль выводит `{"a":1,"c":true}`, `true`, `true`; тип `selected` содержит `a: number` и `c: boolean`, но не содержит `b`.

Ручная проверка: вставьте решение и сравните три строки с ожидаемыми. Затем добавьте `const count: number = selected.a` и `const active: boolean = selected.c`; они должны компилироваться, а `selected.b` и `pick(source, 'missing')` — давать ошибки TypeScript.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
