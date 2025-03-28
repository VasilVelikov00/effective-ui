import { Effect, pipe } from 'effect';

type EventHandler = Effect.Effect<void>;

type EventName = keyof HTMLElementEventMap;
type EventPropKey = `on${Capitalize<string & EventName>}`;

type NonFunctionNonEventKeys<T> = {
  [K in keyof T]: K extends `on${string}` | 'children' | 'style'
    ? never
    : T[K] extends Function
      ? never
      : K;
}[keyof T];

export type TagProps<K extends keyof HTMLElementTagNameMap> = Partial<
  Pick<
    HTMLElementTagNameMap[K],
    NonFunctionNonEventKeys<HTMLElementTagNameMap[K]>
  > & {
    style?: Partial<CSSStyleDeclaration>;
  } & {
    [K in EventPropKey]?: EventHandler;
  }
>;

const runVoidEffect = (eff: Effect.Effect<void>) => {
  void Effect.runPromise(eff);
};

export const tag = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: TagProps<K> = {},
  children: Effect.Effect<Node[]> = Effect.succeed([])
): Effect.Effect<HTMLElementTagNameMap[K]> =>
  pipe(
    Effect.sync(() => document.createElement(tagName)),
    Effect.tap((el) =>
      Effect.sync(() => {
        for (const [key, value] of Object.entries(props)) {
          if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
          } else if (key.startsWith('on') && Effect.isEffect(value)) {
            const eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, () =>
              runVoidEffect(value as Effect.Effect<void>)
            );
          } else if (key in el) {
            (el as Record<string, unknown>)[key] = value;
          }
        }
      })
    ),
    Effect.flatMap((el) =>
      pipe(
        children,
        Effect.tap((nodes) =>
          Effect.sync(() => {
            nodes.forEach((child) => el.appendChild(child));
          })
        ),
        Effect.map(() => el)
      )
    )
  );

export const text = (content: string): Effect.Effect<Text> =>
  Effect.sync(() => document.createTextNode(content));

export const children = (
  ...nodes: Effect.Effect<Node>[]
): Effect.Effect<Node[]> => Effect.all(nodes);
