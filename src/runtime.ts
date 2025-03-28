import { Effect, pipe } from 'effect';

class ElementNotFoundError {
  readonly _tag = 'ElementNotFoundError';
}

export const mount = (
  effect: Effect.Effect<Node>,
  selector: string
): Effect.Effect<Node, ElementNotFoundError> =>
  pipe(
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

type MemoCache = Map<string, Node>;

const defaultCache: MemoCache = new Map();

function stableHash(input: unknown): string {
  return JSON.stringify(input);
}

export function memoizePipe<I>(
  fn: (input: I) => Effect.Effect<Node>,
  cache: MemoCache = defaultCache
): (input: I) => Effect.Effect<Node> {
  return (input: I) =>
    Effect.sync(() => {
      const key = stableHash(input);
      const cached = cache.get(key);

      if (cached) {
        return cached.cloneNode(true);
      }

      return Effect.runSync(
        fn(input).pipe(
          Effect.tap((el) =>
            Effect.sync(() => {
              cache.set(key, el.cloneNode(true));
            })
          )
        )
      );
    });
}

export function component<I>(
  fn: (input: I) => Effect.Effect<Node>
): (input: I) => Effect.Effect<Node> {
  return memoizePipe(fn);
}
