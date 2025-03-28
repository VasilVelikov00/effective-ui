# effective-ui

**Composable, effect-based UI framework built on [Effect.ts](https://effect.website)**

> 🧪 Experimental — work in progress. The API is unstable and subject to change.

---

### ✨ Features

- Everything is an `Effect`
- Declarative DOM via `tag`, `text`, `children`
- Composable routing with dynamic path + query support
- Async data fetching with loading/error fallback
- Zero-hydration, predictable UI pipes
- Pure, memoizable components (no diffing or VDOM)

---

### 📦 Installation

```bash
npm install @vasilvelikov/effective-ui
```

---

### 🚀 Usage

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

Then open http://localhost:5173

---

### 📁 Project Structure

```text
src/      → the core UI framework
dev/      → local demo app using the framework
```

---

### 🔧 TODO (Open to Contributions)

- [ ] Control flow helpers
- [ ] Signals for re-rendering
- [ ] Effect-based context system
- [ ] JSX or template DSL (optional)
- [ ] SSR/streaming support

Want to contribute? See the [Contributing Guide](CONTRIBUTING.md).