# Модальное окно с актуальными обработчиками

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: открытое окно ставит текущий title и блокирует прокрутку body.
// Закрытие и размонтирование возвращают прежние title и overflow; закрытое окно не держит глобальные обработчики.
// Escape, клик по фону и кнопка закрытия вызывают актуальный onClose; клик внутри dialog не закрывает окно.
// Используйте React 19.2 в браузере; добавленный keydown-обработчик снимайте в cleanup.

import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function Modal({
  open,
  title,
  onClose,
  children,
}: ModalProps) {
  const close = useCallback(() => {
    onClose();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.title = title;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div role="presentation" onClick={close}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button type="button" onClick={close}>
          Закрыть
        </button>
      </section>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Настройки');
  const [lastClose, setLastClose] = useState('Окно ещё не закрывали');

  const handleClose = (): void => {
    setOpen(false);
    setLastClose(`Закрыто: ${title}`);
  };

  return (
    <main>
      <button type="button" onClick={() => setOpen(true)}>
        Открыть окно
      </button>
      <p>{lastClose}</p>

      <Modal open={open} title={title} onClose={handleClose}>
        <button
          type="button"
          onClick={() => setTitle('Актуальные настройки')}
        >
          Сменить заголовок
        </button>
      </Modal>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Отделите синхронизацию `document` и `window` от проверки границы клика: это две разные причины закрыть или обновить окно.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

В effect сохраните прежние `document.title` и `body.style.overflow`, выполняйте настройку только при `open === true` и возвращайте cleanup.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Передайте effect зависимости `[open, title, onClose]`, а для фона вызывайте `onClose` только когда `event.target === event.currentTarget`.

</details>

<details>
<summary>Решение</summary>

```tsx
import {
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

function Modal({
  open,
  title,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousTitle = document.title;
    const previousOverflow = document.body.style.overflow;

    document.title = title;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.title = previousTitle;
      document.body.style.overflow = previousOverflow;
    };
  }, [open, title, onClose]);

  const handleOverlayClick: MouseEventHandler = (event): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div role="presentation" onClick={handleOverlayClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button type="button" onClick={onClose}>
          Закрыть
        </button>
      </section>
    </div>
  );
}
```

Effect теперь следует за открытым состоянием и текущими props, а cleanup возвращает внешние ресурсы в исходное состояние. Проверка `target` оставляет клики внутри dialog локальными.

Ожидаемый результат: заголовок и scroll lock действуют только у открытого окна, а любое разрешённое закрытие использует последний `title` и `onClose`.

Ручная проверка: для Escape, фона и кнопки по очереди откройте окно, смените заголовок и проверьте `Закрыто: Актуальные настройки`; отдельно убедитесь, что клик внутри dialog не закрывает окно, а title и прокрутка восстанавливаются.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
