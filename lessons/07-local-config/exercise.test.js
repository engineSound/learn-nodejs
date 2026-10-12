import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig } from './exercise.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'config-test-'));
const write = (name, text) => { const f = path.join(dir, name); fs.writeFileSync(f, text); return f; };

test('values in the file override the defaults', async () => {
  assert.deepEqual(await loadConfig(write('a.json', '{"port": 8080}')), { port: 8080, logLevel: 'info' });
});

test('keeps extra settings from the file', async () => {
  assert.deepEqual(await loadConfig(write('b.json', '{"logLevel": "debug", "name": "hub"}')), { port: 3000, logLevel: 'debug', name: 'hub' });
});

test('a missing file gives the defaults', async () => {
  assert.deepEqual(await loadConfig(path.join(dir, 'missing.json')), { port: 3000, logLevel: 'info' });
});

test('invalid JSON is still an error', async () => {
  await assert.rejects(loadConfig(write('bad.json', '{not json')));
});
