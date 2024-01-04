import { TYPES } from "@eclipse-glsp/client"
import { ContainerModule } from "inversify"

import { LDIndexer } from "."

const editorIndexerModule = new ContainerModule((bind, _unbind, _isBound, _rebind) => {
  bind(LDIndexer).toSelf().inSingletonScope()
  bind(TYPES.IUIExtension).toService(LDIndexer)
})

export default editorIndexerModule
