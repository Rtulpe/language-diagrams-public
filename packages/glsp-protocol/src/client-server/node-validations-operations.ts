import { hasArrayProp, Operation } from "@eclipse-glsp/protocol"

/**
 * Sent every time the monaco editor content changes.
 * From GLSP client to server.
 */
export interface ApplyNodeValidationsOperation extends Operation {
  kind: typeof ApplyNodeValidationsOperation.KIND
  validations: string[]
  elementId: string
}

export namespace ApplyNodeValidationsOperation {
  export const KIND = "applyNodeValidationsOperation"

  export function is(object: unknown): object is ApplyNodeValidationsOperation {
    return Operation.hasKind(object, KIND) && hasArrayProp(object, "validations")
  }

  export function create(validations: string[], elementId: string): ApplyNodeValidationsOperation {
    return {
      kind: KIND,
      isOperation: true,
      elementId,
      validations,
    }
  }
}
