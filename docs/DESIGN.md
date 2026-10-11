# Design

## What it is
A small web app I run on my Mac and later on AWS. It shows the next lesson,
lets me write code in the browser, runs the lesson's tests, and remembers
everything so a tutor (Claude) can adapt to me.

## Parts

```
browser ──► Fastify server ──► runner (child process, node --test, 10 s timeout)
                 │
                 ├──► SQLite: data/history.db  (event log, see SHARED-FORMAT.md)
                 ├──► profile builder → data/profile.md
                 └──► tutor: Claude API (profile + lesson + my code + test output)
```

- **Web UI:** server-rendered pages plus a code editor (CodeMirror). No build step.
- **Runner:** writes my code to a temp copy of the lesson folder and runs
  `node --test` in a child process with a timeout. Results come back as JSON.
- **History:** append-only `events` table; everything else is derived.
- **Profile builder:** after each session, recomputes per-concept mastery and
  review dates (spaced repetition) and writes `data/profile.md`.
- **Tutor:** called only when I ask for a hint or explanation, or after
  repeated failures. Prompt = profile + lesson.md + my code + test output.
  API key in `.env` (`ANTHROPIC_API_KEY`), never committed.

## Running it
- **Mac (now):** `npm install && npm start`, open http://localhost:3000.
- **AWS (later):** the same app in a Docker container on an existing EC2
  instance, behind HTTPS and a login, because it runs code.

## Safety
The runner executes code I wrote. Only I use it, but it still runs with a
timeout, in a temp directory, and in a container on AWS.
