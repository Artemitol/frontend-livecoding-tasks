# Собственная реализация Pick

Песочница для выполнения — [TypeScript Playground](https://www.typescriptlang.org/play/).

## Условие
```typescript
// Опишите NewPick<T, K>, оставляющий только ключи K из объекта T с исходными типами значений.
// RequiredUser должен содержать обязательные id и name и не содержать surname.
// Используйте чистый TypeScript без browser API.

type User = {
  id: number;
  name: string;
  surname: string;
};

type NewPick<T, K extends keyof T> = never;
type RequiredUser = NewPick<User, 'id' | 'name'>;

const user: RequiredUser = { id: 1, name: 'Ира' };
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Ограничение `K extends keyof T` уже задаёт допустимые ключи.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Переберите именно `K`, а не все ключи `T`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для каждого `P in K` тип значения — `T[P]`.

</details>

<details>
<summary>Решение</summary>

```typescript
type NewPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

Mapped type строит объект только по выбранному объединению ключей.

Ожидаемый результат: `user` проходит проверку типов.

Ручная проверка: добавьте `surname` в `user`; TypeScript должен сообщить об ошибке.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
