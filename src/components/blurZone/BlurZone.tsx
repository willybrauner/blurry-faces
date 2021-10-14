import * as css from "./BlurZone.module.less"
import React, { useEffect, useState } from "react"
import { merge } from "../../lib/utils/arrayUtils"

export type TBlurZone = {
  width: number
  height: number
  x: number
  y: number
}

interface IProps {
  className?: string
  imageSize: { width: number; height: number }
  box: TBlurZone
  onClick: () => void
  dispatchIsHover: (isHover: boolean) => void
}

const componentName = "BlurZone"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurZone
 */
function BlurZone(props: IProps) {
  const style = {
    width: Math.floor(props.box.width * props.imageSize.width) + "px",
    height: Math.floor(props.box.height * props.imageSize.height) + "px",
    top: Math.floor(props.box.y * props.imageSize.height) + "px",
    left: Math.floor(props.box.x * props.imageSize.width) + "px",
  }

  const [isHover, setIsHover] = useState(false)
  useEffect(() => {
    props.dispatchIsHover(isHover)
  }, [isHover])

  return (
    <div className={merge([css.root, props.className])} style={style}>
      <div className={css.rect} />
      <div
        className={css.cross}
        onClick={props.onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className={css.crossBg} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}

export default BlurZone
