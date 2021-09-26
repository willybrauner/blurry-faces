import css from "./BlurSquare.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
  imageSize: { width: number; height: number }
  box: {
    width: number
    height: number
    x: number
    y: number
  }
}

const componentName = "BlurSquare"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurSquare
 */
function BlurSquare(props: IProps) {
  debug(props.box)

  const style = {
    width: Math.floor(props.box.width * props.imageSize.width) + "px",
    height: Math.floor(props.box.height * props.imageSize.height) + "px",
    top: Math.floor(props.box.y * props.imageSize.height) + "px",
    left: Math.floor(props.box.x * props.imageSize.width) + "px",
  }

  return <div className={merge([css.root, props.className])} style={style} />
}

export default BlurSquare
