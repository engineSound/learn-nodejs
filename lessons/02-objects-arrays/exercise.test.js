import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fullName, withDefaults, pick, updateUser } from './exercise.js';

const frozen = obj => JSON.parse(JSON.stringify(obj));

test('fullName joins first and last', () => {
  assert.equal(fullName({ first: 'Ada', last: 'Lovelace', born: 1815 }), 'Ada Lovelace');
});

test('withDefaults fills in missing options', () => {
  assert.deepEqual(withDefaults({}), { retries: 3, verbose: false, timeoutMs: 1000 });
});

test('withDefaults keeps falsy values that were given', () => {
  assert.deepEqual(withDefaults({ retries: 0, verbose: true }), { retries: 0, verbose: true, timeoutMs: 1000 });
});

test('withDefaults does not change its argument', () => {
  const opts = { retries: 1 };
  withDefaults(opts);
  assert.deepEqual(opts, { retries: 1 });
});

test('pick keeps only the named keys that exist', () => {
  assert.deepEqual(pick({ a: 1, b: 2, c: 3 }, ['a', 'c', 'z']), { a: 1, c: 3 });
  assert.deepEqual(pick({ a: undefined }, ['a']), { a: undefined });
});

test('updateUser changes top-level fields', () => {
  assert.deepEqual(updateUser({ name: 'Ada', age: 36 }, { age: 37 }), { name: 'Ada', age: 37 });
});

test('updateUser merges the address instead of replacing it', () => {
  const user = { name: 'Ada', address: { city: 'London', zip: 'N1' } };
  assert.deepEqual(updateUser(user, { address: { city: 'Oslo' } }), { name: 'Ada', address: { city: 'Oslo', zip: 'N1' } });
});

test('updateUser does not mutate the user or the nested address', () => {
  const user = { name: 'Ada', address: { city: 'London', zip: 'N1' } };
  const before = frozen(user);
  const updated = updateUser(user, { name: 'Grace', address: { zip: 'E2' } });
  assert.deepEqual(user, before);
  assert.notEqual(updated.address, user.address);
});
