---
id: node-02-convert-temperature
track: nodejs
title: Convert a temperature
topic: Numbers & constants
minutes: 8
concepts: [numbers, const]
prereqs: [node-01-first-function]
contrast: java
edit: exercise.js
---

# Convert a temperature

## Learn the idea

Your thermostats report Celsius; some users want Fahrenheit.

JavaScript has **one** number type: a 64-bit floating-point number, like Java's `double`. There's no `int`, so `7 / 2` is `3.5`, not `3`.

- `const` declares a value you won't reassign (like `final`). Use it by default; use `let` only when the value changes.
- `Math.round(x)` rounds to a whole number. To round to one decimal: `Math.round(x * 10) / 10`.
- Careful: `x.toFixed(1)` also rounds, but returns a **string** (`"70.7"`), not a number.

```visual
{
 "title": "Follow the number",
 "intro": "Every value here is the same type, `number`: a 64-bit float.",
 "regions": [
  {
   "id": "vars",
   "label": "Variables"
  },
  {
   "id": "calc",
   "label": "Working it out"
  },
  {
   "id": "out",
   "label": "Console",
   "kind": "output"
  }
 ],
 "scenarios": [
  {
   "name": "Convert and round",
   "group": "How it works",
   "code": "const c = 21.46;\nconst raw = c * 9 / 5 + 32;\nconst rounded = Math.round(raw * 10) / 10;\nconsole.log(rounded);",
   "check": {
    "output": "70.6"
   },
   "steps": [
    {
     "line": 1,
     "say": "`const c` holds 21.46: a `number`, like Java's `double`.",
     "rule": "There is one number type. No `int`, no `long`.",
     "set": [
      {
       "id": "c",
       "in": "vars",
       "title": "c",
       "value": "21.46",
       "tag": "number",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "`c * 9 / 5` is 38.628: division never truncates.",
     "rule": "`7 / 2` is `3.5` in JavaScript, not `3`.",
     "set": [
      {
       "id": "w1",
       "in": "calc",
       "title": "c * 9 / 5",
       "value": "38.628",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "c",
       "to": "w1",
       "state": "muted"
      }
     ]
    },
    {
     "line": 2,
     "say": "Add 32, and `raw` is 70.628.",
     "set": [
      {
       "id": "w1",
       "state": "faded"
      },
      {
       "id": "raw",
       "in": "vars",
       "title": "raw",
       "value": "70.628",
       "tag": "number",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "w1",
       "to": "raw",
       "label": "+ 32",
       "state": "ok"
      }
     ]
    },
    {
     "line": 3,
     "say": "To round to one decimal: multiply by 10…",
     "set": [
      {
       "id": "w2",
       "in": "calc",
       "title": "raw * 10",
       "value": "706.28",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "raw",
       "to": "w2",
       "state": "muted"
      }
     ]
    },
    {
     "line": 3,
     "say": "…round to a whole number…",
     "rule": "`Math.round` rounds to the nearest whole number.",
     "set": [
      {
       "id": "w2",
       "state": "faded"
      },
      {
       "id": "w3",
       "in": "calc",
       "title": "Math.round(…)",
       "value": "706",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "w2",
       "to": "w3",
       "state": "muted"
      }
     ]
    },
    {
     "line": 3,
     "say": "…and divide by 10 again. Still a number, not text.",
     "rule": "Round with `Math.round(x * 10) / 10` to keep a number.",
     "set": [
      {
       "id": "w3",
       "state": "faded"
      },
      {
       "id": "rounded",
       "in": "vars",
       "title": "rounded",
       "value": "70.6",
       "tag": "number",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "w3",
       "to": "rounded",
       "label": "/ 10",
       "state": "ok"
      }
     ]
    },
    {
     "line": 4,
     "say": "Printed: `70.6`.",
     "set": [
      {
       "id": "o1",
       "in": "out",
       "title": "70.6"
      }
     ],
     "arrows": [
      {
       "from": "rounded",
       "to": "o1",
       "state": "muted"
      }
     ]
    }
   ]
  },
  {
   "name": "toFixed gives text",
   "group": "What if it goes wrong",
   "code": "const raw = 70.628;\nconst shown = raw.toFixed(1);\nconsole.log(shown + 1);",
   "check": {
    "output": "70.61"
   },
   "steps": [
    {
     "line": 1,
     "say": "`raw` is a number.",
     "set": [
      {
       "id": "raw",
       "in": "vars",
       "title": "raw",
       "value": "70.628",
       "tag": "number",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "`toFixed(1)` rounds, but returns a **string**.",
     "rule": "`toFixed` is for display, not for math.",
     "set": [
      {
       "id": "shown",
       "in": "vars",
       "title": "shown",
       "value": "\"70.6\"",
       "tag": "string!",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "raw",
       "to": "shown",
       "label": "toFixed(1)",
       "state": "bad"
      }
     ]
    },
    {
     "line": 3,
     "say": "`+` with a string means *join text*: `\"70.6\" + 1` is `\"70.61\"`.",
     "rule": "If either side of `+` is a string, `+` concatenates.",
     "set": [
      {
       "id": "w",
       "in": "calc",
       "title": "shown + 1",
       "value": "\"70.61\"",
       "tag": "joined text",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "shown",
       "to": "w",
       "state": "bad"
      }
     ]
    },
    {
     "line": 3,
     "say": "The program prints `70.61`, which looks like a number but isn't the one you meant.",
     "set": [
      {
       "id": "o1",
       "in": "out",
       "title": "70.61",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "w",
       "to": "o1",
       "state": "bad"
      }
     ],
     "error": "70.6 + 1 should be 71.6, not \"70.61\""
    }
   ]
  },
  {
   "name": "0.1 + 0.2",
   "group": "What if it goes wrong",
   "code": "const sum = 0.1 + 0.2;\nconsole.log(sum);\nconsole.log(sum === 0.3);",
   "check": {
    "output": "0.30000000000000004\nfalse"
   },
   "steps": [
    {
     "line": 1,
     "say": "Neither 0.1 nor 0.2 is exact in binary floating point, so the sum is a tiny bit off.",
     "rule": "Same as `double` in Java: floats are approximations.",
     "set": [
      {
       "id": "sum",
       "in": "vars",
       "title": "sum",
       "value": "0.30000000000000004",
       "tag": "number",
       "state": "bad"
      }
     ]
    },
    {
     "line": 2,
     "say": "Printing shows the full value.",
     "set": [
      {
       "id": "o1",
       "in": "out",
       "title": "0.30000000000000004"
      }
     ]
    },
    {
     "line": 3,
     "say": "So comparing with `===` fails.",
     "rule": "Round before comparing, or compare with a small tolerance.",
     "set": [
      {
       "id": "o2",
       "in": "out",
       "title": "false",
       "state": "bad"
      }
     ],
     "error": "sum === 0.3 is false"
    }
   ]
  }
 ]
}
```

```run
const RATIO = 9 / 5;
console.log(7 / 2);
console.log(Math.round(21.46 * 10) / 10);
console.log((21.46).toFixed(1), typeof (21.46).toFixed(1));
console.log(RATIO);
```

## Quick check

```predict
console.log(0.1 + 0.2 === 0.3);
---
options: true | false
answer: false
why: Floating-point numbers can't represent 0.1 exactly; the sum is 0.30000000000000004. Same as `double` in Java. That's why we round before comparing.
```

## Your turn

Write `toFahrenheit(celsius)`. Use F = C × 9/5 + 32, and return a **number** rounded to one decimal place.

## Example

```
toFahrenheit(21.5)  →  70.7
toFahrenheit(100)   →  212
```

## Hints

1. First compute the raw value: `celsius * 9 / 5 + 32`.
2. To round to one decimal, multiply by 10, round, then divide by 10.
3. Avoid `toFixed` here: the tests expect a number, not a string.

## Review

Tomorrow, solve this again, then write `toCelsius` without looking.
