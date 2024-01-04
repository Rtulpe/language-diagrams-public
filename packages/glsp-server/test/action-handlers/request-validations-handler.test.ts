import "reflect-metadata"

import {
  RejectNodeValidationsAction,
  RequestNodeValidationsAction,
  ReturnNodeValidationsAction,
} from "language-diagrams-protocol"

import { RequestNodeValidationsActionHandler } from "../../src/action-handlers/request-validations-handler"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("RequestNodeValidationsActionHandler", () => {
  const { state, handler } = preloadStateWithHandler(RequestNodeValidationsActionHandler)

  if (!(handler instanceof RequestNodeValidationsActionHandler)) {
    throw new Error("Handler is not of type RequestNodeValidationsActionHandler")
  }

  it("should return response with correct validations of correct node", () => {
    const correctID = state.LDFile.nodes[0].id
    const correctValidations = state.LDFile.nodes[0].validations

    const requestAction = {
      kind: RequestNodeValidationsAction.KIND,
      nodeID: correctID,
    }
    const response = handler.execute(requestAction as RequestNodeValidationsAction)
    expect(response).toBeDefined()
    const action = (response as ReturnNodeValidationsAction[])[0]
    expect(action.kind).toEqual(ReturnNodeValidationsAction.KIND)
    expect(action.validations).toEqual(correctValidations)
  })
  it("should return reject response if node is not found", () => {
    const incorrectID = state.LDFile.associations[0].id

    const requestAction = {
      kind: RequestNodeValidationsAction.KIND,
      nodeID: incorrectID,
    }

    const rejectAction = {
      kind: RejectNodeValidationsAction.KIND,
      responseId: "",
    }

    expect(handler.execute(requestAction as RequestNodeValidationsAction)).toEqual([rejectAction])
  })
})
