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

```visual
{
 "title": "Inside the event loop",
 "intro": "Node runs your code on **one** thread. Slow work waits elsewhere, and its follow-up joins a queue.",
 "regions": [
  {
   "id": "stack",
   "label": "Call stack: running now"
  },
  {
   "id": "wait",
   "label": "Waiting: timers, I/O"
  },
  {
   "id": "queue",
   "label": "Task queue: ready to run"
  },
  {
   "id": "out",
   "label": "Console",
   "kind": "output"
  }
 ],
 "scenarios": [
  {
   "name": "setTimeout(…, 0)",
   "group": "How it works",
   "code": "console.log('a');\nsetTimeout(() => console.log('b'), 0);\nconsole.log('c');",
   "check": {
    "output": "a\nc\nb"
   },
   "steps": [
    {
     "line": 1,
     "say": "The first line runs right away on the call stack.",
     "rule": "Only one thing runs at a time: whatever is on the call stack.",
     "set": [
      {
       "id": "l1",
       "in": "stack",
       "title": "console.log('a')",
       "state": "active"
      },
      {
       "id": "oa",
       "in": "out",
       "title": "a"
      }
     ]
    },
    {
     "line": 2,
     "say": "`setTimeout` doesn't wait. It hands the callback to a timer and returns immediately.",
     "rule": "Starting slow work never blocks the thread.",
     "set": [
      {
       "id": "t",
       "in": "wait",
       "title": "() => console.log('b')",
       "tag": "timer: 0 ms",
       "state": "active"
      }
     ],
     "drop": [
      "l1"
     ]
    },
    {
     "line": 3,
     "say": "The rest of your code keeps running.",
     "set": [
      {
       "id": "t",
       "state": "normal"
      },
      {
       "id": "l3",
       "in": "stack",
       "title": "console.log('c')",
       "state": "active"
      },
      {
       "id": "oc",
       "in": "out",
       "title": "c"
      }
     ]
    },
    {
     "line": null,
     "say": "The timer is done (0 ms!), so its callback moves to the task queue. It still has to wait its turn.",
     "rule": "Finished work goes to the queue, not straight onto the stack.",
     "set": [
      {
       "id": "t",
       "in": "queue",
       "tag": "ready",
       "state": "active"
      }
     ],
     "drop": [
      "l3"
     ]
    },
    {
     "line": 2,
     "say": "The stack is empty, so the event loop takes the next task from the queue.",
     "rule": "The event loop runs queued callbacks only when the stack is empty.",
     "set": [
      {
       "id": "t",
       "in": "stack",
       "tag": "running"
      }
     ]
    },
    {
     "line": 2,
     "say": "Now `b` prints, last.",
     "rule": "That's why the output is `a c b`.",
     "set": [
      {
       "id": "ob",
       "in": "out",
       "title": "b",
       "state": "ok"
      }
     ]
    }
   ]
  },
  {
   "name": "await a reading",
   "group": "How it works",
   "code": "async function show() {\n  console.log('asking');\n  const v = await sensor.read();\n  console.log('got', v);\n}\nshow();\nconsole.log('meanwhile');",
   "check": {
    "prelude": "const sensor = { read: () => new Promise(r => setTimeout(() => r(21.5), 10)) };",
    "output": "asking\nmeanwhile\ngot 21.5"
   },
   "steps": [
    {
     "line": 6,
     "say": "`show()` is called and starts running.",
     "set": [
      {
       "id": "show",
       "in": "stack",
       "title": "show()",
       "tag": "running",
       "state": "active"
      }
     ]
    },
    {
     "line": 2,
     "say": "It logs `asking`.",
     "set": [
      {
       "id": "o1",
       "in": "out",
       "title": "asking"
      }
     ]
    },
    {
     "line": 3,
     "say": "`sensor.read()` starts the reading and returns a **Promise**: a value that arrives later.",
     "rule": "A Promise is like Java's `CompletableFuture`.",
     "set": [
      {
       "id": "p",
       "in": "wait",
       "title": "Promise",
       "value": "pending…",
       "tag": "sensor reading",
       "state": "active"
      }
     ]
    },
    {
     "line": 3,
     "say": "`await` pauses **only `show`**. It steps off the stack, so the thread is free.",
     "rule": "`await` suspends the function, not the program.",
     "set": [
      {
       "id": "show",
       "in": "wait",
       "tag": "paused at await",
       "state": "faded"
      },
      {
       "id": "p",
       "state": "normal"
      }
     ],
     "arrows": [
      {
       "from": "show",
       "to": "p",
       "label": "waiting for",
       "state": "muted"
      }
     ]
    },
    {
     "line": 7,
     "say": "Meanwhile the rest of your program runs.",
     "set": [
      {
       "id": "m",
       "in": "stack",
       "title": "console.log('meanwhile')",
       "state": "active"
      },
      {
       "id": "o2",
       "in": "out",
       "title": "meanwhile"
      }
     ]
    },
    {
     "line": null,
     "say": "The reading arrives: the Promise resolves with `21.5`, and `show` is ready to continue.",
     "set": [
      {
       "id": "p",
       "value": "21.5",
       "tag": "resolved",
       "state": "ok"
      },
      {
       "id": "show",
       "in": "queue",
       "tag": "ready to resume",
       "state": "active"
      }
     ],
     "drop": [
      "m"
     ],
     "arrows": [
      {
       "from": "p",
       "to": "show",
       "label": "21.5",
       "state": "ok"
      }
     ]
    },
    {
     "line": 4,
     "say": "`show` resumes where it paused, with `v = 21.5`, and logs it.",
     "rule": "Code after `await` runs later, from the queue.",
     "set": [
      {
       "id": "show",
       "in": "stack",
       "tag": "running"
      },
      {
       "id": "o3",
       "in": "out",
       "title": "got 21.5",
       "state": "ok"
      }
     ],
     "drop": [
      "p"
     ],
     "arrows": []
    }
   ]
  },
  {
   "name": "Forgot await",
   "group": "What if it goes wrong",
   "code": "const v = sensor.read();\nconsole.log(v);",
   "check": {
    "prelude": "const sensor = { read: () => new Promise(r => setTimeout(() => r(21.5), 10)) };",
    "output": "Promise { <pending> }"
   },
   "steps": [
    {
     "line": 1,
     "say": "`sensor.read()` returns a Promise right away; the reading is still on its way.",
     "set": [
      {
       "id": "p",
       "in": "wait",
       "title": "Promise",
       "value": "pending…",
       "tag": "sensor reading",
       "state": "active"
      },
      {
       "id": "v",
       "in": "stack",
       "title": "v",
       "value": "Promise",
       "tag": "not a number!",
       "state": "bad"
      }
     ],
     "arrows": [
      {
       "from": "v",
       "to": "p",
       "state": "bad"
      }
     ]
    },
    {
     "line": 2,
     "say": "Without `await`, `v` is the Promise itself, not the reading.",
     "rule": "Inside an `async` function, `await` gives you the value.",
     "set": [
      {
       "id": "o",
       "in": "out",
       "title": "Promise { <pending> }",
       "state": "bad"
      }
     ],
     "error": "Prints Promise { <pending> } instead of 21.5"
    }
   ]
  }
 ]
}
```

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
