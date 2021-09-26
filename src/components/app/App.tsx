import css from "./App.module.less"
import React from "react"
import { Link, Stack } from "@cher-ami/router"
import image1 from "../../images/classe-01.jpg"
import image2 from "../../images/classe-02.jpg"
import BlurryFacesImage from "../blurryFacesImage/BlurryFacesImage"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"

const componentName = "App"

export interface IProps {}

function App(props: IProps) {
  return (
    <div className={css.root}>
      <div className={css.wrapper}>
        <BlurryFacesGallery className={css.gallery} imageUrls={[image1]} />
        {/*<Stack className={css.stack} />*/}
      </div>
    </div>
  )
}

export default App
