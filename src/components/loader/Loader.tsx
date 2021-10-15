import css from "./Loader.module.less"
import React from "react"
import { merge } from "../../helpers/arrayUtils"

interface IProps {
  className?: string
}

const componentName = "Loader"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name Loader
 */
function Loader(props: IProps) {
  return (
    <div className={merge([css.root, props.className])}>
      <div className={css.title}>Process...</div>
    </div>
  )
}

export default Loader
