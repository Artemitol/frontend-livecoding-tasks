# Итеративный вывод дерева

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте formatTree: верните строки всех папок и файлов в порядке объявления, добавляя четыре пробела на каждый уровень.
// Не используйте рекурсивные вызовы; fixture синхронизирован с выводом, включая shoppong-list.pdf.
// Используйте консольный JavaScript без ESM и browser API.

function formatTree(root) {
  // Напишите решение.
}

const folders = {
  name: 'folder',
  children: [
    { name: 'file1.txt' },
    { name: 'file2.txt' },
    {
      name: 'images',
      children: [
        { name: 'image.png' },
        {
          name: 'vacation',
          children: [{ name: 'crocodile.png' }, { name: 'penguin.png' }],
        },
      ],
    },
    { name: 'shoppong-list.pdf' },
  ],
};

console.log(formatTree(folders));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

В элементе стека храните и текущий узел, и его уровень вложенности.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Добавляйте детей в стек в обратном порядке, чтобы при извлечении сохранился порядок из `children`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

После `pop()` добавьте `${'    '.repeat(depth)}${node.name}` в массив строк, а затем обработайте детей.

</details>

<details>
<summary>Решение</summary>

```javascript
function formatTree(root) {
  const lines = [];
  const stack = [{ node: root, depth: 0 }];

  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    lines.push(`${'    '.repeat(depth)}${node.name}`);

    for (let index = (node.children?.length ?? 0) - 1; index >= 0; index -= 1) {
      stack.push({ node: node.children[index], depth: depth + 1 });
    }
  }

  return lines.join('\n');
}
```

Стек заменяет рекурсивные вызовы, а обратное добавление детей сохраняет порядок объявления.

Ожидаемый результат: `folder`, затем `file1.txt`, `file2.txt`, вложенные `images` и `vacation`, а последней строкой `shoppong-list.pdf`.

Ручная проверка: добавьте в `vacation.children` ещё один файл и убедитесь, что его строка получает двенадцать начальных пробелов.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
