import { Effect, pipe } from "effect"
import { EventRegistry } from "../../src/events"
import { children, recurse, tag, text } from "../../src/index.js"

export const Counter = recurse(0, (count, setNext) =>
  pipe(
    tag(
      "div",
      children(
        tag("h1", children(text(`Count: ${count}`))),
        tag("button", { onClick: setNext(count - 1) }, children(text("-"))),
        tag("button", { onClick: setNext(count + 1) }, children(text("+")))
      )
    ),
    Effect.provide(EventRegistry.Default)
  ))
