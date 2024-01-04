import { CreateEdgeOperation, CreateOperationHandler, DefaultTypes } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import * as uuid from "uuid"

import type { LDAssociation } from "../model/ld-model"
import { LDModelState } from "../model/ld-model-state"

/**
 * Creates an association (also known as edge) between two nodes.
 */
@injectable()
export class CreateAssociationHandler extends CreateOperationHandler {
  override elementTypeIds = [DefaultTypes.EDGE]

  @inject(LDModelState)
  protected modelState: LDModelState

  get operationType(): string {
    return CreateEdgeOperation.KIND
  }

  get label(): string {
    return "Association"
  }

  override execute(operation: CreateEdgeOperation): void {
    const assoc = this.createAssociation(operation.sourceElementId, operation.targetElementId)
    const assocList = this.modelState.LDFile
    assocList.associations.push(assoc)
  }

  protected createAssociation(source: string, target: string): LDAssociation {
    const assocCounter = this.modelState.index.typeCount(DefaultTypes.EDGE)
    return {
      id: uuid.v4(),
      name: `NewAssociation${assocCounter}`,
      source_id: source,
      target_id: target,
    }
  }
}
