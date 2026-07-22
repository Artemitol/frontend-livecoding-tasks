# Идемпотентный cleanup в корневом StrictMode

**Учебная цель:** Объяснять повторную установку эффекта в StrictMode и проектировать идемпотентный cleanup.

| Метаданные | Значение |
| --- | --- |
| Технологии | TypeScript, React |
| Тема | Эффекты React |
| Формат | Разбор |
| Уровень | Продвинутый |
| Время | 30 минут |
| Навыки | StrictMode, жизненный цикл effect, идемпотентный cleanup, причинная трассировка |
| Предварительные знания | useEffect и cleanup |
| Среда выполнения | React 19.2, TypeScript 5.9, Google Chrome 150.0.7871.101, development mode, StrictMode |

<details>
<summary>Теория</summary>

В development root `StrictMode` намеренно делает дополнительный цикл setup/cleanup/setup для effect, чтобы обнаружить несимметричную работу с внешними ресурсами. Cleanup должен быть безопасен, если тот же ресурс пытаются освободить повторно: первый вызов освобождает, последующие ничего не делают.

</details>

## Условие

Разберите стартовый код и исправьте cleanup. Опишите начальную трассу при корневом `StrictMode`, затем выполните controlled probe, который вызывает release текущего ресурса дважды. После этого объясните, почему второй вызов не должен увеличить число реальных освобождений.

### Входы

- Initial mount внутри корневого `<StrictMode>`.
- Локальный ресурс с идентификатором.
- Нажатие controlled button, дважды вызывающее release текущего ресурса.

### Выходы

- Начальная трасса начинается с `setup:1 → cleanup:1 → setup:2`.
- До probe: setup count `2`, release count `1`.
- После probe: добавлены `cleanup:2 → skip:2`, release count `2`, skipped-release count `1`.

### Ограничения и побочные эффекты

- StrictMode расположен на React root, не только вокруг вложенного leaf.
- Каждый acquired resource освобождается реально не больше одного раза.
- Локальный trace — единственный допустимый side effect; сети и таймеров нет.
- Нельзя удалять StrictMode или скрывать cleanup.

### Локальный fixture

```tsx
const events: string[] = [];
let setupCount = 0;
let releaseCount = 0;
let skippedReleaseCount = 0;
```

### Стартовый код

```tsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function Probe() {
  useEffect(() => {
    const resourceId = ++setupCount;
    events.push(`setup:${resourceId}`);
    return () => {
      releaseCount += 1;
      events.push(`cleanup:${resourceId}`);
    };
  }, []);

  return null;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Probe /></StrictMode>);
```

### Примеры

#### Обычный сценарий

После загрузки development fixture видна начальная последовательность `setup:1 → cleanup:1 → setup:2`.

#### Граничный сценарий

Контролируемый double-release текущего ресурса добавляет один `cleanup:2` и один `skip:2`.

#### Ошибка или пустой результат

Неправильный cleanup добавляет два `cleanup:2`, увеличивая число реальных освобождений до `3` для двух acquired ресурсов.

## Критерии готовности

- В корне используется `<StrictMode><App /></StrictMode>`.
- Трасса setup/cleanup/setup объяснена как development проверка симметрии effect.
- Повторное освобождение одного resource id не увеличивает release count.
- Результаты probe отображают стабильные setup, release и skipped-release counts.

<details>
<summary>Подсказка 1</summary>

Сохраните `disposed` в замыкании конкретной установки effect, а не в общем флаге для всех ресурсов.

</details>

<details>
<summary>Решение</summary>

### Подход

Каждая установка effect создаёт собственный `disposed`. Первый `release` конкретного ресурса меняет его на `true`; последующие вызовы фиксируются как `skip` и не освобождают ресурс второй раз. Корневой StrictMode даёт наблюдаемую начальную трассу.

```tsx
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const events: string[] = [];
let setupCount = 0;
let releaseCount = 0;
let skippedReleaseCount = 0;

function Probe() {
  const [, setRevision] = useState(0);
  const releaseCurrentRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const resourceId = ++setupCount;
    let disposed = false;
    events.push(`setup:${resourceId}`);
    setRevision((value) => value + 1);
    const release = (): void => {
      if (disposed) {
        skippedReleaseCount += 1;
        events.push(`skip:${resourceId}`);
        setRevision((value) => value + 1);
        return;
      }
      disposed = true;
      releaseCount += 1;
      events.push(`cleanup:${resourceId}`);
      setRevision((value) => value + 1);
    };
    releaseCurrentRef.current = release;
    return release;
  }, []);

  const releaseTwice = (): void => {
    releaseCurrentRef.current?.();
    releaseCurrentRef.current?.();
  };

  return <><button onClick={releaseTwice}>Повторить release дважды</button><output>{events.join(' → ')}</output></>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Probe /></StrictMode>);
```

### Сложность

- Время: `O(1)` на setup, cleanup и probe-вызов.
- Память: `O(1)` для одного активного ресурса, без учёта trace.

### Компромиссы и альтернативы

В production дополнительный replay не является договором, поэтому корректность не должна зависеть от него. Для внешнего API, где `close` уже идемпотентен, guard всё равно документирует инвариант; для нескольких ресурсов полезен отдельный объект-адаптер с собственным lifecycle.

</details>

## Самопроверка

- Почему StrictMode должен быть у React root для этой проверки?
- Какая часть трассы относится к первому ресурсу, а какая — ко второму?
- Почему общий `disposed` вне effect был бы ошибкой?
