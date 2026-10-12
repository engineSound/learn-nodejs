---
id: node-05-incoming-message
track: nodejs
title: Read an incoming message
topic: JSON & errors
minutes: 10
concepts: [json, errors]
prereqs: [node-04-active-devices]
contrast: java
edit: exercise.js
---

# Read an incoming message

## Learn the idea

Devices send readings as JSON text, like `{"device":"thermostat","value":21.5}`. Some messages arrive broken.

- `JSON.parse(text)` turns JSON text into objects and arrays, no classes or Jackson needed. `JSON.stringify(obj)` goes the other way.
- Broken JSON makes `JSON.parse` **throw** a `SyntaxError`. Catch it with `try { … } catch (err) { … }`. As in Java, but there are no checked exceptions and no `throws` clause, so nothing reminds you.
- Reading a missing property gives `undefined` (no exception). `typeof x === 'number'` checks a type at runtime.

```run
for (const text of ['{"device":"fan","value":3}', '{oops']) {
  try {
    const msg = JSON.parse(text);
    console.log('parsed:', msg.device, msg.value, msg.missing);
  } catch (err) {
    console.log('could not parse:', err.name);
  }
}
```

## Quick check

```predict
const msg = JSON.parse('{"value": "21"}');
console.log(typeof msg.value);
---
options: number | string | undefined
answer: string
why: JSON keeps types: `"21"` is in quotes, so it's a string. A device that sends numbers as text needs checking.
```

## Your turn

Write `parseMessage(text)`. If `text` is valid JSON with a **string** `device` and a **number** `value`, return `{ device, value }`. Otherwise, broken JSON, missing fields or wrong types, return `null`. It must never throw.

## Example

```
parseMessage('{"device":"fan","value":3}')  →  { device: "fan", value: 3 }
parseMessage('{oops')                       →  null
```

## Hints

1. Wrap `JSON.parse(text)` in `try { … } catch { return null; }`.
2. Then check `typeof msg.device === 'string'` and `typeof msg.value === 'number'`.
3. Return a new object with just those two fields: `{ device: msg.device, value: msg.value }`.

## Review

Tomorrow, solve this again, then make it also accept `value` sent as a numeric string like `"21"`.
