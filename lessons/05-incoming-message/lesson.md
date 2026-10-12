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

```visual
{
 "title": "From text to object, and what happens when it breaks",
 "regions": [
  {
   "id": "text",
   "label": "Text that arrived"
  },
  {
   "id": "parse",
   "label": "JSON.parse"
  },
  {
   "id": "res",
   "label": "Your code gets"
  }
 ],
 "scenarios": [
  {
   "name": "A good message",
   "group": "How it works",
   "code": "const msg = JSON.parse('{\"device\":\"fan\",\"value\":3}');\nconsole.log(msg.device, msg.value, msg.battery);",
   "check": {
    "output": "fan 3 undefined"
   },
   "steps": [
    {
     "line": 1,
     "say": "A device sends **text**. Until you parse it, it's just characters.",
     "set": [
      {
       "id": "t",
       "in": "text",
       "title": "'{\"device\":\"fan\",\"value\":3}'",
       "tag": "string"
      }
     ]
    },
    {
     "line": 1,
     "say": "`JSON.parse` reads the text and builds a plain object. No classes, no Jackson annotations.",
     "rule": "`JSON.parse` turns text into objects; `JSON.stringify` goes back.",
     "set": [
      {
       "id": "t",
       "state": "faded"
      },
      {
       "id": "p",
       "in": "parse",
       "title": "JSON.parse(…)",
       "tag": "ok",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "t",
       "to": "p",
       "state": "muted"
      }
     ]
    },
    {
     "line": 1,
     "say": "You get an object with the same fields and JSON types: `value` is a number.",
     "set": [
      {
       "id": "p",
       "state": "faded"
      },
      {
       "id": "o",
       "in": "res",
       "title": "msg",
       "value": "{ device: \"fan\", value: 3 }",
       "tag": "object",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "p",
       "to": "o",
       "state": "ok"
      }
     ]
    },
    {
     "line": 2,
     "say": "Reading a missing field doesn't throw: you get `undefined`.",
     "rule": "Missing properties are `undefined`; check them yourself.",
     "set": [
      {
       "id": "m",
       "in": "res",
       "title": "msg.battery",
       "value": "undefined",
       "state": "active"
      }
     ]
    }
   ]
  },
  {
   "name": "Broken JSON",
   "group": "What if it goes wrong",
   "code": "try {\n  JSON.parse(\"{oops\");\n} catch (err) {\n  console.log(err.name);\n}",
   "check": {
    "output": "SyntaxError"
   },
   "steps": [
    {
     "line": 2,
     "say": "A message arrives half-written.",
     "set": [
      {
       "id": "t",
       "in": "text",
       "title": "\"{oops\"",
       "tag": "string",
       "state": "bad"
      }
     ]
    },
    {
     "line": 2,
     "say": "`JSON.parse` can't read it and **throws** a `SyntaxError`.",
     "rule": "There are no checked exceptions: nothing forces you to catch it.",
     "set": [
      {
       "id": "p",
       "in": "parse",
       "title": "JSON.parse(…)",
       "tag": "throws SyntaxError",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "t",
       "to": "p",
       "state": "bad"
      }
     ],
     "error": "SyntaxError: Expected property name"
    },
    {
     "line": 3,
     "say": "Without `try`, the error would stop your service. With `catch`, you decide what happens.",
     "rule": "Wrap parsing of untrusted text in `try { … } catch { … }`.",
     "set": [
      {
       "id": "c",
       "in": "res",
       "title": "catch (err)",
       "tag": "handled",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "p",
       "to": "c",
       "label": "thrown",
       "state": "bad",
       "style": "solid"
      }
     ]
    },
    {
     "line": 4,
     "say": "Here we print the error's name; in the exercise you return `null`.",
     "set": [
      {
       "id": "c",
       "value": "\"SyntaxError\""
      }
     ]
    }
   ]
  },
  {
   "name": "A number sent as text",
   "group": "What if it goes wrong",
   "code": "const msg = JSON.parse('{\"device\":\"fan\",\"value\":\"3\"}');\nconsole.log(typeof msg.value);",
   "check": {
    "output": "string"
   },
   "steps": [
    {
     "line": 1,
     "say": "The quotes around `\"3\"` matter in JSON.",
     "set": [
      {
       "id": "t",
       "in": "text",
       "title": "'{…\"value\":\"3\"}'",
       "tag": "string"
      }
     ]
    },
    {
     "line": 1,
     "say": "Parsing works: the JSON is valid.",
     "set": [
      {
       "id": "p",
       "in": "parse",
       "title": "JSON.parse(…)",
       "tag": "ok",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "t",
       "to": "p",
       "state": "muted"
      }
     ]
    },
    {
     "line": 2,
     "say": "But `value` is the **string** `\"3\"`, so `typeof` says `string`.",
     "rule": "Valid JSON isn't the same as the data you expect: check the types.",
     "set": [
      {
       "id": "o",
       "in": "res",
       "title": "msg.value",
       "value": "\"3\"",
       "tag": "string",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "p",
       "to": "o",
       "state": "bad"
      }
     ],
     "error": "typeof msg.value is \"string\", not \"number\""
    }
   ]
  }
 ]
}
```

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
