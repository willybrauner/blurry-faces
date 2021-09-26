import css from "./App.module.less"
import React from "react"
import { Link, Stack } from "@cher-ami/router"
import image from "../../images/classe-01.jpg"
import BlurryFacesImage from "../blurryFacesImage/BlurryFacesImage"

const componentName = "App"

export interface IProps {}

function App(props: IProps) {
  return (
    <div className={css.root}>
      <BlurryFacesImage imageUrl={image} />

      {/*<Stack className={css.stack} />*/}
    </div>
  )
}

export default App
