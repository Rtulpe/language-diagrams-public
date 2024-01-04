import "../../css/editor.css"

import { configureActionHandler, TYPES } from "@eclipse-glsp/client"
import { ContainerModule } from "inversify"

import { EnableLayoutOptionsAction } from "./actions"
import { LayoutOptionsUI } from "./module"

const layoutOptionsModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(LayoutOptionsUI).toSelf().inSingletonScope()
  bind(TYPES.IUIExtension).toService(LayoutOptionsUI)
  configureActionHandler({ bind, isBound }, EnableLayoutOptionsAction.KIND, LayoutOptionsUI)
})

export default layoutOptionsModule
