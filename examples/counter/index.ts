import { Effect } from "effect"
import { mount } from "../../src"
import { Counter } from "./counter"

Effect.runPromise(mount(Counter, "#root"))
