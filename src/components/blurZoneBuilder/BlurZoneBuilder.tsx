import css from "./BlurZoneBuilder.module.less"
import React, { useEffect, useRef, useState } from "react"
import { merge } from "../../helpers/arrayUtils"
import BlurZone, { TBlurZone } from "../blurZone/BlurZone"

interface IProps {
  className?: string
  dispatchNewZone: (e: TBlurZone) => void
  imageSize: { width: number; height: number }

  // two types of zone

  // auto generated
  blurZoneAI: TBlurZone[]
  // manually built from interface
  blurZoneBuilt: TBlurZone[]

  handleBlurZoneClick: (i: number) => void
  handleBlurZoneBuiltClick: (i: number) => void
}

const componentName = "BlurZoneBuilder"
const debug = require("@wbe/debug")(`front:${componentName}`)

/**
 * @name BlurZoneBuilder
 */
function BlurZoneBuilder(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)

  const [blurZoneIsHover, setBlurZoneIsHover] = useState<boolean>(false)

  const x1 = useRef(0)
  const x2 = useRef(0)
  const y1 = useRef(0)
  const y2 = useRef(0)

  const dragCoordinates = () => {
    const x3 = Math.min(x1.current, x2.current)
    const x4 = Math.max(x1.current, x2.current)
    const y3 = Math.min(y1.current, y2.current)
    const y4 = Math.max(y1.current, y2.current)

    return { x3, y3, x4, y4 }
  }

  const drawRect = ({ x3, y3, x4, y4 }): void => {
    rectRef.current.style.left = x3 + "px"
    rectRef.current.style.top = y3 + "px"
    rectRef.current.style.width = x4 - x3 + "px"
    rectRef.current.style.height = y4 - y3 + "px"
  }

  const handleMousedown = (e): void => {
    if (blurZoneIsHover) return

    const rect = rootRef.current.getBoundingClientRect()

    const relativePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    x1.current = relativePosition.x
    y1.current = relativePosition.y
    rectRef.current.style.border = "1px solid red"

    const coords = dragCoordinates()
    drawRect(coords)
  }

  const handleMousemove = (e): void => {
    if (blurZoneIsHover) return

    const rect = rootRef.current.getBoundingClientRect()

    const relativePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    x2.current = relativePosition.x
    y2.current = relativePosition.y

    const coords = dragCoordinates()
    drawRect(coords)
  }

  const handleMousleave = (e) => {
    x1.current = 0
    x2.current = 0
    y1.current = 0
    y2.current = 0
    rectRef.current.style.border = null
  }

  const handleMouseup = (e): void => {
    if (blurZoneIsHover) return

    const width = Math.abs(x2.current - x1.current)
    const height = Math.abs(y2.current - y1.current)

    if (!height || !width) return

    debug("props.imageSize", props.imageSize)

    props.dispatchNewZone({
      x: (x2.current < x1.current ? x2.current : x1.current) / props.imageSize.width,
      y: (y2.current < y1.current ? y2.current : y1.current) / props.imageSize.height,
      width: width / props.imageSize.width,
      height: height / props.imageSize.height,
    })
  }

  useEffect(() => {
    rootRef.current?.addEventListener("mousedown", handleMousedown, { passive: true })
    rootRef.current?.addEventListener("mousemove", handleMousemove, { passive: true })
    rootRef.current?.addEventListener("mouseup", handleMouseup, { passive: true })
    rootRef.current?.addEventListener("mouseleave", handleMousleave, { passive: true })
    return () => {
      rootRef.current?.removeEventListener("mousedown", handleMousedown)
      rootRef.current?.removeEventListener("mousemove", handleMousemove)
      rootRef.current?.removeEventListener("mouseleave", handleMousleave)
      rootRef.current?.removeEventListener("mouseup", handleMouseup)
    }
  }, [blurZoneIsHover])

  return (
    <div className={merge([css.root, props.className])} ref={rootRef}>
      <div className={css.blurFacesWrapper}>
        {props.blurZoneAI?.length > 0 &&
          props.blurZoneAI?.map((el, i) => (
            <BlurZone
              box={el}
              key={i}
              imageSize={props.imageSize}
              onClick={() => props.handleBlurZoneClick(i)}
              dispatchIsHover={(isHover) => setBlurZoneIsHover(isHover)}
            />
          ))}
        {props.blurZoneBuilt?.length > 0 &&
          props.blurZoneBuilt?.map((el, i) => (
            <BlurZone
              box={el}
              key={i}
              imageSize={props.imageSize}
              onClick={() => props.handleBlurZoneBuiltClick(i)}
              dispatchIsHover={(isHover) => setBlurZoneIsHover(isHover)}
            />
          ))}
      </div>

      <div className={css.rect} ref={rectRef} />
    </div>
  )
}

export default BlurZoneBuilder
