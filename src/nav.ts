import { Effect } from 'effect';
import { parse } from 'regexparam';

type RouteParams = {
  path: string;
  pathParams: Record<string, string>;
  searchParams: URLSearchParams;
};

type RouteEffect = (params: RouteParams) => Effect.Effect<Node>;

export function router(
  routes: Record<string, RouteEffect>,
  fallback: RouteEffect = () =>
    Effect.sync(() => document.createTextNode('404 Not Found'))
): Effect.Effect<Node> {
  return Effect.async<Node>((resume) => {
    const container = document.createElement('div');

    const matchers = Object.entries(routes).map(([pattern, effect]) => {
      const parsed = parse(pattern);
      return { ...parsed, effect };
    });

    const resolve = (path: string): Effect.Effect<Node> => {
      const [pathname, query = ''] = path.split('?');
      const searchParams = new URLSearchParams(query);

      for (const { keys, pattern, effect } of matchers) {
        const match = pattern.exec(pathname);
        if (!match) continue;

        const pathParams: Record<string, string> = {};
        for (let i = 0; i < keys.length; i++) {
          pathParams[keys[i]] = match[i + 1];
        }

        return effect({ path, pathParams, searchParams });
      }

      return fallback({ path, pathParams: {}, searchParams });
    };

    const render = (path: string) => {
      const effect = resolve(path);
      Effect.runPromise(
        effect.pipe(
          Effect.tap((node) =>
            Effect.sync(() => {
              container.replaceChildren(node);
            })
          )
        )
      );
    };

    render(location.pathname + location.search);

    window.addEventListener('popstate', () =>
      render(location.pathname + location.search)
    );

    resume(Effect.succeed(container));
  });
}

export const navigate = (path: string) =>
  Effect.sync(() => {
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
