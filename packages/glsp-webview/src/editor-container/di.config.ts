import "../../css/editor.css"

import { configureActionHandler, TYPES } from "@eclipse-glsp/client"
import { ContainerModule } from "inversify"

import { EnableEditorContainerAction } from "./actions"
import { EditorContainer } from "./module"

const editorContainerModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(EditorContainer).toSelf().inSingletonScope()
  bind(TYPES.IUIExtension).toService(EditorContainer)
  configureActionHandler({ bind, isBound }, EnableEditorContainerAction.KIND, EditorContainer)
})

export default editorContainerModule
