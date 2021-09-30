import css from "./App.module.less"
import React, { useState } from "react"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import InputImages from "../inputImages/InputImages"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import sample from "../../images/example.jpg"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  const [images, setImages] = useState<IImageData[]>([
    {
      filename: "sample.jpg",
      url: sample,
    },
  ])
  /**
   * Save images in context
   * @param imgs
   */
  const saveImages = (imgs: IImageData[]): void => {
    setImages(imgs)
  }

  /**
   * Save image source
   * @param imageSource
   * @param imageUrl
   */
  const saveImageSource = (imageSource: string, imageUrl: string): void => {
    const newImagesList = images.map((el) => {
      if (el.url === imageUrl) el.data = imageSource
      return el
    })
    saveImages(newImagesList)
  }

  /**
   * Create zip file to download
   */
  const createZipFiles = (): void => {
    const zip = new JSZip()
    const img = zip.folder("blurry-images")

    for (let image of images) {
      img.file(image.filename, image.data, { base64: true })
    }

    zip
      .generateAsync({
        type: "blob",
        compression: "DEFLATE",
      })
      .then((content) => {
        debug("content", content)
        saveAs(content, "blurry-images.zip")
      })
  }

  return (
    <AppContext.Provider value={{ images, saveImages, saveImageSource, createZipFiles }}>
      <div className={css.root}>
        <div className={css.wrapper}>
          <InputImages className={css.input} />
          <BlurryFacesGallery className={css.gallery} />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
