---
id: node-01-first-function
track: nodejs
title: Your first JavaScript function
topic: Functions & strings
minutes: 8
concepts: [functions, template-literals]
prereqs: []
contrast: java
edit: exercise.js
---

# Your first JavaScript function

## Learn the idea

You're building the backend for a small fleet of home devices: thermostats, batteries, sensors. Everything starts with functions.

In Java every method lives in a class and declares its types. In JavaScript a function can stand on its own, and nothing is typed:

| Java | JavaScript |
|------|-----------|
| `static String greet(String name) { … }` | `function greet(name) { … }` |
| `"Hi, " + name + "!"` | `` `Hi, ${name}!` `` (a *template literal*, with backticks) |
| `public` | `export` makes the function usable from other files |

Change the name below and press **Run**:

```run
function greet(name) {
  return `Hi, ${name}! Your thermostat is online.`;
}

console.log(greet("Ada"));
console.log(greet("Linus"));
```

## Quick check

```predict
const device = "kitchen sensor";
console.log(`Hello, ${device.toUpperCase()}`);
---
options: Hello, kitchen sensor | Hello, KITCHEN SENSOR | Hello, ${device.toUpperCase()}
answer: Hello, KITCHEN SENSOR
why: Anything inside `${ }` is evaluated as JavaScript, so you can call methods there too.
```

## Your turn

Every device greets its owner when it starts. Write `greeting(name)` so it **returns** (not prints) `"Hello, "` followed by the name and an exclamation mark.

## Example

```
greeting("Sam")  →  "Hello, Sam!"
```

## Hints

1. Start with `return` and a template literal: backticks, not quotes.
2. Inside the backticks, `${name}` puts the value of `name` into the text.
3. `` return `Hello, ${name}!`; `` is the whole body.

## Review

Tomorrow, solve this again without hints, then change the greeting to include the time of day.
