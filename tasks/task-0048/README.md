# События с on, off и emit

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Реализуйте EventEmitter: on добавляет listener к имени события, off удаляет именно этот listener, emit вызывает все текущие listeners с переданными аргументами.
// Несуществующее событие не должно приводить к ошибке; после off удалённый listener больше не вызывается.
// Сравните полный журнал с фикстурой; используйте консольный JavaScript без ESM и browser API.

class EventEmitter {
  on(eventName, listener) {
    // Напишите решение.
  }

  off(eventName, listener) {
    // Напишите решение.
  }

  emit(eventName, ...args) {
    // Напишите решение.
  }
}

const eventEmitter = new EventEmitter();
const log = [];
const greetListener = (name) => {
  log.push(`Hello, ${name}!`);
};

eventEmitter.on('greet', greetListener);
eventEmitter.emit('greet', 'Alice');
eventEmitter.off('greet', greetListener);
eventEmitter.emit('greet', 'Bob');
eventEmitter.emit('unknown', 'Charlie');

console.log(JSON.stringify(log));
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Нужно хранить отдельную коллекцию функций для каждого `eventName`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Создайте `Map`, где значению события соответствует `Set` listeners, и инициализируйте набор при первом `on`.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В `off` удалите точную функцию из набора, а в `emit` обойдите копию текущего набора и вызовите каждую функцию через `listener(...args)`.

</details>

<details>
<summary>Решение</summary>

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    this.events.get(eventName).add(listener);
  }

  off(eventName, listener) {
    const listeners = this.events.get(eventName);

    if (!listeners) {
      return;
    }

    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(eventName);
    }
  }

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);

    if (!listeners) {
      return;
    }

    [...listeners].forEach((listener) => listener(...args));
  }
}
```

`Map` разделяет события, а `Set` хранит ссылки на функции, поэтому `off` удаляет тот же listener. Копия набора делает текущий обход устойчивым к удалению обработчика во время `emit`.

Ожидаемый результат: единственная строка `["Hello, Alice!"]`; вызовы с `Bob` и неизвестным событием ничего не добавляют.

Ручная проверка: вставьте решение, сравните журнал с ожидаемым, затем зарегистрируйте две разные функции на одном событии и убедитесь, что один `emit` вызывает обе.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Написать код
- Сложность: Средняя
- Примерное время: 25 минут

</details>
