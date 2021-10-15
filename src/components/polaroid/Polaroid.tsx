import css from "./Polaroid.module.less"
import React, { forwardRef, MutableRefObject } from "react"
import { merge } from "../../helpers/arrayUtils"

interface IProps {
  className?: string
}

const componentName = "Polaroid"
const debug = require("@wbe/debug")(`front:${componentName}`)

/**
 * @name Polaroid
 */
const Polaroid = forwardRef((props: IProps, ref: MutableRefObject<any>) => {
  return (
    <div className={merge([css.root, props.className])} ref={ref}>
      <div className={css.wrapper}>
        <div className={css.card}>
          <div className={css.pic} />
          <div className={css.deco} />
        </div>
      </div>
    </div>
  )
})

export default Polaroid
