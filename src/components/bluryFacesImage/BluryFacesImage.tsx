import css from "./BluryFacesImage.module.less"
import React, { useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"

interface IProps {
  className?: string
  imageUrl: string
}

const componentName = "BluryFacesImage"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BluryFacesImage
 *
 * - Add loader durring face detection
 * - Blur zone on canvas
 * - select zone manualy on canvas
 * + generate new image
 */
function BluryFacesImage(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const windowSize = useWindowSize()

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
      debug("faceDetections: ", faceDetections)
    })
  }, [])

  /**
   * Draw canvas
   * @param detections
   */
  const drawCanvas = (detections): void => {
    const displaySize = {
      width: imageRef.current.width,
      height: imageRef.current.height,
    }

    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvasRef.current, displaySize)
    // resize the detected boxes in case your displayed image has a different size than the original
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
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
      </div>
    </div>
  )
}

export default BluryFacesImage
