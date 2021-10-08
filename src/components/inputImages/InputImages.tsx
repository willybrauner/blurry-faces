import css from "./InputImages.module.less"
import React, { forwardRef, MutableRefObject, useContext, useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { AppContext, IImageData } from "../../index"
import MainButton, { EMainButtonColor, EMainButtonSize } from "../mainButton/MainButton"

interface IProps {
  className?: string
}

const componentName = "InputImages"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name InputImages
 */
const InputImages = forwardRef((props: IProps, ref: MutableRefObject<any>) => {
  const { saveImages } = useContext(AppContext)
  const inputRef = useRef(null)

  /**
   * set selected images urls from input
   */
  const handleOnChange = (e) => {
    const arr: IImageData[] = []
    for (let file of e.target.files) {
      arr.push({
        url: URL.createObjectURL(file),
        filename: file.name,
        data: null,
        width: null,
        height: null,
        $img: null,
        fullBlurZones: null,
      })
    }
    saveImages(arr)
  }

  return (
    <div className={merge([css.root, props.className])} ref={ref}>
      <MainButton
        label={"Upload your images"}
        className={css.mainButton}
        size={EMainButtonSize.BIG}
        color={EMainButtonColor.RED}
        onClick={() => inputRef.current.click()}
      />

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
})

export default InputImages
