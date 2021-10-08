import css from "./App.module.less"
import React, { useLayoutEffect, useRef, useState } from "react"
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
  const logoRef = useRef(null)
  const polaroidRef = useRef([])
  const inputImagesRef = useRef(null)
  const lineRef = useRef(null)

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

  const enterAnim = (
    $logo = logoRef.current,
    $polaroids = polaroidRef.current,
    $inputImages = inputImagesRef.current,
    $line = lineRef.current
  ): void => {
    const tl = gsap.timeline({
      defaults: { autoAlpha: 1, duration: 1.3, ease: "elastic.out(1, 0.6)" },
    })

    // left
    tl.from(
      $logo,
      {
        y: -100,
        autoAlpha: 0,
        //      duration: 1.5,
        //        ease: "elastic.out(1, 1)",
      },
      "start"
    )
    // left
    tl.from(
      $line,
      {
        autoAlpha: 1,
        width: 0,
        duration: 0.3,
        ease: " circle.in",
      },
      "start+=0.1"
    )
    tl.addLabel("polaroid", "=-.6")
    // left
    tl.from(
      $polaroids[2],
      {
        x: -innerWidth * 1.5,
        rotate: 40,
      },
      "polaroid"
    )
    // right
    tl.from(
      $polaroids[1],
      {
        x: innerWidth * 1.5,
        rotate: 100,
      },
      "polaroid+=.1"
    )
    // center
    tl.from(
      $polaroids[0],
      {
        x: innerWidth * 1.5,
        rotate: 70,
      },
      "polaroid+=.2"
    )

    // button
    tl.from(
      $inputImages,
      {
        y: 200,
        //        ease: "back.inOut",
        duration: 1,
        //        rotate: 100,
        transformOrigin: "center",
        autoAlpha: 0,
      },
      "polaroid+=0.3"
    )
  }

  useLayoutEffect(() => {
    enterAnim()
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
        <header className={css.header}>
          <Logo className={css.logo} ref={logoRef} />
        </header>
        <section className={css.content}>
          <div className={css.line} ref={lineRef} />
          <div className={css.polaroids}>
            {["center", "right", "left"].map((el, i) => (
              <Polaroid
                ref={(r) => (polaroidRef.current[i] = r)}
                className={merge([css.polaroid, css[`polaroid_${el}`]])}
                key={i}
              />
            ))}
          </div>
        </section>
        {images?.length === 0 && (
          <InputImages className={css.input} ref={inputImagesRef} />
        )}
        {/*{images?.length > 0 && <BlurryFacesGallery className={css.gallery} />}*/}
        {isWatingSources && <Loader />}
      </div>
    </AppContext.Provider>
  )
}

export default App
