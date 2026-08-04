# task-0051 — Очередь с ограничением параллельности

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте Queue: start(done) должен выполнить каждую добавленную callback-задачу ровно один раз, одновременно запуская не более maxConcurrent задач.
// После завершения выведите «Queue is empty» ровно один раз и вызовите done; пустая очередь тоже завершается, а повторный start после завершения ничего не запускает заново.
// Для данных ниже итогом должны стать maxRunning: 2, completed: task 2, task 3, task 1, два вызова done и одна строка «Queue is empty».

class Queue {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.tasks = [];
  }

  add(task) {
    this.tasks.push(task);
  }

  start(done) {
    this.tasks.forEach((task) => task(() => {}));
    console.log('Queue is empty');
    done();
  }
}

let running = 0;
let maxRunning = 0;
const completed = [];
let doneCalls = 0;

const createTask = (name, delay) => (finish) => {
  running += 1;
  maxRunning = Math.max(maxRunning, running);

  setTimeout(() => {
    running -= 1;
    completed.push(name);
    finish();
  }, delay);
};

const queue = new Queue(2);
queue.add(createTask('task 1', 40));
queue.add(createTask('task 2', 10));
queue.add(createTask('task 3', 15));

queue.start(() => {
  doneCalls += 1;

  queue.start(() => {
    doneCalls += 1;
    console.log('maxRunning:', maxRunning);
    console.log('completed:', completed.join(', '));
    console.log('doneCalls:', doneCalls);
  });
});
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Храните отдельно индекс следующей задачи, число активных задач и число завершённых задач.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Внутри `start` сделайте функцию, которая запускает новые задачи, пока есть свободный слот и необработанный элемент.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

В callback задачи уменьшайте число активных, увеличивайте число завершённых и либо завершайте очередь, либо снова заполняйте свободные слоты.

</details>

<details>
<summary>Решение</summary>

```javascript
class Queue {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.tasks = [];
    this.started = false;
    this.finished = false;
    this.emptyAnnounced = false;
  }

  add(task) {
    this.tasks.push(task);
  }

  start(done) {
    if (this.finished) {
      done();
      return;
    }

    if (this.started) {
      return;
    }

    this.started = true;
    const tasks = this.tasks.splice(0);
    let nextIndex = 0;
    let active = 0;
    let completed = 0;

    const finishQueue = () => {
      this.started = false;
      this.finished = true;

      if (!this.emptyAnnounced) {
        this.emptyAnnounced = true;
        console.log('Queue is empty');
      }

      done();
    };

    const runNext = () => {
      if (completed === tasks.length) {
        finishQueue();
        return;
      }

      while (active < this.maxConcurrent && nextIndex < tasks.length) {
        const task = tasks[nextIndex];
        nextIndex += 1;
        active += 1;

        task(() => {
          active -= 1;
          completed += 1;
          runNext();
        });
      }
    };

    runNext();
  }
}
```

Задачи извлекаются из публичной очереди один раз, а `runNext` поддерживает не больше заданного числа активных операций. Флаги отделяют первый запуск от повторного вызова после завершения.

Ожидаемый результат: сначала появляется одна строка `Queue is empty`, затем `maxRunning: 2`, `completed: task 2, task 3, task 1` и `doneCalls: 2`.

Ручная проверка: вставьте решение и сравните четыре строки с ожидаемыми; затем создайте отдельную пустую очередь и убедитесь, что её `done` вызывается сразу, а сообщение о пустой очереди выводится один раз.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript → Promise и async/await
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
