# task-0011 — Управление модальным окном через render props

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: ModalController всегда рендерит результат функции children и передаёт ей действие open.
// Каждый из двух экземпляров независимо открывает своё содержимое; кнопка закрытия скрывает только его окно.
// При закрытии вызовите соответствующий onRequestClose и покажите актуальный статус под триггерами.
// Используйте React 19.2; решение работает локально без сторонних библиотек и сетевых запросов.

import { type ReactNode, useState } from 'react';

type ModalControllerProps = {
  content: ReactNode;
  children: (controls: { open: () => void }) => ReactNode;
  onRequestClose: () => void;
};

function ModalController({
  content,
  children,
  onRequestClose,
}: ModalControllerProps) {
  const [open] = useState(false);

  return null;
}

export default function App() {
  const [status, setStatus] = useState('Ничего не закрыто');

  return (
    <main>
      <ModalController
        content={<p>Настройки профиля</p>}
        onRequestClose={() => setStatus('Закрыт профиль')}
      >
        {({ open }) => (
          <button type="button" onClick={open}>
            Открыть профиль
          </button>
        )}
      </ModalController>

      <ModalController
        content={<p>Справка по редактору</p>}
        onRequestClose={() => setStatus('Закрыта справка')}
      >
        {({ open }) => (
          <a
            href="#help"
            onClick={(event) => {
              event.preventDefault();
              open();
            }}
          >
            Открыть справку
          </a>
        )}
      </ModalController>

      <output>{status}</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Компонент управляет состоянием окна, но способ показать триггер оставляет вызывающему коду через функцию `children`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Верните fragment с результатом `children({ open: ... })`, а рядом условно отрисуйте dialog для открытого состояния.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Действие `open` устанавливает `true`; отдельный `close` сначала устанавливает `false`, затем вызывает `onRequestClose`.

</details>

<details>
<summary>Решение</summary>

```tsx
function ModalController({
  content,
  children,
  onRequestClose,
}: ModalControllerProps) {
  const [open, setOpen] = useState(false);

  const close = (): void => {
    setOpen(false);
    onRequestClose();
  };

  return (
    <>
      {children({ open: () => setOpen(true) })}
      {open && (
        <section role="dialog" aria-modal="true">
          {content}
          <button type="button" onClick={close}>
            Закрыть
          </button>
        </section>
      )}
    </>
  );
}
```

Каждый `ModalController` хранит собственное состояние, а функция-ребёнок получает только разрешённое действие открытия.

Ожидаемый результат: кнопка и ссылка видны одновременно, открывают разное содержимое, а закрытие меняет статус на строку соответствующего экземпляра.

Ручная проверка: откройте одновременно профиль и справку, закройте профиль и убедитесь, что справка остаётся открытой, а статус равен `Закрыт профиль`; затем закройте справку и проверьте статус `Закрыта справка`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React → Композиция компонентов и управление состоянием
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
