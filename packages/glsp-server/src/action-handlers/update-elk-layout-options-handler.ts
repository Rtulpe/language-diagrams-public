import type { MaybePromise } from "@eclipse-glsp/server-node"
import { type Action, type ActionHandler, LayoutOperation } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import { UpdateElkLayoutOptionsAction } from "language-diagrams-protocol"

import { LDModelState } from "../model/ld-model-state"

/**
 * This handler receives updated elk layout options from the client,
 * then sets the layout options in the model state.
 */
@injectable()
export class UpdateElkLayoutOptionsActionHandler implements ActionHandler {
  readonly actionKinds = [UpdateElkLayoutOptionsAction.KIND]

  @inject(LDModelState)
  protected readonly modelState: LDModelState

  execute(action: UpdateElkLayoutOptionsAction): MaybePromise<Action[]> {
    this.modelState.layoutOptions = action.options
    return [LayoutOperation.create([])]
  }
}
