// The tutor: hints and newly generated drills from Claude, adapted to the learner's profile.
// Prompts live in docs/tutor/ (shared with learn-rust). Rules: docs/SHARED-FORMAT.md, section 6.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runLesson } from './runner.js';

export const MODEL = 'claude-opus-5-5';
const MAX_TOKENS = 16000;
const ATTEMPTS = 2;

export class TutorError extends Error {
  constructor(message, status = 502) { super(message); this.status = status; }
}

let sdk = null;
let client = null;
let fake = null;

/** Tests pass an object with the same `beta.messages.create` shape as the SDK client. */
export function setClientForTests(c) { fake = c; }

async function getClient() {
  if (fake) return fake;
  if (!client) {
    try {
      sdk = (await import('@anthropic-ai/sdk')).default;
    } catch {
      throw new TutorError('The tutor needs the Anthropic SDK: run `npm install @anthropic-ai/sdk` in this repo, then restart.', 503);
    }
    client = new sdk(); // credentials: ANTHROPIC_API_KEY (from .env), ANTHROPIC_AUTH_TOKEN or an `ant auth login` profile
  }
  return client;
}

export async function tutorStatus() {
  if (fake) return { enabled: true, reason: null };
  try {
    await import('@anthropic-ai/sdk');
    return { enabled: true, reason: null };
  } catch {
    return { enabled: false, reason: 'run `npm install @anthropic-ai/sdk` and put ANTHROPIC_API_KEY in .env, then restart.' };
  }
}

/** One request to Claude; returns the text of the reply. */
async function ask({ system, messages, effort, schema }) {
  const c = await getClient();
  let response;
  try {
    response = await c.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default', // a declined request is re-run on Anthropic's recommended fallback model
      output_config: { effort, ...(schema ? { format: { type: 'json_schema', schema } } : {}) },
      system,
      messages,
    });
  } catch (err) {
    if (sdk && err instanceof sdk.AuthenticationError) throw new TutorError('The API key was rejected. Check ANTHROPIC_API_KEY in .env.', 401);
    if (sdk && err instanceof sdk.RateLimitError) throw new TutorError('The tutor is rate-limited right now. Try again in a minute.', 429);
    if (sdk && err instanceof sdk.APIError) throw new TutorError(`The Claude API returned an error (${err.status ?? 'network'}): ${err.message}`);
    throw err;
  }
  if (response.stop_reason === 'refusal') throw new TutorError('The tutor declined this request.');
  if (response.stop_reason === 'max_tokens') throw new TutorError('The tutor ran out of room before finishing. Try again.');
  return response.content.filter(b => b.type === 'text').map(b => b.text).join('');
}

// ---------- prompts ----------

const render = (template, vars) => template.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? String(vars[k]) : `{{${k}}}`));
const readPrompt = (docsDir, name) => fs.readFileSync(path.join(docsDir, 'tutor', name), 'utf8');

/** The "## Learner" section of PROGRESS.md: the learner's own description. */
export function learnerSection(progressText) {
  const lines = String(progressText || '').split('\n');
  const start = lines.findIndex(l => l.trim() === '## Learner');
  if (start < 0) return '(not written yet)';
  const out = [];
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith('## ') || l.startsWith('<!--')) break;
    out.push(l);
  }
  return out.join('\n').trim() || '(not written yet)';
}

function systemPrompt(ctx) {
  return render(readPrompt(ctx.docsDir, 'system.md'), {
    track_name: ctx.trackName,
    learner: ctx.learner,
    profile: ctx.profileMarkdown.split('\n').filter(l => !l.startsWith('<!--')).join('\n'),
  });
}

