/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { SEdge, SLabel, SNode } from "@eclipse-glsp/client"
import { AbstractUIExtension, DefaultTypes, EditorContextService } from "@eclipse-glsp/client"
import { inject, injectable } from "inversify"
import {
  type FieldContext,
  type GlspContextParams,
  LDTypes,
  type NodeContext,
  type NodeMap,
} from "language-diagrams-protocol"

/**
 * GLSP Client side indexer, which serves similar purpose as the indexer on the server side.
 * The SModel (The graph behind SVG) is traversed and the context is created to be used by
 * Langium.
 */
@injectable()
export class LDIndexer extends AbstractUIExtension {
  static readonly ID = "langium-editor-indexer"

  @inject(EditorContextService) protected readonly editorContext: EditorContextService

  protected getLabelName(node: SNode): string {
    if (node.children.length > 0) {
      const label = node.children.find(child => child.type === DefaultTypes.LABEL || child.type === LDTypes.LABEL_FIELD)
      return (label as SLabel).text
    }

    return "unknown"
  }

  protected getFieldContext(node: SNode): FieldContext {
    const context: FieldContext = new Map<string, string[]>()

    node.children.forEach(child => {
      if (!child.type.includes("field")) return

      const fieldName = this.getLabelName(child as SNode)
      // there are no field values
      const fields = context.get(child.type)
      if (fields === undefined) {
        context.set(child.type, [fieldName])
      } else {
        fields.push(fieldName)
      }
    })

    return context
  }

  protected getTargetNodes(node: SNode): SNode[] {
    const rootChildren = this.editorContext.modelRoot.children
    const targetNodes = rootChildren
      .filter(child => child.type === DefaultTypes.EDGE)
      .filter(assoc => (assoc as SEdge).source?.id === node.id)
      .map(assoc => (assoc as SEdge).target)

    return targetNodes as SNode[]
  }

  protected getSourceNodes(node: SNode): SNode[] {
    const rootChildren = this.editorContext.modelRoot.children
    const sourceNodes = rootChildren
      .filter(child => child.type === DefaultTypes.EDGE)
      .filter(assoc => (assoc as SEdge).target?.id === node.id)
      .map(assoc => (assoc as SEdge).source)

    return sourceNodes as SNode[]
  }

  protected getNodeContext(node: SNode): NodeContext {
    const sourceNodes = this.getSourceNodes(node).map(source => this.getLabelName(source))
    const targetNodes = this.getTargetNodes(node).map(target => this.getLabelName(target))
    return {
      asSource: sourceNodes,
      asTarget: targetNodes,
      fields: this.getFieldContext(node),
    }
  }

  protected getNodeMap(): NodeMap {
    const nodeMap: NodeMap = new Map<string, NodeContext>()
    const root = this.editorContext.modelRoot
    const nodes = root.children.filter(child => child.type === DefaultTypes.NODE) as SNode[]
    nodes.forEach(node => {
      nodeMap.set(this.getLabelName(node), this.getNodeContext(node))
    })

    return nodeMap
  }

  getGLSPContext(elementId: string): GlspContextParams | undefined {
    const root = this.editorContext.modelRoot
    const element = root.index.getById(elementId) as SNode

    return {
      currentNode: this.getLabelName(element),
      nodes: this.getNodeMap(),
    }
  }

  override id(): string {
    return LDIndexer.ID
  }

  override containerClass(): string {
    return LDIndexer.ID
  }

  /**
   * Unnecessary override, but required by the abstract class.
   */
  protected override initializeContents(_containerElement: HTMLElement): void {
    // do nothing
  }
}
