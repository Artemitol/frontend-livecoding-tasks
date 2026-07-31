# Выдача купюр с ограниченным запасом

Песочница для выполнения — [Programiz](https://www.programiz.com/javascript/online-compiler/).

## Условие
```javascript
// Исправьте dispense: выдайте точную сумму минимальным числом купюр из DENOMINATIONS с учётом доступного stock.
// В stock хранится неотрицательное целое количество купюр; отсутствующий номинал равен нулю. Верните только положительные количества или null, если сумму выдать нельзя.
// При равном числе купюр предпочитайте вариант с большим количеством старших номиналов; не изменяйте stock и сравните три сценария с фикстурами.
// Используйте консольный JavaScript без ESM и browser API.

const DENOMINATIONS = [5000, 2000, 1000, 500, 100, 50];

function dispense(amount, stock) {
  const result = {};

  for (const denomination of DENOMINATIONS) {
    const count = Math.min(
      Math.floor(amount / denomination),
      stock[denomination] ?? 0,
    );

    if (count > 0) {
      result[denomination] = count;
      amount -= count * denomination;
    }
  }

  return amount === 0 ? result : null;
}

function orderedCounts(result) {
  return result === null
    ? null
    : Object.entries(result).sort(
      (left, right) => Number(right[0]) - Number(left[0]),
    );
}

const stockA = {
  5000: 1,
  2000: 3,
};
const stockB = {
  5000: 1,
  2000: 1,
  1000: 2,
  500: 1,
  100: 2,
  50: 1,
};
const stockC = {
  5000: 1,
  2000: 3,
  500: 2,
};
const stockBBeforeDispense = JSON.stringify(stockB);
const stockCBeforeDispense = JSON.stringify(stockC);

console.log(JSON.stringify(orderedCounts(dispense(6000, stockA))));
console.log(JSON.stringify(orderedCounts(dispense(6200, stockB))));
console.log(JSON.stringify(orderedCounts(dispense(6000, stockC))));
console.log(dispense(150, { 50: 2 }) === null);
console.log(
  JSON.stringify(stockB) === stockBBeforeDispense
  && JSON.stringify(stockC) === stockCBeforeDispense,
);
```

<details>
<summary>Подсказка 1 — куда смотреть</summary>

Жадный выбор старшей купюры может завести в тупик: для `6000` одна купюра `5000` мешает использовать три доступные купюры `2000`.

</details>

<details>
<summary>Подсказка 2 — с чего начать</summary>

Перебирайте допустимое количество текущего номинала от максимума до нуля и передавайте остаток следующему уровню поиска.

</details>

<details>
<summary>Подсказка 3 — почти решение</summary>

Сохраняйте лучший полный набор по минимальному числу купюр. Обход старших количеств первым и отсутствие замены при равенстве дают нужное правило разрешения ничьей.

</details>

<details>
<summary>Решение</summary>

```javascript
function dispense(amount, stock) {
  let best = null;

  function search(index, remainder, counts, usedNotes) {
    if (remainder === 0) {
      if (best === null || usedNotes < best.usedNotes) {
        best = {
          usedNotes,
          counts: { ...counts },
        };
      }

      return;
    }

    if (
      index === DENOMINATIONS.length
      || (best !== null && usedNotes >= best.usedNotes)
    ) {
      return;
    }

    const denomination = DENOMINATIONS[index];
    const available = stock[denomination] ?? 0;
    const maximumCount = Math.min(
      Math.floor(remainder / denomination),
      available,
    );

    for (let count = maximumCount; count >= 0; count -= 1) {
      if (count > 0) {
        counts[denomination] = count;
      } else {
        delete counts[denomination];
      }

      search(
        index + 1,
        remainder - count * denomination,
        counts,
        usedNotes + count,
      );
    }

    delete counts[denomination];
  }

  search(0, amount, {}, 0);
  return best === null ? null : best.counts;
}
```

Поиск рассматривает все допустимые сочетания запасов, но отсекает ветви, которые уже используют не меньше купюр, чем лучший вариант. Старшие номиналы перебираются первыми.

Ожидаемый результат: строки `[["2000",3]]`, `[["5000",1],["1000",1],["100",2]]`, `[["5000",1],["500",2]]` для равного по числу купюр выбора вместо `[["2000",3]]`, затем `true` для невозможной суммы и `true` для неизменённых запасов.

Ручная проверка: вставьте решение и сравните пять строк с ожидаемыми; в третьей строке должен победить вариант с `5000`, а не три купюры `2000`. Отдельно вызовите `dispense(0, stockA)` и убедитесь, что функция возвращает пустой объект.

</details>

<details>
<summary>О задаче</summary>

- Технология: JavaScript
- Подборка: JavaScript: практика к собеседованию
- Формат: Исправить код
- Сложность: Продвинутая
- Примерное время: 30 минут

</details>
