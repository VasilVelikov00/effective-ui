import { Effect, pipe } from "effect"
import { dom, events, runtime, utils } from "../../src/index.js"

const fetchPosts = (userId: number) =>
  utils.fetchJSON<Array<{ title: string }>>(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  )

const renderPosts = runtime.component((posts: Array<{ title: string }>) =>
  pipe(
    dom.tag(
      "div",
      dom.children(
        ...posts.map((post) => dom.tag("p", dom.children(dom.text(post.title))))
      )
    ),
    Effect.provide(events.EventRegistry.Default)
  )
)

export const Posts = utils.withFallback(
  utils.withData(fetchPosts, renderPosts),
  {
    loading: () => dom.text("Loading..."),
    error: (err) => dom.text(`Oops: ${err._tag}`)
  }
)
