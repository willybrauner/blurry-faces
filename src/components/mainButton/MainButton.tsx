import * as css from "./MainButton.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
  label: string
  onClick?: () => void
  target?: string
}

const componentName = "MainButton"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name MainButton
 */
function MainButton(props: IProps) {
  return (
    <button className={merge([css.root, props.className])} onClick={props?.onClick}>
      <div className={css.wrapper}>
        <div className={merge([css.container, css.container_rollover])}>
          <div className={css.label}>{props?.label}</div>
        </div>
        <div className={css.container}>
          <div className={css.label}>{props?.label}</div>
        </div>
      </div>
    </button>
  )
}

export default MainButton
