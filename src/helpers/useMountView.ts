import { useLayoutEffect, useState } from "react"
import ViewManager, { TPlayState } from "../manager/ViewManager"

const componentName = "useMountView"
const debug = require("debug")(`front:${componentName}`)

/**
 *
 * @param view
 */
export const useMountView = (view: ViewManager): boolean => {
  const [mount, setMount] = useState<boolean>(false)

  const handlePlayState = (playState: TPlayState): void => {
    if (playState === "mount") {
      setMount(true)
      view.mountComplete()
    }
    if (playState === "unmount") {
      setMount(false)
      view.unmountComplete()
    }
  }

  useLayoutEffect(() => {
    return view.playStateSignal.on(handlePlayState)
  }, [])

  return mount
}
