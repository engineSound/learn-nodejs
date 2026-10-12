---
id: node-01b-stretch-word-stats
track: nodejs
title: Word statistics
kind: stretch
for: node-01-values-functions
minutes: 20
concepts: [array-methods, arrow-functions, objects]
prereqs: [node-01-values-functions]
contrast: java
edit: exercise.js
---

# Stretch: word statistics

A harder exercise for when lesson 01 felt easy. It's one function that chains
`split`, `filter`, `map` and `reduce`, the way a Java stream pipeline would,
but on plain arrays.

Useful pieces:
- `text.split(/\s+/)` splits on any run of whitespace (it can leave `""` at the ends).
- `str.toLowerCase()`, `str[0]` for the first character.
- `Math.round(x * 100) / 100` rounds to two decimals.
- An object works as a counting map: `counts[key] = (counts[key] ?? 0) + 1`.

## Exercise
Implement `wordStats(text)` in `exercise.js`. Words are compared in lower case.
