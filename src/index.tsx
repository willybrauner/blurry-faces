import "./index.less"
import ReactDOM from "react-dom"
import * as React from "react"
import App from "./components/app/App"
import { createContext } from "react"

/**
 * Create Global App context
 * For store images
 */
export type IImageData = { filename?: string; url?: string; data?: string }

export const AppContext = createContext<{
  images: IImageData[]
  saveImages: (images: IImageData[]) => void
  saveImageSource: (source: string, url: string) => void
  createZipFiles: () => void
}>({
  images: null,
  saveImages: null,
  saveImageSource: null,
  createZipFiles: null,
})

/**
 *  Start React App
 */
ReactDOM.render(<App />, document.getElementById("root"))
