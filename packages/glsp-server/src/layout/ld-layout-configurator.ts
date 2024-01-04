import type { LayoutOptions } from "@eclipse-glsp/layout-elk"
import { AbstractLayoutConfigurator } from "@eclipse-glsp/layout-elk"
import type { GEdge, GGraph, GLabel, GNode, GPort } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import { LayoutOptionUtils } from "language-diagrams-protocol"

import { LDModelState } from "../model/ld-model-state"

/**
 * Elk layout configurator. The configurations are used upon
 * processing the layout request.
 */
@injectable()
export class LDLayoutConfigurator extends AbstractLayoutConfigurator {
  @inject(LDModelState)
  protected override readonly modelState: LDModelState

  protected override graphOptions(_graph: GGraph): LayoutOptions | undefined {
    return LayoutOptionUtils.asLayoutOptions(this.modelState.layoutOptions.graph)
  }

  protected override edgeOptions(_edge: GEdge): LayoutOptions | undefined {
    if (this.modelState.layoutOptions.edge === undefined) return undefined

    return LayoutOptionUtils.asLayoutOptions(this.modelState.layoutOptions.edge)
  }

  protected override nodeOptions(_node: GNode): LayoutOptions | undefined {
    if (this.modelState.layoutOptions.node === undefined) return undefined

    return LayoutOptionUtils.asLayoutOptions(this.modelState.layoutOptions.node)
  }

  protected override portOptions(_sport: GPort): LayoutOptions | undefined {
    if (this.modelState.layoutOptions.port === undefined) return undefined

    return LayoutOptionUtils.asLayoutOptions(this.modelState.layoutOptions.port)
  }

  protected override labelOptions(_label: GLabel): LayoutOptions | undefined {
    if (this.modelState.layoutOptions.label === undefined) return undefined

    return LayoutOptionUtils.asLayoutOptions(this.modelState.layoutOptions.label)
  }
}
