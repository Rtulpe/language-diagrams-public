import "reflect-metadata"

import type { CreateNodeOperation } from "@eclipse-glsp/server-node"
import { ModelState } from "@eclipse-glsp/server-node"
import { LDTypes } from "language-diagrams-protocol"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { CreateFieldBooleanHandler } from "../../src/operation-handlers/create-field-boolean-handler"
import { CreateFieldNumberHandler } from "../../src/operation-handlers/create-field-number-handler"
import { CreateFieldStringHandler } from "../../src/operation-handlers/create-field-string-handler"
import { mainContainer } from "../inversify.config"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("CreateFieldHandler", () => {
  const { state, handler: handler1 } = preloadStateWithHandler(CreateFieldBooleanHandler)
  const { handler: handler2 } = preloadStateWithHandler(CreateFieldNumberHandler)
  const { handler: handler3 } = preloadStateWithHandler(CreateFieldStringHandler)

  if (!(handler1 instanceof CreateFieldBooleanHandler)) {
    throw new Error("Handler1 is not of type CreateFieldBooleanHandler")
  }
  if (!(handler2 instanceof CreateFieldNumberHandler)) {
    throw new Error("Handler2 is not of type CreateFieldNumberHandler")
  }
  if (!(handler3 instanceof CreateFieldStringHandler)) {
    throw new Error("Handler3 is not of type CreateFieldStringHandler")
  }

  const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
  factory.createModel()
  mainContainer.rebind<ModelState>(ModelState).toConstantValue(state)

  it("should create any field without any issues", () => {
    const containerID = state.LDFile.nodes[0].id
    const initialLength = state.LDFile.nodes[0].fields.length

    const boolOp: CreateNodeOperation = {
      elementTypeId: LDTypes.FIELD_BOOLEAN,
      containerId: containerID,
      isOperation: true,
      kind: "createNode",
    }

    const numOp: CreateNodeOperation = {
      elementTypeId: LDTypes.FIELD_NUMBER,
      containerId: containerID,
      isOperation: true,
      kind: "createNode",
    }

    const strOp: CreateNodeOperation = {
      elementTypeId: LDTypes.FIELD_STRING,
      containerId: containerID,
      isOperation: true,
      kind: "createNode",
    }

    handler1.execute(boolOp)

    expect(state.LDFile.nodes[0].fields.length).toEqual(initialLength + 1)

    handler2.execute(numOp)

    expect(state.LDFile.nodes[0].fields.length).toEqual(initialLength + 2)

    handler3.execute(strOp)

    expect(state.LDFile.nodes[0].fields.length).toEqual(initialLength + 3)
  })
})
