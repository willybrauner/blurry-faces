import "./index.less"
import ReactDOM from "react-dom"
import * as React from "react"
import App from "./components/app/App"
import { createContext } from "react"
import { TBlurZone } from "./components/blurZone/BlurZone"
import { DICO } from "./data/dico"

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
 *  Start React App
 */
ReactDOM.render(<App />, document.getElementById("root"))
