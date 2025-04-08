import { Effect } from "effect"
import { runtime } from "../../src"
import { Posts } from "./fetching-data.js"

Effect.runPromise(runtime.mount(Posts(1), "#root"))
