// learn-nodejs web app. No dependencies: only Node's built-in modules.
// Start with `npm start`, then open http://localhost:3000.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLessons, loadLesson } from './lessons.js';
import { runLesson } from './runner.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS = path.join(ROOT, 'lessons');
const WORK = path.join(ROOT, 'data', 'work');
const PUBLIC = path.join(ROOT, 'app', 'public');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const MAX_BODY = 256 * 1024;

const INFO = { track: 'nodejs', title: 'Learn Node.js', accent: '#2f7d32' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

const workPath = lesson => path.join(WORK, lesson.slug, lesson.file);

function savedCode(lesson) {
  try { return fs.readFileSync(workPath(lesson), 'utf8'); } catch { return null; }
}

function saveCode(lesson, code) {
  fs.mkdirSync(path.dirname(workPath(lesson)), { recursive: true });
  fs.writeFileSync(workPath(lesson), code);
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Code is too large'), { status: 413 })); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (req.method === 'GET' && p === '/api/info') return send(res, 200, INFO);
  if (req.method === 'GET' && p === '/api/lessons') return send(res, 200, listLessons(LESSONS));

  const m = /^\/api\/lessons\/([^/]+)(\/code|\/run)?$/.exec(p);
  if (m) {
    const lesson = loadLesson(LESSONS, decodeURIComponent(m[1]));
    if (!lesson) return send(res, 404, { error: 'No such lesson' });
    const action = m[2] || '';
    if (req.method === 'GET' && action === '') {
      const saved = savedCode(lesson);
      return send(res, 200, { slug: lesson.slug, meta: lesson.meta, body: lesson.body, file: lesson.file, code: saved ?? lesson.starter, saved: saved !== null });
    }
    if (req.method === 'PUT' && action === '/code') {
      saveCode(lesson, await readBody(req));
      return send(res, 200, { saved: true });
    }
    if (req.method === 'DELETE' && action === '/code') {
      fs.rmSync(workPath(lesson), { force: true });
      return send(res, 200, { code: lesson.starter });
    }
    if (req.method === 'POST' && action === '/run') {
      const code = await readBody(req);
      saveCode(lesson, code);
      return send(res, 200, await runLesson(lesson, code));
    }
    return send(res, 405, { error: 'Method not allowed' });
  }

  if (req.method === 'GET') {
    const file = p === '/' ? 'index.html' : p.slice(1);
    const full = path.join(PUBLIC, file);
    if (full.startsWith(PUBLIC + path.sep) && fs.existsSync(full) && fs.statSync(full).isFile()) {
      return send(res, 200, fs.readFileSync(full), TYPES[path.extname(full)] || 'application/octet-stream');
    }
  }
  return send(res, 404, { error: 'Not found' });
}

http.createServer((req, res) => {
  handle(req, res).catch(err => {
    console.error(err);
    if (!res.headersSent) send(res, err.status || 500, { error: err.message });
  });
}).listen(PORT, HOST, () => {
  console.log(`${INFO.title} running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
