import "./utils/jest-ext"

import type { LdvAstType } from "../src/language/generated/ast"
import { LdvValidator } from "../src/language/ldv-validator"
import type { TestCase, TestSuite } from "./utils/ld-test-helpers"
import { loadActualAndExpected } from "./utils/ld-test-helpers"

describe("Typesystem validations", () => {
  const suite: TestSuite = {
    Addition: {
      input: `
      ensure ->Node2.N2S1 + 2 < 5 otherwise {}
      ensure 2 + true < 6 otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of an addition must be numbers",
    },
    Subtraction: {
      input: `
      ensure "2" - 2 < 5 otherwise {}
      ensure 2 - true < 6 otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of a subtraction must be numbers",
    },
    Multiplication: {
      input: `
      ensure "2" * 2 < 5 otherwise {}
      ensure 2 * true < 6 otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of a multiplication must be numbers",
    },
    Division: {
      input: `
      ensure "2" / 2 < 5 otherwise {}
      ensure 2 / true < 6 otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of a division must be numbers",
    },
    LessThan: {
      input: `
      ensure "2" < 2 otherwise {}
      ensure 2 < true otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of a less than must be numbers",
    },
    GreaterThan: {
      input: `
      ensure "2" > 2 otherwise {}
      ensure 2 > true otherwise {}
      `,
      validation: LdvValidator.checkArithmetic,
      description: "Left and right sides of a greater than must be numbers",
    },
    And: {
      input: `
      ensure "2" && true otherwise {}
      ensure false && 2 otherwise {}
      `,
      validation: LdvValidator.checkBoolean,
      description: "Left and right sides of an and must be booleans",
    },
    Or: {
      input: `
      ensure "2" || true otherwise {}
      ensure false || 2 otherwise {}
      `,
      validation: LdvValidator.checkBoolean,
      description: "Left and right sides of an or must be booleans",
    },
    Equals: {
      input: `
      ensure "2" == 2 otherwise {}
      ensure 2 == true otherwise {}
      `,
      validation: LdvValidator.checkEquality,
      description: "Left and right sides of an equals must be of the same type",
    },
    NotEquals: {
      input: `
      ensure "2" != 2 otherwise {}
      ensure 2 != true otherwise {}
      `,
      validation: LdvValidator.checkEquality,
      description: "Left and right sides of a not equals must be of the same type",
    },
    NotExpression: {
      input: `
      ensure not("2") otherwise {}
      ensure not(2) otherwise {}
      `,
      validation: LdvValidator.checkNotExpression,
      description: "Expression of a not must be a boolean",
    },
    Ensure: {
      input: `
      ensure "2" otherwise {}
      ensure 2 otherwise {}
      `,
      validation: LdvValidator.checkEnsureStatement,
      description: "Expression of an ensure must be a boolean",
    },
    When: {
      input: `
      when "2" ensure true otherwise {}
      when 2 ensure false otherwise {}
      `,
      validation: LdvValidator.checkEnsureStatement,
      description: "Expression of a when must be a boolean",
    },
  }

  for (const [type, testCases] of Object.entries(suite)) {
    const testCase = testCases as TestCase
    it(`${testCase.description}`, async () => {
      const { expected, actual } = await loadActualAndExpected(testCase, <keyof LdvAstType>type)
      expect(actual).matchesAtLeast(expected)
    })
  }
})
