---
id: node-04b-stretch-word-stats
track: nodejs
title: Word statistics
kind: stretch
for: node-04-active-devices
topic: Arrays & objects
minutes: 15
concepts: [array-methods, arrow-functions, objects]
prereqs: [node-04-active-devices]
contrast: java
edit: exercise.js
---

# Word statistics

## Recall

A harder one, for when *Pick active devices* felt easy. It's one function that chains `split`, `filter`, `map` and `reduce`, the way a Java stream pipeline would, but on plain arrays.

- `text.split(/\s+/)` splits on any run of whitespace (it can leave `""` at the ends).
- `new Set(words).size` counts distinct values.
- An object works as a counting map: `counts[key] = (counts[key] ?? 0) + 1`.

```run
const words = '  The cat and the hat '.split(/\s+/);
console.log(words);
console.log(words.filter(w => w !== '').map(w => w.toLowerCase()));
```

## Your turn

The support team wants statistics about device notes. Implement `wordStats(text)`; the comment in the editor describes the result. Words are compared in lower case.

## Example

```
wordStats("The cat and the hat")
  →  { words: 5, unique: 4, longest: "the", averageLength: 3, byFirstLetter: { t: 2, c: 1, a: 1, h: 1 } }
```

## Hints

1. Start with `text.split(/\s+/).filter(w => w !== '').map(w => w.toLowerCase())`, and handle the empty case right after.
2. `longest`: `reduce` keeping the longer word, using `>` so the first one wins ties.
3. Round the average with `Math.round(avg * 100) / 100`.
