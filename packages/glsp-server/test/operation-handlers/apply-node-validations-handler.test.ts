import "reflect-metadata"

import { ApplyNodeValidationsOperation } from "language-diagrams-protocol"

import { ApplyNodeValidationsHandler } from "../../src/operation-handlers/apply-node-validations-handler"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("ApplyNodeValidationsActionHandler", () => {
  const { state, handler } = preloadStateWithHandler(ApplyNodeValidationsHandler)

  if (!(handler instanceof ApplyNodeValidationsHandler)) {
    throw new Error("Handler is not of type ApplyNodeValidationsHandler")
  }

  it("should apply correct validations to correct node", () => {
    const nodeID = state.LDFile.nodes[0].id
    const newValidations = ["Hello", "World"]

    const applyAction = ApplyNodeValidationsOperation.create(newValidations, nodeID)
    void handler.execute(applyAction)

    expect(state.LDFile.nodes[0].validations).toEqual(newValidations)
  })
})
