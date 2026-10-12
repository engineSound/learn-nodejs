---
id: node-02-objects-arrays
track: nodejs
title: Objects, destructuring and spread
minutes: 20
concepts: [objects, destructuring, spread, immutability]
prereqs: [node-01-values-functions]
contrast: java
edit: exercise.js
---

# Objects, destructuring and spread

## Coming from Java

| Java | JavaScript |
|------|-----------|
| a class or `record` for every shape of data | an object literal: `{ name: "Ada", age: 36 }` |
| getters `user.getName()` | properties `user.name` |
| `Map<String, Object>` | a plain object works as a map with string keys |
| builder / `withX()` copies | spread: `{ ...user, age: 37 }` makes a changed copy |
| `null` checks, `Optional` | a missing property is `undefined`; `??` gives a default |

## Destructuring
Pull properties or array items into variables, including in parameter lists:

```js
const { name, age = 0 } = user;          // age defaults to 0 if missing
const [first, ...rest] = [1, 2, 3];      // first = 1, rest = [2, 3]
function greet({ name }) { return `Hi ${name}`; }
```

## Spread copies, shallowly
`{ ...a, ...b }` copies `a`'s properties, then `b`'s; later ones win.
Arrays work the same way: `[...xs, 4]`. The copy is **shallow**: nested
objects are shared, so to change a nested property, spread that level too:

```js
const moved = { ...user, address: { ...user.address, city: "Oslo" } };
```

Not mutating inputs is the norm in modern JavaScript, the same way Java
records are immutable. The tests check that your functions leave their
arguments unchanged.

## Exercise
Four functions in `exercise.js`.
