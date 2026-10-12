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
