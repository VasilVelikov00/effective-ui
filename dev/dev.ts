// import { Effect } from "effect"
//
// import {
//   children,
//   component,
//   fetchJSON,
//   mount,
//   navigate,
//   router,
//   tag,
//   text,
//   withData,
//   withFallback,
// } from "../src/index.js"
// import { Telemetry } from "../src/telemetry.js"
//
// const goToHome = navigate("/")
// const goToAbout = navigate("/about")
// const goToUsers1 = navigate("/users/1")
// const goToPostsUser1 = navigate("/posts?userId=1")
//
// const Home = component(
//   () =>
//     tag(
//       "main",
//       children(
//         tag("h1", children(text("Home"))),
//         tag("button", { onClick: goToAbout }, children(text("Go to About"))),
//         tag("button", { onClick: goToUsers1 }, children(text("Go to User 1"))),
//         tag(
//           "button",
//           { onClick: goToPostsUser1 },
//           children(text("Go to Posts"))
//         )
//       )
//     ),
//   "Home"
// )
//
// const About = component(
//   () =>
//     tag(
//       "main",
//       children(
//         tag("h1", children(text("About"))),
//         tag("button", { onClick: goToHome }, children(text("Go to Home"))),
//         tag("button", { onClick: goToUsers1 }, children(text("Go to User 1"))),
//         tag(
//           "button",
//           { onClick: goToPostsUser1 },
//           children(text("Go to Posts"))
//         )
//       )
//     ),
//   "About"
// )
//
// const fetchUser = (id: number) =>
//   fetchJSON<{ name: string }>(
//     `https://jsonplaceholder.typicode.com/users/${id}`
//   )
//
// const renderUser = (user: { name: string }) =>
//   tag(
//     "h1",
//     { onClick: Effect.sync(() => console.log("Clicked!")) },
//     children(text(`Hi, ${user.name}`))
//   )
//
// const UserProfile = withFallback(withData(fetchUser, renderUser), {
//   loading: () => text("Loading..."),
//   error: (err) => text(`Oops: ${err._tag}`)
// })
//
// const fetchPosts = (userId: number) =>
//   fetchJSON<Array<{ title: string }>>(
//     `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
//   )
//
// const renderPosts = component((posts: Array<{ title: string }>) =>
//   tag(
//     "div",
//     children(...posts.map((post) => tag("p", children(text(post.title)))))
//   )
// )
//
// const Posts = withFallback(withData(fetchPosts, renderPosts), {
//   loading: () => text("Loading..."),
//   error: (err) => text(`Oops: ${err._tag}`)
// })
//
// const App = router({
//   "/": Home,
//   "/about": About,
//   "/users/:userId": ({ pathParams: { userId } }) => UserProfile(Number(userId)),
//   "/posts": ({ searchParams }) => Posts(Number(searchParams.get("userId") || 0)),
// })
//
// Effect.runPromise(mount(App, "#root"))
// ;(window as any).telemetry = Telemetry