/** Plain-text summary of a run result for the prompt. */
export function describeResult(r) {
  if (!r) return 'Not run yet.';
  if (r.timedOut) return 'The run timed out.';
  if (r.compileErrors.length) return 'It does not compile/load yet:\n\n' + r.compileErrors.map(e => `${e.code ? e.code + ' ' : ''}${e.title}\n${e.message}`).join('\n\n');
  const lines = [`${r.passed} of ${r.total} tests pass.`];
  for (const t of r.tests.filter(t => !t.ok)) lines.push(`- FAILED ${t.name}${t.message ? `: ${t.message.split('\n').slice(0, 6).join(' / ')}` : ''}`);
  return lines.join('\n');
}

// ---------- hints ----------

/**
 * @param ctx { docsDir, trackName, learner, profileMarkdown }
 * @param hintInput { title, lesson, file, code, result, question }
 */
export async function hint(ctx, { title, lesson, file, code, result, question }) {
  const user = render(readPrompt(ctx.docsDir, 'hint.md'), {
    title, lesson, file, code, result: describeResult(result),
    question: question && question.trim() ? question.trim() : '(No question: they pressed "Hint".)',
  });
  return (await ask({ system: systemPrompt(ctx), messages: [{ role: 'user', content: user }], effort: 'medium' })).trim();
}

// ---------- generated drills ----------

const oneLine = s => String(s).replace(/\s+/g, ' ').replace(/ #/g, ' ').trim();

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 5).join('-') || 'drill';
}

function checkShape(d) {
  for (const k of ['title', 'slug', 'explanation', 'starter', 'tests', 'solution', 'targets']) {
    if (typeof d?.[k] !== 'string' || !d[k].trim()) return `field "${k}" is missing or empty`;
  }
  if (!Array.isArray(d.concepts)) return 'field "concepts" must be a list';
  return null;
}

/** Run the drill's tests against its starter (must fail) and its solution (must pass). */
async function verify(drill, explanation) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'learn-gen-'));
  try {
    fs.writeFileSync(path.join(dir, 'lesson.md'), explanation);
    fs.writeFileSync(path.join(dir, 'exercise.js'), drill.starter);
    fs.writeFileSync(path.join(dir, 'exercise.test.js'), drill.tests);
    const lesson = { dir, file: 'exercise.js' };
    const starter = await runLesson(lesson, drill.starter);
    if (starter.compileErrors.length || starter.timedOut) return `The starter code does not load: ${describeResult(starter)}`;
    if (starter.total < 2) return `Only ${starter.total} test(s) ran; write at least 2.`;
    if (starter.passed === starter.total) return 'Every test already passes against the starter code, so the tests check nothing.';
    const solved = await runLesson(lesson, drill.solution);
    if (solved.compileErrors.length || solved.timedOut || solved.failed || solved.total !== starter.total) {
      return `The solution does not pass the tests: ${describeResult(solved)}`;
    }
    return null;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Ask Claude for a drill aimed at the learner's difficulties, verify it, and save it
 * as lessons/<NN>g-<slug>/ (kind: drill, for: the core lesson).
 *
 * @param ctx  { docsDir, trackName, learner, profileMarkdown, lessonsDir, dataDir, track: 'nodejs', idPrefix: 'node' }
 * @param plan { parent: { id, slug, title, concepts, body }, existing: string, target: string }
 * @returns { slug, id, title, targets, attempts }
 */
export async function generateDrill(ctx, plan) {
  const { parent } = plan;
  const user = render(readPrompt(ctx.docsDir, 'drill.md'), {
    target: plan.target,
    parent_title: parent.title,
    parent_id: parent.id,
    parent_concepts: parent.concepts.join(', '),
    parent_lesson: parent.body,
    existing: plan.existing || '(none)',
    conventions: readPrompt(ctx.docsDir, `conventions-${ctx.track}.md`),
  });
  const schema = JSON.parse(readPrompt(ctx.docsDir, 'drill-schema.json'));
  const messages = [{ role: 'user', content: user }];
  let problem = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const text = await ask({ system: systemPrompt(ctx), messages, effort: 'high', schema });
    let drill = null;
    try { drill = JSON.parse(text); } catch { problem = 'The reply was not valid JSON.'; }
    if (drill) problem = checkShape(drill) || (await verify(drill, drill.explanation));
    if (!problem) return save(ctx, plan, drill, attempt);
    messages.push({ role: 'assistant', content: text });
    messages.push({ role: 'user', content: `The app checked this drill and it failed:\n\n${problem}\n\nReturn a corrected drill in the same format.` });
  }
  throw new TutorError(`The tutor couldn't produce a drill that passed its checks (${problem}). Try again.`);
}

