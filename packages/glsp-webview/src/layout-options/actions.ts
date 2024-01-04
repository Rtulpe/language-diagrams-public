import { Action } from "@eclipse-glsp/protocol"

/**
 * Action to enable the layout options GUI, which are used to configure the editor layout.
 */
export interface EnableLayoutOptionsAction extends Action {
  kind: typeof EnableLayoutOptionsAction.KIND
}

export namespace EnableLayoutOptionsAction {
  export const KIND = "enableLayoutOptionsAction"

  export function is(object: unknown): object is EnableLayoutOptionsAction {
    return Action.hasKind(object, KIND)
  }

  export function create(): EnableLayoutOptionsAction {
    return { kind: KIND }
  }
}
