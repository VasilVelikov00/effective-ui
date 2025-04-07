import { Effect } from "effect"
import { Telemetry } from "./telemetry.js"

class ElementNotFoundError {
  readonly _tag = "ElementNotFoundError"
}

export function mount(
  effect: Effect.Effect<Node>,
  selector: string
): Effect.Effect<void, ElementNotFoundError> {
  return Effect.gen(function*() {
    const el = document.querySelector(selector)
    if (el === null) return yield* Effect.fail(new ElementNotFoundError())
    el.appendChild(yield* effect)
  })
}

type MemoCache = Map<string, Node>

const defaultCache: MemoCache = new Map()

function stableHash(input: unknown): string {
  return JSON.stringify(input)
}

export function memoizePipe<I>(
  fn: (input: I) => Effect.Effect<Node>,
  source: string,
  cache: MemoCache = defaultCache
): (input: I) => Effect.Effect<Node> {
  return (input: I) =>
    Effect.sync(() => {
      const key = stableHash(input)
      const cached = cache.get(key)

      if (cached) {
        Telemetry.registerCacheHit(source, key)
        return cached.cloneNode(true)
      }

      return Effect.runSync(
        fn(input).pipe(
          Effect.tap((el) =>
            Effect.sync(() => {
              cache.set(key, el.cloneNode(true))
              Telemetry.registerCacheSet(source, key, input)
            })
          )
        )
      )
    })
}

export function component<I>(
  fn: (input: I) => Effect.Effect<Node>,
  name = "anonymous"
): (input: I) => Effect.Effect<Node> {
  return memoizePipe(fn, name)
}

export function recurse<I>(
  initial: I,
  fn: (current: I, setNext: (next: I) => Effect.Effect<void>) => Effect.Effect<Node>
): Effect.Effect<Node> {
  return Effect.async<Node>((resume) => {
    let currentNode: Node | null = null

    const render = (input: I): void => {
      const effect = fn(input, (next) => Effect.sync(() => render(next)))
      Effect.runPromise(effect).then((node) => {
        if (!currentNode) {
          currentNode = node
          resume(Effect.succeed(node))
        } else if (currentNode.parentNode) {
          currentNode.parentNode.replaceChild(node, currentNode)
          currentNode = node
        }
      })
    }

    render(initial)
  })
}
