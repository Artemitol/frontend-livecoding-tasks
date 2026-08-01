# Типизированное чтение свойства

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Типизируйте getProperty так, чтобы ключ зависел от переданного объекта, а результат имел тип выбранного свойства.
// Вызовы с существующими ключами должны компилироваться и выводить соответствующий тип значения.
// Вызов getProperty(first, 'm') не должен компилироваться. Используйте чистый TypeScript без browser API.

const first = { a: 1, b: 2, c: 3, d: 4 };
const second = { m: 1, b: 2, c: 3, d: 4 };

const getProperty = (object, key) => object[key];

const firstValue = getProperty(first, 'a');
const secondValue = getProperty(second, 'm');
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Для объекта нужен параметр типа, а ключ можно ограничить его `keyof`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Объявите `T` для объекта и `K extends keyof T` для ключа.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Тип возвращаемого значения записывается как `T[K]`.

</details>

<details>
<summary>Решение</summary>

```typescript
const getProperty = <T, K extends keyof T>(object: T, key: K): T[K] => object[key];
```

Ограничение ключа не даёт обратиться к отсутствующему свойству, а индексный доступ сохраняет тип результата.

Ожидаемый результат: `firstValue` и `secondValue` имеют тип `number`.

Ручная проверка: вызовите `getProperty(first, 'm')`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
