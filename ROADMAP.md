# Roadmap

**Learner:** professional Java developer, intermediate Python, language
learner and researcher. **Goal:** general fluency plus backend/APIs.
**Pace:** short daily sessions (~20 min), under 3 hours a week. Week numbers
assume that pace; slower is fine.

The order below is the *core* path. The app adapts around it (drills, stretches,
reviews; see `docs/SHARED-FORMAT.md`, section 5). Lessons contrast with Java first (and Python where that fits better), so
known ideas go fast and time goes to what's actually different.

## Learning path

### Phase 1: The language (weeks 1–3)
| # | Lesson | Key difference from Java |
|---|--------|--------------------------|
| 01 | Values, equality, functions | `===` vs `==`, `const`/`let`, functions are values |
| 02 | Objects and arrays | object literals, destructuring, spread, no classes required |
| 03 | Closures and `this` | functions capture scope; `this` depends on how you call |
| 04 | Classes and prototypes | `class` is syntax over prototypes |
| 05 | Modules | ESM `import`/`export` vs CommonJS `require` |
| 06 | Errors | `throw` anything; no checked exceptions |

### Phase 2: Asynchrony (weeks 4–5), the biggest shift from Java
| # | Lesson | |
|---|--------|---|
| 07 | The event loop | one thread, a queue, no blocking |
| 08 | Promises | `then`, rejection, `Promise.all` / `allSettled` |
| 09 | `async` / `await` | and the bugs it hides (sequential vs parallel) |
| 10 | Streams | backpressure; reading big files |

### Phase 3: The platform (weeks 6–7)
| # | Lesson | |
|---|--------|---|
| 11 | `fs`, `path`, `process` | files, env vars, exit codes |
| 12 | npm and `package.json` | dependencies, scripts, semver |
| 13 | Testing with `node:test` | the test runner these lessons use |

### Phase 4: Backend (weeks 8–11)
| # | Lesson | |
|---|--------|---|
| 14 | A raw `http` server | what frameworks hide |
| 15 | Fastify | routes, plugins, JSON schema validation |
| 16 | SQLite from Node | queries, migrations |
| 17 | A REST API | CRUD, status codes, errors |
| 18 | Auth basics | sessions vs tokens, password hashing |
| 19 | Testing an API | `inject`, fixtures |

### Phase 5: Capstone (week 12 onward)
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
| M4 ✅ | **Tutor (Claude API)**: hints and error explanations in your style; generates new drills aimed at your recurring mistakes, verified against a reference solution before you see them |
| M5 | Docker; deploy to an existing EC2 instance behind a login |
