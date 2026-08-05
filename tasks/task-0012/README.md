# task-0012 — Динамическая коллекция валидных полей

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: начальная коллекция содержит два управляемых поля со значениями vue и angular.
// «Добавить поле» дописывает пустое поле, «Очистить список» удаляет все поля, изменение одного input не затрагивает остальные.
// «Сохранить» доступно только для непустой коллекции, в которой каждое значение в точности равно react.
// После сохранения покажите текущие значения; используйте React 19.2 и не удаляйте начальную коллекцию.

import { useState } from 'react';

const INITIAL_VALUES = ['vue', 'angular'];
const REQUIRED_VALUE = 'react';

export default function App() {
  const [values] = useState(INITIAL_VALUES);

  return (
    <main>
      {values.map((value, index) => (
        <label key={index}>
          Поле {index + 1}
          <input defaultValue={value} />
        </label>
      ))}

      <button type="button">
        Добавить поле
      </button>
      <button type="button">
        Очистить список
      </button>
      <button type="button" disabled>
        Сохранить
      </button>
      <output>Ещё не сохранено</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Все input должны получать `value` из одного массива состояния, но обновлять только элемент со своим индексом.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Инициализируйте изменяемое состояние копией `INITIAL_VALUES` и напишите функцию `updateValue(index, value)`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для доступности сохранения объедините `values.length > 0` и `values.every((value) => value === REQUIRED_VALUE)`.

</details>

<details>
<summary>Решение</summary>

```tsx
export default function App() {
  const [values, setValues] = useState<string[]>([
    ...INITIAL_VALUES,
  ]);
  const [savedValues, setSavedValues] = useState<string[]>([]);

  const updateValue = (index: number, value: string): void => {
    setValues((current) => current.map((item, itemIndex) => (
      itemIndex === index ? value : item
    )));
  };

  const canSave = values.length > 0 && values.every(
    (value) => value === REQUIRED_VALUE,
  );

  return (
    <main>
      {values.map((value, index) => (
        <label key={index}>
          Поле {index + 1}
          <input
            value={value}
            onChange={(event) => {
              updateValue(index, event.target.value);
            }}
          />
        </label>
      ))}

      <button
        type="button"
        onClick={() => setValues((current) => [...current, ''])}
      >
        Добавить поле
      </button>
      <button type="button" onClick={() => setValues([])}>
        Очистить список
      </button>
      <button
        type="button"
        disabled={!canSave}
        onClick={() => setSavedValues([...values])}
      >
        Сохранить
      </button>
      <output>
        {savedValues.length > 0
          ? `Сохранено: ${savedValues.join(', ')}`
          : 'Ещё не сохранено'}
      </output>
    </main>
  );
}
```

Массив остаётся единственным источником значений, поэтому добавленные и начальные поля участвуют в одной проверке.

Ожидаемый результат: стартовые `vue` и `angular` сохранены в управляемом состоянии; кнопка активируется только после замены всех значений на `react`, включая добавленные поля.

Ручная проверка: замените только `vue` на `react` и убедитесь, что `angular` осталось без изменений, а сохранение недоступно; затем исправьте `angular` на `react` и проверьте `Сохранено: react, react`. После этого очистите список и убедитесь, что сохранение снова недоступно; добавьте три поля, по очереди введите в них `react` и проверьте строку `Сохранено: react, react, react`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Композиция компонентов и управление состоянием
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
