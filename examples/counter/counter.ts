import { Effect, pipe } from "effect"
import { dom, events, runtime } from "../../src/index.js"

export const Counter = runtime.recurse(0, (count, setNext) =>
  pipe(
    dom.tag(
      "div",
      dom.children(
        dom.tag("h1", dom.children(dom.text(`Count: ${count}`))),
        dom.tag(
          "button",
          { onClick: setNext(count - 1) },
          dom.children(dom.text("-"))
        ),
        dom.tag(
          "button",
          { onClick: setNext(count + 1) },
          dom.children(dom.text("+"))
        )
      )
    ),
    Effect.provide(events.EventRegistry.Default)
  ))
