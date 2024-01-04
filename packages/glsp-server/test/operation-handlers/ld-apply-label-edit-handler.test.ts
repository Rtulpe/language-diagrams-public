/* eslint-disable jest/expect-expect */
import "reflect-metadata"

import { ApplyLabelEditOperation } from "@eclipse-glsp/protocol"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { LDApplyLabelEditHandler } from "../../src/operation-handlers/ld-apply-label-edit-handler"
import { mainContainer } from "../inversify.config"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("LDApplyLabelEditHandler", () => {
  // Could not make it testable
  // Could not access updated label, probably due inversify.js
  // yet in practice it works

  // Simple execution test, to see if it does not throw any errors

  const { state, handler } = preloadStateWithHandler(LDApplyLabelEditHandler)

  const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
  factory.createModel()

  if (!(handler instanceof LDApplyLabelEditHandler)) {
    throw new Error("Handler is not of type LDApplyLabelEditHandler")
  }

  it("should apply correct label to correct node", () => {
    // First child is always a node
    const nodeId = state.root.children[0].id
    const newLabel = "Hello World"

    const applyOperation = ApplyLabelEditOperation.create({ labelId: nodeId, text: newLabel })

    handler.execute(applyOperation)
  })

  it("should throw error if node does not exist", () => {
    const invalidId = "invalidId"

    const invalidOperation = ApplyLabelEditOperation.create({ labelId: invalidId, text: "Hello World" })

    const invalidOperationExecution = () => void handler.execute(invalidOperation)

    expect(invalidOperationExecution).toThrow("Could not retrieve element with id: '" + invalidId + "'")
  })
})
