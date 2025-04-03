# effective-ui

[![npm version](https://img.shields.io/npm/v/@vasilvelikov/effective-ui)](https://www.npmjs.com/package/@vasilvelikov/effective-ui)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Composable, effect-based UI framework built on [Effect.ts](https://effect.website)**

> 🧪 Experimental — work in progress. The API is unstable and subject to change.

---

### ✨ Features

- Everything is an `Effect`
- Declarative DOM via `tag`, `text`, `children`
- Composable routing with dynamic path + query support
- Async data fetching with loading/error fallback
- Predictable UI pipes
- Pure, memoizable components (no diffing or VDOM)

---

### 📦 Installation

```bash
npm install @vasilvelikov/effective-ui
```

---

### 🚀 Quick Start

```typescript
import { tag, text, children, mount } from '@vasilvelikov/effective-ui';

const App = tag('div', {}, children(
  tag('h1', {}, children(text('Hello from effective-ui')))
));

Effect.runPromise(mount(App, '#root'));
```

---

### 🧪 Dev Preview

This repo includes a local demo using Vite.

```bash
npm install
npm run preview
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 📁 Project Structure

```text
src/      → the core UI framework
dev/      → local demo app using the framework
```

---

### 🔧 TODO (Open to Contributions)

- Control flow helpers - _planned_
- Signals for re-rendering - _planned_
- SSR/streaming support - _planned_
- Effect-based context system - _maybe_
- JSX or template DSL (optional) - _maybe_

Want to contribute? See the [Contributing Guide](https://github.com/VasilVelikov00/effective-ui/blob/main/CONTRIBUTING.md).

See [CHANGELOG.md](https://github.com/VasilVelikov00/effective-ui/blob/main/CHANGELOG.md) for release history.