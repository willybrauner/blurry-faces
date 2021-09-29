import css from "./InputImages.module.less"
import React, { useContext, useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { AppContext, IImageData } from "../../index"

interface IProps {
  className?: string
}

const componentName = "InputImages"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name InputImages
 */
function InputImages(props: IProps) {
  const { saveImages } = useContext(AppContext)
  const inputRef = useRef(null)

  /**
   * set selected images urls from input
   */
  const handleOnChange = (e) => {
    const arr: IImageData[] = []
    for (let file of e.target.files) {
      arr.push({ url: URL.createObjectURL(file), filename: file.name, data: null })
    }
    saveImages(arr)
  }

  return (
    <div className={merge([css.root, props.className])}>
      <button
        className={css.button}
        onClick={() => {
          inputRef.current.click()
        }}
      >
        Select images
      </button>

      <input
        ref={inputRef}
        className={css.input}
        type="file"
        accept="image/*"
        multiple={true}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default InputImages
