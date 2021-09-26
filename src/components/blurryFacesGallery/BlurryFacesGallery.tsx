import css from "./BlurryFacesGallery.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"
import BlurryFacesImage from "../blurryFacesImage/BlurryFacesImage"
import image1 from "../../images/classe-01.jpg"

interface IProps {
  className?: string
  imageUrls: string[]
}

const componentName = "BlurryFacesGallery"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name BlurryFacesGallery
 */
function BlurryFacesGallery(props: IProps) {
  return (
    <div className={merge([css.root, props.className])}>
      {props.imageUrls?.map((el) => (
        <BlurryFacesImage className={css.image} imageUrl={el} />
      ))}
    </div>
  )
}

export default BlurryFacesGallery
