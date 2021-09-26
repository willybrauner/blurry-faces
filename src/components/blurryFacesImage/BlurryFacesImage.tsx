import css from "./BlurryFacesImage.module.less"
import React, { useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"
import BlurZone from "../blurZone/BlurZone"

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
  }, [])

  /**
   * Draw canvas
   * @param detections
   */
  const [blurFacesPos, setBlurFacesPos] = useState([])
  const drawCanvas = (detections: FaceDetection[]): void => {
    const displaySize = {
      width: imageRef.current.width,
      height: imageRef.current.height,
    }
    setImageSize(displaySize)

    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvasRef.current, displaySize)

    // resize the detected boxes in case your displayed image has a different size than the original
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    // draw detections into the canvas
    // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

    // blur result
    debug("detections", detections)
    // normalise box size
    const boxs = detections.map((detection) => ({
      x: detection.box.x / detection.imageDims.width,
      y: detection.box.y / detection.imageDims.height,
      width: detection.box.width / detection.imageDims.width,
      height: detection.box.height / detection.imageDims.height,
    }))
    debug("boxs", boxs)

    setBlurFacesPos(boxs)
  }

  useEffect(() => {
    if (faceDetections) {
      drawCanvas(faceDetections)
    }
  }, [faceDetections, windowSize])

  return (
    <div className={css.root} ref={rootRef}>
      <div className={css.wrapper}>
        <img className={css.image} alt={"image"} src={props.imageUrl} ref={imageRef} />
        <canvas className={css.canvas} ref={canvasRef} />
        <div className={css.blurFacesWrapper}>
          {blurFacesPos.map((el, i) => (
            <BlurZone box={el} key={i} imageSize={imageSize} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlurryFacesImage
