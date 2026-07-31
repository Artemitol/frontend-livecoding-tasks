# Загрузка скрипта через Promise

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```javascript
// Исправьте loadScript(scriptData, selector): после готовности DOM найдите target, добавьте в него один script с единственным полем src и верните Promise.
// Успешная загрузка вызывает onSuccess ровно один раз и resolve(src); ошибка загрузки или отсутствующий target вызывает onError ровно один раз и reject(src), даже при повторном событии.
// Функция должна работать и при уже готовом DOM; локальные сценарии ниже дают resolved data:text/javascript,void 0, rejected local-test://failure, rejected data:text/javascript,missing и счётчики success: 1, error: 2.

function loadScript(scriptData, selector) {
  const script = document.createElement('script');
  script.script = scriptData.src;
  document.querySelector(selector).appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => resolve();
  });
}

document.body.innerHTML = '<div id="root"></div>';

async function runChecks() {
  let successCalls = 0;
  let errorCalls = 0;

  const successPromise = loadScript({
    src: 'data:text/javascript,void 0',
    onSuccess: () => {
      successCalls += 1;
    },
    onError: () => {
      errorCalls += 1;
    },
  }, '#root');

  setTimeout(() => {
    const script = document.querySelector('#root script:last-child');
    script?.dispatchEvent(new Event('load'));
    script?.dispatchEvent(new Event('load'));
  }, 0);

  console.log('resolved', await successPromise);

  const errorPromise = loadScript({
    src: 'local-test://failure',
    onSuccess: () => {
      successCalls += 1;
    },
    onError: () => {
      errorCalls += 1;
    },
  }, '#root');

  setTimeout(() => {
    const script = document.querySelector('#root script:last-child');
    script?.dispatchEvent(new Event('error'));
    script?.dispatchEvent(new Event('error'));
  }, 0);

  try {
    await errorPromise;
  } catch (src) {
    console.log('rejected', src);
  }

  try {
    await loadScript({
      src: 'data:text/javascript,missing',
      onSuccess: () => {
        successCalls += 1;
      },
      onError: () => {
        errorCalls += 1;
      },
    }, '#missing');
  } catch (src) {
    console.log('rejected', src);
  }

  console.log('success:', successCalls, 'error:', errorCalls);
}

runChecks();
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Поместите поиск target и создание script внутрь функции, которая запускается сразу для готового DOM или по `DOMContentLoaded`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Используйте один флаг `settled`, чтобы повторные `load` или `error` не вызывали callbacks второй раз.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Для успеха вызывайте `onSuccess()` и `resolve(src)`, а для обоих видов ошибки — `onError()` и `reject(src)` через общую функцию.

</details>

<details>
<summary>Решение</summary>

```javascript
function loadScript(scriptData, selector) {
  const {
    src,
    onSuccess,
    onError,
  } = scriptData;

  return new Promise((resolve, reject) => {
    let settled = false;

    const succeed = () => {
      if (settled) {
        return;
      }

      settled = true;
      onSuccess();
      resolve(src);
    };

    const fail = () => {
      if (settled) {
        return;
      }

      settled = true;
      onError();
      reject(src);
    };

    const appendScript = () => {
      const target = document.querySelector(selector);

      if (!target) {
        fail();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.addEventListener('load', succeed);
      script.addEventListener('error', fail);
      target.appendChild(script);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', appendScript, {
        once: true,
      });
    } else {
      appendScript();
    }
  });
}
```

Обе ветви DOM readiness используют один путь создания элемента, а функции завершения защищены общим флагом. Поэтому Promise и соответствующий callback получают одно согласованное завершение.

Ожидаемый результат: строки `resolved data:text/javascript,void 0`, `rejected local-test://failure`, `rejected data:text/javascript,missing` и `success: 1 error: 2`.

Ручная проверка: вставьте решение и сравните четыре строки; затем замените существующий `#root` на отсутствующий селектор и убедитесь, что script не добавляется, а счётчик ошибок увеличивается только на один.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
