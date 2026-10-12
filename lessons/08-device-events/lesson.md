---
id: node-08-device-events
track: nodejs
title: Subscribe to device events
topic: EventEmitter
minutes: 12
concepts: [events, closures]
prereqs: [node-07-local-config]
contrast: java
edit: exercise.js
---

# Subscribe to device events

## Learn the idea

Devices don't wait to be asked: they push readings whenever they like. Node models this with **events**.

- `EventEmitter` (from `node:events`) is the observer pattern, built in. `emitter.on('reading', listener)` subscribes; `emitter.emit('reading', data)` calls every listener, in order, right away.
- Listeners are plain functions. A function can use variables from where it was created, even later: a **closure**. Java lambdas can only capture effectively-final variables; JavaScript closures can change them.

```visual
{
 "title": "Listeners and the closure that remembers",
 "regions": [
  {
   "id": "emit",
   "label": "hub.emit(…)"
  },
  {
   "id": "lst",
   "label": "Listeners for 'reading'"
  },
  {
   "id": "alerts",
   "label": "alerts (array)"
  }
 ],
 "scenarios": [
  {
   "name": "Subscribe, then emit",
   "group": "How it works",
   "code": "const alerts = [];\nhub.on('reading', r => {\n  if (r.value > 100) alerts.push(`${r.device}: ${r.value}`);\n});\nhub.emit('reading', { device: 'oven', value: 230 });\nhub.emit('reading', { device: 'fan', value: 3 });\nconsole.log(alerts);",
   "check": {
    "prelude": "import { EventEmitter } from 'node:events'; const hub = new EventEmitter();",
    "output": "[ 'oven: 230' ]"
   },
   "steps": [
    {
     "line": 1,
     "say": "An empty array to collect alerts.",
     "set": [
      {
       "id": "a",
       "in": "alerts",
       "title": "alerts",
       "value": "[ ]",
       "tag": "array"
      }
     ]
    },
    {
     "line": 2,
     "say": "`on` registers a listener function. It **captures** `alerts`: a closure.",
     "rule": "A function remembers the variables around where it was created.",
     "set": [
      {
       "id": "l",
       "in": "lst",
       "title": "r => { … alerts.push(…) }",
       "tag": "listener",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "l",
       "to": "a",
       "label": "captures",
       "state": "accent"
      }
     ]
    },
    {
     "line": 5,
     "say": "An event arrives. `emit` calls every listener **right away**, in order.",
     "rule": "`emit` is synchronous: listeners run before `emit` returns.",
     "set": [
      {
       "id": "e1",
       "in": "emit",
       "title": "{ device: 'oven', value: 230 }",
       "tag": "reading",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "e1",
       "to": "l",
       "state": "accent"
      },
      {
       "from": "l",
       "to": "a",
       "label": "captures",
       "state": "muted"
      }
     ]
    },
    {
     "line": 3,
     "say": "230 is above the limit, so the listener pushes into the captured array.",
     "set": [
      {
       "id": "a",
       "value": "[ 'oven: 230' ]",
       "state": "ok"
      },
      {
       "id": "e1",
       "state": "faded"
      }
     ],
     "arrows": [
      {
       "from": "l",
       "to": "a",
       "label": "push",
       "state": "ok",
       "style": "solid"
      }
     ]
    },
    {
     "line": 6,
     "say": "The fan reading is below the limit: the listener runs but does nothing.",
     "set": [
      {
       "id": "e2",
       "in": "emit",
       "title": "{ device: 'fan', value: 3 }",
       "tag": "reading",
       "state": "faded"
      }
     ],
     "arrows": [
      {
       "from": "e2",
       "to": "l",
       "state": "muted"
      },
      {
       "from": "l",
       "to": "a",
       "label": "captures",
       "state": "muted"
      }
     ]
    }
   ]
  },
  {
   "name": "Emit before subscribing",
   "group": "What if it goes wrong",
   "code": "hub.emit('reading', { device: 'oven', value: 230 });\nhub.on('reading', r => console.log(r.device));\nhub.emit('reading', { device: 'fan', value: 3 });",
   "check": {
    "prelude": "import { EventEmitter } from 'node:events'; const hub = new EventEmitter();",
    "output": "fan"
   },
   "steps": [
    {
     "line": 1,
     "say": "An event is emitted, but no one is listening yet.",
     "rule": "Events are not stored or replayed.",
     "set": [
      {
       "id": "e1",
       "in": "emit",
       "title": "{ device: 'oven', … }",
       "tag": "no listeners",
       "state": "bad"
      }
     ]
    },
    {
     "line": 1,
     "say": "It's simply lost.",
     "drop": [
      "e1"
     ],
     "error": "The oven reading was never seen"
    },
    {
     "line": 2,
     "say": "Now a listener subscribes…",
     "set": [
      {
       "id": "l",
       "in": "lst",
       "title": "r => console.log(r.device)",
       "tag": "listener",
       "state": "ok"
      }
     ]
    },
    {
     "line": 3,
     "say": "…and only events from now on reach it.",
     "rule": "Subscribe before anything can emit.",
     "set": [
      {
       "id": "e2",
       "in": "emit",
       "title": "{ device: 'fan', … }",
       "tag": "reading",
       "state": "active"
      },
      {
       "id": "o",
       "in": "alerts",
       "title": "prints \"fan\"",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "e2",
       "to": "l",
       "state": "accent"
      },
      {
       "from": "l",
       "to": "o",
       "state": "ok"
      }
     ]
    }
   ]
  }
 ]
}
```

```run
import { EventEmitter } from 'node:events';

const hub = new EventEmitter();
let count = 0;                       // the listener below keeps updating this
hub.on('reading', r => {
  count += 1;
  console.log(`#${count}: ${r.device} = ${r.value}`);
});

hub.emit('reading', { device: 'fan', value: 3 });
hub.emit('reading', { device: 'oven', value: 230 });
console.log('total readings:', count);
```

## Quick check

```predict
import { EventEmitter } from 'node:events';
const e = new EventEmitter();
e.emit('ping');
e.on('ping', () => console.log('pong'));
e.emit('ping');
---
options: pong | pong pong | (nothing)
answer: pong
why: Events aren't stored: the first `emit` happened before anyone listened, so it was lost. Only the second one printed.
```

## Your turn

Write `collectAlerts(emitter, limit)`. It subscribes to `'reading'` events, each `{ device, value }`, and **returns an array** that fills up over time with `"<device>: <value>"` for every reading **above** `limit`.

## Example

```
const alerts = collectAlerts(hub, 100);
hub.emit('reading', { device: 'oven', value: 230 });
hub.emit('reading', { device: 'fan', value: 3 });
alerts  →  ["oven: 230"]
```

## Hints

1. Create the array first: `const alerts = [];`, then return it at the end.
2. Subscribe with `emitter.on('reading', r => { … })`; inside, push when `r.value > limit`.
3. The listener keeps a reference to `alerts` (a closure), so readings emitted *after* you return still land in it.

## Review

Tomorrow, solve this again, then return a function that unsubscribes (`emitter.off`).
