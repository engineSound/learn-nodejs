import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseScores, average, groupByLength, makeMultiplier } from './exercise.js';

test('parseScores keeps numbers and trims spaces', () => {
  assert.deepEqual(parseScores('3, 10, 7'), [3, 10, 7]);
});

test('parseScores skips non-numbers', () => {
  assert.deepEqual(parseScores('3,x,7'), [3, 7]);
});

test('parseScores skips empty items instead of turning them into 0', () => {
  assert.deepEqual(parseScores('3,,7, '), [3, 7]);
});

test('parseScores keeps decimals and negatives', () => {
  assert.deepEqual(parseScores('-1.5,2'), [-1.5, 2]);
});

test('average of numbers', () => {
  assert.equal(average([2, 4, 9]), 5);
});

test('average of an empty array is null', () => {
  assert.equal(average([]), null);
});

test('groupByLength groups words by length', () => {
  assert.deepEqual(groupByLength(['cat', 'horse', 'dog']), { 3: ['cat', 'dog'], 5: ['horse'] });
});

test('groupByLength of no words is an empty object', () => {
  assert.deepEqual(groupByLength([]), {});
});

test('makeMultiplier returns a function', () => {
  const triple = makeMultiplier(3);
  assert.equal(typeof triple, 'function');
  assert.equal(triple(5), 15);
});
