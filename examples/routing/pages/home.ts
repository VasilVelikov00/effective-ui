import { dom, runtime } from "../../../src"
import { goToAbout, goToPostsUser1, goToUsers1 } from "../navigators"

export const Home = runtime.component(
  () =>
    dom.tag(
      "main",
      dom.children(
        dom.tag("h1", dom.children(dom.text("Home"))),
        dom.tag(
          "button",
          { onClick: goToAbout },
          dom.children(dom.text("Go to About"))
        ),
        dom.tag(
          "button",
          { onClick: goToUsers1 },
          dom.children(dom.text("Go to User 1"))
        ),
        dom.tag(
          "button",
          { onClick: goToPostsUser1 },
          dom.children(dom.text("Go to Posts"))
        )
      )
    ),
  "Home"
)
