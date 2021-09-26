import css from "./App.module.less"
import React from "react"
import { Link, Stack } from "@cher-ami/router"
import image from "../../images/classe-01.jpg"
import BluryFacesImage from "../bluryFacesImage/BluryFacesImage"

const componentName = "App"

export interface IProps {}

function App(props: IProps) {
  return (
    <div className={css.root}>
      <BluryFacesImage imageUrl={image} />

      {/*<Stack className={css.stack} />*/}
    </div>
  )
}

export default App
