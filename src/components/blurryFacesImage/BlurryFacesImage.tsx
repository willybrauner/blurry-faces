import css from "./BlurryFacesImage.module.less"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"
import { TBlurZone } from "../blurZone/BlurZone"
import { AppContext } from "../../index"
import BlurZoneBuilder from "../blurZoneBuilder/BlurZoneBuilder"
import { div2Canvas } from "../../helpers/helpers"

interface IProps {
  className?: string
  imageUrl: string
}

const componentName = "BluryFacesImage"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurryFacesImage
 *
 * - Add loader durring face detection
 * - Blur zone on canvas
 * - select zone manualy on canvas
 * + generate new image
 */
function BlurryFacesImage(props: IProps) {
  const { images, saveImages, saveImageSource } = useContext(AppContext)

  const rootRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const windowSize = useWindowSize()

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(null)

  /**
   * Get face detections
   */
  const [faceDetections, setFaceDetections] = useState<FaceDetection[]>(null)

  const getFaceDetections = async (): Promise<FaceDetection[]> => {
    const modelUrl = "https://www.rocksetta.com/tensorflowjs/saved-models/face-api-js/"
    await faceapi.loadTinyFaceDetectorModel(modelUrl)

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 608,
      scoreThreshold: 0.5,
    })
    return faceapi.detectAllFaces(imageRef.current, options)
  }

  useEffect(() => {
    getFaceDetections().then((detections: FaceDetection[]) => {
      setFaceDetections(detections)
    })
  }, [props.imageUrl])

  /**
   * Draw canvas
   * @param detections
   */
  const [blurZones, setBlurZones] = useState([])
  const [blurZonesBuilt, setBlurZonesBuilt] = useState([])
  const createBlurZones = (detections: FaceDetection[]): void => {
    const displaySize = {
      width: imageRef.current.width,
      height: imageRef.current.height,
    }
    setImageSize(displaySize)

    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvasRef.current, displaySize)

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
        <img className={css.image} alt={"image"} src={props.imageUrl} ref={imageRef} />
        <canvas className={css.canvas} ref={canvasRef} />
        <BlurZoneBuilder
          key={`blur-${blurZones.length + blurZonesBuilt.length}`}
          className={css.blurZoneBuilder}
          dispatchNewZone={(e) => registerNewZone(e)}
          imageSize={imageSize}
          blurZoneAI={blurZones}
          blurZoneBuilt={blurZonesBuilt}
          handleBlurZoneClick={(i) => handleBlurZoneClick(i)}
          handleBlurZoneBuiltClick={(i) => handleBlurZoneBuiltClick(i)}
        />
      </div>

      {/*<div onClick={createImageSource}>{"download image"}</div>*/}
    </div>
  )
}

export default BlurryFacesImage
