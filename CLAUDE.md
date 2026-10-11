# Notes for Claude

This repo is a personal Node.js tutor app and its lessons. Read these first:

1. `PROGRESS.md`: who the learner is and where they are. Teach from there.
2. `ROADMAP.md`: lesson order and app milestones.
3. `docs/SHARED-FORMAT.md`: lesson and history formats. **They are shared with
   the `learn-rust` repo; change them in both repos or not at all.**

Teaching rules:
- The learner is a professional Java developer. Contrast with Java; skip
  basics Java already covers.
- Sessions are ~20 minutes. A lesson is ~5 minutes of reading plus one exercise.
- Never hand over a full solution unprompted; give the smallest hint that unblocks.
- New lessons follow the lesson format exactly, and their tests must pass
  against a reference solution before committing (do not commit the solution).

Tech: Node 22+, ESM (`"type": "module"`), `node:test` for tests.

App: `app/` (server, lesson loader, test runner; no npm dependencies, keep it
that way unless there's a strong reason). `app/public/` is shared byte-for-byte
with `learn-rust`. Check with `npm test`, then run `npm start` and try a lesson.
