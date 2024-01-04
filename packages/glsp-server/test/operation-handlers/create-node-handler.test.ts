import "reflect-metadata"

import { CreateNodeOperation, ModelState } from "@eclipse-glsp/server-node"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { CreateNodeHandler } from "../../src/operation-handlers/create-node-handler"
import { mainContainer } from "../inversify.config"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("CreateNodeHandler", () => {
  const { state, handler } = preloadStateWithHandler(CreateNodeHandler)

  //This handler injects modelState, which is then overloaded by LDModelState
  //Thus, we need to generate root and rebind it to the correct value
  const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
  factory.createModel()
  mainContainer.rebind<ModelState>(ModelState).toConstantValue(state)

  if (!(handler instanceof CreateNodeHandler)) {
    throw new Error("Handler is not of type CreateNodeHandler")
  }

  it("should create node without any issues", () => {
    const correctPosition = {
      x: 0,
      y: 1,
    }
    const createOperation = CreateNodeOperation.create("node", {
      location: correctPosition,
    })

    handler.execute(createOperation)

    const testedNode = state.LDFile.nodes[state.LDFile.nodes.length - 1]
    //todo: As fields will get introduced, this test will need to be updated
    expect(testedNode.position).toEqual(correctPosition)
  })
})
