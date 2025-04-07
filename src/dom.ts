import { Effect } from "effect"

import { EventRegistry } from "./events.js"

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

export function tag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  maybePropsOrChildren?: TagProps<K> | Effect.Effect<Array<Node>, never, EventRegistry>,
  maybeChildren?: Effect.Effect<Array<Node>, never, EventRegistry>
): Effect.Effect<HTMLElementTagNameMap[K], never, EventRegistry> {
  const isChildrenOnly = Effect.isEffect(maybePropsOrChildren)

  const props = (isChildrenOnly ? {} : maybePropsOrChildren) as TagProps<K>
  const children = isChildrenOnly
    ? (maybePropsOrChildren as Effect.Effect<Array<Node>>)
    : (maybeChildren ?? Effect.succeed([]))

  return Effect.gen(function*() {
    const el = document.createElement(tagName)

    for (const [key, value] of Object.entries(props)) {
      if (key === "style" && typeof value === "object") {
        Object.assign(el.style, value)
      } else if (key.startsWith("on") && Effect.isEffect(value)) {
        const eventName = key.slice(2).toLowerCase()
        const registry = yield* EventRegistry
        const id = yield* registry.register(eventName, value as Effect.Effect<void>)
        el.setAttribute(`data-${eventName}-event`, id)
      } else {
        ;(el as Record<string, unknown>)[key] = value
      }
    }

    const nodeList = yield* children
    for (const child of nodeList) {
      el.appendChild(child)
    }

    return el
  })
}

export const text = (content: string): Effect.Effect<Text> =>
  Effect.sync(() => {
    return document.createTextNode(content)
  })

export const children = (
  ...nodes: Array<Effect.Effect<Node, never, EventRegistry>>
): Effect.Effect<Array<Node>, never, EventRegistry> => Effect.all(nodes)
