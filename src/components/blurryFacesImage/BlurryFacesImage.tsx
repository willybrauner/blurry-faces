import css from "./BlurryFacesImage.module.less"
import React, { useEffect, useRef, useState } from "react"
import { useWindowSize } from "@wbe/use-window-size"
import { FaceDetection } from "face-api.js"
import * as faceapi from "face-api.js"
import * as StackBlur from "stackblur-canvas"
import { merge } from "../../lib/utils/arrayUtils"

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
  const blurFacesWrapperRef = useRef(null)
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
    })
  }, [])

  /**
   * Draw canvas
   * @param detections
   */
  const drawCanvas = (detections: FaceDetection[]): void => {
    const displaySize = {
      width: imageRef.current.width,
      height: imageRef.current.height,
    }
    debug("displaySize: ", displaySize)

    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvasRef.current, displaySize)
    //faceapi.matchDimensions(canvasBlurRef.current, displaySize)
    // resize the detected boxes in case your displayed image has a different size than the original
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

    // blur result
    debug("detections", detections)
    for (let detection of detections) {
      drawSingleBlurFilter(detection, displaySize)
    }
  }

  function drawSingleBlurFilter(
    detection: FaceDetection,
    displaySize: { width: number; height: number }
  ) {
    debug(detection, detection.box)
    const { x, y, width, height, top, left } = detection.box
    debug({ x, y, width, height, top, left })

    // const blurImage = new Image(displaySize.width, displaySize.height)
    // blurImage.src = props.imageUrl

    const context = canvasRef.current.getContext("2d")

    // context.drawImage(imageRef.current, 0, 0, displaySize.width, displaySize.height)
    //StackBlur.image(imageRef.current, canvasRef.current, 30)

    context.fillStyle = "rgba(0,0,0,1)"
    // context.filter = "blur(2px)"

    context.beginPath()

    const xPos = displaySize.width / 2 - width / 2
    const yPos = displaySize.height / 2 - height / 2
    context.fillRect(x, y, width, height)

    //    context.arc(x, y, 30, 0, Math.PI * 2, true)
    context.fill()

    //   StackBlur.canvasRGBA(canvasRef.current, x, y, width, height, 10)
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
        <div className={css.blurFacesWrapper} ref={blurFacesWrapperRef} />
      </div>
    </div>
  )
}

export default BlurryFacesImage
