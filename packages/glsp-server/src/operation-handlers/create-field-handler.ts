import type { CreateNodeOperation } from "@eclipse-glsp/server-node"
import { CreateNodeOperationHandler } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

import type { LDField } from "../model/ld-model"
import { LDModelState } from "../model/ld-model-state"

/**
 * Abstract for creating field element inside a node.
 */
@injectable()
export abstract class CreateFieldHandler extends CreateNodeOperationHandler {
  @inject(LDModelState)
  protected override modelState: LDModelState

  override execute(operation: CreateNodeOperation): void {
    if (operation.containerId !== undefined) {
      const parent = this.modelState.index.findNode(operation.containerId)
      if (parent !== undefined) {
        const field = this.createField()
        const fieldList = parent.fields
        fieldList.push(field)
      }
    } else {
      throw new Error("ContainerId is undefined")
    }
  }

  protected abstract createField(): LDField<string> | LDField<number> | LDField<boolean>
}
