/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { ValidationAcceptor, ValidationChecks } from "langium"
import { ValidationRegistry } from "langium"

import type {
  And,
  Division,
  Ensure,
  Equals,
  GreaterThan,
  LessThan,
  Multiplication,
  NotEquals,
  NotExpression,
  Or,
  When,
} from "./generated/ast"
import { type Addition, type LdvAstType, type Subtraction } from "./generated/ast"
import type { LdvServices } from "./ldv-module"
import type { TypeChecker } from "./ldv-type-checker"

/**
 * Implementation of custom validations.
 */
export namespace LdvValidator {
  export function checkArithmetic(
    tc: TypeChecker,
    operation: Addition | Subtraction | Multiplication | Division | LessThan | GreaterThan,
    accept: ValidationAcceptor
  ): void {
    if (operation === undefined) return
    if (operation.left === undefined || operation.right === undefined) return

    if (!tc.isArithmeticExpression(operation.left)) {
      accept("error", `Expected <Arithmetic Expression> on left, but found <${operation.left.$type}>`, {
        node: operation,
      })
    }
    if (!tc.isArithmeticExpression(operation.right)) {
      accept("error", `Expected <Arithmetic Expression> on right, but found <${operation.right.$type}>`, {
        node: operation,
      })
    }
  }

  export function checkBoolean(tc: TypeChecker, operation: And | Or, accept: ValidationAcceptor): void {
    if (operation === undefined) return
    if (operation.left === undefined || operation.right === undefined) return

    if (!tc.isBooleanExpression(operation.left)) {
      accept("error", `Expected <Boolean Expression> on left, but found <${operation.left.$type}>`, {
        node: operation,
      })
    }
    if (!tc.isBooleanExpression(operation.right)) {
      accept("error", `Expected <Boolean Expression> on right, but found <${operation.right.$type}>`, {
        node: operation,
      })
    }
  }

  export function checkEquality(tc: TypeChecker, operation: Equals | NotEquals, accept: ValidationAcceptor): void {
    if (operation === undefined) return
    if (operation.left === undefined || operation.right === undefined) return

    if (!tc.isSameExpressionType(operation.left, operation.right)) {
      accept(
        "error",
        `Expected <${operation.left.$type}> and <${operation.right.$type}> to be of same, <Arithmetic> or <Boolean>, type`,
        {
          node: operation,
        }
      )
    }
  }

  export function checkNotExpression(tc: TypeChecker, operation: NotExpression, accept: ValidationAcceptor): void {
    if (operation === undefined) return
    if (operation.base === undefined) return

    if (!tc.isBooleanExpression(operation.base)) {
      accept("error", `Expected <Boolean Expression>, but found <${operation.base.$type}>`, {
        node: operation,
      })
    }
  }

  export function checkEnsureStatement(tc: TypeChecker, statement: Ensure | When, accept: ValidationAcceptor): void {
    if (statement === undefined) return
    if (statement.condition === undefined) return

    if (!tc.isBooleanExpression(statement.condition)) {
      accept("error", `Expected <Boolean Expression>, but found <${statement.condition.$type}>`, {
        node: statement,
      })
    }
  }
}

/**
 * Register custom validation checks.
 */
export class LdvValidationRegistry extends ValidationRegistry {
  constructor(services: LdvServices) {
    super(services)
    const typeChecker = services.validation.TypeChecker

    const typeCheck: ValidationChecks<LdvAstType> = {
      // Arithmetic expressions will always have arithmetic operands
      Addition: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),
      Subtraction: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),

      Multiplication: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),
      Division: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),

      // Comparison expressions will also have arithmetic operands
      GreaterThan: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),
      LessThan: (n, a) => LdvValidator.checkArithmetic(typeChecker, n, a),

      // Boolean expressions will always have boolean operands
      And: (n, a) => LdvValidator.checkBoolean(typeChecker, n, a),
      Or: (n, a) => LdvValidator.checkBoolean(typeChecker, n, a),

      // Equality expressions will have operands of either arithmetic or boolean type exclusively
      Equals: (n, a) => LdvValidator.checkEquality(typeChecker, n, a),
      NotEquals: (n, a) => LdvValidator.checkEquality(typeChecker, n, a),

      // Not expressions will always have boolean operands
      NotExpression: (n, a) => LdvValidator.checkNotExpression(typeChecker, n, a),

      // Ensure/When statements will always have boolean conditions
      Ensure: (n, a) => LdvValidator.checkEnsureStatement(typeChecker, n, a),
      When: (n, a) => LdvValidator.checkEnsureStatement(typeChecker, n, a),
    }

    this.register(typeCheck)
  }
}
