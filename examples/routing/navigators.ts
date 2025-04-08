import { nav } from "../../src/index.js"

export const goToHome = nav.navigate("/")
export const goToAbout = nav.navigate("/about")
export const goToUsers1 = nav.navigate("/users/1")
export const goToPostsUser1 = nav.navigate("/posts?userId=1")
