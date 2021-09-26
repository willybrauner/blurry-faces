import css from "./HomePage.module.less"
import React, { ForwardedRef, forwardRef, useRef } from "react"
import { useStack } from "@cher-ami/router"

import image from "../../images/classe-01.jpg"

interface IProps {}

const componentName = "HomePage"
const debug = require("debug")(`front:${componentName}`)

/**
 * @name HomePage
 */
const HomePage = forwardRef((props: IProps, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef<HTMLDivElement>(null)
  /**
   * Handle page for Stack
   * Minimal arguments should be: useStack({ componentName, handleRef, rootRef });
   * (remove playIn and playOut if not use)
   */
  useStack({ componentName, handleRef, rootRef })

  return (
    <div className={css.root} ref={rootRef}>
      HomePage
    </div>
  )
})

HomePage.displayName = componentName
export default HomePage
