# Design

## What it is
A small web app I run on my Mac and later on AWS. It shows the next lesson,
lets me write code in the browser, runs the lesson's tests, and remembers
everything so a tutor (Claude) can adapt to me.

## Parts

```
browser ──► node:http server ──► runner (child process, node --test, 10 s timeout)
                 │
                 ├──► data/events.jsonl  (event log, see SHARED-FORMAT.md)
                 ├──► profile builder → data/profile.md
                 └──► tutor: Claude API (profile + lesson + my code + test output)
```

- **No dependencies.** The server uses only Node's built-in modules, so
  there's no `npm install` and nothing to update. (Fastify comes later as a
  lesson, not as plumbing.)
- **Web UI** (`app/public/`, shared with `learn-rust`): plain HTML, CSS and
  JS. A textarea editor with line numbers, a small Markdown renderer for
  lessons, and a results panel. Works offline.
- **Runner** (`app/runner.js`): copies the lesson to a temp folder, writes my
  code into the `edit:` file, runs `node --test --test-reporter=tap` in a
  child process with a 10 s timeout, and parses the TAP output into JSON.
- **Server** (`app/server.js`): the API in `docs/SHARED-FORMAT.md`. Listens
  on 127.0.0.1 only unless `HOST` is set.
- **History** (`app/history.js`): every lesson open and every run is
  appended to `data/events.jsonl`; per-lesson stats are derived from it on
  each request. The file lives only on the machine running the app (it's
  gitignored). The learner profile (M3) is the summary that gets committed.
- **Profile builder:** after each session, recomputes per-concept mastery and
  review dates (spaced repetition) and writes `data/profile.md`.
- **Tutor:** called only when I ask for a hint or explanation, or after
  repeated failures. Prompt = profile + lesson.md + my code + test output.
  API key in `.env` (`ANTHROPIC_API_KEY`), never committed.

## Running it
- **Mac (now):** `npm start`, open http://localhost:3000.
- **AWS (later):** the same app in a Docker container on an existing EC2
  instance, behind HTTPS and a login, because it runs code.

## Safety
The runner executes code I wrote. Only I use it, but it still runs with a
timeout, in a temp directory, and in a container on AWS.
