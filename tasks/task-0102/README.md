# task-0102 — Объединение ключей объекта

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Замените any в ObjectKey на тип объединения ключей объекта user.
// Строки 'name' и 'age' должны проходить проверку, а другие строки и числа — нет.

const user = {
  name: 'Nik',
  age: 25,
};

type ObjectKey = any;

const validName: ObjectKey = 'name';
const validAge: ObjectKey = 'age';
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Тип значения объекта доступен через `typeof`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Оператор `keyof` превращает тип объекта в объединение его ключей.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Примените `keyof` к `typeof user`.

</details>

<details>
<summary>Решение</summary>

```typescript
type ObjectKey = keyof typeof user;
```

`ObjectKey` равен `'name' | 'age'`.

Ожидаемый результат: оба объявления проходят проверку типов.

Ручная проверка: добавьте `const invalid: ObjectKey = 'email'`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript → Дженерики и ключи объектов
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 15 минут

</details>
