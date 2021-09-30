import css from "./MainButton.module.less"
import React, { useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"

interface IProps {
  className?: string
  label: string
  size: EMainButtonSize
  color: EMainButtonColor
  onClick?: () => void // for button tag
  target?: string
  disableRollover?: boolean
}

const componentName = "MainButton"
const debug = require("debug")(`front:${componentName}`)

export enum EMainButtonSize {
  SMALL = "small",
  BIG = "big",
}
export enum EMainButtonColor {
  RED = "red",
  YELLOW = "yellow",
  WHITE = "white",
}

/**
 * @name MainButton
 */
function MainButton(props: IProps) {
  // ------------------------------------------------------------------------------------ PREPARE

  // Modifier list to add to each dom element
  const modifierProps = useRef<string[]>([
    props.color,
    props.size,
    props.disableRollover && "disableRollover",
  ])

  /**
   * Return a list of CSS modules modifier
   * @param pName
   * @param pModifier
   * @returns string[]
   */
  function modifierClassName(pName: string, pModifier: string[]) {
    return pModifier.map((el) => el && css[`${pName}_${el}`])
  }

  // ------------------------------------------------------------------------------------ HANDLERS

  const clickHandler = () => props.onClick?.()

  // ------------------------------------------------------------------------------------ RENDER

  const contentRender = () => {
    const render = (
      <>
        <div
          className={merge([
            css.label,
            ...modifierClassName("label", modifierProps.current),
          ])}
        >
          {props?.label}
        </div>
      </>
    )

    return (
      <div
        className={merge([
          css.wrapper,
          ...modifierClassName("wrapper", modifierProps.current),
        ])}
      >
        <div
          className={merge([
            css.container,
            css.container_rollover,
            ...modifierClassName("container", modifierProps.current),
          ])}
        >
          {render}
        </div>
        <div
          className={merge([
            css.container,
            ...modifierClassName("container", modifierProps.current),
          ])}
        >
          {render}
        </div>
      </div>
    )
  }

  return (
    <button
      className={merge([
        css.root,

        props.className,
        ...modifierClassName("root", modifierProps.current),
      ])}
      onClick={clickHandler}
      children={contentRender()}
    />
  )
}

export default MainButton
