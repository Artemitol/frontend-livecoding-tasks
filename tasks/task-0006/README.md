# task-0006 — Посты, комментарии и таймер

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: загрузка двух локальных наборов не зависит от elapsed и описана loading, success и error типом.
// После размонтирования не обновляйте state; показывайте у поста только comments с тем же postId.
// Используйте корректные ul/li и стабильные id-ключи для обоих уровней списка.
// Отдельный effect держит ровно один интервал, увеличивает elapsed от прошлого значения раз в секунду и очищает таймер.

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
};

type Comment = {
  id: number;
  postId: number;
  text: string;
};

type DashboardData = {
  posts: Post[];
  comments: Comment[];
};

const POSTS: Post[] = [
  { id: 1, title: 'План релиза' },
  { id: 2, title: 'Итоги ретро' },
];

const COMMENTS: Comment[] = [
  { id: 11, postId: 1, text: 'Добавить даты.' },
  { id: 12, postId: 2, text: 'Записать решения.' },
  { id: 13, postId: 1, text: 'Проверить риски.' },
];

function loadPosts(): Promise<Post[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(POSTS), 250);
  });
}

function loadComments(): Promise<Comment[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(COMMENTS), 400);
  });
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    void Promise.all([loadPosts(), loadComments()])
      .then(([posts, comments]) => {
        setData({ posts, comments });
      })
      .catch(() => {
        setError('Не удалось загрузить данные');
      });

    window.setInterval(() => {
      setElapsed(elapsed + 1);
    }, 1000);
  }, [elapsed]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main>
      <p>Прошло секунд: {elapsed}</p>
      {data === null && <p>Загрузка…</p>}
      <ul>
        {data?.posts.map((post) => (
          <div>
            <h2>{post.title}</h2>
            {data.comments.map((comment) => (
              <p>{comment.text}</p>
            ))}
          </div>
        ))}
      </ul>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Загрузка и таймер имеют разные жизненные циклы. Сначала разделите их на два effect и перечислите состояния данных явно.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте discriminated union по полю `status`, а в effect загрузки используйте флаг `active`, который cleanup переводит в `false`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Интервалу нужны пустые зависимости, функциональный `setElapsed` и `clearInterval`; внутри каждого post отберите `comments.filter((comment) => comment.postId === post.id)`.

</details>

<details>
<summary>Решение</summary>

```tsx
type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData };

export default function App() {
  const [state, setState] = useState<LoadState>({
    status: 'loading',
  });
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let active = true;

    void Promise.all([loadPosts(), loadComments()])
      .then(([posts, comments]) => {
        if (active) {
          setState({
            status: 'success',
            data: { posts, comments },
          });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setState({
            status: 'error',
            message: reason instanceof Error
              ? reason.message
              : 'Не удалось загрузить данные',
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <main>
      <p>Прошло секунд: {elapsed}</p>

      {state.status === 'loading' && <p>Загрузка…</p>}
      {state.status === 'error' && (
        <p role="alert">{state.message}</p>
      )}
      {state.status === 'success' && (
        <ul>
          {state.data.posts.map((post) => {
            const postComments = state.data.comments.filter(
              (comment) => comment.postId === post.id,
            );

            return (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <ul>
                  {postComments.map((comment) => (
                    <li key={comment.id}>{comment.text}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
```

Раздельные effect больше не перезапускают загрузку из-за счётчика. Discriminated union закрывает все состояния, фильтр связывает сущности, а cleanup ограничивает работу жизненным циклом.

Ожидаемый результат: через локальную задержку показаны два поста только с их комментариями, а счётчик растёт ровно на единицу в секунду.

Ручная проверка: сверяйте комментарии по `postId`, наблюдайте таймер пять секунд, затем временно заставьте `loadComments` отклонить Promise и проверьте отдельное error-состояние.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Асинхронные данные и состояния интерфейса
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 60 минут

</details>
