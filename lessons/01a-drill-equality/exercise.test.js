import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toNumbers, sameValue, total } from './exercise.js';

test('toNumbers keeps numbers and trims spaces', () => {
  assert.deepEqual(toNumbers(['4', ' 2 ', '-1.5']), [4, 2, -1.5]);
});

test('toNumbers drops blanks instead of turning them into 0', () => {
  assert.deepEqual(toNumbers(['', '  ', '7']), [7]);
});

test('toNumbers drops things that are not numbers', () => {
  assert.deepEqual(toNumbers(['x', '3', 'NaN']), [3]);
});

test('sameValue treats NaN as equal to NaN', () => {
  assert.equal(sameValue(NaN, NaN), true);
});

test('sameValue does not convert types', () => {
  assert.equal(sameValue(1, '1'), false);
  assert.equal(sameValue(0, ''), false);
});

test('sameValue is otherwise like ===', () => {
  assert.equal(sameValue(0, -0), true);
  assert.equal(sameValue('a', 'a'), true);
  assert.equal(sameValue(1, 2), false);
});

test('total of numbers, and of an empty array', () => {
  assert.equal(total([1, 2, 3.5]), 6.5);
  assert.equal(total([]), 0);
});
