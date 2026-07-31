# Сводка данных для страницы постов

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```html
<!-- Реализуйте async-функцию getPosts: объедините локальные posts, users и comments, сохранив исходный порядок постов. -->
<!-- Для каждого поста верните id, title, userName и commentsCount; неизвестный userId даёт «Неизвестный автор», отсутствие комментариев — 0. -->
<!-- Не используйте сеть и не изменяйте три массива; выведите полный результат в #output в браузерной песочнице CodePen без ESM. -->

<pre id="output"></pre>
```

```javascript
const posts = [
  { userId: 1, id: 1, title: 'Первый пост' },
  { userId: 3, id: 2, title: 'Пост без автора' },
  { userId: 2, id: 3, title: 'Пост без комментариев' },
];
const users = [
  { id: 1, name: 'Анна' },
  { id: 2, name: 'Борис' },
];
const comments = [
  { id: 1, postId: 1 },
  { id: 2, postId: 1 },
  { id: 3, postId: 2 },
];

const dataBeforeAggregation = JSON.stringify({
  posts,
  users,
  comments,
});

async function getPosts(posts, users, comments) {
  // Напишите решение.
}

getPosts(posts, users, comments).then((postSummaries) => {
  const dataUnchanged = JSON.stringify({
    posts,
    users,
    comments,
  }) === dataBeforeAggregation;

  document.querySelector('#output').textContent = [
    JSON.stringify(postSummaries, null, 2),
    `Данные не изменены: ${dataUnchanged}`,
  ].join('\n\n');
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала постройте два быстрых справочника: имя пользователя по `id` и количество комментариев по `postId`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Пользователей удобно положить в `Map`, а комментарии свернуть через `reduce` в объект счётчиков.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните `posts.map`: берите имя из `Map` с fallback, а число комментариев — из справочника с fallback `0`.

</details>

<details>
<summary>Решение</summary>

```javascript
async function getPosts(posts, users, comments) {
  const usersById = new Map(
    users.map((user) => [user.id, user.name]),
  );
  const commentsByPostId = comments.reduce((counts, comment) => {
    counts[comment.postId] = (counts[comment.postId] ?? 0) + 1;
    return counts;
  }, {});

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    userName: usersById.get(post.userId) ?? 'Неизвестный автор',
    commentsCount: commentsByPostId[post.id] ?? 0,
  }));
}
```

Два справочника отделяют агрегацию от прохода по постам. Итоговый `map` сохраняет их порядок и создаёт новые объекты.

Ожидаемый результат: `#output` показывает по порядку посты `{ id: 1, title: 'Первый пост', userName: 'Анна', commentsCount: 2 }`, `{ id: 2, title: 'Пост без автора', userName: 'Неизвестный автор', commentsCount: 1 }`, `{ id: 3, title: 'Пост без комментариев', userName: 'Борис', commentsCount: 0 }`, а ниже — `Данные не изменены: true`.

Ручная проверка: вставьте решение, сравните три записи и строку неизменности с ожидаемыми; затем временно добавьте комментарий к посту `3` и убедитесь, что только его `commentsCount` увеличился до `1`.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Приближённая к реальной работе
- Сложность: Продвинутая
- Примерное время: 50 минут

</details>
