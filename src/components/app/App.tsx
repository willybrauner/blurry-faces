import css from "./App.module.less"
import React, { useEffect, useState } from "react"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"
import { Stack, useLocation } from "@cher-ami/router"
import * as faceapi from "face-api.js"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  /**
   *
   */
  const [appIsReady, setAppIsReady] = useState(false)
  useEffect(() => {
    // faceapi.nets.tinyFaceDetector.loadFromUri("./_models").then(()=> console.log('mai oui !'))
    const modelUrl = "https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/"
    faceapi.loadTinyFaceDetectorModel(modelUrl).then(() => {
      setAppIsReady(true)
    })
  }, [])

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

  // ------------------------------------------------------------------------------------- RENDER

  const providerValue = {
    images,
    saveImages,
    saveImageSource,
    createZipFiles,
    resetImages,
    isWatingSources,
  }

  return appIsReady ? (
    <AppContext.Provider value={providerValue}>
      <div className={css.root}>
        <Stack className={css.stack} />
        {isWatingSources && <Loader />}
      </div>
    </AppContext.Provider>
  ) : (
    <div className={css.loading}>loadinggggg</div>
  )
}

export default App
