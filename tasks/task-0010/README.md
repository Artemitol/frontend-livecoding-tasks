# Ошибки асинхронного хука

Песочница для выполнения — [React TypeScript](https://vite.new/react-ts).

## Условие
```tsx
// Замените src/App.tsx: loading включается перед запросом и выключается в finally после любого исхода.
// При успехе hook уведомляет и возвращает результат, после чего caller добавляет второе success-уведомление.
// При ошибке hook уведомляет и повторно выбрасывает ту же причину, чтобы caller добавил второе error-уведомление.
// Используйте React 19.2 и локальный simulateRequest без сети; пока loading=true обе кнопки отключены.

import { useCallback, useState } from 'react';

type Notify = (message: string) => void;

function simulateRequest(shouldFail: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Тестовая ошибка'));
      } else {
        resolve('готово');
      }
    }, 350);
  });
}

function useRequest(notify: Notify) {
  const [loading] = useState(false);

  const execute = useCallback(async (
    shouldFail: boolean,
  ): Promise<string> => {
    try {
      const result = await simulateRequest(shouldFail);
      notify(`Hook: успех — ${result}`);
      return result;
    } catch {
      notify('Hook: ошибка');
      return 'ошибка скрыта';
    }
  }, [notify]);

  return { execute, loading };
}

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const notify = useCallback((message: string): void => {
    setMessages((current) => [...current, message]);
  }, []);
  const { execute, loading } = useRequest(notify);

  const run = async (shouldFail: boolean): Promise<void> => {
    setMessages([]);

    try {
      const result = await execute(shouldFail);
      notify(`Component: успех — ${result}`);
    } catch {
      notify('Component: ошибка');
    }
  };

  return (
    <main>
      <button
        type="button"
        disabled={loading}
        onClick={() => void run(false)}
      >
        Успешный запрос
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => void run(true)}
      >
        Запрос с ошибкой
      </button>

      {loading && <p>Загрузка…</p>}
      <ul>
        {messages.map((message, index) => (
          <li key={`${index}-${message}`}>{message}</li>
        ))}
      </ul>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сейчас catch превращает отклонённый Promise в успешный, а `loading` вообще не связан с временем жизни операции.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Установите `loading` перед `try`, а сброс поместите в `finally`, который выполняется и после `return`, и после `throw`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `catch (reason: unknown)` сначала вызовите error-уведомление hook, затем выполните `throw reason`; caller уже содержит второй catch.

</details>

<details>
<summary>Решение</summary>

```tsx
function useRequest(notify: Notify) {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (
    shouldFail: boolean,
  ): Promise<string> => {
    setLoading(true);

    try {
      const result = await simulateRequest(shouldFail);
      notify(`Hook: успех — ${result}`);
      return result;
    } catch (reason: unknown) {
      notify('Hook: ошибка');
      throw reason;
    } finally {
      setLoading(false);
    }
  }, [notify]);

  return { execute, loading };
}
```

`finally` закрывает pending-состояние независимо от результата. Повторный `throw` сохраняет отклонение, поэтому hook и вызывающий компонент обрабатывают одну операцию на своих границах.

Ожидаемый результат: успешная кнопка даёт два success-сообщения, ошибочная — два error-сообщения, а после каждого завершения `loading` исчезает.

Ручная проверка: по очереди запустите оба сценария, во время задержки проверьте disabled кнопок и загрузку, затем посчитайте ровно два сообщения нужного типа.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React и TypeScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Средняя
- Примерное время: 30 минут

</details>
