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

```visual
{
 "title": "Watch the accumulator grow",
 "scenarios": [
  {
   "name": "Count per device",
   "group": "How it works",
   "regions": [
    {
     "id": "items",
     "label": "readings"
    },
    {
     "id": "fn",
     "label": "(acc, r) => …"
    },
    {
     "id": "acc",
     "label": "accumulator"
    }
   ],
   "code": "const perDevice = readings.reduce((acc, r) => {\n  acc[r.device] = (acc[r.device] ?? 0) + 1;\n  return acc;\n}, {});\nconsole.log(perDevice);",
   "check": {
    "prelude": "const readings = [{ device: 'oven', value: 230 }, { device: 'fan', value: 3 }, { device: 'oven', value: 180 }];",
    "output": "{ oven: 2, fan: 1 }"
   },
   "steps": [
    {
     "line": 1,
     "say": "Three readings, and a starting value for the accumulator: an empty object.",
     "rule": "The second argument to `reduce` is the starting value.",
     "set": [
      {
       "id": "r1",
       "in": "items",
       "title": "{ oven: 230 }"
      },
      {
       "id": "r2",
       "in": "items",
       "title": "{ fan: 3 }"
      },
      {
       "id": "r3",
       "in": "items",
       "title": "{ oven: 180 }"
      },
      {
       "id": "acc",
       "in": "acc",
       "title": "acc",
       "value": "{ }",
       "tag": "start value",
       "state": "ok"
      }
     ]
    },
    {
     "line": 3,
     "say": "The function gets the accumulator and the next reading (oven), and returns the updated count.",
     "rule": "Whatever the function returns becomes the accumulator for the next item.",
     "set": [
      {
       "id": "r1",
       "in": "fn",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "acc",
       "to": "r1",
       "label": "acc",
       "state": "muted"
      }
     ]
    },
    {
     "line": 4,
     "say": "Accumulator is now `{ oven: 1 }`.",
     "set": [
      {
       "id": "r1",
       "state": "faded",
       "in": "items"
      },
      {
       "id": "acc",
       "value": "{ oven: 1 }",
       "state": "ok"
      }
     ],
     "arrows": []
    },
    {
     "line": 3,
     "say": "The function gets the accumulator and the next reading (fan), and returns the updated count.",
     "rule": "Whatever the function returns becomes the accumulator for the next item.",
     "set": [
      {
       "id": "r2",
       "in": "fn",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "acc",
       "to": "r2",
       "label": "acc",
       "state": "muted"
      }
     ]
    },
    {
     "line": 4,
     "say": "Accumulator is now `{ oven: 1, fan: 1 }`.",
     "set": [
      {
       "id": "r2",
       "state": "faded",
       "in": "items"
      },
      {
       "id": "acc",
       "value": "{ oven: 1, fan: 1 }",
       "state": "ok"
      }
     ],
     "arrows": []
    },
    {
     "line": 3,
     "say": "The function gets the accumulator and the next reading (oven), and returns the updated count.",
     "rule": "Whatever the function returns becomes the accumulator for the next item.",
     "set": [
      {
       "id": "r3",
       "in": "fn",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "acc",
       "to": "r3",
       "label": "acc",
       "state": "muted"
      }
     ]
    },
    {
     "line": 4,
     "say": "Accumulator is now `{ oven: 2, fan: 1 }`.",
     "set": [
      {
       "id": "r3",
       "state": "faded",
       "in": "items"
      },
      {
       "id": "acc",
       "value": "{ oven: 2, fan: 1 }",
       "state": "ok"
      }
     ],
     "arrows": []
    },
    {
     "line": 5,
     "say": "After the last item, the accumulator **is** the result.",
     "rule": "reduce = fold a list into one value.",
     "set": [
      {
       "id": "acc",
       "tag": "result"
      }
     ]
    }
   ]
  },
  {
   "name": "No start value, empty array",
   "group": "What if it goes wrong",
   "regions": [
    {
     "id": "items",
     "label": "readings"
    },
    {
     "id": "fn",
     "label": "(acc, r) => …"
    },
    {
     "id": "acc",
     "label": "accumulator"
    }
   ],
   "code": "[].reduce((a, b) => a + b);",
   "check": {
    "error": "TypeError"
   },
   "steps": [
    {
     "line": 1,
     "say": "No readings today, and no starting value.",
     "set": [
      {
       "id": "e",
       "in": "items",
       "title": "[ ]",
       "value": "empty",
       "state": "faded"
      }
     ]
    },
    {
     "line": 1,
     "say": "Without a start value, `reduce` uses the first item as the start. There isn't one.",
     "rule": "Always pass a start value, e.g. `reduce(fn, 0)`.",
     "set": [
      {
       "id": "acc",
       "in": "acc",
       "title": "acc",
       "value": "???",
       "state": "bad"
      }
     ],
     "error": "TypeError: Reduce of empty array with no initial value"
    }
   ]
  }
 ]
}
```

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
