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
