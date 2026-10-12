import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordStats } from './exercise.js';

test('counts words and unique words, ignoring case', () => {
  const s = wordStats('The cat and the hat');
  assert.equal(s.words, 5);
  assert.equal(s.unique, 4);
});

test('longest is the first of the longest words, in lower case', () => {
  assert.equal(wordStats('Tiny Elephant Giraffe').longest, 'elephant');
  assert.equal(wordStats('ab cd').longest, 'ab');
});

test('averageLength is rounded to two decimals', () => {
  assert.equal(wordStats('The cat and the hat').averageLength, 3);
  assert.equal(wordStats('a bb bb').averageLength, 1.67);
});

test('byFirstLetter counts every word by its first letter', () => {
  assert.deepEqual(wordStats('The cat and the hat').byFirstLetter, { t: 2, c: 1, a: 1, h: 1 });
});

test('extra whitespace and newlines do not create empty words', () => {
  assert.equal(wordStats('  one\n two\t\tthree  ').words, 3);
});

test('blank text gives empty statistics', () => {
  const empty = { words: 0, unique: 0, longest: null, averageLength: 0, byFirstLetter: {} };
  assert.deepEqual(wordStats(''), empty);
  assert.deepEqual(wordStats('   \n '), empty);
});
