import css from "./BlurryFacesGallery.module.less"
import React, { useContext } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import BlurryFacesImage from "../blurryFacesImage/BlurryFacesImage"
import { AppContext } from "../../index"
import MainButton, {
  EMainButtonAlignment,
  EMainButtonColor,
  EMainButtonIcon,
  EMainButtonSize,
} from "../mainButton/MainButton"

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

  debug("images", images)
  return (
    <div className={merge([css.root, props.className])}>
      {images?.length > 0 && (
        <MainButton
          label={"Download images collection"}
          className={css.mainButton}
          icon={EMainButtonIcon.ARROW}
          alignment={EMainButtonAlignment.LEFT}
          size={EMainButtonSize.BIG}
          color={EMainButtonColor.WHITE}
          onClick={createZipFiles}
        />
      )}

      <ul className={css.list}>
        {images?.map((el, i) => (
          <li className={css.item} key={i}>
            <BlurryFacesImage className={css.image} imageUrl={el.url} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlurryFacesGallery
