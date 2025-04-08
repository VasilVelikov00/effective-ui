import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { events } from "../../src/index.js"
import { Counter } from "./counter"

describe("Counter", () => {
  it.effect("increments and decrements", () =>
    Effect.gen(function*() {
      const counter = yield* Counter.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(counter)

      const buttons = () => document.querySelectorAll("button")
      const heading = () => document.querySelector("h1")!

      console.log(buttons()[1])

      expect(heading().textContent).toBe("Count: 0")

      buttons()[1].click()
      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))
      expect(heading().textContent).toBe("Count: 1")

      buttons()[0].click()
      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))
      expect(heading().textContent).toBe("Count: 0")
    }))
})
