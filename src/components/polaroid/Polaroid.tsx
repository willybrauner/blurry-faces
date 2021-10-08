import css from "./Polaroid.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
}

const componentName = "Polaroid"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name Polaroid
 */
function Polaroid(props: IProps) {
  return (
    <div className={merge([css.root, props.className])}>
      <div className={css.wrapper}>
        <div className={css.card}>
          <div className={css.pic} />
          <div className={css.deco} />
        </div>
      </div>
    </div>
  )
}

export default Polaroid
