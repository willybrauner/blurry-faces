import css from "./BlurryFacesImage.module.less"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"
import BlurZone, { TBlurZone } from "../blurZone/BlurZone"
import { div2Canvas } from "../../helpers/helpers"
import { AppContext } from "../../index"
import { Image } from "@wbe/react-image"
import BlurZoneBuilder from "../blurZoneBuilder/BlurZoneBuilder"

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
   */
  const [imageSource, setImageSource] = useState<string>(null)
  useEffect(() => {
    if (props.imageUrl && imageSize) {
      // setImageSource(
      //   div2Canvas(imageSize.width, imageSize.height, imageRef.current, blurZones)
      // )
    }
  }, [blurZones, imageSize, props.imageUrl])

  useEffect(() => {
    if (imageSource) {
      const newImagesList = images.map((el) => {
        if (el.url === props.imageUrl) {
          el.data = imageSource
        }
        return el
      })
      saveImages(newImagesList)
    }
  }, [imageSource, props.imageUrl])

  /**
   * remove Blur if clicked
   * @param i
   */
  const handleBlurZoneClick = (i: number) => {
    const update = blurZones.filter((e, index) => index !== i)
    setBlurZones(update)
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
        />
        <div className={css.blurFacesWrapper}>
          {[...(blurZones || []), ...(blurZonesBuilt || [])].map((el, i) => (
            <BlurZone
              box={el}
              key={i}
              imageSize={imageSize}
              onClick={() => handleBlurZoneClick(i)}
            />
          ))}
        </div>
      </div>

      {/*<div onClick={createImageSource}>{"download image"}</div>*/}
    </div>
  )
}

export default BlurryFacesImage
