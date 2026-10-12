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
