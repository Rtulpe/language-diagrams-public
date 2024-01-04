import { configureActionHandler, DeleteElementOperation, SelectAction, TYPES } from "@eclipse-glsp/client"
import { ContainerModule } from "inversify"

import { EnableEditorApplicationAction } from "./actions"
import { EditorApplication } from "./module"

const editorApplicationModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(EditorApplication).toSelf().inSingletonScope()
  bind(TYPES.IUIExtension).toService(EditorApplication)
  configureActionHandler({ bind, isBound }, EnableEditorApplicationAction.KIND, EditorApplication)
  configureActionHandler({ bind, isBound }, SelectAction.KIND, EditorApplication)
  configureActionHandler({ bind, isBound }, DeleteElementOperation.KIND, EditorApplication)
})

export default editorApplicationModule
