---
id: node-04-active-devices
track: nodejs
title: Pick active devices
topic: Arrays & objects
minutes: 8
concepts: [arrays, objects, array-methods, arrow-functions]
prereqs: [node-03-battery-low]
contrast: java
edit: exercise.js
---

# Pick active devices

## Learn the idea

The dashboard lists devices that are online. Devices arrive as an array of objects:

```
[{ name: "porch light", status: "online" }, { name: "garage door", status: "offline" }]
```

An **object literal** `{ name: "x" }` is like a small record you don't need a class for; read fields with `device.name`. Arrays have stream-like methods built in, and they're eager (no `.stream()` or `.collect()`):

| Java streams | JavaScript arrays |
|---|---|
| `.filter(d -> d.isOnline())` | `.filter(d => d.status === "online")` |
| `.map(Device::name)` | `.map(d => d.name)` |
| `.sorted()` | `.toSorted()` (returns a new array) |

Watch out: `.sort()` **changes the original array**, and without arguments it sorts as text.

```run
const devices = [
  { name: "porch light", status: "online" },
  { name: "garage door", status: "offline" },
  { name: "attic fan", status: "online" },
];
const names = devices.filter(d => d.status === "online").map(d => d.name);
console.log(names);
console.log(names.toSorted());
```

## Quick check

```predict
const n = [10, 9, 1];
n.sort();
console.log(n);
---
options: [ 1, 9, 10 ] | [ 1, 10, 9 ] | [ 10, 9, 1 ]
answer: [ 1, 10, 9 ]
why: Without a compare function, `sort` compares values as text, and "10" comes before "9". For numbers use `sort((a, b) => a - b)`. And `n` itself was changed.
```

## Your turn

Write `activeDeviceNames(devices)`: return the **names** of the devices whose status is `"online"`, **sorted alphabetically**. Don't change the array you're given.

## Example

```
activeDeviceNames([
  { name: "porch light", status: "online" },
  { name: "garage door", status: "offline" },
  { name: "attic fan", status: "online" },
])  →  ["attic fan", "porch light"]
```

## Hints

1. Chain three steps: `filter`, then `map`, then sort.
2. `filter` keeps devices where `d.status === "online"`; `map` turns each into `d.name`.
3. Use `.toSorted()` (or sort *after* `map`, which already made a new array) so the input isn't changed.

## Review

Tomorrow, solve this again, then sort by name length instead.
