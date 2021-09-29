import css from "./BlurryFacesGallery.module.less"
import React, { useContext } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import BlurryFacesImage from "../blurryFacesImage/BlurryFacesImage"
import { AppContext } from "../../index"

interface IProps {
  className?: string
}

const componentName = "BlurryFacesGallery"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurryFacesGallery
 */
function BlurryFacesGallery(props: IProps) {
  const { images, createZipFiles } = useContext(AppContext)

  return (
    <div className={merge([css.root, props.className])}>
      {images && (
        <button className={css.download} onClick={createZipFiles}>
          Download all images
        </button>
      )}

      {images?.map(
        (el, i) =>
          el.url && <BlurryFacesImage className={css.image} imageUrl={el.url} key={i} />
      )}
    </div>
  )
}

export default BlurryFacesGallery
