import type { Action } from "@eclipse-glsp/protocol"
import type { ActionHandler, MaybePromise } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import {
  RejectNodeValidationsAction,
  RequestNodeValidationsAction,
  ReturnNodeValidationsAction,
} from "language-diagrams-protocol"

import { LDModelState } from "../model/ld-model-state"

/**
 * This handler receives a request from the client,
 * then finds the node in the model state and returns
 * the validations of that node. If the node is not
 * found, it returns a reject action.
 */
@injectable()
export class RequestNodeValidationsActionHandler implements ActionHandler {
  readonly actionKinds = [RequestNodeValidationsAction.KIND]

  @inject(LDModelState)
  protected modelState: LDModelState

  execute(action: RequestNodeValidationsAction): MaybePromise<Action[]> {
    const elementId = action.nodeID
    const index = this.modelState.index
    const node = index.findNode(elementId)
    if (node !== undefined) {
      return [ReturnNodeValidationsAction.create(node.validations)]
    }
    return [RejectNodeValidationsAction.create()]
  }
}
