import css from "./RestartButton.module.less"
import React, { forwardRef, MutableRefObject, useContext } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { AppContext } from "../../index"
import { useLocation } from "@cher-ami/router"

interface IProps {
  className?: string
  onClick?: () => void
}

const componentName = "RestartButton"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name RestartButton
 */
const RestartButton = forwardRef((props: IProps, ref: MutableRefObject<any>) => {
  const { resetImages } = useContext(AppContext)
  const [, setLocation] = useLocation()

  const handleClick = () => {
    props.onClick?.()
    setLocation({ name: "home" })
    resetImages()
  }

  return (
    <button
      className={merge([css.root, props.className])}
      ref={ref}
      onClick={handleClick}
    >
      <svg
        width="11"
        height="17"
        viewBox="0 0 11 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.018 1.94778L3.84097 8.06766L9.94737 14.258L8.04574 16.1379L0.0459945 8.0459L8.13802 0.0461536L10.018 1.94778Z"
          fill="#FE3457"
        />
      </svg>
      <span className={css.label}>{"restart"}</span>
    </button>
  )
})

export default RestartButton
