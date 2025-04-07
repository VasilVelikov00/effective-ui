import { Effect, Ref } from "effect"

type EventHandler = (event: Event) => void

const registry = new Map<string, EventHandler>()

const listeners = new Set<string>()

const eventIdCounter = Ref.unsafeMake(0)

export const registerEvent = (key: string, handler: EventHandler) => {
  registry.set(key, handler)
}

const generateEventId = Effect.gen(function*() {
  const next = yield* Ref.updateAndGet(eventIdCounter, (n) => n + 1)
  return `event-${next}`
})

const getCachedEventId = Effect.cachedFunction(
  (effect: Effect.Effect<void>) =>
    Effect.gen(function*() {
      const id = yield* generateEventId
      registerEvent(id, () => void Effect.runPromise(effect))
      return id
    })
)

export class EventRegistry extends Effect.Service<EventRegistry>()("EventRegistry", {
  sync: () => {
    return {
      register: (type: string, handler: Effect.Effect<void>) =>
        Effect.gen(function*() {
          let id
          try {
            const cachedFn = yield* getCachedEventId
            id = yield* cachedFn(handler)
          } catch {
            id = yield* generateEventId
            registry.set(id, () => void Effect.runPromise(handler))
          }

          if (!listeners.has(type)) {
            document.addEventListener(type, (event) => {
              const target = event.target as HTMLElement | null
              const key = target?.getAttribute(`data-${type}-event`)
              if (!key) return

              const handler = registry.get(key)
              if (handler) handler(event)
            })

            listeners.add(type)
          }

          return id
        })
    } as const
  }
}) {}
