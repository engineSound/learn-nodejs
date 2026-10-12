import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { collectAlerts } from './exercise.js';

test('collects readings above the limit', () => {
  const hub = new EventEmitter();
  const alerts = collectAlerts(hub, 100);
  hub.emit('reading', { device: 'oven', value: 230 });
  assert.deepEqual(alerts, ['oven: 230']);
});

test('ignores readings at or below the limit', () => {
  const hub = new EventEmitter();
  const alerts = collectAlerts(hub, 100);
  hub.emit('reading', { device: 'fan', value: 3 });
  hub.emit('reading', { device: 'heater', value: 100 });
  assert.deepEqual(alerts, []);
});

test('keeps collecting in order as readings arrive', () => {
  const hub = new EventEmitter();
  const alerts = collectAlerts(hub, 50);
  hub.emit('reading', { device: 'oven', value: 230 });
  hub.emit('reading', { device: 'fan', value: 3 });
  hub.emit('reading', { device: 'kettle', value: 98 });
  assert.deepEqual(alerts, ['oven: 230', 'kettle: 98']);
});

test('returns an array right away', () => {
  assert.ok(Array.isArray(collectAlerts(new EventEmitter(), 0)));
});
