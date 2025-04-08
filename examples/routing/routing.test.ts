import { beforeEach, describe, expect, it, vi } from "@effect/vitest"
import { Effect } from "effect"
import { events } from "../../src/index.js"
import { Router } from "./routing.js"

describe("Routing", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it.effect("renders Home on root", () =>
    Effect.gen(function*() {
      window.history.pushState({}, "", "/")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))

      expect(document.body.textContent).toContain("Home")
    }))

  it.effect("navigates to About via button click", () =>
    Effect.gen(function*() {
      window.history.pushState({}, "", "/")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))

      const aboutButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent?.includes("Go to About")
      )!
      aboutButton.click()

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 0)))

      expect(document.body.textContent).toContain("About")
    }))

  it.effect("renders UserProfile route with user data", () =>
    Effect.gen(function*() {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: "Alice" })
      })

      window.history.pushState({}, "", "/users/1")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 20)))

      expect(document.body.textContent).toContain("Hi, Alice")
    }))

  it.effect("renders UserPosts route with posts", () =>
    Effect.gen(function*() {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [{ title: "Post A" }, { title: "Post B" }]
      })

      window.history.pushState({}, "", "/posts?userId=1")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 20)))

      expect(document.body.textContent).toContain("Post A")
      expect(document.body.textContent).toContain("Post B")
    }))

  it.effect("shows fallback error when fetch fails", () =>
    Effect.gen(function*() {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("boom"))

      window.history.pushState({}, "", "/users/1")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 20)))

      expect(document.body.textContent).toContain("Oops")
    }))

  it.effect("renders fallback or default page on unknown route (404)", () =>
    Effect.gen(function*() {
      window.history.pushState({}, "", "/not-found")

      const el = yield* Router.pipe(
        Effect.provide(events.EventRegistry.Default)
      )
      document.body.appendChild(el)

      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 20)))

      expect(document.body.textContent).toContain("404 Not Found")
    }))
})
