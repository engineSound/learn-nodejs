import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './exercise.js';

const readings = [
  { device: 'oven', value: 230 },
  { device: 'fan', value: 3 },
  { device: 'oven', value: 180 },
];

test('counts all readings', () => {
  assert.equal(summarize(readings).total, 3);
});

test('counts readings per device', () => {
  assert.deepEqual(summarize(readings).byDevice, { oven: 2, fan: 1 });
});

test('finds the hottest reading', () => {
  assert.deepEqual(summarize(readings).hottest, { device: 'oven', value: 230 });
});

test('on a tie, the first hottest reading wins', () => {
  const tie = [{ device: 'a', value: 5 }, { device: 'b', value: 5 }];
  assert.deepEqual(summarize(tie).hottest, { device: 'a', value: 5 });
});

test('no readings: zero, empty, null', () => {
  assert.deepEqual(summarize([]), { total: 0, byDevice: {}, hottest: null });
});
