import css from "./BlurZoneBuilder.module.less"
import React, { useEffect, useRef, useState } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { TBlurZone } from "../blurZone/BlurZone"

interface IProps {
  className?: string
  dispatchNewZone: (e: TBlurZone) => void
}

const componentName = "BlurZoneBuilder"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurZoneBuilder
 */
function BlurZoneBuilder(props: IProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<HTMLDivElement>(null)

  const x1 = useRef(0)
  const x2 = useRef(0)
  const y1 = useRef(0)
  const y2 = useRef(0)

  const dragCoordinates = () => {
    const x3 = Math.min(x1.current, x2.current)
    const x4 = Math.max(x1.current, x2.current)
    const y3 = Math.min(y1.current, y2.current)
    const y4 = Math.max(y1.current, y2.current)

    rectRef.current.style.left = x3 + "px"
    rectRef.current.style.top = y3 + "px"
    rectRef.current.style.width = x4 - x3 + "px"
    rectRef.current.style.height = y4 - y3 + "px"
  }

  const drawRect = () => {}

  const handleMousedown = (e): void => {
    const rect = rootRef.current.getBoundingClientRect()

    const relativePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    x1.current = relativePosition.x
    y1.current = relativePosition.y
    rectRef.current.style.border = "1px solid red"
    dragCoordinates()
  }

  const handleMousemove = (e): void => {
    const rect = rootRef.current.getBoundingClientRect()

    const relativePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    x2.current = relativePosition.x
    y2.current = relativePosition.y
    dragCoordinates()
  }

  const handleMouseup = (e): void => {
    // reset
    // x1.current = 0
    // y1.current = 0
    // x2.current = 0
    // y2.current = 0
    rectRef.current.style.border = null

    props.dispatchNewZone({
      width: Math.abs(x2.current - x1.current),
      height: Math.abs(y2.current - y1.current),
      x: x1.current,
      y: x1.current,
    })
  }

  useEffect(() => {
    rootRef.current.addEventListener("mousedown", handleMousedown)
    rootRef.current.addEventListener("mousemove", handleMousemove)
    rootRef.current.addEventListener("mouseup", handleMouseup)
    return () => {
      // rootRef.current.removeEventListener("mousedown", handleMousedown)
      // rootRef.current.removeEventListener("mousemove", handleMousemove)
      // rootRef.current.removeEventListener("mouseup", handleMouseup)
    }
  }, [])

  return (
    <div className={merge([css.root, props.className])} ref={rootRef}>
      <div className={css.rect} ref={rectRef} />
    </div>
  )
}

export default BlurZoneBuilder
