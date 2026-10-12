import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMessage } from './exercise.js';

test('reads a valid message', () => {
  assert.deepEqual(parseMessage('{"device":"fan","value":3}'), { device: 'fan', value: 3 });
});

test('broken JSON gives null instead of an error', () => {
  assert.equal(parseMessage('{oops'), null);
});

test('a missing value gives null', () => {
  assert.equal(parseMessage('{"device":"fan"}'), null);
});

test('a value sent as text gives null', () => {
  assert.equal(parseMessage('{"device":"fan","value":"3"}'), null);
});

test('extra fields are left out', () => {
  assert.deepEqual(parseMessage('{"device":"fan","value":3,"battery":80}'), { device: 'fan', value: 3 });
});
