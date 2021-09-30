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
  const { images, resetImages, createZipFiles } = useContext(AppContext)
  return (
    <div className={merge([css.root, props.className])}>
      <header className={css.header}>
        <button
          className={css.mainButton}
          onClick={createZipFiles}
          aria-label={"download button"}
        >
          <span className={css.text}>{`Download ${images.length} images`}</span>
          {/* prettier-ignore */}
          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 6.04C18.67 2.59 15.64 0 12 0C9.11 0 6.6 1.64 5.35 4.04C2.34 4.36 0 6.91 0 10C0 13.31 2.69 16 6 16H19C21.76 16 24 13.76 24 11C24 8.36 21.95 6.22 19.35 6.04ZM17 9L12 14L7 9H10V5H14V9H17Z" fill="black" />
          </svg>
        </button>

        <button className={css.restart} onClick={resetImages}>
          Restart
        </button>
      </header>
      <section className={css.content}>
        <ul className={css.list}>
          {images?.map((el, i) => (
            <li className={css.item} key={i}>
              <BlurryFacesImage className={css.image} imageUrl={el.url} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default BlurryFacesGallery
