import { dom, runtime } from "../../../src"
import { goToHome, goToPostsUser1, goToUsers1 } from "../navigators"

export const About = runtime.component(
  () =>
    dom.tag(
      "main",
      dom.children(
        dom.tag("h1", dom.children(dom.text("About"))),
        dom.tag(
          "button",
          { onClick: goToHome },
          dom.children(dom.text("Go to Home"))
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
  "About"
)
