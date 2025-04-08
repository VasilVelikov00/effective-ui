import { Effect } from "effect"
import { runtime } from "../../src"
import { Router } from "./routing"

Effect.runPromise(runtime.mount(Router, "#root"))
