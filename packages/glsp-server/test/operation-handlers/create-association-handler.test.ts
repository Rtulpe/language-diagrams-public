import "reflect-metadata"

import { CreateEdgeOperation } from "@eclipse-glsp/server-node"

import { CreateAssociationHandler } from "../../src/operation-handlers/create-association-handler"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("CreateAssociationActionHandler", () => {
  const { state, handler } = preloadStateWithHandler(CreateAssociationHandler)

  if (!(handler instanceof CreateAssociationHandler)) {
    throw new Error("Handler is not of type CreateAssociationHandler")
  }

  it("should create association without any issues", () => {
    const correctSourceID = state.LDFile.nodes[0].id
    const correctTargetID = state.LDFile.nodes[1].id

    const createOperation = CreateEdgeOperation.create({
      elementTypeId: "edge",
      sourceElementId: correctSourceID,
      targetElementId: correctTargetID,
    })

    handler.execute(createOperation)

    const testedAssociation = state.LDFile.associations[state.LDFile.associations.length - 1]
    expect(testedAssociation.source_id).toEqual(correctSourceID)
    expect(testedAssociation.target_id).toEqual(correctTargetID)
  })
})
