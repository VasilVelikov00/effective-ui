import { Effect, pipe } from 'effect';

/**
 * Represents a network-level error during fetch.
 */
class FetchError {
  readonly _tag = 'FetchError';
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly statusText: string
  ) {}
}

/**
 * Represents a failure to parse JSON from a response.
 */
class JSONParseError {
  readonly _tag = 'JSONParseError';
  constructor(
    public readonly url: string,
    public readonly cause: unknown
  ) {}
}

/**
 * Fetches and parses a JSON response with typed error handling.
 *
 * @template T - The expected shape of the parsed JSON data.
 * @param url - The resource URL to fetch.
 * @param options - Optional fetch configuration.
 * @returns An Effect producing the parsed result or a typed error.
 */
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

/**
 * Wraps an async data loader and renderer into a single effectful component function.
 *
 * @template I - The input type.
 * @template O - The output type.
 * @template E - The error type.
 * @param load - A function that loads the data asynchronously.
 * @param render - A function that renders a DOM node from the loaded data.
 * @returns A function that takes input and returns a DOM-producing Effect.
 */
export const withData =
  <I, O, E = never>(
    load: (input: I) => Effect.Effect<O, E>,
    render: (data: O) => Effect.Effect<Node>
  ): ((input: I) => Effect.Effect<Node, E>) =>
  (input) =>
    pipe(load(input), Effect.flatMap(render));

/**
 * Enhances a data effect with loading and error fallback rendering.
 *
 * @template I - Input type to the effect.
 * @template E - Error type the effect may throw.
 * @param effectFn - The data effect that produces a DOM node.
 * @param fallback - A fallback object containing `loading` and `error` renderers.
 * @returns A function that wraps the effect in loading/error UI.
 */
export const withFallback =
  <I, E>(
    effectFn: (input: I) => Effect.Effect<Node, E>,
    fallback: {
      loading: () => Effect.Effect<Node>;
      error: (err: E) => Effect.Effect<Node>;
    }
  ): ((input: I) => Effect.Effect<Node>) =>
  (input) =>
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
