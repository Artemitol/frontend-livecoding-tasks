# Производный список без копии состояния

**Учебная цель:** Вычислять производное представление списка из props и state без дублирования состояния.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript, React |
| Тема | Состояние React |
| Формат | Реализация |
| Уровень | Базовый |
| Время | 20 минут |
| Навыки | props, локальное состояние фильтра, производные данные, useMemo |
| Предварительные знания | Базовые props и useState |
| Среда выполнения | React 19.2, TypeScript 5.9, Google Chrome 150.0.7871.101, development mode |

<details>
<summary>Теория</summary>

`items`, строка поиска и выбранная категория — три входа одного отображения. Если хранить результат фильтрации отдельным state, он может устареть при изменении props. Производное значение вычисляется во время render; `useMemo` здесь только кэширует вычисление между неизменившимися входами.

</details>

## Условие

Реализуйте `DerivedList`. Компонент получает список `items` через props, а строку поиска и категорию хранит локально. Покажите число и имена элементов, подходящих одновременно по категории и подстроке без учёта регистра. Не копируйте отфильтрованный список в state и не синхронизируйте его эффектом.

### Входы

- `items: readonly Item[]` — неизменяемый список из parent fixture.
- Значение текстового поля поиска.
- Выбранная категория `all`, `fruit` или `vegetable`.

### Выходы

- `output` с числом подходящих элементов.
- `ul` с их именами в исходном порядке.
- Пустой `ul` и число `0`, если совпадений нет.

### Ограничения и побочные эффекты

- Не изменяйте `items` и не создавайте state для `visibleItems`.
- Не используйте `useEffect` для копирования props или фильтра.
- Изменение `items` в parent fixture должно сразу участвовать в проекции.
- Сетевых запросов, таймеров и побочных эффектов нет.

### Локальный fixture

```tsx
type Item = { id: number; name: string; category: 'fruit' | 'vegetable' };

const initialItems: Item[] = [
  { id: 1, name: 'Яблоко', category: 'fruit' },
  { id: 2, name: 'Банан', category: 'fruit' },
  { id: 3, name: 'Брокколи', category: 'vegetable' },
];
```

### Стартовый код

```tsx
import { useState } from 'react';

type Item = { id: number; name: string; category: 'fruit' | 'vegetable' };
type DerivedListProps = { items: readonly Item[] };

export function DerivedList({ items }: DerivedListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Item['category']>('all');
  const [visibleItems, setVisibleItems] = useState(items);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
        <option value="all">Все</option><option value="fruit">Фрукты</option><option value="vegetable">Овощи</option>
      </select>
      <output>{visibleItems.length}</output>
    </section>
  );
}
```

### Примеры

#### Обычный сценарий

При `query = 'бан'` и `category = 'fruit'` результат — `1` и `Банан`.

#### Граничный сценарий

При `query = 'zzz'` результат — `0` и пустой список.

#### Изменение props

После возврата к `query = 'бан'` parent добавляет `{ id: 4, name: 'Банановый смузи', category: 'fruit' }`. Результат становится `2`: `Банан`, `Банановый смузи`.

## Критерии готовности

- Фильтр одновременно учитывает текущие props, категорию и строку поиска.
- `zzz` не оставляет устаревший элемент на экране.
- Добавление элемента parent fixture меняет результат без отдельного состояния списка.
- `items` присутствует в зависимостях `useMemo`.

<details>
<summary>Подсказка 1</summary>

Спросите: можно ли полностью получить список из уже существующих трёх значений во время render?

</details>

<details>
<summary>Решение</summary>

### Подход

Единственное сохраняемое состояние — ввод пользователя. Список вычисляется из `items`, `query` и `category`; поэтому новый props-список не требует отдельного пути синхронизации.

```tsx
import { useMemo, useState } from 'react';

type Item = { id: number; name: string; category: 'fruit' | 'vegetable' };
type DerivedListProps = { items: readonly Item[] };

export function DerivedList({ items }: DerivedListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Item['category']>('all');
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => (
      (category === 'all' || item.category === category)
      && item.name.toLowerCase().includes(normalizedQuery)
    ));
  }, [category, items, query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
        <option value="all">Все</option><option value="fruit">Фрукты</option><option value="vegetable">Овощи</option>
      </select>
      <output>{visibleItems.length}</output>
      <ul>{visibleItems.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
    </section>
  );
}
```

### Сложность

- Время: `O(n)` при изменении входов.
- Память: `O(m)` для отфильтрованного результата, где `m` — число совпадений.

### Компромиссы и альтернативы

`useMemo` не исправляет архитектуру и не нужен для очень дешёвого вычисления; прямой `filter` в render также корректен. Отдельный state оправдан только если результат пользователь редактирует независимо от исходных входов.

</details>

## Самопроверка

- Почему `visibleItems` не должен быть вторым source of truth?
- Что произойдёт при новом массиве `items`, если его нет в зависимостях memo?
- Когда можно отказаться от `useMemo`, не меняя корректность?
