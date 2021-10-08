import { useEffect, useLayoutEffect, useState } from "react"
import ViewManager from "../manager/ViewManager"

const componentName = "useMountView"
const debug = require("debug")(`front:${componentName}`)

/**
 *
 * @param viewInstance
 */
export const useMountView = (viewInstance: ViewManager): boolean => {
  const [mount, setMount] = useState<boolean>(false)

  useLayoutEffect(() => {
    const handleMountState = (mount) => {
      debug("mount args?", mount)
      setMount(mount)
      mount ? viewInstance.mountComplete() : viewInstance.unmountComplete()
    }
    return viewInstance.playStateSignal.on(handleMountState)
  }, [])

  return mount
}
