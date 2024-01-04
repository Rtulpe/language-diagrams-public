import "reflect-metadata"

import { DeleteElementOperation } from "@eclipse-glsp/server-node"

import { DeleteElementHandler } from "../../src/operation-handlers/delete-element-handler"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("DeleteElementHandler", () => {
  const { state, handler } = preloadStateWithHandler(DeleteElementHandler)

  if (!(handler instanceof DeleteElementHandler)) {
    throw new Error("Handler is not of type DeleteElementHandler")
  }

  it("should delete elements without any issues", () => {
    const deletedNodeID = state.LDFile.nodes[0].id
    const initialNodeLength = state.LDFile.nodes.length

    const deletedAssocID = state.LDFile.associations[0].id
    const initialAssocLength = state.LDFile.associations.length

    const deletedFieldID = state.LDFile.nodes[1].fields[0].id
    const initialFieldLength = state.LDFile.nodes[1].fields.length

    const deleteNodeOperation = DeleteElementOperation.create([deletedNodeID])
    const deleteAssocOperation = DeleteElementOperation.create([deletedAssocID])
    const deleteFieldOperation = DeleteElementOperation.create([deletedFieldID])

    void handler.execute(deleteNodeOperation)
    void handler.execute(deleteAssocOperation)
    void handler.execute(deleteFieldOperation)

    expect(state.LDFile.nodes.length).toEqual(initialNodeLength - 1)
    expect(state.index.findNode(deletedNodeID)).toBeUndefined()

    expect(state.LDFile.associations.length).toEqual(initialAssocLength - 1)
    expect(state.index.findAssociation(deletedAssocID)).toBeUndefined()

    expect(state.LDFile.nodes[0].fields.length).toEqual(initialFieldLength - 1)
  })

  it("should not change the file structure if the element does not exist", () => {
    const invalidID = "invalidID"
    const initialNodeLength = state.LDFile.nodes.length
    const initialAssocLength = state.LDFile.associations.length

    const invalidDeleteOperation = DeleteElementOperation.create([invalidID])

    const invalidOperation = () => void handler.execute(invalidDeleteOperation)
    expect(invalidOperation).toThrow("Could not retrieve element with id: '" + invalidID + "'")

    expect(state.LDFile.nodes.length).toEqual(initialNodeLength)
    expect(state.LDFile.associations.length).toEqual(initialAssocLength)
  })
})
