import { describe, expect, it, vi } from "@effect/vitest"
import { Effect } from "effect"
import { events } from "../../src/index.js"
import { Posts } from "./fetching-data.js"

describe("Posts", () => {
  it.effect("shows loading then renders posts", () =>
    Effect.gen(function*() {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { title: "Hello World" },
          { title: "Post 2" },
          { title: "Another Post" }
        ]
      })

      const element = yield* Posts(1).pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(element)

      expect(document.body.textContent).toContain("Loading...")

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))

      expect(document.body.textContent).toContain("Hello World")
      expect(document.body.textContent).toContain("Post 2")
      expect(document.body.textContent).toContain("Another Post")
    }))

  it.effect("shows error fallback if fetch fails", () =>
    Effect.gen(function*() {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network failure"))

      const element = yield* Posts(1).pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(element)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))

      expect(document.body.textContent).toContain("Oops")
    }))
})
