import { Effect, pipe } from 'effect';

class FetchError {
  readonly _tag = 'FetchError';
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly statusText: string
  ) {}
}

class JSONParseError {
  readonly _tag = 'JSONParseError';
  constructor(
    public readonly url: string,
    public readonly cause: unknown
  ) {}
}

export const fetchJSON = <T>(
  url: string,
  options?: RequestInit
): Effect.Effect<T, FetchError | JSONParseError> =>
  pipe(
    Effect.tryPromise<Response, FetchError>({
      try: () => fetch(url, options),
      catch: (err) =>
        new FetchError(
          url,
          0,
          err instanceof Error ? err.message : String(err)
        ),
    }),
    Effect.flatMap((res) =>
      res.ok
        ? Effect.tryPromise<T, JSONParseError>({
            try: () => res.json(),
            catch: (err) => new JSONParseError(url, err),
          })
        : Effect.fail<FetchError | JSONParseError>(
            new FetchError(url, res.status, res.statusText)
          )
    )
  );

export function withData<I, O, E = never>(
  load: (input: I) => Effect.Effect<O, E>,
  render: (data: O) => Effect.Effect<Node>
): (input: I) => Effect.Effect<Node, E> {
  return (input) => pipe(load(input), Effect.flatMap(render));
}

export function withFallback<I, E>(
  effectFn: (input: I) => Effect.Effect<Node, E>,
  fallback: {
    loading: () => Effect.Effect<Node>;
    error: (err: E) => Effect.Effect<Node>;
  }
): (input: I) => Effect.Effect<Node> {
  return (input) =>
    pipe(
      fallback.loading(),
      Effect.flatMap((loadingNode) =>
        Effect.sync(() => {
          const wrapper = document.createElement('div');
          wrapper.appendChild(loadingNode);

          Effect.runPromise(
            effectFn(input).pipe(
              Effect.catchAll(fallback.error),
              Effect.map((finalNode) => {
                wrapper.innerHTML = '';
                wrapper.appendChild(finalNode);
              })
            )
          );

          return wrapper;
        })
      )
    );
}
