---
id: node-03a-drill-equality
track: nodejs
title: Equality and parsing, again
kind: drill
for: node-03-battery-low
topic: Conditions & equality
minutes: 8
concepts: [equality, conditions]
prereqs: [node-03-battery-low]
contrast: java
edit: exercise.js
---

# Equality and parsing, again

## Recall

A short practice round on *Decide when a battery is low*, with new code so you recall the idea rather than an old answer.

- `===` never converts types; `==` does. And `NaN === NaN` is `false`.
- `Number("")` and `Number("  ")` are `0`, not `NaN`: blank text sneaks through as zero.
- `reduce` needs a starting value, or it throws on an empty array.

## Quick check

```predict
console.log(Number(""), Number("x"), Number(" 7 "));
---
options: 0 NaN 7 | NaN NaN 7 | 0 NaN NaN
answer: 0 NaN 7
why: Blank text converts to 0, which is why blanks need filtering before you convert. Spaces around a number are ignored.
```

## Your turn

Device logs arrive as text. Write three small functions in the editor: `toNumbers`, `sameValue` and `total`. Each comment says what to do.

## Example

```
toNumbers(["4", " 2 ", "", "x"])  →  [4, 2]
sameValue(NaN, NaN)                →  true
total([])                          →  0
```

## Hints

1. `toNumbers`: drop blank strings *before* converting: `s.trim() !== ''`; afterwards drop `NaN` with `Number.isNaN`.
2. `sameValue`: `a === b`, or both are `NaN`.
3. `total`: `nums.reduce((sum, x) => sum + x, 0)`. The `0` matters.
