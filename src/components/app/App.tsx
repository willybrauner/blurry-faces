import css from "./App.module.less"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import InputImages from "../inputImages/InputImages"
import { AppContext, IImageData } from "../../index"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { div2Canvas } from "../../helpers/helpers"
import Loader from "../loader/Loader"
import Logo from "../logo/Logo"
import Polaroid from "../polaroid/Polaroid"
import { merge } from "../../lib/utils/arrayUtils"
import { gsap } from "gsap"

const componentName = "App"
const debug = require("debug")(`front:${componentName}`)

function App() {
  const polaroidRef = useRef([])

  // -------------------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------------------- ANIM

  const polaroidsAnim = (els = polaroidRef.current): void => {
    const tl = gsap.timeline({
      defaults: { autoAlpha: 0, duration: 2, ease: "elastic.out(1, 0.3)" },
    })
    // left
    tl.from(
      els[2],
      {
        x: -innerWidth * 1.5,
        rotate: 40,
      },
      "start"
    )
    // right
    tl.from(
      els[1],
      {
        x: innerWidth * 1.5,
        rotate: 100,
      },
      "start-=0.1"
    )

    // center
    tl.from(
      els[0],
      {
        x: innerWidth * 1.5,
        rotate: 70,
      },
      "start-=0.1"
    )
  }

  useLayoutEffect(() => {
    polaroidsAnim()
  }, [])

  // ------------------------------------------------------------------------------------- RENDER

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
        <header>
          <Logo className={css.logo} />
        </header>
        <section className={css.content}>
          <div className={css.polaroids}>
            {["center", "right", "left"].map((el, i) => (
              <Polaroid
                ref={(r) => (polaroidRef.current[i] = r)}
                className={merge([css.polaroid, css[`polaroid_${el}`]])}
                key={i}
              />
            ))}
          </div>

          {/*{images?.length === 0 && <InputImages className={css.input} />}*/}
          {/*{images?.length > 0 && <BlurryFacesGallery className={css.gallery} />}*/}
        </section>
        {isWatingSources && <Loader />}
      </div>
    </AppContext.Provider>
  )
}

export default App
