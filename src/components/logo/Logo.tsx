import css from "./Logo.module.less"
import React from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { DICO } from "../../data/dico"

interface IProps {
  className?: string
}

const componentName = "Logo"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name Logo
 */
function Logo(props: IProps) {
  return (
    <div className={merge([css.root, props.className])}>
      <div className={css.wrapper}>
        <h1 className={css.title}>{DICO.logo_title}</h1>
        <div className={css.subtitle}>
          <div className={css.subtitlePart}>{DICO.logo_baseLine_part1}</div>
          <div className={css.subtitlePart}>{DICO.logo_baseLine_part2}</div>
        </div>
      </div>
    </div>
  )
}

export default Logo
