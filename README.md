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
- [x] Learner profile (M3): concept mastery, spaced-repetition reviews, recurring mistakes and the next step, written into `PROGRESS.md` after every run
- [x] Adaptive path (M3.5): reviews use fresh drills; struggles get extra drills, easy wins get stretch exercises; rate each exercise too easy / about right / too hard
- [x] Tutor (M4, optional): hints for your code and new drills aimed at your mistakes, verified before you see them
- [ ] Docker setup; deploy to AWS

## Start the app

Needs Node 22 or later. Nothing to install: the app uses only Node's
built-in modules (the optional tutor below needs one package).

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

## The tutor (optional)

Hints for your current code, and new drills written for your mistakes, from
Claude. Without it, everything else still works.

1. Create an API key at https://console.anthropic.com/ (billed per use,
   separate from a Claude subscription; roughly 2–5 cents per hint and
   10–30 cents per new drill).
2. `cp .env.example .env` and put the key after `ANTHROPIC_API_KEY=`.
   `.env` is never committed.
3. `npm install @anthropic-ai/sdk` (the official Anthropic SDK), then restart
   `npm start`.

Then, under any test result: **Hint** (optionally type a question first), or
**New drill on this**, which writes a drill aimed at what you find hard,
checks it against a working solution, and adds it to the lesson list.


## Docs

- [ROADMAP.md](ROADMAP.md): what to learn, in order, and the app milestones
- [docs/DESIGN.md](docs/DESIGN.md): how the app works
- [docs/SHARED-FORMAT.md](docs/SHARED-FORMAT.md): lesson and history formats shared with `learn-rust`
- [PROGRESS.md](PROGRESS.md): learning log; read by the tutor and by Claude
