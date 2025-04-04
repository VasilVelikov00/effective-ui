import { Effect, pipe } from "effect"

import { ensureDelegatedListener, generateEventId, getCachedEventId, registerEvent } from "./events.js"

type EventHandler = Effect.Effect<void>

type EventName = keyof HTMLElementEventMap
type EventPropKey = `on${Capitalize<string & EventName>}`

type NonFunctionNonEventKeys<T> = {
  [K in keyof T]: K extends `on${string}` | "children" | "style" ? never
    : T[K] extends (...args: Array<any>) => any ? never
    : K
}[keyof T]

export type TagProps<K extends keyof HTMLElementTagNameMap> = Partial<
  & Pick<
    HTMLElementTagNameMap[K],
    NonFunctionNonEventKeys<HTMLElementTagNameMap[K]>
  >
  & {
    style?: Partial<CSSStyleDeclaration>
  }
  & {
    [K in EventPropKey]?: EventHandler
  }
>

const runVoidEffect = (eff: Effect.Effect<void>) => {
  void Effect.runPromise(eff)
}

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K
): Effect.Effect<HTMLElementTagNameMap[K]>

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: TagProps<K>
): Effect.Effect<HTMLElementTagNameMap[K]>

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  children: Effect.Effect<Array<Node>>
): Effect.Effect<HTMLElementTagNameMap[K]>

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: TagProps<K>,
  children: Effect.Effect<Array<Node>>
): Effect.Effect<HTMLElementTagNameMap[K]>

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  maybePropsOrChildren?: TagProps<K> | Effect.Effect<Array<Node>>,
  maybeChildren?: Effect.Effect<Array<Node>>
): Effect.Effect<HTMLElementTagNameMap[K]> {
  const isChildrenOnly = Effect.isEffect(maybePropsOrChildren)

  const props = (isChildrenOnly ? {} : maybePropsOrChildren) as TagProps<K>
  const children = isChildrenOnly
    ? (maybePropsOrChildren as Effect.Effect<Array<Node>>)
    : (maybeChildren ?? Effect.succeed([]))

  return pipe(
    Effect.sync(() => {
      return document.createElement(tagName)
    }),
    Effect.tap((el) =>
      Effect.sync(() => {
        for (const [key, value] of Object.entries(props)) {
          if (key === "style" && typeof value === "object") {
            Object.assign(el.style, value)
          } else if (key.startsWith("on") && Effect.isEffect(value)) {
            const effect = value as Effect.Effect<void>
            const eventName = key.slice(2).toLowerCase()

            const register: Effect.Effect<void, unknown, never> = Effect.gen(
              function*() {
                try {
                  const cachedFn = yield* getCachedEventId
                  const id = yield* cachedFn(effect)
                  el.setAttribute(`data-${eventName}-event`, id)
                  ensureDelegatedListener(eventName)
                } catch {
                  const id = yield* generateEventId
                  el.setAttribute(`data-${eventName}-event`, id)
                  registerEvent(id, () => runVoidEffect(effect))
                  ensureDelegatedListener(eventName)
                }
              }
            )

            Effect.runSync(register)
          } else if (key in el) {
            ;(el as Record<string, unknown>)[key] = value
          }
        }
      })
    ),
    Effect.flatMap((el) =>
      pipe(
        children,
        Effect.tap((nodes) =>
          Effect.sync(() => {
            nodes.forEach((child) => el.appendChild(child))
          })
        ),
        Effect.map(() => el)
      )
    )
  )
}

export const text = (content: string): Effect.Effect<Text> =>
  Effect.sync(() => {
    return document.createTextNode(content)
  })

export const children = (
  ...nodes: Array<Effect.Effect<Node>>
): Effect.Effect<Array<Node>> => Effect.all(nodes)
