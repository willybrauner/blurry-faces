import css from "./App.module.less"
import React, { useState } from "react"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import InputImages from "../inputImages/InputImages"
import { AppContext, IImageData } from "../../index"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  const [images, setImages] = useState<IImageData[]>(null)

  const saveImages = (imgs: IImageData[]): void => {
    setImages(imgs)
  }

  const saveImageSource = (imageSource: string, imageUrl: string): void => {
    const newImagesList = images.map((el) => {
      if (el.url === imageUrl) el.data = imageSource
      return el
    })
    saveImages(newImagesList)
  }

  return (
    <AppContext.Provider value={{ images, saveImages, saveImageSource }}>
      <div className={css.root}>
        <div className={css.wrapper}>
          <InputImages className={css.inputImages} />
          <BlurryFacesGallery className={css.gallery} />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
