import "./index.less"
import ReactDOM from "react-dom"
import * as React from "react"
import App from "./components/app/App"
import { createContext } from "react"
import { TBlurZone } from "./components/blurZone/BlurZone"
import VhHelper from "./helpers/VhHelper"
import { Router, TRoute } from "@cher-ami/router"
import { createMemoryHistory, createBrowserHistory } from "history"
import HomePage from "./pages/homePage/HomePage"
import GalleryPage from "./pages/galleryPage/GalleryPage"

/**
 * Utils
 */
new VhHelper()

/**
 * Create Global App context
 * For store images
 */
export type IImageData = {
  filename?: string
  url?: string
  data?: string
  width?: number
  height?: number
  $img?: HTMLImageElement
  fullBlurZones?: TBlurZone[]
}

export const AppContext = createContext<{
  images: IImageData[]
  saveImages: (images: IImageData[]) => void
  resetImages: () => void
  saveImageSource: (source: string, url: string) => void
  createZipFiles: () => Promise<void>
  isWatingSources: boolean
}>({
  images: null,
  resetImages: null,
  saveImages: null,
  saveImageSource: null,
  createZipFiles: null,
  isWatingSources: false,
})

/**
 * Router
 */
const history =
  process.env.NODE_ENV === "development" ? createBrowserHistory() : createMemoryHistory()

const routes: TRoute[] = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/gallery",
    name: "gallery",
    component: GalleryPage,
  },
]

/**
 *  Start React App
 */
ReactDOM.render(
  <Router base={"/"} routes={routes} history={history}>
    <App />
  </Router>,
  document.getElementById("root")
)
