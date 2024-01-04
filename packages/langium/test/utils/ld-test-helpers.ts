import type { ValidationAcceptor } from "langium"
import { type AstNode, type AstTypeList, EmptyFileSystem, type LangiumDocument, streamAst } from "langium"
import type {
  FieldContext,
  GlspContextParams,
  NodeContext,
  NodeMap,
} from "language-diagrams-protocol/lib/client-langium"
import { LDTypes } from "language-diagrams-protocol/lib/client-server/ld-types"
import { DiagnosticSeverity } from "vscode-languageserver"
import { URI } from "vscode-uri"

import { type LdvAstType, reflection, type ValidationFile } from "../../src/language/generated/ast"
import { createLdvServices } from "../../src/language/ldv-module"
import type { TypeChecker } from "../../src/language/ldv-type-checker"

// The code below is borrowed from our in-house Lotse Script project

export type TestSuite<T extends AstTypeList<T> = LdvAstType> = {
  [K in keyof T]?: TestSuiteContent<T[K]>
}

export type TestSuiteContent<T extends AstNode = AstNode> = ReadonlyArray<TestCase<T>> | TestCase<T>

export type TestCase<T extends AstNode = AstNode> = ValidationTestCase<T>

export type LdvAstTypeKeys = keyof LdvAstType

type TCValidationCheck<T extends AstNode = AstNode> = (tc: TypeChecker, node: T, acceptor: ValidationAcceptor) => void

type Validation<T extends AstNode = AstNode> = TCValidationCheck<T>

type ValidationTestCase<T extends AstNode = AstNode> = {
  input: string
  validation: Validation<T>
  description: string
}

const services = createLdvServices(EmptyFileSystem).Ldv

/**
 * Generally the context should be retrieved from the GLSP client.
 * In test environment we mock the context.
 */

function getMockGlspContext(): GlspContextParams {
  const map: NodeMap = new Map<string, NodeContext>()

  const fields1: FieldContext = new Map()
  fields1.set(LDTypes.FIELD_STRING, ["N1S1", "N1S2"])
  fields1.set(LDTypes.FIELD_NUMBER, ["N1N1", "N1N2"])
  fields1.set(LDTypes.FIELD_BOOLEAN, ["N1B1", "N1B2"])

  const context1: NodeContext = {
    asSource: ["Node2"],
    asTarget: ["Node2"],
    fields: fields1,
  }

  const fields2: FieldContext = new Map()
  fields2.set(LDTypes.FIELD_STRING, ["N2S1", "N2S2"])
  fields2.set(LDTypes.FIELD_NUMBER, ["N2N1", "N2N2"])
  fields2.set(LDTypes.FIELD_BOOLEAN, ["N2B1", "N2B2"])

  const context2: NodeContext = {
    asSource: ["Node1"],
    asTarget: ["Node1"],
    fields: fields2,
  }

  map.set("Node1", context1)
  map.set("Node2", context2)

  return {
    currentNode: "Node1",
    nodes: map,
  }
}

export async function parse(input: string): Promise<LangiumDocument<ValidationFile>> {
  const documentBuilder = services.shared.workspace.DocumentBuilder

  const randomNumber = Math.floor(Math.random() * 10000000) + 1000000
  const uri = URI.parse(`file:///${randomNumber}.ls`)
  const document = services.shared.workspace.LangiumDocumentFactory.fromString<ValidationFile>(input, uri)

  services.shared.workspace.LangiumDocuments.addDocument(document)

  services.Fields.glspContext = getMockGlspContext()

  await documentBuilder.build([document])

  return document
}

export type Severity = "error" | "warning" | "info" | "hint" | "fatal"

function toLdvSeverity(severity: DiagnosticSeverity): Severity {
  switch (severity) {
    case DiagnosticSeverity.Error:
      return "error"
    case DiagnosticSeverity.Warning:
      return "warning"
    case DiagnosticSeverity.Information:
      return "info"
    case DiagnosticSeverity.Hint:
      return "hint"
    default:
      throw new Error("Invalid diagnostic severity: " + (severity as string))
  }
}

export interface ValidationResult {
  severity: Severity
  message: string
  type?: string
}

async function loadAndGetResults(
  test: TestCase,
  expect: (document: LangiumDocument) => Promise<ValidationResult[]>
): Promise<ValidationResult[]> {
  const { input } = test

  const results: ValidationResult[] = []

  const document = await parse(input)

  if (document.parseResult.lexerErrors.length > 0 || document.parseResult.parserErrors.length > 0) {
    results.push({
      severity: "fatal",
      message: "Failed to parse test input",
    })
  } else {
    results.push(...(await expect(document)))
  }

  return results
}

function validationAcceptor(results: ValidationResult[], type: keyof LdvAstType): ValidationAcceptor {
  return (severity, message, _) => {
    results.push({
      message: message,
      severity: severity,
      type: type,
    })
  }
}

function isTCValidationCheck(v: Validation): v is TCValidationCheck {
  return v.length === 3
}

function expectedChecks(test: ValidationTestCase & { type: keyof LdvAstType }): Promise<ValidationResult[]> {
  return loadAndGetResults(test, async document => {
    const { type, validation } = test
    const results: ValidationResult[] = []
    const tc = services.validation.TypeChecker

    const acceptor = validationAcceptor(results, type)

    streamAst(document.parseResult.value)
      .filter(node => reflection.isInstance(node, type))
      .forEach(node => {
        if (isTCValidationCheck(validation)) {
          validation(tc, node, acceptor)
        } else {
          throw new Error("Unexpected validation check type!")
        }
      })
    return results
  })
}

async function loadInputAndValidate(test: TestCase & { type: LdvAstTypeKeys }): Promise<ValidationResult[]> {
  return loadAndGetResults(test, async document => {
    const results: ValidationResult[] = []
    const validator = services.validation.DocumentValidator
    const diagnostics = await validator.validateDocument(document)

    const validationResults = diagnostics.map(
      diagnostic =>
        <ValidationResult>{
          severity: diagnostic.severity !== undefined ? toLdvSeverity(diagnostic.severity) : "error",
          message: diagnostic.message,
          type: test.type,
        }
    )

    results.push(...validationResults)

    return results
  })
}

export type ValidationResultsPair = { actual: ValidationResult[]; expected: ValidationResult[] }

export async function loadActualAndExpected(test: TestCase, type: LdvAstTypeKeys): Promise<ValidationResultsPair> {
  const actual = await loadInputAndValidate({
    type,
    ...test,
  })

  const expected = await expectedChecks({
    type,
    ...test,
  })

  return {
    actual,
    expected,
  }
}
