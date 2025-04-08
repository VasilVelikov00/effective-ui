import { Effect } from "effect"
import { dom, utils } from "../../../../src"

const fetchUser = (id: number) =>
  utils.fetchJSON<{ name: string }>(
    `https://jsonplaceholder.typicode.com/users/${id}`
  )

const renderUser = (user: { name: string }) =>
  dom.tag(
    "h1",
    { onClick: Effect.sync(() => console.log("Clicked!")) },
    dom.children(dom.text(`Hi, ${user.name}`))
  )

export const UserProfile = utils.withFallback(
  utils.withData(fetchUser, renderUser),
  {
    loading: () => dom.text("Loading..."),
    error: (err) => dom.text(`Oops: ${err._tag}`)
  }
)
