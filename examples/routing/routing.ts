import { nav } from "../../src/index.js"
import { About } from "./pages/about"
import { Home } from "./pages/home"
import { UserPosts } from "./pages/user/posts"
import { UserProfile } from "./pages/user/profile"

export const Router = nav.router({
  "/": Home,
  "/about": About,
  "/users/:userId": ({ pathParams: { userId } }) => UserProfile(Number(userId)),
  "/posts": ({ searchParams }) => UserPosts(Number(searchParams.get("userId") || 0))
})
