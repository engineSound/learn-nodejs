# Roadmap

**Learner:** professional Java developer, intermediate Python, language
learner and researcher. **Goal:** general fluency plus backend/APIs.
**Pace:** short daily sessions (~20 min), under 3 hours a week. Week numbers
assume that pace; slower is fine.

The order below is the *core* path. The app adapts around it (drills, stretches,
reviews; see `docs/SHARED-FORMAT.md`, section 5). Lessons contrast with Java first (and Python where that fits better), so
known ideas go fast and time goes to what's actually different.

## Learning path

### Module 1: Node.js from scratch (weeks 1–3), built ✅
One practical skill per exercise (~8–12 min), in a running story: the backend
for a small fleet of home devices. Each has an animated step-through visual
(including what goes wrong), a runnable example, a quick check, the exercise
and three hints.

| # | Exercise | Skill | Key difference from Java |
|---|----------|-------|--------------------------|
| 01 | Your first JavaScript function | functions, template literals | functions stand alone; no types |
| 02 | Convert a temperature | numbers, `const` | one number type; `toFixed` returns a string |
| 03 | Decide when a battery is low | conditions, `===`, truthiness | `==` converts; `0` is falsy |
| 04 | Pick active devices | arrays, objects, `filter`/`map` | eager array methods; `sort` mutates |
| 05 | Read an incoming message | JSON, `try`/`catch` | no checked exceptions |
| 06 | Wait for a device reading | Promises, `async`/`await` | one thread, event loop |
| 07 | Read a local configuration | modules, `fs/promises`, spread | `node:` imports; `ENOENT` |
| 08 | Subscribe to device events | `EventEmitter`, closures | closures can change captured variables |
| 09 | Describe an HTTP response | destructuring, defaults | options objects instead of overloads |
| 10 | Build an event summary | `reduce`, objects as maps | mini project |

Practice and challenge exercises so far: a drill for 03, a challenge for 04;
the tutor generates more on demand.

### Module 2: Going deeper (weeks 4–5)
| # | Lesson | |
|---|--------|---|
| 11 | Closures and `this` | `this` depends on how you call |
| 12 | Classes and prototypes | `class` is syntax over prototypes |
| 13 | Promise combinators | `Promise.all` / `allSettled`, sequential vs parallel |
| 14 | Streams | backpressure; reading big files |

### Module 3: The platform (weeks 6–7)
| # | Lesson | |
|---|--------|---|
| 11 | `fs`, `path`, `process` | files, env vars, exit codes |
| 12 | npm and `package.json` | dependencies, scripts, semver |
| 13 | Testing with `node:test` | the test runner these lessons use |

### Module 4: Backend (weeks 8–11)
| # | Lesson | |
|---|--------|---|
| 14 | A raw `http` server | what frameworks hide |
| 15 | Fastify | routes, plugins, JSON schema validation |
| 16 | SQLite from Node | queries, migrations |
| 17 | A REST API | CRUD, status codes, errors |
| 18 | Auth basics | sessions vs tokens, password hashing |
| 19 | Testing an API | `inject`, fixtures |

### Module 5: Capstone (week 12 onward)
A **vocabulary API with spaced repetition**: words, reviews and a
"what's due today" endpoint. It uses everything above, and the same project
is the `learn-rust` capstone, so you can compare the two languages directly.

## App milestones

| Milestone | What you get |
|-----------|--------------|
| M1 ✅ | Website lists lessons; editor; **Run** shows test results in seconds |
| M2 ✅ | Every run, pass and fail saved to the history log (`data/events.jsonl`) |
| M3 ✅ | Learner profile generated after each session; review items scheduled |
| M3.5 ✅ | Adaptive path: reviews with fresh drills, extra drills after a struggle, stretches after an easy win, your own difficulty ratings |
| M4 ✅ | **Tutor (Claude API)**: hints and error explanations in your style; a step-through visual of your own failing code, checked against what it really does; generates new drills aimed at your recurring mistakes, verified against a reference solution before you see them |
| M5 | Docker; deploy to an existing EC2 instance behind a login |
