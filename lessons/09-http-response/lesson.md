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

```visual
{
 "title": "How destructuring fills in defaults",
 "regions": [
  {
   "id": "call",
   "label": "The call"
  },
  {
   "id": "params",
   "label": "{ status = 200, headers = {} } = {}"
  },
  {
   "id": "res",
   "label": "Response"
  }
 ],
 "scenarios": [
  {
   "name": "Only data",
   "group": "How it works",
   "code": "function respond(data, { status = 200, headers = {} } = {}) {\n  return { status, headers, body: JSON.stringify(data) };\n}\nconsole.log(respond({ ok: true }).status);",
   "check": {
    "output": "200"
   },
   "steps": [
    {
     "line": 4,
     "say": "The caller passes only `data`. The options argument is `undefined`.",
     "set": [
      {
       "id": "d",
       "in": "call",
       "title": "data",
       "value": "{ ok: true }"
      },
      {
       "id": "o",
       "in": "call",
       "title": "options",
       "value": "undefined",
       "state": "faded"
      }
     ]
    },
    {
     "line": 1,
     "say": "`= {}` replaces the missing options object with an empty one…",
     "rule": "A default applies when the argument is `undefined`.",
     "set": [
      {
       "id": "obj",
       "in": "params",
       "title": "options",
       "value": "{ }",
       "tag": "default",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "o",
       "to": "obj",
       "label": "= {}",
       "state": "accent"
      }
     ]
    },
    {
     "line": 1,
     "say": "…then destructuring pulls out `status` and `headers`; both missing, so both get their defaults.",
     "rule": "Destructuring with defaults replaces Java's overloads.",
     "set": [
      {
       "id": "obj",
       "state": "faded"
      },
      {
       "id": "s",
       "in": "params",
       "title": "status",
       "value": "200",
       "tag": "default",
       "state": "ok"
      },
      {
       "id": "h",
       "in": "params",
       "title": "headers",
       "value": "{ }",
       "tag": "default",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "The response uses them.",
     "set": [
      {
       "id": "r",
       "in": "res",
       "title": "response",
       "value": "{ status: 200, … }",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "s",
       "to": "r",
       "state": "ok"
      }
     ]
    }
   ]
  },
  {
   "name": "With options",
   "group": "How it works",
   "code": "respond({ error: 'not found' }, { status: 404 });",
   "steps": [
    {
     "line": 1,
     "say": "This time the caller passes an options object with `status`.",
     "set": [
      {
       "id": "d",
       "in": "call",
       "title": "data",
       "value": "{ error: 'not found' }"
      },
      {
       "id": "o",
       "in": "call",
       "title": "options",
       "value": "{ status: 404 }",
       "state": "active"
      }
     ]
    },
    {
     "line": 1,
     "say": "`status` is present, so it's used; `headers` is missing, so it gets the default.",
     "rule": "Defaults fill only what's missing.",
     "set": [
      {
       "id": "s",
       "in": "params",
       "title": "status",
       "value": "404",
       "tag": "from the call",
       "state": "ok"
      },
      {
       "id": "h",
       "in": "params",
       "title": "headers",
       "value": "{ }",
       "tag": "default",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "o",
       "to": "s",
       "state": "ok"
      }
     ]
    },
    {
     "line": 1,
     "say": "One function, every combination of options.",
     "set": [
      {
       "id": "r",
       "in": "res",
       "title": "response",
       "value": "{ status: 404, … }",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "s",
       "to": "r",
       "state": "ok"
      }
     ]
    }
   ]
  },
  {
   "name": "null is not missing",
   "group": "What if it goes wrong",
   "code": "const { status = 200 } = { status: null };\nconsole.log(status);",
   "check": {
    "output": "null"
   },
   "steps": [
    {
     "line": 1,
     "say": "The options object has `status: null`.",
     "set": [
      {
       "id": "o",
       "in": "call",
       "title": "options",
       "value": "{ status: null }",
       "state": "active"
      }
     ]
    },
    {
     "line": 1,
     "say": "`null` is a real value, so the default is **not** used.",
     "rule": "Defaults apply to `undefined` only, never to `null`.",
     "set": [
      {
       "id": "s",
       "in": "params",
       "title": "status",
       "value": "null",
       "tag": "not 200!",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "o",
       "to": "s",
       "state": "bad"
      }
     ]
    },
    {
     "line": 2,
     "say": "The response would go out with `status: null`.",
     "rule": "Use `?? 200` if `null` should also mean \"use the default\".",
     "set": [
      {
       "id": "r",
       "in": "res",
       "title": "response",
       "value": "{ status: null, … }",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "s",
       "to": "r",
       "state": "bad"
      }
     ],
     "error": "status is null, not 200"
    }
   ]
  }
 ]
}
```

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
