# task-0007 — Оптимизация дерева компонентов

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx и сохраните все элементы управления и видимый результат.
// Ввод заметки не рендерит дочерние компоненты; online меняет только UserCard, а theme — только ThemePreview.
// SaveButton остаётся стабильным при любых обновлениях, но каждый клик увеличивает сохранения от актуального значения.
// Докажите результат существующими console.count; в React 19.2 dev StrictMode начальные вызовы могут удвоиться.

import { useState } from 'react';

type User = {
  name: string;
  online: boolean;
};

type Palette = {
  theme: 'light' | 'dark';
};

type UserCardProps = {
  user: User;
};

type ThemePreviewProps = {
  palette: Palette;
};

type SaveButtonProps = {
  onSave: () => void;
};

const UserCard = ({ user }: UserCardProps) => {
  console.count('UserCard render');

  return (
    <p>
      {user.name}: {user.online ? 'в сети' : 'не в сети'}
    </p>
  );
};

const ThemePreview = ({ palette }: ThemePreviewProps) => {
  console.count('ThemePreview render');

  return <p>Тема: {palette.theme}</p>;
};

const SaveButton = ({ onSave }: SaveButtonProps) => {
  console.count('SaveButton render');

  return (
    <button type="button" onClick={onSave}>
      Сохранить
    </button>
  );
};

export default function App() {
  const [note, setNote] = useState('');
  const [online, setOnline] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [saveCount, setSaveCount] = useState(0);

  const user = { name: 'Лена', online };
  const palette = { theme };
  const handleSave = (): void => {
    setSaveCount(saveCount + 1);
  };

  return (
    <main>
      <label>
        Заметка
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={online}
          onChange={(event) => setOnline(event.target.checked)}
        />
        Пользователь в сети
      </label>

      <label>
        Тема
        <select
          value={theme}
          onChange={(event) => {
            setTheme(event.target.value as 'light' | 'dark');
          }}
        >
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </label>

      <UserCard user={user} />
      <ThemePreview palette={palette} />
      <SaveButton onSave={handleSave} />
      <output>Сохранений: {saveCount}</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Даже одинаковые по содержимому object и function получают новую identity при каждом render `App`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Сначала оберните три дочерних компонента в `memo`, затем стабилизируйте каждый передаваемый object и callback.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для `user` и `palette` используйте `useMemo` с их единственной меняющейся частью, а `handleSave` сделайте `useCallback` с функциональным `setSaveCount`.

</details>

<details>
<summary>Решение</summary>

```tsx
import {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

const UserCard = memo(function UserCard({
  user,
}: UserCardProps) {
  console.count('UserCard render');

  return (
    <p>
      {user.name}: {user.online ? 'в сети' : 'не в сети'}
    </p>
  );
});

const ThemePreview = memo(function ThemePreview({
  palette,
}: ThemePreviewProps) {
  console.count('ThemePreview render');

  return <p>Тема: {palette.theme}</p>;
});

const SaveButton = memo(function SaveButton({
  onSave,
}: SaveButtonProps) {
  console.count('SaveButton render');

  return (
    <button type="button" onClick={onSave}>
      Сохранить
    </button>
  );
});

// Внутри App:
const user = useMemo(
  () => ({ name: 'Лена', online }),
  [online],
);
const palette = useMemo(() => ({ theme }), [theme]);
const handleSave = useCallback((): void => {
  setSaveCount((current) => current + 1);
}, []);
```

`memo` может пропустить render только при стабильных props. `useMemo` связывает identity объектов с их данными, а функциональное обновление освобождает callback от зависимости `saveCount`.

Ожидаемый результат: журнал показывает render только у компонента, чьи входные данные изменились; `SaveButton` не рендерится повторно, но счётчик сохранений растёт.

Ручная проверка: после начальных логов по очереди введите заметку, смените online, смените theme и дважды сохраните, сравнивая прирост каждого `console.count`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Рендеринг и мемоизация
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
