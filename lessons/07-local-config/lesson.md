---
id: node-07-local-config
track: nodejs
title: Read a local configuration
topic: Node modules & file I/O
minutes: 12
concepts: [modules, file-io, async-await, spread]
prereqs: [node-06-device-reading]
contrast: java
edit: exercise.js
---

# Read a local configuration

## Learn the idea

The service reads its settings from a JSON file. If the file is missing, it should still start with sensible defaults.

- **Modules**: `import { readFile } from 'node:fs/promises';` loads part of Node's standard library, like a Java `import`. The `node:` prefix marks built-ins. Your own files export with `export`.
- `await readFile(path, 'utf8')` returns the file's text. A missing file **rejects** with an error whose `code` is `'ENOENT'`.
- **Spread** merges objects: `{ ...defaults, ...fromFile }`. Later properties win, so file values override defaults.

```visual
{
 "title": "Merging settings with spread",
 "intro": "Spread copies properties in order; a later one with the same name wins.",
 "regions": [
  {
   "id": "def",
   "label": "defaults"
  },
  {
   "id": "file",
   "label": "from the file"
  },
  {
   "id": "res",
   "label": "{ ...defaults, ...fromFile }"
  }
 ],
 "scenarios": [
  {
   "name": "File overrides defaults",
   "group": "How it works",
   "code": "const defaults = { port: 3000, logLevel: 'info' };\nconst fromFile = { port: 8080 };\nconst config = { ...defaults, ...fromFile };\nconsole.log(config);",
   "check": {
    "output": "{ port: 8080, logLevel: 'info' }"
   },
   "steps": [
    {
     "line": 1,
     "say": "The defaults the service always has.",
     "set": [
      {
       "id": "dp",
       "in": "def",
       "title": "port",
       "value": "3000"
      },
      {
       "id": "dl",
       "in": "def",
       "title": "logLevel",
       "value": "\"info\""
      }
     ]
    },
    {
     "line": 2,
     "say": "What the config file says: only `port`.",
     "set": [
      {
       "id": "fp",
       "in": "file",
       "title": "port",
       "value": "8080"
      }
     ]
    },
    {
     "line": 3,
     "say": "`...defaults` copies each default into the new object first.",
     "rule": "Spread makes a new object; neither input changes.",
     "set": [
      {
       "id": "rp",
       "in": "res",
       "title": "port",
       "value": "3000",
       "state": "active"
      },
      {
       "id": "rl",
       "in": "res",
       "title": "logLevel",
       "value": "\"info\"",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "dp",
       "to": "rp",
       "state": "muted"
      },
      {
       "from": "dl",
       "to": "rl",
       "state": "muted"
      }
     ]
    },
    {
     "line": 3,
     "say": "`...fromFile` comes second, so its `port` overwrites the default.",
     "rule": "Later properties win: put overrides last.",
     "set": [
      {
       "id": "rp",
       "value": "8080",
       "state": "ok",
       "tag": "overridden"
      },
      {
       "id": "rl",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "fp",
       "to": "rp",
       "label": "wins",
       "state": "ok",
       "style": "solid"
      }
     ]
    }
   ]
  },
  {
   "name": "File is missing",
   "group": "How it works",
   "code": "try {\n  await readFile('/no/config.json', 'utf8');\n} catch (err) {\n  console.log(err.code);\n}",
   "check": {
    "prelude": "import { readFile } from 'node:fs/promises';",
    "output": "ENOENT"
   },
   "steps": [
    {
     "line": 2,
     "say": "`readFile` looks for the file; the Promise **rejects** because it isn't there.",
     "set": [
      {
       "id": "dp",
       "in": "def",
       "title": "port",
       "value": "3000"
      },
      {
       "id": "dl",
       "in": "def",
       "title": "logLevel",
       "value": "\"info\""
      },
      {
       "id": "err",
       "in": "file",
       "title": "readFile(…)",
       "tag": "rejects: ENOENT",
       "state": "bad"
      }
     ]
    },
    {
     "line": 4,
     "say": "`await` turns the rejection into an exception; `catch` sees `err.code === \"ENOENT\"`.",
     "rule": "\"ENOENT\" means \"no such file\". Expected here, so handle it.",
     "set": [
      {
       "id": "err",
       "value": "err.code = \"ENOENT\""
      }
     ]
    },
    {
     "line": 4,
     "say": "Missing file → use the defaults as they are.",
     "rule": "Only swallow the error you expect; rethrow anything else.",
     "set": [
      {
       "id": "rp",
       "in": "res",
       "title": "port",
       "value": "3000",
       "state": "ok"
      },
      {
       "id": "rl",
       "in": "res",
       "title": "logLevel",
       "value": "\"info\"",
       "state": "ok"
      }
     ],
     "arrows": [
      {
       "from": "dp",
       "to": "rp",
       "state": "ok"
      },
      {
       "from": "dl",
       "to": "rl",
       "state": "ok"
      }
     ]
    }
   ]
  },
  {
   "name": "Spread in the wrong order",
   "group": "What if it goes wrong",
   "code": "const config = { ...fromFile, ...defaults };\nconsole.log(config.port);",
   "check": {
    "prelude": "const defaults = { port: 3000, logLevel: 'info' }; const fromFile = { port: 8080 };",
    "output": "3000"
   },
   "steps": [
    {
     "line": 1,
     "say": "Same inputs, but the file is spread first…",
     "set": [
      {
       "id": "dp",
       "in": "def",
       "title": "port",
       "value": "3000"
      },
      {
       "id": "dl",
       "in": "def",
       "title": "logLevel",
       "value": "\"info\""
      },
      {
       "id": "fp",
       "in": "file",
       "title": "port",
       "value": "8080"
      },
      {
       "id": "rp",
       "in": "res",
       "title": "port",
       "value": "8080",
       "state": "active"
      }
     ],
     "arrows": [
      {
       "from": "fp",
       "to": "rp",
       "state": "muted"
      }
     ]
    },
    {
     "line": 1,
     "say": "…so the defaults come last and overwrite the file's value.",
     "rule": "Order decides who wins.",
     "set": [
      {
       "id": "rp",
       "value": "3000",
       "state": "bad",
       "tag": "file value lost"
      },
      {
       "id": "rl",
       "in": "res",
       "title": "logLevel",
       "value": "\"info\""
      }
     ],
     "arrows": [
      {
       "from": "dp",
       "to": "rp",
       "label": "wins",
       "state": "bad",
       "style": "solid"
      },
      {
       "from": "dl",
       "to": "rl",
       "state": "muted"
      }
     ],
     "error": "port is 3000: the setting in the file is ignored"
    }
   ]
  }
 ]
}
```

```run
import { writeFile, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const file = path.join(os.tmpdir(), 'demo-config.json');
await writeFile(file, '{"port": 8080}');
const fromFile = JSON.parse(await readFile(file, 'utf8'));
console.log({ port: 3000, logLevel: 'info', ...fromFile });

try {
  await readFile('/no/such/file.json', 'utf8');
} catch (err) {
  console.log('missing file →', err.code);
}
```

## Quick check

```predict
const defaults = { port: 3000, debug: false };
console.log({ ...defaults, debug: true }.debug, { debug: true, ...defaults }.debug);
---
options: true true | true false | false true
answer: true false
why: With spread, whichever comes later wins. Put the overrides last.
```

## Your turn

Write `async function loadConfig(file)`. Read the JSON file and return the defaults `{ port: 3000, logLevel: "info" }` overridden by whatever the file contains. If the file **doesn't exist**, return just the defaults. Other errors, such as invalid JSON, should still throw.

## Example

```
file contains {"port": 8080}   →  { port: 8080, logLevel: "info" }
file is missing                →  { port: 3000, logLevel: "info" }
```

## Hints

1. `import { readFile } from 'node:fs/promises';` at the top of the file.
2. `const text = await readFile(file, 'utf8');` then `JSON.parse(text)`, and spread it after the defaults.
3. In `catch (err)`, return the defaults only when `err.code === 'ENOENT'`; otherwise `throw err`.

## Review

Tomorrow, solve this again, then also let an environment variable `PORT` override the file.
