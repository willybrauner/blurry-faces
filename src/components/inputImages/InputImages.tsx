import css from "./InputImages.module.less"
import React, { useEffect, useRef, useState } from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
  dispatchImageUrls: (images: string[]) => void
}

const componentName = "InputImages"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name InputImages
 */
function InputImages(props: IProps) {
  const [imageUrls, setImageUrls] = useState(null)
  const inputRef = useRef(null)

  /**
   * set selected images urls from input
   */
  const handleOnChange = (e) => {
    const arr = []
    for (let file of e.target.files) {
      const url = URL.createObjectURL(file)
      arr.push(url)
    }
    setImageUrls(arr)
  }

  /**
   * dispatch urls to parent
   */
  useEffect(() => {
    props.dispatchImageUrls(imageUrls)
  }, [imageUrls])

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
