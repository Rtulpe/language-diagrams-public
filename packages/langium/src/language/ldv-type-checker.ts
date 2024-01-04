/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { AstNode } from "langium"
import { LDTypes } from "language-diagrams-protocol/lib/client-server/ld-types"

import type { Expression } from "./generated/ast"
import {
  isAddition,
  isAnd,
  isBooleanLiteral,
  isDivision,
  isDotExpression,
  isEquals,
  isField,
  isGreaterThan,
  isLessThan,
  isMultiplication,
  isNotEquals,
  isNotExpression,
  isNumberLiteral,
  isOr,
  isParenthesis,
  isSubtraction,
} from "./generated/ast"
import type { FieldProvider } from "./ldv-completion"
import type { LdvServices } from "./ldv-module"

/**
 * Custom type checker to figure out if expression
 * is used correctly.
 * Example: (value) + (value), where value is arithmetic expression.
 */
export class TypeChecker {
  protected fieldProvider: FieldProvider

  constructor(services: LdvServices) {
    this.fieldProvider = services.Fields
  }

  isArithmeticExpression(node: AstNode): boolean {
    return (
      isMultiplication(node) ||
      isDivision(node) ||
      isAddition(node) ||
      isSubtraction(node) ||
      isNumberLiteral(node) ||
      isParenthesis(node) ||
      this.evaluateParenthesis(node, "Arithmetic") ||
      this.evaluateField(node, this.fieldProvider.glspContext.currentNode, LDTypes.FIELD_NUMBER) ||
      this.evaluateDotExpression(node, LDTypes.FIELD_NUMBER)
    )
  }

  isBooleanExpression(node: AstNode): boolean {
    return (
      isAnd(node) ||
      isOr(node) ||
      isGreaterThan(node) ||
      isLessThan(node) ||
      isEquals(node) ||
      isNotEquals(node) ||
      isBooleanLiteral(node) ||
      isNotExpression(node) ||
      this.evaluateParenthesis(node, "Boolean") ||
      this.evaluateField(node, this.fieldProvider.glspContext.currentNode, LDTypes.FIELD_BOOLEAN) ||
      this.evaluateDotExpression(node, LDTypes.FIELD_BOOLEAN)
    )
  }

  isSameExpressionType(left: AstNode, right: AstNode): boolean {
    return (
      this.isArithmeticExpression(left) === this.isArithmeticExpression(right) ||
      this.isBooleanExpression(left) === this.isBooleanExpression(right)
    )
  }

  evaluateParenthesis(node: AstNode, expectedType: "Arithmetic" | "Boolean"): boolean {
    if (!isParenthesis(node) || node.expr === undefined) return false

    return this.evaluateNestedExpression(node.expr, expectedType)
  }

  /**
   * Recursively go through nested expressions
   * until expression type is found.
   */
  evaluateNestedExpression(expr: Expression, expectedType: "Arithmetic" | "Boolean"): boolean {
    return isParenthesis(expr)
      ? this.evaluateParenthesis(expr, expectedType)
      : expectedType === "Arithmetic"
      ? this.isArithmeticExpression(expr)
      : this.isBooleanExpression(expr)
  }

  evaluateField(node: AstNode, contextNode: string, type: string): boolean {
    if (!isField(node)) return false
    const values = this.fieldProvider.glspContext.nodes.get(contextNode)?.fields.get(type)
    return values?.includes(node.name) ?? false
  }

  evaluateDotExpression(node: AstNode, type: string): boolean {
    if (!isDotExpression(node)) return false
    if (node.target === undefined) return false

    const field = node.target.ref
    const context = this.fieldProvider.findPreviousAssociation(node)

    return this.evaluateField(field, context, type)
  }
}
