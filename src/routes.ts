import { TRoute } from "@cher-ami/router"
import HomePage from "./pages/homePage/HomePage"
import NotFoundPage from "./pages/notFoundPage/NotFoundPage"

export const routes: TRoute[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/:rest",
    component: NotFoundPage,
  },
]
