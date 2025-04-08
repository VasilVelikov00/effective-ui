import { Effect } from "effect"
import { runtime } from "../../src"
import { Counter } from "./counter"

Effect.runPromise(runtime.mount(Counter, "#root"))
