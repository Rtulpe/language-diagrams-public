import type { RequestAction, ResponseAction } from "@eclipse-glsp/protocol"
import { Action, hasStringProp } from "@eclipse-glsp/protocol"

/**
 * Sent after clicking on a node in the diagram.
 * The server should respond with a ReturnNodeValidationsAction or RejectNodeValidationsAction.
 */
export interface RequestNodeValidationsAction extends RequestAction<ReturnNodeValidationsAction> {
  kind: typeof RequestNodeValidationsAction.KIND
  nodeID: string
}

export namespace RequestNodeValidationsAction {
  export const KIND = "requestNodeValidationsAction"

  export function is(object: unknown): object is RequestNodeValidationsAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, "nodeID")
  }

  export function create(nodeID: string): RequestNodeValidationsAction {
    return {
      kind: KIND,
      nodeID: nodeID,
      requestId: "",
    }
  }
}

/**
 * Sent from the server to the client in response to a RequestNodeValidationsAction.
 */
export interface ReturnNodeValidationsAction extends ResponseAction {
  kind: typeof ReturnNodeValidationsAction.KIND
  validations: string[]
}

export namespace ReturnNodeValidationsAction {
  export const KIND = "returnNodeValidationsAction"

  export function is(object: unknown): object is ReturnNodeValidationsAction {
    return Action.hasKind(object, KIND)
  }

  export function create(validations: string[]): ReturnNodeValidationsAction {
    return {
      kind: KIND,
      validations: validations,
      responseId: "",
    }
  }
}

/**
 * Sent from the server to the client in response to a RequestNodeValidationsAction.
 * Indicates that the selected node was not found.
 */
export interface RejectNodeValidationsAction extends ResponseAction {
  kind: typeof RejectNodeValidationsAction.KIND
}

export namespace RejectNodeValidationsAction {
  export const KIND = "rejectNodeValidationsAction"

  export function is(object: unknown): object is RejectNodeValidationsAction {
    return Action.hasKind(object, KIND)
  }

  export function create(): RejectNodeValidationsAction {
    return {
      kind: KIND,
      responseId: "",
    }
  }
}
