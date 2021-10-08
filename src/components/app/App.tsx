import css from "./App.module.less"
import React, { useEffect, useLayoutEffect, useState } from "react"
import GalleryView from "../galleryView/GalleryView"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"
import HomeView from "../homeView/HomeView"
import { useMountView } from "../../helpers/useMountView"
import HomeViewService from "../homeView/HomeViewService"
import GalleryViewService from "../galleryView/GalleryViewService"
import { useView } from "../../helpers/useView"

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

  // ------------------------------------------------------------------------------------- VIEWS

  const { mount: mountHomeView } = useView({ view: HomeViewService })
  const { mount: galleryViewHome } = useView({ view: GalleryViewService })

  /**
   * show home
   */
  useLayoutEffect(() => {
    const thread = async () => {
      if (images?.length === 0) {
        await HomeViewService.mount()
        await HomeViewService.playIn()
      } else {
        await HomeViewService.playOut()
        await HomeViewService.unmount()

        await GalleryViewService.mount()
        await GalleryViewService.playIn()
      }
    }

    thread()
  }, [images])

  // ------------------------------------------------------------------------------------- RENDER

  const providerValue = {
    images,
    saveImages,
    saveImageSource,
    createZipFiles,
    resetImages,
    isWatingSources,
  }

  return (
    <AppContext.Provider value={providerValue}>
      <div className={css.root}>
        {mountHomeView && <HomeView className={css.home} />}
        {galleryViewHome && <GalleryView className={css.gallery} />}
        {isWatingSources && <Loader />}
      </div>
    </AppContext.Provider>
  )
}

export default App
