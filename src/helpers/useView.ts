import { useLayoutEffect, useState } from "react"
import ViewManager, { TPlayState } from "../manager/ViewManager"
import { gsap } from "gsap"

const componentName = "useView"
const debug = require("debug")(`front:${componentName}`)

export type TUseView = {
  view: ViewManager
  playIn?: (args?: any) => Promise<void | any> | gsap.core.Timeline
  playOut?: (args?: any) => Promise<void | any> | gsap.core.Timeline
}

/**
 * Use View
 * @param view
 * @param playIn
 * @param playOut
 */
export const useView = ({
  view,
  playIn,
  playOut,
}: TUseView): {
  playState: TPlayState
  mount: boolean
} => {
  const [playState, setPlayState] = useState<TPlayState>()
  const [mount, setMount] = useState<boolean>(false)

  const handlePlayState = async (play: TPlayState, args?: any): Promise<void> => {
    //setPlayState(play)
    //    if (play === playState) return

    if (play === "mount") {
      view.mountComplete()
      setMount(true)
    }

    if (play === "unmount") {
      view.unmountComplete()
      setMount(false)
    }

    if (play === "play-in" && playIn) {
      await playIn?.(args)
      view.playInComplete()
    }

    if (play === "play-out" && playOut) {
      await playOut?.(args)
      view.playOutComplete()
    }
  }

  useLayoutEffect(() => {
    return view.playStateSignal.on(handlePlayState)
  }, [])

  return { playState, mount }
}
