---
id: node-09-http-response
track: nodejs
title: Describe an HTTP response
topic: API boundaries
minutes: 12
concepts: [objects, destructuring, default-parameters, json]
prereqs: [node-08-device-events]
contrast: java
edit: exercise.js
---

# Describe an HTTP response

## Learn the idea

Your service answers the phone app over HTTP. Before writing a server, describe a response as a plain object: status, headers and a JSON body.

- **Destructuring** pulls fields out of an object: `const { status, headers } = options;`. It works in parameter lists too.
- **Default values** fill in what's missing: `function f({ status = 200 } = {})`. Calling `f()` with no argument then works.
- Java's overloads like `respond(data)` and `respond(data, status)` become one function with an options object.

```run
function describe(device, { unit = '°C', precision = 1 } = {}) {
  return `${device.name}: ${device.value.toFixed(precision)}${unit}`;
}
const oven = { name: 'oven', value: 229.66 };
console.log(describe(oven));
console.log(describe(oven, { unit: '°F' }));
console.log(describe(oven, { precision: 0 }));
```

## Quick check

```predict
const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);
---
options: 1 2 | 1 null | undefined null
answer: 1 null
why: Defaults apply only to `undefined`. `null` is a real value, so `b` stays `null`.
```

## Your turn

Write `jsonResponse(data, options)`. Return `{ status, headers, body }` where:
- `status` is `options.status`, defaulting to `200`;
- `headers` always has `"content-type": "application/json"`, plus any `options.headers`;
- `body` is `data` as a JSON string.

Calling it with only `data` must work. Don't change the `headers` object you were given.

## Example

```
jsonResponse({ ok: true })
  →  { status: 200, headers: { "content-type": "application/json" }, body: '{"ok":true}' }
jsonResponse({ error: "not found" }, { status: 404, headers: { "x-device": "fan" } })
  →  { status: 404, headers: { "content-type": "application/json", "x-device": "fan" }, body: '{"error":"not found"}' }
```

## Hints

1. Destructure with defaults in the parameter list: `function jsonResponse(data, { status = 200, headers = {} } = {})`.
2. Build headers with spread: `{ 'content-type': 'application/json', ...headers }`.
3. `JSON.stringify(data)` makes the body.

## Review

Tomorrow, solve this again, then add a `textResponse` that shares the same defaults.
