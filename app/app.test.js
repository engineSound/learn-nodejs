import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter, listLessons, loadLesson } from './lessons.js';
import { parseTap, runLesson } from './runner.js';

const LESSONS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'lessons');

test('front matter: strings, numbers, lists, comments', () => {
  const { meta, body } = parseFrontMatter('---\nid: x-01  # comment\nminutes: 20\nconcepts: [a, b]\nprereqs: []\n---\n# Hi\n');
  assert.deepEqual(meta, { id: 'x-01', minutes: 20, concepts: ['a', 'b'], prereqs: [] });
  assert.equal(body, '# Hi\n');
});

test('every lesson has the required front matter and its edit file exists', () => {
  const lessons = listLessons(LESSONS);
  assert.ok(lessons.length > 0);
  for (const { slug } of lessons) {
    const l = loadLesson(LESSONS, slug);
    for (const key of ['id', 'track', 'title', 'minutes', 'concepts', 'edit']) assert.ok(key in l.meta, `${slug} is missing ${key}`);
    assert.equal(l.meta.track, 'nodejs');
    assert.ok(l.starter.length > 0);
  }
});

test('loadLesson rejects path tricks', () => {
  assert.equal(loadLesson(LESSONS, '../app'), null);
  assert.equal(loadLesson(LESSONS, 'no-such-lesson'), null);
});

test('parseTap reads results and multi-line errors', () => {
  const tap = [
    'TAP version 13',
    '# Subtest: adds',
    'ok 1 - adds',
    '  ---',
    '  duration_ms: 1',
    '  ...',
    '# Subtest: subtracts',
    'not ok 2 - subtracts',
    '  ---',
    '  error: |-',
    '    Expected values to be strictly equal:',
    '    ',
    '    1 !== 2',
    '  code: \'ERR_ASSERTION\'',
    '  ...',
  ].join('\n');
  assert.deepEqual(parseTap(tap), [
    { name: 'adds', ok: true, message: '' },
    { name: 'subtracts', ok: false, message: 'Expected values to be strictly equal:\n\n1 !== 2' },
  ]);
});

test('runLesson: starter fails, a syntax error is reported as not loading', async () => {
  const lesson = loadLesson(LESSONS, '01-values-functions');
  const starter = await runLesson(lesson, lesson.starter);
  assert.equal(starter.passed, 0);
  assert.ok(starter.failed > 0);

  const broken = await runLesson(lesson, 'export function (');
  assert.equal(broken.compileErrors.length, 1);
  assert.equal(broken.total, 0);
});

test('runLesson: a correct solution passes every test', async () => {
  const lesson = loadLesson(LESSONS, '01-values-functions');
  const solution = `
export const parseScores = line => line.split(',').map(s => s.trim()).filter(s => s !== '').map(Number).filter(n => !Number.isNaN(n));
export const average = nums => nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
export const groupByLength = words => words.reduce((acc, w) => { (acc[w.length] ??= []).push(w); return acc; }, {});
export const makeMultiplier = factor => x => x * factor;`;
  const r = await runLesson(lesson, solution);
  assert.equal(r.failed, 0, r.output);
  assert.equal(r.passed, r.total);
  assert.ok(r.total >= 9);
  assert.equal(fs.existsSync(lesson.dir + '/package.json'), false, 'runner must not write into the lesson folder');
});

test('history: append, read back, skip a torn line, compute stats', async () => {
  const { appendEvent, readEvents, lessonStats, runPayload } = await import('./history.js');
  const os = await import('node:os');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'learn-hist-')), 'events.jsonl');
  const fail = { passed: 2, failed: 1, total: 3, tests: [{ name: 'a', ok: true }, { name: 'b', ok: true }, { name: 'c', ok: false }], compileErrors: [], timedOut: false };
  const pass = { ...fail, passed: 3, failed: 0, tests: fail.tests.map(t => ({ ...t, ok: true })) };

  assert.deepEqual(lessonStats([], 'x'), { runs: 0, first_pass_run: null, last_result: null, last_ts: null, best_passed: 0, total: null });
  appendEvent(file, { track: 'nodejs', lesson_id: 'x', kind: 'lesson_open' });
  appendEvent(file, { track: 'nodejs', lesson_id: 'x', kind: 'fail', payload: runPayload(fail, 'code 1') });
  appendEvent(file, { track: 'nodejs', lesson_id: 'other', kind: 'pass', payload: runPayload(pass, '') });
  appendEvent(file, { track: 'nodejs', lesson_id: 'x', kind: 'pass', payload: runPayload(pass, 'code 2') });
  fs.appendFileSync(file, '{"ts":"broken');

  const events = readEvents(file);
  assert.equal(events.length, 4);
  assert.deepEqual(Object.keys(events[0]), ['ts', 'track', 'lesson_id', 'concept', 'kind', 'duration_ms', 'payload']);
  assert.deepEqual(events[1].payload.failing, ['c']);
  const st = lessonStats(events, 'x');
  assert.equal(st.runs, 2);
  assert.equal(st.first_pass_run, 2);
  assert.equal(st.last_result, 'pass');
  assert.equal(st.best_passed, 3);
  assert.equal(st.total, 3);
});
