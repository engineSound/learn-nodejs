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
