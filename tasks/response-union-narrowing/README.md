# Безопасная обработка результата запроса

Откройте [TypeScript Playground](https://www.typescriptlang.org/play/), выберите TypeScript 5.9, включите `strict` в **TS Config** и полностью замените код блоком ниже. Сначала проверьте diagnostics с `noEmit`, затем выключите `noEmit` и нажмите **Run**. Понадобятся union-типы и условные ветви.

## Условие

Исправьте `getArticleLabel(result)`, безопасно сузив `ArticleResult` по `result.ok`. Для успешного ответа верните `title` после `trim()` или `Без названия`, если строка пустая; для ошибки верните `Ошибка CODE: message`. Не используйте type assertion, мутацию, `throw` или I/O внутри функции.

```typescript
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

console.log(JSON.stringify(labels));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Поле `ok` — дискриминант: после успешной проверки доступно `data`, а в противоположной ветви остаётся только `error`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В успешной ветви сохраните `result.data.title.trim()` в локальную переменную и отдельно проверьте, стала ли строка пустой.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Верните очищенный заголовок или маркер пустого результата из первой ветви, а после неё соберите строку из `result.error.code` и `result.error.message`.

</details>

<details>
<summary>Решение</summary>

```typescript
function getArticleLabel(result: ArticleResult): string {
  if (result.ok) {
    const title = result.data.title.trim();

    return title === '' ? 'Без названия' : title;
  }

  return `Ошибка ${result.error.code}: ${result.error.message}`;
}
```

Литеральное поле `ok` сужает union до ветви с подходящими данными, а `trim()` отделяет пустой успешный заголовок от ошибки запроса. Playground не должен показывать ошибок, а после **Run** ожидается `["Типы без догадок","Без названия","Ошибка NOT_FOUND: Статья не найдена"]`. Для ручной проверки попробуйте обратиться к `result.data` в ошибочной ветви: TypeScript должен это отклонить.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: Сужение и проверка данных
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 20 минут

</details>
