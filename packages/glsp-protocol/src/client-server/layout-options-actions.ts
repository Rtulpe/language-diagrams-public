import { Action } from "@eclipse-glsp/protocol"

import type { AllLayoutOptions } from "./layout-options-structure"

/**
 * UpdateElkLayoutOptionsAction is sent from GLSP client to server.
 * It is used to apply elk layout options to the diagram.
 */
export interface UpdateElkLayoutOptionsAction {
  kind: typeof UpdateElkLayoutOptionsAction.KIND
  options: AllLayoutOptions
}

export namespace UpdateElkLayoutOptionsAction {
  export const KIND = "UpdateElkLayoutOptionsAction"

  export function is(object: unknown): object is UpdateElkLayoutOptionsAction {
    return Action.hasKind(object, KIND)
  }

  export function create(options: AllLayoutOptions): UpdateElkLayoutOptionsAction {
    return {
      kind: KIND,
      options,
    }
  }
}
