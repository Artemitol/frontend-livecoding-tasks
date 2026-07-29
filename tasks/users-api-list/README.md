# Список пользователей из API

Откройте [React TypeScript](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Предполагается React 19.2 в браузере и доступ к DummyJSON по HTTPS; другие файлы не меняйте. Контракт API приведён в карточке, а справочная схема доступна в [DummyJSON Users](https://dummyjson.com/docs/users).

## Условие

Выполните требования последовательно:

1. Загружайте по десять пользователей через `GET /users?limit=10&skip=<offset>` и отображайте имя, email и avatar. Ответ имеет форму `{ users, total, skip, limit }`.
2. Добавьте ограниченные значениями `total`, `limit` и `skip` кнопки «Назад» и «Вперёд». Поиск запускайте только после отправки формы через `GET /users/search?q=<query>&limit=10&skip=<offset>`; новый запрос поиска всегда начинает с первой страницы.
3. Показывайте отдельные loading, error и empty состояния. При новом запросе не показывайте данные предыдущего запроса как новый результат, а запоздалый ответ не должен перезаписывать более свежий.

```tsx
// FILE: src/App.tsx
import { type FormEvent, useEffect, useRef, useState } from 'react';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

const API_URL = 'https://dummyjson.com';
const PAGE_SIZE = 10;

export default function App() {
  const [queryInput, setQueryInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    // Загрузите текущую страницу и защитите state от запоздалого ответа.
  }, [submittedQuery, skip]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <main>
      <h1>Пользователи</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Поиск
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </label>
        <button type="submit">Найти</button>
      </form>

      <p>Реализуйте состояния загрузки, ошибки и пустого результата.</p>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
            <strong>{user.firstName} {user.lastName}</strong>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>

      <button type="button" disabled>Назад</button>
      <span>{skip + 1}–{Math.min(skip + limit, total)} из {total}</span>
      <button type="button" disabled>Вперёд</button>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Состояние запроса определяется парой `submittedQuery` и `skip`; текст в input сам по себе не должен запускать загрузку.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В effect соберите URL, очистите прежний список, включите `loading` и создайте новый номер запроса; обновляйте state только для текущего номера.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

На submit сохраните `queryInput.trim()` и сбросьте `skip` в `0`; для границ используйте `skip === 0` и `skip + limit >= total`.

</details>

<details>
<summary>Решение</summary>

```tsx
export default function App() {
  const [queryInput, setQueryInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const resource = submittedQuery
      ? `/users/search?q=${encodeURIComponent(submittedQuery)}&limit=${PAGE_SIZE}&skip=${skip}`
      : `/users?limit=${PAGE_SIZE}&skip=${skip}`;

    setUsers([]);
    setError('');
    setLoading(true);

    fetch(`${API_URL}${resource}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json() as Promise<UsersResponse>;
      })
      .then((data) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setUsers(data.users);
        setTotal(data.total);
        setSkip(data.skip);
        setLimit(data.limit);
      })
      .catch((reason: unknown) => {
        if (requestId === requestIdRef.current) {
          setError(reason instanceof Error ? reason.message : 'Неизвестная ошибка');
        }
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  }, [submittedQuery, skip]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSkip(0);
    setSubmittedQuery(queryInput.trim());
  };

  const hasPrevious = skip > 0;
  const hasNext = skip + limit < total;

  return (
    <main>
      <h1>Пользователи</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Поиск
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </label>
        <button type="submit">Найти</button>
      </form>

      {loading && <p>Загрузка…</p>}
      {!loading && error && <p role="alert">Ошибка: {error}</p>}
      {!loading && !error && users.length === 0 && <p>Ничего не найдено.</p>}
      {!loading && !error && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
              <strong>{user.firstName} {user.lastName}</strong>
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={loading || !hasPrevious}
        onClick={() => setSkip((current) => Math.max(0, current - limit))}
      >
        Назад
      </button>
      <span>{total === 0 ? 0 : skip + 1}–{Math.min(skip + limit, total)} из {total}</span>
      <button
        type="button"
        disabled={loading || !hasNext}
        onClick={() => setSkip((current) => current + limit)}
      >
        Вперёд
      </button>
    </main>
  );
}
```

Номер запроса не позволяет запоздалому ответу изменить state, а очистка `users` не выдаёт старую страницу за результат новой загрузки. Для ручной проверки сопоставьте Markdown-контракт со сценариями: первая страница, обе границы пагинации, отправленный поиск со сбросом на `skip=0`, пустой ответ, loading, HTTP error и два ответа в обратном порядке.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: эффекты и жизненный цикл
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
