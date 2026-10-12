import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeReading } from './exercise.js';

const after = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

test('describes a reading in °C', async () => {
  assert.equal(await describeReading({ read: () => Promise.resolve(21.5) }), '21.5°C');
});

test('waits for a slow sensor', async () => {
  assert.equal(await describeReading({ read: () => after(50, 19) }), '19°C');
});

test('a failed reading gives "unavailable" instead of an error', async () => {
  assert.equal(await describeReading({ read: () => Promise.reject(new Error('offline')) }), 'unavailable');
});

test('returns a promise (it is an async function)', () => {
  const result = describeReading({ read: () => Promise.resolve(1) });
  assert.equal(typeof result.then, 'function');
});
