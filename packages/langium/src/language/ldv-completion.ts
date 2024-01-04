/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { AstNode, CompletionAcceptor, CompletionContext, MaybePromise, NextFeature } from "langium"
import { DefaultCompletionProvider } from "langium"
import { type AbstractElement, isRuleCall } from "langium/lib/grammar/generated/ast"
import type { GlspContextParams } from "language-diagrams-protocol/lib/client-langium"
import { GLSP_CONTEXT_NOTIFICATION } from "language-diagrams-protocol/lib/client-langium"

import {
  Association,
  DotExpression,
  DotTargetRef,
  Field,
  isAssociation,
  isDotExpression,
  isDotTargetRef,
  isField,
} from "./generated/ast"
import type { LdvServices } from "./ldv-module"

/**
 * Takes the context from the GLSP client and provides the field and association data
 * to langium.
 */
export class FieldProvider {
  glspContext: GlspContextParams

  constructor(services: LdvServices) {
    services.shared.lsp.Connection?.onNotification(GLSP_CONTEXT_NOTIFICATION, (msg: { context: GlspContextParams }) => {
      this.glspContext = msg.context
    })
  }

  getNodeFields(nodeId: string): string[] {
    const node = this.glspContext.nodes.get(nodeId)
    const fields: string[] = []
    node?.fields.forEach((value, _key) => {
      fields.push(...value)
    })
    return fields
  }

  getNodeAssociations(nodeId: string): string[] {
    return this.glspContext.nodes.get(nodeId)?.asTarget ?? []
  }

  /**
   * Finds the most recent association. Example:
   * Node1->Node2->Node3 (Node3 is the most recent association)
   * @returns Returns the most recent association name in the AST.
   */
  findPreviousAssociation(node: AstNode): string {
    switch (node.$type) {
      case Association:
        const association = node as Association
        return this.findPreviousAssociation(association.$container)

      case DotTargetRef:
        const dotTargetRef = node as DotTargetRef
        return this.findPreviousAssociation(dotTargetRef.$container)

      case DotExpression:
        const dotExpression = node as DotExpression
        return isDotExpression(dotExpression.base)
          ? dotExpression.base.target.ref.name
          : isAssociation(dotExpression.base)
          ? dotExpression.base.name
          : ""

      case Field:
        const field = node as Field
        return this.findPreviousAssociation(field.$container)
    }

    // Possible edge case
    throw new Error(`Could not find previous association: ${node.$type}`)
  }
}

/**
 * Provides the completion items for the language.
 * Example: Pressing Ctrl+Space in the editor will trigger this.
 */
export class CompletionProvider extends DefaultCompletionProvider {
  protected fieldProvider: FieldProvider

  constructor(services: LdvServices) {
    super(services)
    this.fieldProvider = services.Fields
  }

  protected override completionFor(
    context: CompletionContext,
    next: NextFeature<AbstractElement>,
    acceptor: CompletionAcceptor
  ): MaybePromise<void> {
    const nodeName =
      !isDotExpression(context.node) && !isDotTargetRef(context.node?.$container)
        ? this.fieldProvider.glspContext.currentNode
        : context.node !== undefined
        ? this.fieldProvider.findPreviousAssociation(context.node)
        : ""

    if (isField(context.node) || (isRuleCall(next.feature) && next.type === Field)) {
      this.fieldProvider.getNodeFields(nodeName).map(it => acceptor(context, { label: it, kind: 5 }))
    }
    if (isAssociation(context.node) || (isRuleCall(next.feature) && next.type === Association)) {
      this.fieldProvider.getNodeAssociations(nodeName).map(it => acceptor(context, { label: it, kind: 7 }))
    }

    return super.completionFor(context, next, acceptor)
  }
}
