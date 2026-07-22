# Безопасная обработка результата запроса

**Учебная цель:** Исправлять небезопасное сужение union-типа при обработке успешного и ошибочного ответа.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript |
| Тема | Сужение типов |
| Формат | Отладка |
| Уровень | Средний |
| Время | 20 минут |
| Навыки | discriminated union, сужение по Boolean-дискриминанту, обработка пустой строки |
| Предварительные знания | Union-типы и условные ветви |
| Среда выполнения | TypeScript 5.9, strict mode, noEmit |

<details>
<summary>Теория</summary>

Поле `ok` — дискриминант результата. После проверки `if (result.ok)` TypeScript знает, что существует `data`; в другой ветви существует только `error`. Доступ к полю другой ветви — не запасной вариант, а ошибка модели. Нормализация `title.trim()` позволяет отдельно обработать пустое содержимое успешного ответа.

</details>

## Условие

Исправьте `getArticleLabel(result: ArticleResult): string`. Функция должна безопасно сузить union по `ok`, вернуть заголовок статьи или понятное сообщение для пустого заголовка и API-ошибки.

### Входы

Один аргумент `result` типа `ArticleResult`:

- `{ ok: true, data: { title: string } }`;
- `{ ok: false, error: { code: string, message: string } }`.

### Выходы

- Непустой заголовок после `trim()` для успешного ответа.
- `Без названия`, если успешный заголовок пустой или состоит из пробелов.
- `Ошибка CODE: message` для ответа `{ ok: false }`.

### Ограничения и побочные эффекты

- Сначала сузьте `ArticleResult` по `ok`, затем обращайтесь к эксклюзивным полям ветви.
- Не используйте type assertion, мутацию, `catch`, I/O или `throw`.
- Ошибка API представлена ветвью `ok: false`; пустой заголовок — пустой результат успешной ветви.
- Побочные эффекты отсутствуют.

### Стартовый код

```ts
type ArticleResult =
  | { ok: true; data: { title: string } }
  | { ok: false; error: { code: string; message: string } };

function getArticleLabel(result: ArticleResult): string {
  if (result.ok) {
    return result.data.title;
  }

  return `Ошибка ${result.data.title}`;
  // Исправьте обращение к полям и обработайте пустой title.
}
```

### Примеры

#### Обычный сценарий

Вход: `{ ok: true, data: { title: 'Типы без догадок' } }`.

Результат: `Типы без догадок`.

#### Граничный сценарий

Вход: `{ ok: true, data: { title: '   ' } }`.

Результат: `Без названия`, поскольку после удаления пробелов заголовок пуст.

#### Ошибка или пустой результат

Вход: `{ ok: false, error: { code: 'NOT_FOUND', message: 'Статья не найдена' } }`.

Результат: `Ошибка NOT_FOUND: Статья не найдена`. В этой ветви доступ к `data` должен быть ошибкой компиляции.

## Критерии готовности

- Успешный непустой ответ возвращает очищенный заголовок.
- Пустой заголовок даёт `Без названия`.
- Ошибочный ответ использует только `error.code` и `error.message`.
- Решение не содержит assertion, мутации, `catch`, I/O или исключений.

<details>
<summary>Подсказка 1</summary>

В ветви после `if (result.ok)` тип `result` уже другой. Посмотрите, какое поле существует, когда `ok` равно `false`.

</details>

<details>
<summary>Решение</summary>

### Подход

Проверка `ok` разделяет union на успех и ошибку. В успешной ветви очищаем строку и отдельно возвращаем маркер пустого результата. В ошибочной ветви доступно только описание ошибки.

```ts
type ArticleResult =
  | { ok: true; data: { title: string } }
  | { ok: false; error: { code: string; message: string } };

function getArticleLabel(result: ArticleResult): string {
  if (result.ok) {
    const title = result.data.title.trim();

    return title === '' ? 'Без названия' : title;
  }

  return `Ошибка ${result.error.code}: ${result.error.message}`;
}

const success = getArticleLabel({
  ok: true,
  data: { title: 'Типы без догадок' },
});
const empty = getArticleLabel({ ok: true, data: { title: '   ' } });
const error = getArticleLabel({
  ok: false,
  error: { code: 'NOT_FOUND', message: 'Статья не найдена' },
});

// @ts-expect-error В ошибочной ветви поля data нет.
const invalidDataAccess = (result: Extract<ArticleResult, { ok: false }>) => result.data;
```

### Сложность

- Время: `O(n)`, где `n` — длина заголовка из-за `trim()`.
- Память: `O(1)` дополнительной памяти.

### Компромиссы и альтернативы

Проверка наличия произвольного свойства допустима для внешних данных, но здесь `ok` уже является явным и стабильным дискриминантом. Assertion мог бы скрыть ошибку обращения к `data` в неуспешном ответе; сужение union сохраняет проверку компилятора.

</details>

## Самопроверка

- Почему в ветви `ok: false` недоступно `data`?
- Чем пустой заголовок отличается от ошибки API?
- Зачем нормализовать заголовок через `trim()` до проверки на пустоту?