function save(ctx, plan, drill, attempts) {
  const { parent } = plan;
  const nn = (/^\d+/.exec(parent.slug) || ['00'])[0];
  const base = `${nn}g-${slugify(drill.slug)}`;
  let slug = base;
  for (let i = 2; fs.existsSync(path.join(ctx.lessonsDir, slug)); i++) slug = `${base}-${i}`;
  const concepts = drill.concepts.map(slugify).filter(c => parent.concepts.includes(c));
  const id = `${ctx.idPrefix}-${slug}`;
  const frontMatter = [
    '---',
    `id: ${id}`,
    `track: ${ctx.track}`,
    `title: ${oneLine(drill.title)}`,
    'kind: drill',
    `for: ${parent.id}`,
    `minutes: ${Number.isInteger(drill.minutes) && drill.minutes > 0 ? drill.minutes : 10}`,
    `concepts: [${(concepts.length ? concepts : parent.concepts).join(', ')}]`,
    `prereqs: [${parent.id}]`,
    'contrast: java',
    'edit: exercise.js',
    'generated: true',
    `targets: ${oneLine(drill.targets)}`,
    '---',
    '',
  ].join('\n');
  const dir = path.join(ctx.lessonsDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'lesson.md'), frontMatter + drill.explanation.trim() + '\n');
  fs.writeFileSync(path.join(dir, 'exercise.js'), drill.starter.trimEnd() + '\n');
  fs.writeFileSync(path.join(dir, 'exercise.test.js'), drill.tests.trimEnd() + '\n');
  // The reference solution stays local (data/ is gitignored): the learner never sees it.
  const solDir = path.join(ctx.dataDir, 'solutions', slug);
  fs.mkdirSync(solDir, { recursive: true });
  fs.writeFileSync(path.join(solDir, 'exercise.js'), drill.solution.trimEnd() + '\n');
  return { slug, id, title: oneLine(drill.title), targets: oneLine(drill.targets), attempts };
}

/** What the drill should aim at, from the profile and the latest failures on this lesson. */
export function drillTarget(profile, parent, events, lessonIds) {
  const lines = [];
  const mine = profile.lessons.find(l => l.id === parent.id);
  if (mine) {
    lines.push(`- Their history on "${parent.title}": ${mine.runs} runs, ${mine.first_pass_run ? `solved on run ${mine.first_pass_run}` : 'not solved yet'}${mine.feedback ? `, rated "${mine.feedback}"` : ''}.`);
  }
  const weak = profile.concepts.filter(c => parent.concepts.includes(c.name) && c.mastery !== null).sort((a, b) => a.mastery - b.mastery);
  if (weak.length) lines.push(`- Mastery of this lesson's concepts (0–1): ${weak.map(c => `${c.name} ${c.mastery.toFixed(2)}`).join(', ')}.`);
  if (profile.recurring.length) lines.push(`- Recurring mistakes across all exercises: ${profile.recurring.map(r => `${r.what} ×${r.count}`).join(', ')}.`);
  const fails = events.filter(e => e.kind === 'fail' && lessonIds.includes(e.lesson_id) && e.payload).slice(-3);
  for (const f of fails) {
    const what = [...(f.payload.errors || []), ...(f.payload.failing || [])].slice(0, 4).join('; ');
    if (what) lines.push(`- A recent failing run on this lesson: ${what}.`);
  }
  if (!lines.length) lines.push('- No history on this lesson yet: write a gentle drill covering its main concept.');
  return lines.join('\n');
}
