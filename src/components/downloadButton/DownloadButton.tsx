import css from "./DownloadButton.module.less"
import React, { forwardRef, MutableRefObject, useContext } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { AppContext } from "../../index"
import { useLocation } from "@cher-ami/router"

interface IProps {
  className?: string
}

const componentName = "DownloadButton"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name DownloadButton
 */
const DownloadButton = forwardRef((props: IProps, ref: MutableRefObject<any>) => {
  const { images, createZipFiles } = useContext(AppContext)

  const handleClick = async () => {
    await createZipFiles()
  }

  return (
    <button
      className={merge([css.root, props.className])}
      ref={ref}
      onClick={handleClick}
      aria-label={"export images button"}
    >
      <svg
        className={css.svg}
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.35 6.04C18.67 2.59 15.64 0 12 0C9.11 0 6.6 1.64 5.35 4.04C2.34 4.36 0 6.91 0 10C0 13.31 2.69 16 6 16H19C21.76 16 24 13.76 24 11C24 8.36 21.95 6.22 19.35 6.04ZM17 9L12 14L7 9H10V5H14V9H17Z"
          fill="black"
        />
      </svg>
      <div className={css.label}>
        {"Export"}
        <br />
        {`${images.length} image${images.length > 1 ? "s" : ""} :)`}
      </div>
    </button>
  )
})

export default DownloadButton
