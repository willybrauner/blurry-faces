import css from "./Output.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
}

const componentName = "Output"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name Output
 */
function Output(props: IProps) {
  return <div className={merge([css.root, props.className])}>{componentName}</div>
}

export default Output
