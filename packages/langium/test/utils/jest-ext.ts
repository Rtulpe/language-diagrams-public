import { expect } from "@jest/globals"

import type { ValidationResult } from "./ld-test-helpers"

type MatcherMode = "ByActual" | "ByExpected"

function matches(
  actual: ValidationResult[],
  expected: ValidationResult[],
  mode: MatcherMode
): jest.CustomMatcherResult {
  if (expected.length === 0) {
    return {
      pass: false,
      message: () => "At least one expected case must be present. Please add an expected case to the test input",
    }
  }

  if (actual.length === 1 && actual[0].severity === "fatal") {
    return {
      pass: false,
      message: () => actual[0].message,
    }
  }

  const messages: string[] = []

  const countOccurrences = (arr: ValidationResult[], message: string) => {
    return arr.filter(it => it.message === message).length
  }

  const visited = new Set<string>()
  ;(mode === "ByActual" ? actual : expected).forEach(result => {
    const { message, severity, type } = result

    if (!visited.has(message)) {
      const expectedCount = countOccurrences(expected, message)
      const outputCount = countOccurrences(actual, message)

      if (expectedCount !== outputCount) {
        const displayType = type === undefined ? "unknown" : type
        messages.push(
          `Expected ${expectedCount} ${severity} messages for type ${displayType} but ${outputCount} were found.
           Message: "${message}"
          `
        )
      }
      visited.add(message)
    }
  })

  return {
    pass: messages.length === 0,
    message: () => messages.join("\n"),
  }
}

/*
 * Custom Jest matchers
 */
expect.extend({
  /**
   *
   * Every actual result must match an expected result.
   *
   * @param actual
   * @param expected
   * @returns
   */
  matchesExactly(actual: ValidationResult[], expected: ValidationResult[]): jest.CustomMatcherResult {
    return matches(actual, expected, "ByActual")
  },

  /**
   *
   * Every expected result must match an actual result. If result has any
   * additional results these are ignored.
   *
   * @param actual
   * @param expected
   * @returns
   */
  matchesAtLeast(actual: ValidationResult[], expected: ValidationResult[]): jest.CustomMatcherResult {
    return matches(actual, expected, "ByExpected")
  },
})

declare global {
  namespace jest {
    interface Matchers<R> {
      matchesExactly(input: ValidationResult[]): R
      matchesAtLeast(input: ValidationResult[]): R
    }
  }
}
