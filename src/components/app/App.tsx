import css from "./App.module.less"
import React, { useState } from "react"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"
import Home from "../home/Home"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  const [images, setImages] = useState<IImageData[]>([])
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

  const providerValue = {
    images,
    saveImages,
    saveImageSource,
    createZipFiles,
    resetImages,
    isWatingSources,
  }

  // ------------------------------------------------------------------------------------- RENDER

  return (
    <AppContext.Provider value={providerValue}>
      <div className={css.root}>
        {images?.length === 0 && <Home className={css.home} />}
        {images?.length > 0 && <BlurryFacesGallery className={css.gallery} />}
        {isWatingSources && <Loader />}
      </div>
    </AppContext.Provider>
  )
}

export default App
