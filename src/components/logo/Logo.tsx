import css from "./Logo.module.less"
import React, { forwardRef, MutableRefObject } from "react"
import { merge } from "../../helpers/arrayUtils"
import { DICO } from "../../data/dico"

interface IProps {
  className?: string
}

const componentName = "Logo"
const debug = require("@wbe/debug")(`front:${componentName}`)

/**
 * @name Logo
 */
const Logo = forwardRef((props: IProps, ref: MutableRefObject<any>) => {
  return (
    <div className={merge([css.root, props.className])} ref={ref}>
      <div className={css.wrapper}>
        <h1 className={css.title}>{DICO.logo_title}</h1>
        <div className={css.subtitle}>
          <div className={css.subtitlePart}>{DICO.logo_baseLine_part1}</div>
          <div className={css.subtitlePart}>{DICO.logo_baseLine_part2}</div>
        </div>
      </div>
    </div>
  )
})

export default Logo
