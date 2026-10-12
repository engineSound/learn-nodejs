import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toFahrenheit } from './exercise.js';

test('freezing point: 0°C is 32°F', () => {
  assert.equal(toFahrenheit(0), 32);
});

test('boiling point: 100°C is 212°F', () => {
  assert.equal(toFahrenheit(100), 212);
});

test('-40 is the same in both scales', () => {
  assert.equal(toFahrenheit(-40), -40);
});

test('rounds to one decimal place: 21.5°C is 70.7°F', () => {
  assert.equal(toFahrenheit(21.5), 70.7);
});

test('returns a number, not a string', () => {
  assert.equal(typeof toFahrenheit(21.5), 'number');
});
