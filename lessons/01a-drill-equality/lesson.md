---
id: node-01a-drill-equality
track: nodejs
title: Equality and parsing, again
kind: drill
for: node-01-values-functions
minutes: 10
concepts: [equality, array-methods]
prereqs: [node-01-values-functions]
contrast: java
edit: exercise.js
---

# Drill: equality and parsing

A short drill on the ideas from *Values, equality and functions*, with new
code so you recall the ideas rather than the old solution.

Remember:
- `===` never converts types; `==` does. `NaN === NaN` is `false`.
- `Number("")` and `Number("  ")` are `0`, not `NaN`.
- `reduce` needs a starting value, or it throws on an empty array.

## Exercise
Three small functions in `exercise.js`. Aim to finish in under 10 minutes.
