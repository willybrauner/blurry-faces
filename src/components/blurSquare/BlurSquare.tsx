import css from "./BlurSquare.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
  imageSize: { width: number; height: number }
  box: {
    width: number
    height: number
    top: number
    left: number
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
  debug(props.imageSize.width)
  debug(props.box.left)

  const ratio = {
    left: props.box.left / 100,
  }

  return (
    <div
      className={merge([css.root, props.className])}
      style={{
        width: props.box.width,
        height: props.box.height,
        top: props.box.top,
        left: props.box.left,
      }}
    >
      <div className={css.inner} style={{}} />
    </div>
  )
}

export default BlurSquare
