# Типизированная интеграция браузерного скрипта

Песочница для выполнения — [CodePen](https://pen.new).

## Условие
```typescript
// Исправьте интеграцию: loadScript создаёт один script с id FOO_SCRIPT_ID и локальным data-URL, ставит callback до append и для существующего элемента вызывает callback сразу.
// Типизируйте входные options и config; удаляйте дубли options по id с сохранением первого, отображая id/cardType/title в code/label/value/dataTest; маршруты details/coming/results/live заменяют hash на #events/#calendar/#results/#live.
// initScript ищет wrapper без #, применяет stickyTop 70 и themeName defaultTheme, сохраняет onLogin/onRegister и один раз вызывает init; фикстура синхронно вызывает load во время append и выводит обе полные option-маппинга, все четыре hash, оба callback-счётчика, два loader-callback, один script с точными id/src и один init.

type OptionInput = {
  readonly id: string;
  cardType: string;
  title: string;
};

type RendererOption = {
  code: string;
  label: string;
  value: string;
  dataTest: string;
};

type NavigationEvent = {
  pageName: 'details' | 'coming' | 'results' | 'live';
};

type RendererConfig = {
  lang: string;
  target: HTMLElement;
  themeName: string;
  stickyTop: number;
  onLogin: () => void;
  onRegister?: () => void;
  onNavigation: (event: NavigationEvent) => void;
  options: RendererOption[];
};

type RendererInstance = {
  init(config: RendererConfig): RendererConfig;
};

type RendererConstructor = new () => RendererInstance;

type InitScriptParams = {
  lang: string;
  stickyTop?: number | null;
  themeName?: string;
  optionsList: OptionInput[];
  onLogin: () => void;
  onRegister?: () => void;
};

const SCRIPT_ID = 'FOO_SCRIPT_ID';
const SCRIPT_URL = 'data:text/javascript,void 0';
const browserWindow = window as Window & {
  RendererFunc?: RendererConstructor;
};

function loadScript(callback: () => void): void {
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = 'FOO_SCRIPT ID';
    script.src = SCRIPT_URL;
    document.head.appendChild(script);
    script.onload = callback;
    return;
  }

  callback();
}

function prepareOptions(optionsList: OptionInput[]): RendererOption[] {
  const options: RendererOption[] = [];

  for (const item of optionsList) {
    if (options.some((option) => option.code === item.id)) {
      return options;
    }

    options.push({
      code: item.id,
      label: item.cardType,
      value: item.title,
      dataTest: item.id,
    });
  }

  return options;
}

function createNavigationHandler() {
  return (event: NavigationEvent): void => {
    const routes = {
      detasils: '#events',
      coming: '#calendar',
      results: '#results',
      live: '#live',
    };
    window.history.replaceState(null, '', routes[event.pageName] ?? '');
  };
}

function initScript(params: InitScriptParams): RendererConfig | null {
  const target = document.getElementById('#wrapper');
  const config = {
    lang: params.lang,
    target,
    stickyTop: params.stickyTop,
    themeName: params.themeName,
    onLogin: params.onLogin,
    options: prepareOptions(params.optionsList),
    onNavigation: createNavigationHandler(),
  };

  if (browserWindow.RendererFunc && target) {
    return new browserWindow.RendererFunc().init(config);
  }

  return null;
}

document.body.innerHTML = '<div id="wrapper"></div>';

const rendererCalls: RendererConfig[] = [];
class LocalRenderer implements RendererInstance {
  init(config: RendererConfig): RendererConfig {
    rendererCalls.push(config);
    return config;
  }
}
browserWindow.RendererFunc = LocalRenderer;

let loaderCalls = 0;
let callbackBeforeAppend = false;
const originalAppendChild = document.head.appendChild;
document.head.appendChild = function <T extends Node>(node: T): T {
  const appendedNode = originalAppendChild.call(document.head, node) as T;
  node.dispatchEvent(new Event('load'));
  callbackBeforeAppend = loaderCalls === 1;
  return appendedNode;
};
loadScript(() => {
  loaderCalls += 1;
});
document.head.appendChild = originalAppendChild;
loadScript(() => {
  loaderCalls += 1;
});
const loaderScripts = document.querySelectorAll(`#${SCRIPT_ID}`);

let registerCalls = 0;
let loginCalls = 0;
const config = initScript({
  lang: 'ru',
  stickyTop: null,
  themeName: '',
  optionsList: [
    { id: 'visa', cardType: 'debit', title: 'Visa' },
    { id: 'visa', cardType: 'credit', title: 'Duplicate' },
    { id: 'mir', cardType: 'debit', title: 'Mir' },
  ],
  onLogin: () => {
    loginCalls += 1;
  },
  onRegister: () => {
    registerCalls += 1;
  },
});

if (config) {
  config.onLogin();
  config.onRegister?.();
  const routeHashes = ([
    'details',
    'coming',
    'results',
    'live',
  ] as NavigationEvent['pageName'][]).map((pageName) => {
    config.onNavigation({ pageName });
    return location.hash;
  });

  console.log(JSON.stringify(config.options));
  console.log(config.stickyTop);
  console.log(config.themeName);
  console.log(routeHashes.join(','));
  console.log(
    'loader:',
    loaderCalls,
    'sync:',
    callbackBeforeAppend,
    'scripts:',
    loaderScripts.length,
    'src:',
    loaderScripts[0]?.getAttribute('src'),
  );
  console.log(rendererCalls.length);
  console.log('login:', loginCalls, 'register:', registerCalls);
}
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Сначала исправьте два строковых идентификатора: `script.id` должен совпасть с искомым ID, а `getElementById` принимает значение без `#`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Для options заведите `Set<string>` и используйте `continue` при повторном ID; конфигурацию объявите как `RendererConfig`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сделайте типизированный объект маршрутов, назначьте `onload` до вставки script и добавляйте `onRegister` в config только при его наличии.

</details>

<details>
<summary>Решение</summary>

```typescript
function loadScript(callback: () => void): void {
  if (document.getElementById(SCRIPT_ID)) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = SCRIPT_URL;
  script.addEventListener('load', callback, { once: true });
  document.head.appendChild(script);
}

function prepareOptions(optionsList: OptionInput[]): RendererOption[] {
  const seenIds = new Set<string>();
  const options: RendererOption[] = [];

  for (const item of optionsList) {
    if (seenIds.has(item.id)) {
      continue;
    }

    seenIds.add(item.id);
    options.push({
      code: item.id,
      label: item.cardType,
      value: item.title,
      dataTest: item.id,
    });
  }

  return options;
}

function createNavigationHandler() {
  const routes: Record<NavigationEvent['pageName'], string> = {
    details: '#events',
    coming: '#calendar',
    results: '#results',
    live: '#live',
  };

  return (event: NavigationEvent): void => {
    window.history.replaceState(null, '', routes[event.pageName]);
  };
}

function initScript(params: InitScriptParams): RendererConfig | null {
  const target = document.getElementById('wrapper');

  if (!target || !browserWindow.RendererFunc) {
    return null;
  }

  const config: RendererConfig = {
    lang: params.lang,
    target,
    stickyTop: params.stickyTop ?? 70,
    themeName: params.themeName || 'defaultTheme',
    onLogin: params.onLogin,
    options: prepareOptions(params.optionsList),
    onNavigation: createNavigationHandler(),
  };

  if (params.onRegister) {
    config.onRegister = params.onRegister;
  }

  return new browserWindow.RendererFunc().init(config);
}
```

Исправленный loader не пропускает быстрое событие загрузки и повторно не создаёт элемент. Контролируемый `appendChild` синхронно отправляет `load`: callback сработает в этот момент только при подписке до вставки. Строгие типы связывают нормализацию options, навигацию и конфигурацию renderer, а ранняя проверка гарантирует корректные `target` и constructor.

Ожидаемый результат: выводятся `[{"code":"visa","label":"debit","value":"Visa","dataTest":"visa"},{"code":"mir","label":"debit","value":"Mir","dataTest":"mir"}]`, `70`, `defaultTheme`, `#events,#calendar,#results,#live`, `loader: 2 sync: true scripts: 1 src: data:text/javascript,void 0`, `1`, затем `login: 1 register: 1`.

Ручная проверка: выберите TypeScript для JS-панели CodePen и сравните все семь строк, включая четыре поля обеих options, четыре hash, callback во время синхронного append, ровно один script с точными `id` и `src`, а также оба callback-счётчика; затем удалите `wrapper` перед `initScript` и убедитесь, что возвращается `null`, а новый renderer не создаётся.

</details>

<details>
<summary>О задаче</summary>

- Технология: TypeScript
- Подборка: TypeScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
