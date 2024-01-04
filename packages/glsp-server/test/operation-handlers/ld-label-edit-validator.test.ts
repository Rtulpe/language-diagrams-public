import "reflect-metadata"

import type { GLabel } from "@eclipse-glsp/server-node"
import { ModelState, ValidationStatus } from "@eclipse-glsp/server-node"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { LDLabelEditValidator } from "../../src/operation-handlers/ld-label-edit-validator"
import { mainContainer } from "../inversify.config"
import { preloadState } from "../utils/model-utils"

describe("LDApplyLabelEditValidator", () => {
  const state = preloadState()
  const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
  factory.createModel()
  mainContainer.rebind(ModelState).toConstantValue(state)

  const validator = mainContainer.resolve<LDLabelEditValidator>(LDLabelEditValidator)

  it("should validate labels without any issues", () => {
    const correctLabel = "correct label"
    const incorrectLabel = ""

    expect(validator.validate(correctLabel, undefined).severity).toBe(ValidationStatus.Severity.OK)
    expect(validator.validate(incorrectLabel, undefined).severity).toBe(ValidationStatus.Severity.ERROR)
  })

  it("should disallow duplicate labels", () => {
    const nodeId = state.LDFile.nodes[0].id
    const dupeNode = state.index.find(nodeId)?.children[0]
    const dupeNodeLabel = (dupeNode as GLabel).text

    const fieldId = state.LDFile.nodes[0].fields[0].id
    const dupeField = state.index.find(fieldId)?.children[0]
    const dupeFieldLabel = (dupeField as GLabel).text

    expect(validator.validate(dupeNodeLabel, dupeNode).severity).toBe(ValidationStatus.Severity.ERROR)
    expect(validator.validate(dupeFieldLabel, dupeField).severity).toBe(ValidationStatus.Severity.ERROR)
  })
})
