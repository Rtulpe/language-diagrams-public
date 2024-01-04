import { Action } from "@eclipse-glsp/protocol"

/**
 * Action to enable the editor application.
 */
export interface EnableEditorApplicationAction extends Action {
  kind: typeof EnableEditorApplicationAction.KIND
  // Path used to determine the location of webworkers
  path: string
}

export namespace EnableEditorApplicationAction {
  export const KIND = "enableEditorApplicationAction"

  export function is(object: unknown): object is EnableEditorApplicationAction {
    return Action.hasKind(object, KIND)
  }

  export function create(path: string): EnableEditorApplicationAction {
    return {
      kind: KIND,
      path: path,
    }
  }
}
