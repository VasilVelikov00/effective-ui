import { dom, runtime, utils } from "../../../../src"

const fetchPosts = (userId: number) =>
  utils.fetchJSON<Array<{ title: string }>>(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  )

const renderPosts = runtime.component((posts: Array<{ title: string }>) =>
  dom.tag(
    "div",
    dom.children(
      ...posts.map((post) => dom.tag("p", dom.children(dom.text(post.title))))
    )
  )
)

export const UserPosts = utils.withFallback(
  utils.withData(fetchPosts, renderPosts),
  {
    loading: () => dom.text("Loading..."),
    error: (err) => dom.text(`Oops: ${err._tag}`)
  }
)
