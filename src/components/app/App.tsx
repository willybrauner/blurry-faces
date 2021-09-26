import css from "./App.module.less"
import React, { useState } from "react"
import image1 from "../../images/classe-01.jpg"
import image2 from "../../images/classe-02.jpg"
import BlurryFacesGallery from "../blurryFacesGallery/BlurryFacesGallery"
import InputImages from "../inputImages/InputImages"
import Output from "../output/Output"

const componentName = "App"

export interface IProps {}

function App(props: IProps) {
  // get image urls dispatched from input
  const [imageUrls, setImageUrls] = useState<string[]>(null)
  return (
    <div className={css.root}>
      <div className={css.wrapper}>
        <InputImages dispatchImageUrls={(urls: string[]) => setImageUrls(urls)} />
        {/* TODO binder le state */}
        <BlurryFacesGallery className={css.gallery} imageUrls={imageUrls} />

        {/*<Output className={css.output} />*/}
      </div>
    </div>
  )
}

export default App
