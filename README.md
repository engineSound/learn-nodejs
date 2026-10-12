# learn-nodejs

A personal Node.js tutor that runs on my Mac (later on AWS). It picks the next
exercise from my learning history, runs my code against tests in seconds, and
explains mistakes in light of what I've struggled with before.

Sister project: `learn-rust`. Both follow [docs/SHARED-FORMAT.md](docs/SHARED-FORMAT.md)
so they can merge into one multi-language tutor later.

## Status

- [x] Lesson format, history format, roadmap
- [x] Lesson 01
- [x] Web app (M1): lesson list, editor, Run button → test results in well under a second
- [x] Learning history (M2): every run recorded; each lesson shows runs, best score and when you solved it
- [ ] Learner profile and review schedule
- [ ] Tutor (Claude API) reading the profile
- [ ] Docker setup; deploy to AWS

## Start the app

Needs Node 22 or later. There's nothing to install: the app uses only Node's
built-in modules.

```sh
npm start                # then open http://localhost:3000
```

Pick a lesson, read it on the left, write code on the right, and press
**Ctrl+Enter** (or **⌘+Enter**) to run the tests. Your code is saved as you
type, in `data/work/` (not committed). After a lesson, add a line to
[PROGRESS.md](PROGRESS.md).

`npm run dev` restarts the server when its code changes. `npm test` tests the
app itself (lesson tests are meant to fail until you solve them).

Without the app: `cd lessons/01-values-functions && node --test`.

## Docs

- [ROADMAP.md](ROADMAP.md): what to learn, in order, and the app milestones
- [docs/DESIGN.md](docs/DESIGN.md): how the app works
- [docs/SHARED-FORMAT.md](docs/SHARED-FORMAT.md): lesson and history formats shared with `learn-rust`
- [PROGRESS.md](PROGRESS.md): learning log; read by the tutor and by Claude
