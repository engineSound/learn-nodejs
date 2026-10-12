---
id: node-06-device-reading
track: nodejs
title: Wait for a device reading
topic: Promises & async/await
minutes: 10
concepts: [promises, async-await, errors]
prereqs: [node-05-incoming-message]
contrast: java
edit: exercise.js
---

# Wait for a device reading

## Learn the idea

Asking a sensor for a reading takes time. Node has **one thread**: instead of blocking while it waits, it moves on and comes back when the answer arrives.

- A **Promise** is a value that arrives later, like Java's `CompletableFuture`. It either *resolves* with a value or *rejects* with an error.
- Inside an `async function`, `await promise` pauses *that function* until the value arrives. The thread is free meanwhile. A rejected promise makes `await` throw, so `try/catch` works.
- An `async function` always returns a Promise.

```run
const sensor = {
  read: () => new Promise(resolve => setTimeout(() => resolve(21.5), 300)),
};

async function show() {
  console.log('asking the sensor…');
  const value = await sensor.read();
  console.log('got', value);
}

show();
console.log('this line runs before the reading arrives');
```

## Quick check

```predict
console.log('a');
setTimeout(() => console.log('b'), 0);
console.log('c');
---
options: a b c | a c b | b a c
answer: a c b
why: Even with 0 ms, the callback waits until the current code has finished. Node runs it from the event loop afterwards.
```

## Your turn

Write `async function describeReading(sensor)`. Call `sensor.read()`, which returns a Promise of a number, and return text like `"21.5°C"`. If the reading fails (the promise rejects), return `"unavailable"` instead of throwing.

## Example

```
await describeReading({ read: async () => 21.5 })                        →  "21.5°C"
await describeReading({ read: async () => { throw new Error("offline"); } })  →  "unavailable"
```

## Hints

1. Make it `async function` so you can use `await` inside.
2. `const value = await sensor.read();` then return a template literal with `°C`.
3. Put the `await` inside `try { … } catch { return "unavailable"; }`.

## Review

Tomorrow, solve this again, then read two sensors at once with `Promise.all`.
