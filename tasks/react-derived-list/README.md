# Производный список без копии состояния

Откройте [React TypeScript](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Предполагается React 19.2 в браузере; другие файлы и сеть не нужны.

## Условие

Исправьте `DerivedList`: вычисляйте `visibleItems` из актуальных `items`, `query` и `category` во время render, а не храните копию списка в state. Поиск должен игнорировать регистр и крайние пробелы, фильтр категории — сохранять исходный порядок и не изменять `items`. Для строки `бан` и категории `fruit` сначала должен остаться `Банан`, а после добавления смузи — `Банан` и `Банановый смузи`.

```tsx
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
      <output aria-live="polite">Найдено: {visibleItems.length}</output>
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
            { id: 4, name: 'Банановый смузи', category: 'fruit' },
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

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Значение, которое полностью получается из props и state, не должно становиться вторым источником истины.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Нормализуйте `query` через `trim().toLowerCase()`, затем проверьте категорию и вхождение строки для каждого `item`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Замените `useState(items)` обычным `items.filter(...)` внутри компонента; новый render сам пересчитает результат для новых props и state.

</details>

<details>
<summary>Решение</summary>

```tsx
function DerivedList({ items }: DerivedListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] =
    useState<'all' | Item['category']>('all');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = items.filter((item) => (
    (category === 'all' || item.category === category) &&
    item.name.toLowerCase().includes(normalizedQuery)
  ));

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
      <output aria-live="polite">Найдено: {visibleItems.length}</output>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
  );
}
```

`visibleItems` теперь является проекцией текущих входов и не может рассинхронизироваться с `items`. Для ручной проверки выберите «Фрукты», введите ` бан `, затем добавьте смузи: счётчик должен измениться с `1` на `2`, а исходный порядок сохраниться.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: состояние и производные данные
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
