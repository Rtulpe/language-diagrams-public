import type { Args, PaletteItem } from "@eclipse-glsp/server-node"
import {
  CreateEdgeOperation,
  CreateNodeOperation,
  CreateOperationHandler,
  OperationHandlerRegistry,
  ToolPaletteItemProvider,
} from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

/**
 * This class provides the tool palette items for the client.
 * This can be seen as a table, where you can pick elements from.
 */
@injectable()
export class LDToolPaletteItemProvider extends ToolPaletteItemProvider {
  @inject(OperationHandlerRegistry) operationHandlerRegistry: OperationHandlerRegistry

  protected counter: number

  getItems(_args?: Args): PaletteItem[] {
    const handlers = this.operationHandlerRegistry
      .getAll()
      .filter(handler => handler instanceof CreateOperationHandler) as CreateOperationHandler[]
    this.counter = 0
    const nodes = this.createPaletteItem(handlers, CreateNodeOperation.KIND, "node")
    const fields = this.createPaletteItem(handlers, CreateNodeOperation.KIND, "field")
    const associations = this.createPaletteItem(handlers, CreateEdgeOperation.KIND)
    return [
      { id: "node-group", label: "Nodes", actions: [], children: nodes, icon: "symbol-constant", sortString: "A" },
      { id: "field-group", label: "Fields", actions: [], children: fields, icon: "symbol-field", sortString: "B" },
      {
        id: "association-group",
        label: "Associations",
        actions: [],
        children: associations,
        icon: "arrow-swap",
        sortString: "C",
      },
    ]
  }

  createPaletteItem(handlers: CreateOperationHandler[], kind: string, subkind?: string): PaletteItem[] {
    return handlers
      .filter(handler => handler.operationType === kind)
      .filter(handler => subkind === undefined || handler.elementTypeIds.some(element => element.includes(subkind)))
      .map(handler => handler.getTriggerActions().map(action => this.create(action, handler.label)))
      .reduce((accumulator, value) => accumulator.concat(value), [])
      .sort((a, b) => a.sortString.localeCompare(b.sortString))
  }

  create(action: PaletteItem.TriggerElementCreationAction, label: string): PaletteItem {
    return { id: `palette-item${this.counter}`, sortString: label.charAt(0), label, actions: [action] }
  }
}
