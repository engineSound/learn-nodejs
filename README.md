# learn-nodejs

A personal Node.js tutor that runs on my Mac (later on AWS). It picks the next
exercise from my learning history, runs my code against tests in seconds, and
explains mistakes in light of what I've struggled with before.

Sister project: `learn-rust`. Both follow [docs/SHARED-FORMAT.md](docs/SHARED-FORMAT.md)
so they can merge into one multi-language tutor later.

## Status

- [x] Lesson format, history format, roadmap
- [x] Lesson 01 (works from the command line today)
- [ ] Web app: lesson list, editor, Run button → test results
- [ ] History database + learner profile
- [ ] Tutor (Claude API) reading the profile
- [ ] Docker setup; deploy to AWS

## Doing a lesson today, before the app exists

Needs Node 22 or later.

```sh
cd lessons/01-values-functions
cat lesson.md            # read (~5 min)
$EDITOR exercise.js      # fill in the TODOs
node --test              # run the tests; repeat until green
```

Then add a line to [PROGRESS.md](PROGRESS.md).

## Docs

- [ROADMAP.md](ROADMAP.md): what to learn, in order, and the app milestones
- [docs/DESIGN.md](docs/DESIGN.md): how the app works
- [docs/SHARED-FORMAT.md](docs/SHARED-FORMAT.md): lesson and history formats shared with `learn-rust`
- [PROGRESS.md](PROGRESS.md): learning log; read by the tutor and by Claude
