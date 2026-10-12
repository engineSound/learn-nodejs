---
id: node-03-battery-low
track: nodejs
title: Decide when a battery is low
topic: Conditions & booleans
minutes: 8
concepts: [conditions, equality, booleans]
prereqs: [node-02-convert-temperature]
contrast: java
edit: exercise.js
---

# Decide when a battery is low

## Learn the idea

Sensors run on batteries. The app should warn when one is low, but not while it's charging.

Conditions look like Java's, with two differences that cause real bugs:

1. **Use `===`, never `==`.** `==` converts types first: `"20" == 20` is `true`. `===` compares without converting, like Java's `==` on primitives.
2. **`if` accepts any value**, not just booleans. These count as false (*falsy*): `false`, `0`, `""`, `null`, `undefined`, `NaN`. Everything else is *truthy*.

So `if (!level)` is true when `level` is `0`. A battery at 0% would slip through!

```visual
{
 "title": "Truthy, falsy, and the 0% battery",
 "intro": "Watch each value drop into its bin, then see why `if (!level)` is a bug.",
 "scenarios": [
  {
   "name": "Sort the values",
   "group": "How it works",
   "regions": [
    {
     "id": "vals",
     "label": "Values to test"
    },
    {
     "id": "falsy",
     "label": "Falsy: counts as false"
    },
    {
     "id": "truthy",
     "label": "Truthy: counts as true"
    }
   ],
   "code": "const values = [0, 15, \"\", \"0\", null, undefined, NaN];\nfor (const value of values) {\n  console.log(value, value ? \"truthy\" : \"falsy\");\n}",
   "steps": [
    {
     "line": 1,
     "say": "`if (value)` accepts any value, not just booleans. Where does each one go?",
     "rule": "Falsy values: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN`. Everything else is truthy.",
     "set": [
      {
       "id": "v0",
       "in": "vals",
       "title": "0",
       "tag": "number"
      },
      {
       "id": "v15",
       "in": "vals",
       "title": "15",
       "tag": "number"
      },
      {
       "id": "ve",
       "in": "vals",
       "title": "\"\"",
       "tag": "empty string"
      },
      {
       "id": "vs0",
       "in": "vals",
       "title": "\"0\"",
       "tag": "string"
      },
      {
       "id": "vn",
       "in": "vals",
       "title": "null"
      },
      {
       "id": "vu",
       "in": "vals",
       "title": "undefined"
      },
      {
       "id": "vnan",
       "in": "vals",
       "title": "NaN",
       "tag": "number"
      }
     ]
    },
    {
     "line": 2,
     "say": "Zero is falsy: the classic trap.",
     "set": [
      {
       "id": "v0",
       "in": "falsy",
       "state": "info"
      }
     ]
    },
    {
     "line": 2,
     "say": "Any other number is truthy.",
     "set": [
      {
       "id": "v15",
       "in": "truthy",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "The empty string is falsy.",
     "set": [
      {
       "id": "ve",
       "in": "falsy",
       "state": "info"
      }
     ]
    },
    {
     "line": 2,
     "say": "A non-empty string is truthy, even `\"0\"`.",
     "set": [
      {
       "id": "vs0",
       "in": "truthy",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "`null` is falsy.",
     "set": [
      {
       "id": "vn",
       "in": "falsy",
       "state": "info"
      }
     ]
    },
    {
     "line": 2,
     "say": "`undefined` is falsy.",
     "set": [
      {
       "id": "vu",
       "in": "falsy",
       "state": "info"
      }
     ]
    },
    {
     "line": 2,
     "say": "`NaN` is falsy.",
     "set": [
      {
       "id": "vnan",
       "in": "falsy",
       "state": "info"
      }
     ]
    }
   ]
  },
  {
   "name": "=== vs ==",
   "group": "How it works",
   "regions": [
    {
     "id": "left",
     "label": "Left side"
    },
    {
     "id": "cmp",
     "label": "Comparison"
    },
    {
     "id": "right",
     "label": "Right side"
    }
   ],
   "code": "console.log(\"20\" == 20);\nconsole.log(\"20\" === 20);",
   "check": {
    "output": "true\nfalse"
   },
   "steps": [
    {
     "line": 1,
     "say": "Compare the string `\"20\"` with the number `20`.",
     "set": [
      {
       "id": "l",
       "in": "left",
       "title": "\"20\"",
       "tag": "string"
      },
      {
       "id": "r",
       "in": "right",
       "title": "20",
       "tag": "number"
      }
     ]
    },
    {
     "line": 1,
     "say": "`==` converts first: the string becomes the number 20…",
     "rule": "`==` converts types before comparing.",
     "set": [
      {
       "id": "l",
       "title": "20",
       "tag": "converted to number",
       "state": "active"
      },
      {
       "id": "eq",
       "in": "cmp",
       "title": "==",
       "value": "true",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "l",
       "to": "eq",
       "state": "muted"
      },
      {
       "from": "r",
       "to": "eq",
       "state": "muted"
      }
     ]
    },
    {
     "line": 2,
     "say": "`===` compares type and value: a string is never a number.",
     "rule": "Always use `===` and `!==`.",
     "set": [
      {
       "id": "l",
       "title": "\"20\"",
       "tag": "string",
       "state": "normal"
      },
      {
       "id": "eq",
       "title": "===",
       "value": "false",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "l",
       "to": "eq",
       "label": "string",
       "state": "ok"
      },
      {
       "from": "r",
       "to": "eq",
       "label": "number",
       "state": "ok"
      }
     ]
    }
   ]
  },
  {
   "name": "The 0% bug",
   "group": "What if it goes wrong",
   "regions": [
    {
     "id": "call",
     "label": "The call"
    },
    {
     "id": "check",
     "label": "if (!level)"
    },
    {
     "id": "res",
     "label": "Result"
    }
   ],
   "code": "function isBatteryLow(level, charging) {\n  if (!level) return false;   // meant: \"level unknown\"\n  return level < 20 && !charging;\n}\nisBatteryLow(0, false);",
   "steps": [
    {
     "line": 5,
     "say": "A sensor reports 0%. It is definitely low.",
     "set": [
      {
       "id": "lv",
       "in": "call",
       "title": "level",
       "value": "0",
       "tag": "number",
       "state": "active"
      }
     ]
    },
    {
     "line": 2,
     "say": "`!level` was meant to catch \"unknown\", but 0 is falsy, so `!0` is `true`…",
     "rule": "`!value` is true for every falsy value, not just `undefined`.",
     "set": [
      {
       "id": "lv",
       "in": "check",
       "state": "bad",
       "tag": "falsy!"
      }
     ]
    },
    {
     "line": 2,
     "say": "…and the function returns `false`: \"not low\".",
     "rule": "Test exactly what you mean: `level === undefined || level === null`.",
     "set": [
      {
       "id": "r",
       "in": "res",
       "title": "isBatteryLow",
       "value": "false",
       "tag": "wrong answer",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "lv",
       "to": "r",
       "label": "return false",
       "state": "bad"
      }
     ],
     "error": "A 0% battery is reported as fine"
    }
   ]
  }
 ]
}
```

```run
const levels = [0, 15, 80, undefined];
for (const level of levels) {
  console.log(level, '→ falsy?', !level, '| a number?', typeof level === 'number');
}
```

## Quick check

```predict
console.log(0 == "", 0 === "");
---
options: true true | true false | false false
answer: true false
why: `==` converts the empty string to the number 0, so they're "equal". `===` sees a number and a string and says no.
```

## Your turn

Write `isBatteryLow(level, charging)`. A battery is low when its level (0–100) is **under 20** and it's **not charging**. If the level is unknown (`undefined` or `null`), it's not low: we can't tell.

## Example

```
isBatteryLow(15, false)  →  true
isBatteryLow(15, true)   →  false
isBatteryLow(0, false)   →  true
```

## Hints

1. Handle the unknown case first: `if (level === undefined || level === null) return false;`
2. Then combine two conditions with `&&`: the level is under 20, and it's not charging.
3. Don't write `if (!level)`: that's also true for 0, and a 0% battery is definitely low.

## Review

Tomorrow, solve this again, then explain to yourself why `if (!level)` would be a bug here.
