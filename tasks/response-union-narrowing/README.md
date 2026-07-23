# Безопасная обработка результата запроса

[← Все подборки](../../README.md)

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала исправьте diagnostic как в исходном режиме `noEmit`, затем оставьте `noEmit` выключенным, обработайте пустой заголовок и нажмите **Run**.

## Условие

```ts
// Учебная цель: исправлять небезопасное сужение union-типа
// при обработке успешного и ошибочного ответа.
// Перед началом нужны union-типы и условные ветви.
//
// Исправьте getArticleLabel(result).
// Сначала сузьте ArticleResult по result.ok.
// Для успеха верните title после trim() или «Без названия».
// Для ошибки верните «Ошибка CODE: message».
// Не используйте type assertion, mutation, throw или I/O внутри функции.

type ArticleResult =
  | { ok: true; data: { title: string } }
  | { ok: false; error: { code: string; message: string } };

function getArticleLabel(result: ArticleResult): string {
  if (result.ok) {
    return result.data.title;
  }

  return `Ошибка ${result.data.title}`;
}

const labels = [
  getArticleLabel({
    ok: true,
    data: { title: '  Типы без догадок  ' },
  }),
  getArticleLabel({
    ok: true,
    data: { title: '   ' },
  }),
  getArticleLabel({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Статья не найдена',
    },
  }),
];

const expectedLabels = [
  'Типы без догадок',
  'Без названия',
  'Ошибка NOT_FOUND: Статья не найдена',
];
const runtimePass =
  JSON.stringify(labels) === JSON.stringify(expectedLabels);

console.log({ labels, runtimePass });
```

## Готово, когда

- TypeScript Playground 5.9 с `strict` не позволяет читать `data` в ветви `ok: false`, а исправленное решение не имеет неожиданных diagnostics.
- После **Run** `labels` точно содержит очищенный заголовок, `Без названия` и `Ошибка NOT_FOUND: Статья не найдена`.
- `runtimePass` равен `true`: пустой успешный заголовок не смешан с ошибочным ответом.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Поле `ok` — дискриминант. После `if (result.ok)` TypeScript знает о `data`, а в противоположной ветви оставляет только `error`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В успешной ветви сохраните `result.data.title.trim()` в локальную переменную и отдельно проверьте, стала ли строка пустой.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните очищенный заголовок или маркер пустого результата из первой ветви. После неё формируйте сообщение только из `result.error.code` и `result.error.message`.

</details>

<details>
<summary>Решение</summary>

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

const labels = [
  getArticleLabel({
    ok: true,
    data: { title: '  Типы без догадок  ' },
  }),
  getArticleLabel({
    ok: true,
    data: { title: '   ' },
  }),
  getArticleLabel({
    ok: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Статья не найдена',
    },
  }),
];

const expectedLabels = [
  'Типы без догадок',
  'Без названия',
  'Ошибка NOT_FOUND: Статья не найдена',
];
const runtimePass =
  JSON.stringify(labels) === JSON.stringify(expectedLabels);

const invalidErrorResult: Extract<ArticleResult, { ok: false }> = {
  ok: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Статья не найдена',
  },
};

// @ts-expect-error В ошибочной ветви поля data нет.
invalidErrorResult.data;

console.log({ labels, runtimePass });
```

### Почему это работает

Литеральное поле `ok` безопасно сужает union до одной ветви до обращения к её эксклюзивным полям. `trim()` отделяет пустое содержимое успешного ответа от API-ошибки, а отрицательная проверка фиксирует запрет на `data` в ошибочной ветви.

</details>

<details>
<summary>Самопроверка</summary>

- Почему `data` недоступно после того, как `result.ok` сузился до `false`?
- Чем пустой заголовок успешного ответа отличается от API-ошибки?
- Как изменится модель, если у ошибки появится ещё один обязательный вариант данных?

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Сужение и проверка данных
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
