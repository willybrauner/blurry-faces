import ViewManager from "../../manager/ViewManager"

const componentName = "GalleryViewService"
const debug = require("debug")(`front:${componentName}`)

class GalleryViewService extends ViewManager {
  constructor() {
    super(componentName, true)
  }
}

export default new GalleryViewService()
