import css from "./Loader.module.less"
import React from "react"
import { merge } from "../../helpers/arrayUtils"
import { DICO } from "../../data/dico"

interface IProps {
  className?: string
}

const componentName = "Loader"
const debug = require("@wbe/debug")(`front:${componentName}`)

/**
 * @name Loader
 */
function Loader(props: IProps) {
  return (
    <div className={merge([css.root, props.className])}>
      <div className={css.title}>{DICO.zipLoader_label}</div>
    </div>
  )
}

export default Loader
