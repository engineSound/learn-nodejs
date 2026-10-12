---
id: node-10-event-summary
track: nodejs
title: Build an event summary
topic: Mini project
minutes: 12
concepts: [array-methods, objects, reduce]
prereqs: [node-09-http-response]
contrast: java
edit: exercise.js
---

# Build an event summary

## Learn the idea

Time to combine what you know. The daily report summarises all readings: how many, per device, and the hottest one.

`reduce` folds an array into one value, like Java's `stream().reduce(identity, accumulator)`. You pass a function and a starting value; the function gets the value so far and the next item:

```run
const readings = [
  { device: 'oven', value: 230 },
  { device: 'fan', value: 3 },
  { device: 'oven', value: 180 },
];

const total = readings.reduce((sum, r) => sum + r.value, 0);
const perDevice = readings.reduce((acc, r) => {
  acc[r.device] = (acc[r.device] ?? 0) + 1;   // ?? : use 0 when it's missing
  return acc;
}, {});
console.log(total, perDevice);
```

A plain object works as a counting map: `acc[key]` reads or writes the property named by `key`.

## Quick check

```predict
console.log([].reduce((a, b) => a + b, 0), [5].reduce((a, b) => a + b));
---
options: 0 5 | undefined 5 | 0 0
answer: 0 5
why: With a starting value, an empty array gives that value. Without one, `reduce` uses the first item as the start. On an empty array that would throw.
```

## Your turn

Write `summarize(readings)`, where each reading is `{ device, value }`. Return:
- `total`: the number of readings;
- `byDevice`: how many readings each device sent;
- `hottest`: the reading with the highest value (the first one if there's a tie), or `null` when there are no readings.

## Example

```
summarize([{ device: "oven", value: 230 }, { device: "fan", value: 3 }, { device: "oven", value: 180 }])
  →  { total: 3, byDevice: { oven: 2, fan: 1 }, hottest: { device: "oven", value: 230 } }
```

## Hints

1. `total` is just `readings.length`.
2. Count per device with `reduce` into an object, as in the example above.
3. For `hottest`, `reduce` without a start value keeps the bigger of two readings, but check for an empty array first.

## Review

Tomorrow, solve this again, then add the average value per device.
