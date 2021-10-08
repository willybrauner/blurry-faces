import ViewManager from "../../manager/ViewManager"

const componentName = "HomeViewService"
const debug = require("debug")(`front:${componentName}`)

class HomeViewService extends ViewManager {
  constructor() {
    super(componentName, true)
  }
}

export default new HomeViewService()
