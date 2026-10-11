---
id: node-01-values-functions
track: nodejs
title: Values, equality and functions
minutes: 20
concepts: [equality, let-const, arrow-functions, array-methods]
prereqs: []
contrast: java
---

# Values, equality and functions

## Coming from Java

| Java | JavaScript |
|------|-----------|
| `int`, `double`, `long` | one `number` type (64-bit float); `BigInt` when you need it |
| `final int x = 1;` | `const x = 1;` (binding can't change; contents still can) |
| `int x = 1;` | `let x = 1;` (never use `var`) |
| `a.equals(b)` / `a == b` | `a === b`, always the three-equals form |
| lambdas `x -> x * 2` | arrow functions `x => x * 2`, and functions are ordinary values |
| `stream().map().filter()` | `array.map().filter()`, directly on arrays and eager |

## The equality trap
`==` converts types before comparing: `"1" == 1` is `true`, and so is
`0 == ""`. `===` never converts. Use `===` and `!==` everywhere.

## Parsing numbers
`Number("42")` is `42`. `Number("x")` is `NaN`, and `NaN === NaN` is
`false`, so test with `Number.isNaN(value)`. Also `Number("")` is `0`, which
surprises everyone once.

## Functions are values
```js
const double = x => x * 2;
[1, 2, 3].map(double);                     // [2, 4, 6]
[1, 2, 3].reduce((sum, x) => sum + x, 0);  // 6
```

## Exercise
Open `exercise.js` and implement the four functions. Run `node --test` in
this folder. Each test name says what it checks.
