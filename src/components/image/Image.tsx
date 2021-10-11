import css from "./Image.module.less"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"
import { TBlurZone } from "../blurZone/BlurZone"
import { AppContext } from "../../index"
import BlurZoneBuilder from "../blurZoneBuilder/BlurZoneBuilder"

interface IProps {
  className?: string
  imageUrl: string
}

const componentName = "Image"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name Image
 *
 * - Add loader durring face detection
 * - Blur zone on canvas
 * - select zone manualy on canvas
 * + generate new image
 */
function Image(props: IProps) {
  const { images, saveImages } = useContext(AppContext)

  const rootRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const windowSize = useWindowSize()

  /**
   * Get face detections
   */
  const [faceDetections, setFaceDetections] = useState<FaceDetection[]>(null)

  const getFaceDetections = async (): Promise<FaceDetection[]> => {
    // TODO charger le model de donnée en local
    //    await faceapi.nets.tinyFaceDetector.loadFromUri("./models")
    debug("ici !")
    // const modelUrl = "https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/"
    // await faceapi.loadTinyFaceDetectorModel(modelUrl)

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 608,
      scoreThreshold: 0.5,
    })
    return faceapi.detectAllFaces(imageRef.current, options)
  }

  const [imageIsReady, setImageIsReady] = useState(false)
  useEffect(() => {
    getFaceDetections()
      .then((detections: FaceDetection[]) => {
        setFaceDetections(detections)
        setImageIsReady(true)
      })
      .catch((e) => {
        setImageIsReady(true)
      })
  }, [props.imageUrl])

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(null)
  useEffect(() => {
    setImageSize({
      width: imageRef.current.width,
      height: imageRef.current.height,
    })
  }, [windowSize, imageIsReady])

  /**
   * Draw canvas
   * @param detections
   */
  const [blurZones, setBlurZones] = useState([])
  const [blurZonesBuilt, setBlurZonesBuilt] = useState([])
  const createBlurZones = (detections: FaceDetection[]): void => {
    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvasRef.current, imageSize)

    // resize the detected boxes in case your displayed image has a different size than the original
    //const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // draw detections into the canvas
    // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

    // blur result
    debug("detections", detections)
    // normalise box size
    const zones = detections.map((zone) => ({
      x: zone.box.x / zone.imageDims.width,
      y: zone.box.y / zone.imageDims.height,
      width: zone.box.width / zone.imageDims.width,
      height: zone.box.height / zone.imageDims.height,
    }))

    debug("zones from AI", zones)
    setBlurZones(zones)
  }

  /**
   * Create blur zone
   */
  useEffect(() => {
    if (faceDetections) {
      createBlurZones(faceDetections)
    }
  }, [faceDetections, windowSize])

  /**
   * Create new image with blur zones
   *
   * TODO on veut executer cette fonction uniquement quand on click sur tout télécharger
   */

  useEffect(() => {
    // get all zones
    const fullBlurZones = [...(blurZones || []), ...(blurZonesBuilt || [])]
    if (!props.imageUrl || !imageSize || !fullBlurZones) return

    // prepare new image list with sources
    const newImagesList = images.map((el) => {
      if (el.url === props.imageUrl) {
        el["width"] = imageSize.width
        el["height"] = imageSize.height
        el["$img"] = imageRef.current
        el["fullBlurZones"] = fullBlurZones
        //            el.data = source
      }
      return el
    })

    // au lieu de save image, on pourrait save
    saveImages(newImagesList)
  }, [blurZonesBuilt, blurZones, imageSize, props.imageUrl])

  /**
   * remove zone on click
   * @param i
   */
  const handleBlurZoneClick = (i: number) => {
    const update = blurZones.filter((e, index) => index !== i)
    setBlurZones(update)
  }
  /**
   * remove zone on click
   * @param i
   */
  const handleBlurZoneBuiltClick = (i: number) => {
    const updateZoneBuilt = blurZonesBuilt.filter((e, index) => index !== i)
    setBlurZonesBuilt(updateZoneBuilt)
  }

  const registerNewZone = (e: TBlurZone) => {
    debug("registerNewZone > blurZones")
    setBlurZonesBuilt(blurZonesBuilt.concat(e))
  }

  useEffect(() => {
    debug("blurZones", blurZones)
  }, [blurZones])

  useEffect(() => {
    debug("blurZonesBuilt", blurZonesBuilt)
  }, [blurZonesBuilt])

  return (
    <div className={css.root} ref={rootRef}>
      <div className={css.wrapper}>
        <img
          className={[css.image, imageIsReady && css.image_isReady].join(" ")}
          alt={"image"}
          src={props.imageUrl}
          ref={imageRef}
        />
        <canvas className={css.canvas} ref={canvasRef} />

        {imageIsReady && (
          <BlurZoneBuilder
            key={
              `blur-${blurZones.length + blurZonesBuilt.length}` +
              `-${imageSize?.width}-${imageSize?.height}`
            }
            className={css.blurZoneBuilder}
            dispatchNewZone={(e) => registerNewZone(e)}
            imageSize={imageSize}
            blurZoneAI={blurZones}
            blurZoneBuilt={blurZonesBuilt}
            handleBlurZoneClick={(i) => handleBlurZoneClick(i)}
            handleBlurZoneBuiltClick={(i) => handleBlurZoneBuiltClick(i)}
          />
        )}
      </div>
    </div>
  )
}

export default Image
