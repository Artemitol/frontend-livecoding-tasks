# Идемпотентный cleanup в корневом StrictMode

[← Все подборки](../../README.md)

Откройте [Vite React TypeScript в StackBlitz](https://vite.new/react-ts), дождитесь запуска проекта и полностью замените `src/App.tsx` кодом ниже. Сценарий рассчитан на React 19.2 в development mode и браузер Google Chrome 150.0.7871.101. Оставьте стандартный `src/main.tsx`: он оборачивает `<App />` в корневой `<StrictMode>`, который нужен для наблюдаемого development replay. Другие файлы менять не нужно; трасса работает локально без сети и таймеров.

## Условие

```tsx
// Учебная цель: объяснить development replay эффекта в корневом
// StrictMode и сделать cleanup одного ресурса идемпотентным.
// Перед началом нужны useEffect и cleanup.
//
// Сначала предскажите чистую начальную трассу и счётчики.
// Затем исправьте release так, чтобы повторный вызов для того же
// resourceId записывал skip и не увеличивал releaseCount.
// Не удаляйте StrictMode из стандартного src/main.tsx.
// После исправления кнопка должна добавить cleanup:2 → skip:2,
// а releaseCount должен остаться равным 2.

import { useEffect, useRef, useState } from 'react';

const events: string[] = [];
let setupCount = 0;
let releaseCount = 0;
let skippedReleaseCount = 0;

const record = (event: string): void => {
  events.push(event);
  console.log(`[strictmode] ${event}`);
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

## Готово, когда

- На чистом development-запуске корневой StrictMode даёт трассу `setup:1 → cleanup:1 → setup:2` и значения `Setup: 2`, `Реальных cleanup: 1`, `Пропущенных повторов: 0`.
- Один клик по «Вызвать release дважды» добавляет `cleanup:2 → skip:2`; значения становятся `Setup: 2`, `Реальных cleanup: 2`, `Пропущенных повторов: 1`.
- Консоль содержит `[strictmode] setup:1`, `cleanup:1`, `setup:2`, `cleanup:2`, `skip:2` в том же причинном порядке.
- `disposed` принадлежит одной установке effect; StrictMode, cleanup, локальная трасса и controlled double-release сохранены.

Застряли? Открывайте подсказки по одной. После каждой закройте подсказку и попробуйте решить задачу снова. Третья подсказка почти подводит к решению, но не показывает готовый код.

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Корневой StrictMode в development намеренно выполняет `setup → cleanup → setup`. Это проверка симметрии effect, а не production-жизненный цикл.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Идемпотентность нужна для каждого acquired resource отдельно. Храните флаг внутри замыкания `release`, созданного конкретным запуском effect.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Перед `releaseCount += 1` проверьте локальный `disposed`. Первый вызов меняет его на `true`, а следующий увеличивает `skippedReleaseCount` и записывает `skip:<id>`.

</details>

<details>
<summary>Решение</summary>

```tsx
import { useEffect, useRef, useState } from 'react';

const events: string[] = [];
let setupCount = 0;
let releaseCount = 0;
let skippedReleaseCount = 0;

const record = (event: string): void => {
  events.push(event);
  console.log(`[strictmode] ${event}`);
};

export default function App() {
  const [, forceRender] = useState(0);
  const releaseCurrentRef = useRef<(() => void) | null>(null);

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

### Почему это работает

Каждый запуск effect создаёт собственный `resourceId` и `disposed`. В development корневой StrictMode сразу проверяет первый ресурс последовательностью setup/cleanup и создаёт второй. Первый вызов `release` второго ресурса освобождает его, а повторный видит локальный `disposed` и только фиксирует `skip`. В production дополнительный replay не гарантирован, поэтому корректность опирается на симметричный и идемпотентный cleanup, а не на саму проверку.

</details>

<details>
<summary>Самопроверка</summary>

- Какая часть начальной трассы относится к первому ресурсу, а какая — ко второму?
- Почему общий `disposed` вне effect смешал бы жизненные циклы разных ресурсов?
- Почему development replay полезен, но не должен быть частью production-контракта?

</details>

<details>
<summary>О задаче</summary>

- Технология: React/TypeScript
- Подборка: React: эффекты и жизненный цикл
- Формат: Разобрать код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>

Нажмите «Назад», чтобы вернуться в выбранную подборку. [Потерялись? Открыть все подборки](../../README.md).
