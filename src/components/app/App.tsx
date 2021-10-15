import css from "./App.module.less"
import React, { useEffect, useState } from "react"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"
import { Stack } from "@cher-ami/router"
import * as faceapi from "face-api.js"

const componentName = "App"
const debug = require("@wbe/debug")(`front:${componentName}`)
import example from "../../images/example-1.jpg"
import example2 from "../../images/example-2.jpg"
import example3 from "../../images/example-3.jpg"

function App() {
  /**
   * Load model
   */
  const [appIsReady, setAppIsReady] = useState(false)
  useEffect(() => {
    // TODO charger le model de donnée en local
    //   await faceapi.nets.tinyFaceDetector.loadFromUri("./models")

    const modelUrl = "https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/"
    faceapi.loadTinyFaceDetectorModel(modelUrl).then(() => {
      setAppIsReady(true)
    })
  }, [])

  const [images, setImages] = useState<IImageData[]>([
    {
      filename: "example-1.jpg",
      url: example,
      width: 200,
      height: 200,
    },
    {
      filename: "example-2.jpg",
      url: example2,
      width: 200,
      height: 200,
    },
    {
      filename: "example-3.jpg",
      url: example3,
      width: 200,
      height: 200,
    },
  ])
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

  // ------------------------------------------------------------------------------------- PAGES

  const sequencialTransition = ({
    previousPage,
    currentPage,
    unmountPreviousPage,
  }): Promise<void> => {
    return new Promise(async (resolve) => {
      const $current = currentPage?.$element

      // hide new page
      if ($current) $current.style.visibility = "hidden"

      // play out and unmount previous page
      if (previousPage) {
        await previousPage.playOut()
        unmountPreviousPage()
      }

      // wait page isReady promise
      await currentPage?.isReadyPromise?.()

      // show and play in new page
      if (currentPage) {
        if ($current) $current.style.visibility = "visible"
        await currentPage?.playIn?.()
      }

      resolve()
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
        <Stack className={css.stack} manageTransitions={sequencialTransition} />
      </div>
    </AppContext.Provider>
  ) : (
    <div className={css.loading}>loadinggggg</div>
  )
}

export default App
