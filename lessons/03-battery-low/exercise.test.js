import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBatteryLow } from './exercise.js';

test('15% and not charging is low', () => {
  assert.equal(isBatteryLow(15, false), true);
});

test('15% while charging is not low', () => {
  assert.equal(isBatteryLow(15, true), false);
});

test('exactly 20% is not low', () => {
  assert.equal(isBatteryLow(20, false), false);
});

test('0% is low (watch out: 0 is falsy)', () => {
  assert.equal(isBatteryLow(0, false), true);
});

test('an unknown level is not low', () => {
  assert.equal(isBatteryLow(undefined, false), false);
  assert.equal(isBatteryLow(null, false), false);
});
