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
  //      const [createImages, setCreateImages] = useState()
  return (
    <div className={merge([css.root, props.className])}>
      <button className={css.download}>Download all images</button>

      {props.imageUrls?.map((el, i) => (
        <BlurryFacesImage className={css.image} imageUrl={el} key={i} />
      ))}
    </div>
  )
}

export default BlurryFacesGallery
