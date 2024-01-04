/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, type MaybePromise, type OperationHandler } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import { ApplyNodeValidationsOperation } from "language-diagrams-protocol"

import { LDModelState } from "../model/ld-model-state"

/**
 * Receives an operation from the client every time the monaco editor
 * content changes. The content is then applied to the node.
 */
@injectable()
export class ApplyNodeValidationsHandler implements OperationHandler {
  readonly operationType = ApplyNodeValidationsOperation.KIND

  @inject(LDModelState)
  protected modelState: LDModelState

  @inject(Logger)
  protected logger: Logger

  execute(operation: ApplyNodeValidationsOperation): MaybePromise<void> {
    const elementId: string = operation.elementId
    const index = this.modelState.index
    const node = index.findNode(elementId)
    if (node !== undefined) {
      node.validations = operation.validations
    } else {
      this.logger.warn(`Node with id ${elementId} not found`)
    }
  }
}
