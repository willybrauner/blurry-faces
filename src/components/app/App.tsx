import css from "./App.module.less"
import React, { useState } from "react"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import InputImages from "../inputImages/InputImages"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  const [images, setImages] = useState<IImageData[]>([])
  // loader
  const [isWatingSources, setIsWaitingSources] = useState<boolean>(false)

  /**
   * Save images in context
   * @param imgs
   */
  const saveImages = (imgs: IImageData[]): void => {
    setImages(imgs)
  }
  const resetImages = (): void => {
    setImages([])
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
  const createZipFiles = async (): Promise<void> => {
    setIsWaitingSources(true)

    const zip = new JSZip()
    const img = zip.folder("blurry-images")

    for (let image of images) {
      // generate source
      const source = await div2Canvas(
        image.width,
        image.height,
        image.$img,
        image.fullBlurZones
      )

      // create file for zip
      img.file(image.filename, source, { base64: true })
    }

    // generate zip
    zip
      .generateAsync({
        type: "blob",
        compression: "DEFLATE",
      })
      .then((content) => {
        setIsWaitingSources(false)
        saveAs(content, "blurry-images.zip")
      })
  }

  return (
    <AppContext.Provider
      value={{
        images,
        saveImages,
        saveImageSource,
        createZipFiles,
        resetImages,
        isWatingSources,
      }}
    >
      <div className={css.root}>
        {images?.length === 0 && <InputImages className={css.input} />}
        {images?.length > 0 && <BlurryFacesGallery className={css.gallery} />}
      </div>

      {isWatingSources && <Loader />}
    </AppContext.Provider>
  )
}

export default App
