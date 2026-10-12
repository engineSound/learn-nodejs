import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jsonResponse } from './exercise.js';

test('works with only the data: status 200 and a JSON content type', () => {
  assert.deepEqual(jsonResponse({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: '{"ok":true}',
  });
});

test('uses the given status', () => {
  assert.equal(jsonResponse({ error: 'not found' }, { status: 404 }).status, 404);
});

test('adds extra headers to the content type', () => {
  assert.deepEqual(jsonResponse({}, { headers: { 'x-device': 'fan' } }).headers, {
    'content-type': 'application/json',
    'x-device': 'fan',
  });
});

test('the body is a JSON string', () => {
  assert.equal(jsonResponse([1, 2]).body, '[1,2]');
});

test('does not change the headers it was given', () => {
  const headers = { 'x-device': 'fan' };
  jsonResponse({}, { headers });
  assert.deepEqual(headers, { 'x-device': 'fan' });
});
