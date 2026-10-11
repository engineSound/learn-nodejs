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
