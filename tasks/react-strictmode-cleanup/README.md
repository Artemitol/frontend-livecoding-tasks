# Идемпотентный cleanup в корневом StrictMode

Откройте [React TypeScript](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Предполагается React 19.2 в development mode; оставьте стандартный корневой `StrictMode`, который выполняет дополнительный цикл effect. Сеть и таймеры не нужны.

## Условие

Сделайте `release` идемпотентным для ресурса конкретного запуска effect. Начальный development replay должен дать `setup:1 → cleanup:1 → setup:2`. После одного клика по «Вызвать release дважды» трасса должна дополниться `cleanup:2 → skip:2`: `releaseCount` увеличивается только первым вызовом, а повтор увеличивает `skippedReleaseCount`. Не выносите флаг освобождения за пределы конкретного effect и не отключайте `StrictMode`.

```tsx
import { useEffect, useRef, useState } from 'react';

const events: string[] = [];
let setupCount = 0;
let releaseCount = 0;
let skippedReleaseCount = 0;

const record = (event: string): void => {
  events.push(event);
};

export default function App() {
  const [, forceRender] = useState(0);
  const releaseCurrentRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const resourceId = ++setupCount;
    record(`setup:${resourceId}`);
    forceRender((revision) => revision + 1);

    const release = (): void => {
      releaseCount += 1;
      record(`cleanup:${resourceId}`);
      forceRender((revision) => revision + 1);
    };

    releaseCurrentRef.current = release;
    return release;
  }, []);

  const releaseTwice = (): void => {
    releaseCurrentRef.current?.();
    releaseCurrentRef.current?.();
  };

  return (
    <main>
      <h1>Трасса StrictMode</h1>
      <button type="button" onClick={releaseTwice}>
        Вызвать release дважды
      </button>
      <p>Setup: {setupCount}</p>
      <p>Реальных cleanup: {releaseCount}</p>
      <p>Пропущенных повторов: {skippedReleaseCount}</p>
      <output aria-live="polite">{events.join(' → ')}</output>
    </main>
  );
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Корневой `StrictMode` в development проверяет симметрию effect через `setup → cleanup → setup`; второй cleanup того же ресурса должен быть безопасным.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте флаг `disposed` рядом с `resourceId`, чтобы один запуск effect не делил состояние освобождения с другим.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Первый `release` меняет `disposed` на `true`; следующий записывает `skip:<id>` и выходит до увеличения `releaseCount`.

</details>

<details>
<summary>Решение</summary>

```tsx
useEffect(() => {
  const resourceId = ++setupCount;
  let disposed = false;

  record(`setup:${resourceId}`);
  forceRender((revision) => revision + 1);

  const release = (): void => {
    if (disposed) {
      skippedReleaseCount += 1;
      record(`skip:${resourceId}`);
      forceRender((revision) => revision + 1);
      return;
    }

    disposed = true;
    releaseCount += 1;
    record(`cleanup:${resourceId}`);
    forceRender((revision) => revision + 1);
  };

  releaseCurrentRef.current = release;
  return release;
}, []);
```

Каждый запуск effect получает собственный `disposed`, поэтому повторное освобождение одного ресурса не влияет на следующий. Для ручной проверки сверьте начальную трассу и один раз нажмите кнопку: итоговые счётчики должны быть `Setup: 2`, `Реальных cleanup: 2`, `Пропущенных повторов: 1`.

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: эффекты и жизненный цикл
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
