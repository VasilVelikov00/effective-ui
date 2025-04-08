# effective-ui

[![npm version](https://img.shields.io/npm/v/@vasilvelikov/effective-ui)](https://www.npmjs.com/package/@vasilvelikov/effective-ui)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Composable, effect-based UI framework built on [Effect.ts](https://effect.website)**

> Experimental — work in progress. The API is unstable and subject to change.

---

### Features

- Everything is an `Effect`
- Declarative DOM via `tag`, `text`, `children`
- Tree-shakable for smaller builds
- Composable routing with dynamic path + query support
- Async data fetching with loading/error fallback
- Predictable UI pipes
- Pure, memoizable components (no diffing or VDOM)

---

### Installation

```bash
pnpm install @vasilvelikov/effective-ui
```

---

### Quick Start

```typescript
import { dom, runtime } from "@vasilvelikov/effective-ui";

const App = dom.tag(
  "div",
  dom.children(
    dom.tag("h1", dom.children(dom.text("Hello from effective-ui"))),
  ),
);

Effect.runPromise(runtime.mount(App, "#root"));
```

---

### Dev Preview

This repo includes examples that you can run locally.

```bash
pnpm install
pnpm run example counter
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Project Structure

```text
src/           → the core UI framework
examples/      → runnable examples
```

---

### TODO (Open to Contributions)

- Predefined components - _planned_
- Theming - _planned_
- SSR/streaming support - _maybe_

Want to contribute? See the [Contributing Guide](https://github.com/VasilVelikov00/effective-ui/blob/main/CONTRIBUTING.md).

See [CHANGELOG.md](https://github.com/VasilVelikov00/effective-ui/blob/main/CHANGELOG.md) for release history.
