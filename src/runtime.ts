import { Effect, pipe } from 'effect';
import { Telemetry } from './telemetry';

class ElementNotFoundError {
  readonly _tag = 'ElementNotFoundError';
}

export function mount(
  effect: Effect.Effect<Node>,
  selector: string
): Effect.Effect<Node, ElementNotFoundError> {
  return pipe(
    Effect.sync(() => document.querySelector(selector)),
    Effect.flatMap((el) =>
      el === null
        ? Effect.fail(new ElementNotFoundError())
        : pipe(
            effect,
            Effect.map((node) => el.appendChild(node))
          )
    )
  );
}

type MemoCache = Map<string, Node>;

const defaultCache: MemoCache = new Map();

function stableHash(input: unknown): string {
  return JSON.stringify(input);
}

export function memoizePipe<I>(
  fn: (input: I) => Effect.Effect<Node>,
  source: string,
  cache: MemoCache = defaultCache,
): (input: I) => Effect.Effect<Node> {
  return (input: I) =>
    Effect.sync(() => {
      const key = stableHash(input);
      const cached = cache.get(key);

      if (cached) {
        Telemetry.registerCacheHit(source, key);
        return cached.cloneNode(true);
      }

      return Effect.runSync(
        fn(input).pipe(
          Effect.tap((el) =>
            Effect.sync(() => {
              cache.set(key, el.cloneNode(true));
              Telemetry.registerCacheSet(source, key, input);
            })
          )
        )
      );
    });
}

export function component<I>(
  fn: (input: I) => Effect.Effect<Node>,
  name = 'anonymous'
): (input: I) => Effect.Effect<Node> {
  return memoizePipe(fn, name);
}
