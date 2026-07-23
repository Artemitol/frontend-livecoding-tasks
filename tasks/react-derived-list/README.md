# Производный список без копии состояния

[← Все подборки](../../README.md)

Откройте [Vite React TypeScript в StackBlitz](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Сценарий проверяет поведение React 19.2 в браузере Google Chrome 150.0.7871.101. Другие файлы менять не нужно.

## Условие

```tsx
// Учебная цель: вычислять производный список из props и state,
// не создавая для него второй источник истины.
// Перед началом нужны базовые props и useState.
//
// Исправьте DerivedList:
// 1. Фильтруйте items одновременно по query и category.
// 2. Сравнивайте query с именем без учёта регистра и крайних пробелов.
// 3. Не храните visibleItems в state и не синхронизируйте его effect.
// 4. Сохраняйте исходный порядок и не изменяйте items.
// После query "бан" и category "fruit" должен остаться "Банан".
// После добавления smoothie тем же фильтром должны быть видны два элемента.

import { useState } from 'react';

type Item = {
  id: number;
  name: string;
  category: 'fruit' | 'vegetable';
};

type DerivedListProps = {
  items: readonly Item[];
};

const initialItems: Item[] = [
  { id: 1, name: 'Яблоко', category: 'fruit' },
  { id: 2, name: 'Банан', category: 'fruit' },
  { id: 3, name: 'Брокколи', category: 'vegetable' },
];

function DerivedList({ items }: DerivedListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] =
    useState<'all' | Item['category']>('all');
  const [visibleItems] = useState(items);

  return (
    <section>
      <label>
        Поиск
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <label>
        Категория
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as typeof category);
          }}
        >
          <option value="all">Все</option>
          <option value="fruit">Фрукты</option>
          <option value="vegetable">Овощи</option>
        </select>
      </label>

      <output aria-live="polite">
        Найдено: {visibleItems.length}
      </output>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addSmoothie = (): void => {
    setItems((currentItems) => (
      currentItems.some((item) => item.id === 4)
        ? currentItems
        : [
            ...currentItems,
            {
              id: 4,
              name: 'Банановый смузи',
              category: 'fruit',
            },
          ]
    ));
  };

  return (
    <main>
      <h1>Каталог продуктов</h1>
      <button type="button" onClick={addSmoothie}>
        Добавить банановый смузи
      </button>
      <DerivedList items={items} />
    </main>
  );
}
```

## Готово, когда

- При строке `бан` и категории «Фрукты» показаны `Найдено: 1` и только `Банан`.
- Строка `zzz` даёт `Найдено: 0` и пустой список, а очистка строки возвращает подходящие элементы.
- После возврата к `бан` кнопка «Добавить банановый смузи» сразу меняет результат на `Найдено: 2`: видны `Банан` и `Банановый смузи`.
- `visibleItems` вычисляется из `items`, `query` и `category`; отдельного state, синхронизирующего effect и мутации `items` нет.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Если значение можно полностью получить из уже имеющихся props и state во время render, отдельный state для него создаёт риск рассинхронизации.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Нормализуйте `query` через `trim().toLowerCase()`, затем отфильтруйте `items` двумя независимыми условиями: категория и подстрока имени.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Вычислите `visibleItems` через `useMemo`. В список зависимостей должны войти все три входа проекции: `items`, `query` и `category`.

</details>

<details>
<summary>Решение</summary>

```tsx
import { useMemo, useState } from 'react';

type Item = {
  id: number;
  name: string;
  category: 'fruit' | 'vegetable';
};

type DerivedListProps = {
  items: readonly Item[];
};

const initialItems: Item[] = [
  { id: 1, name: 'Яблоко', category: 'fruit' },
  { id: 2, name: 'Банан', category: 'fruit' },
  { id: 3, name: 'Брокколи', category: 'vegetable' },
];

function DerivedList({ items }: DerivedListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] =
    useState<'all' | Item['category']>('all');
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => (
      (category === 'all' || item.category === category) &&
      item.name.toLowerCase().includes(normalizedQuery)
    ));
  }, [category, items, query]);

  return (
    <section>
      <label>
        Поиск
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <label>
        Категория
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as typeof category);
          }}
        >
          <option value="all">Все</option>
          <option value="fruit">Фрукты</option>
          <option value="vegetable">Овощи</option>
        </select>
      </label>

      <output aria-live="polite">
        Найдено: {visibleItems.length}
      </output>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addSmoothie = (): void => {
    setItems((currentItems) => (
      currentItems.some((item) => item.id === 4)
        ? currentItems
        : [
            ...currentItems,
            {
              id: 4,
              name: 'Банановый смузи',
              category: 'fruit',
            },
          ]
    ));
  };

  return (
    <main>
      <h1>Каталог продуктов</h1>
      <button type="button" onClick={addSmoothie}>
        Добавить банановый смузи
      </button>
      <DerivedList items={items} />
    </main>
  );
}
```

### Почему это работает

`items`, `query` и `category` остаются единственными источниками истины. `useMemo` кэширует результат между неизменившимися входами, но не превращает его в состояние: новый массив от parent сразу участвует в следующем вычислении. Для дешёвого списка прямой `filter` во время render был бы так же корректен.

</details>

<details>
<summary>Самопроверка</summary>

- Почему `visibleItems` в state может устареть после изменения props?
- Что произойдёт, если убрать `items` из зависимостей `useMemo`?
- Когда можно отказаться от `useMemo`, не меняя корректность решения?

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: состояние и производные данные
- Формат: Написать код
- Сложность: Базовая
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
