import { describe, expect, it, vi } from "@effect/vitest"
import { Effect } from "effect"
import { children, EventRegistry, tag, text } from "../src/index.js"

describe("dom", () => {
  describe("tag", () => {
    it.effect("creates an element with text", () =>
      Effect.gen(function*() {
        const el = yield* tag("div", children(text("hello"))).pipe(
          Effect.provide(EventRegistry.Default)
        )

        expect(el.tagName).toBe("DIV")
        expect(el.textContent).toBe("hello")
      }))

    it.effect("applies styles", () =>
      Effect.gen(function*() {
        const el = yield* tag("div", { style: { color: "red" } }).pipe(
          Effect.provide(EventRegistry.Default)
        )

        expect(el.style.color).toBe("red")
      }))

    it.effect("registers event handler", () =>
      Effect.gen(function*() {
        const spy = vi.fn()

        const el = yield* tag("button", {
          onClick: Effect.sync(spy)
        }).pipe(Effect.provide(EventRegistry.Default))

        const eventAttr = el.getAttribute("data-click-event")
        expect(eventAttr).toMatch(/^event-/)

        document.body.appendChild(el)
        el.click()

        expect(spy).toHaveBeenCalled()
      }))
  })
})
