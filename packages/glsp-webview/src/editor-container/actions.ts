import { Action } from "@eclipse-glsp/protocol"

/**
 * Action to enable the editor container, which holds the editor application.
 */
export interface EnableEditorContainerAction extends Action {
  kind: typeof EnableEditorContainerAction.KIND
}

export namespace EnableEditorContainerAction {
  export const KIND = "enableEditorContainerAction"

  export function is(object: unknown): object is EnableEditorContainerAction {
    return Action.hasKind(object, KIND)
  }

  export function create(): EnableEditorContainerAction {
    return { kind: KIND }
  }
}
