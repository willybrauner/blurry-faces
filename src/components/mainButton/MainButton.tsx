import css from "./MainButton.module.less"
import React, { useRef } from "react"
import { merge } from "../../lib/utils/arrayUtils"
import { TOpenRouteParams } from "@cher-ami/router/dist/api/helpers"

interface IProps {
  className?: string
  label: string
  icon: EMainButtonIcon
  alignment: EMainButtonAlignment
  size: EMainButtonSize
  color: EMainButtonColor
  tag?: EMainButtonTag
  onClick?: () => void // for button tag
  to?: string | TOpenRouteParams // for link
  target?: string
  disableRollover?: boolean
}

const componentName = "MainButton"
const debug = require("debug")(`front:${componentName}`)

export enum EMainButtonTag {
  LINK = "link",
  BUTTON = "button",
  EXTERNAL_LINK = "a",
}
export enum EMainButtonIcon {
  ARROW = "arrow",
  DOT = "dot",
}
export enum EMainButtonAlignment {
  LEFT = "left",
  RIGHT = "right",
}
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
    props.alignment,
    props.icon,
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
      <>
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
      </>
    )
  }

  const ButtonRender = (pChildren: any) => {
    return (
      <button
        className={merge([
          css.root,
          css.root_button,
          props.className,
          ...modifierClassName("root", modifierProps.current),
        ])}
        onClick={clickHandler}
        children={contentRender()}
      />
    )
  }

  const ExternalLinkRender = () => {
    return (
      <a
        className={merge([
          css.root,
          css.root_link,
          props.className,
          ...modifierClassName("root", modifierProps.current),
        ])}
        onClick={clickHandler}
        href={props.to as string}
        children={contentRender()}
        target={props?.target}
      />
    )
  }

  const RenderTag =
    props.tag === EMainButtonTag.BUTTON ? ButtonRender : ExternalLinkRender

  return <RenderTag />
}

MainButton.defaultProps = {
  tag: EMainButtonTag.BUTTON,
} as IProps

export default MainButton
