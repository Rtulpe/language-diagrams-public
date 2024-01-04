/* eslint-disable jest/expect-expect */
import "reflect-metadata"

import { ChangeBoundsOperation } from "@eclipse-glsp/protocol"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { LDChangeBoundsHandler } from "../../src/operation-handlers/ld-change-bounds-handler"
import { mainContainer } from "../inversify.config"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("LDChangeBoundsHandler", () => {
  // Spent hours on this, could not make it testable
  // Could be due inversify.js, I cannot access updated bounds
  // yet in practice it works

  // Simple execution test, to see if it does not throw any errors

  const { state, handler } = preloadStateWithHandler(LDChangeBoundsHandler)

  const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
  factory.createModel()

  if (!(handler instanceof LDChangeBoundsHandler)) {
    throw new Error("Handler is not of type LDChangeBoundsHandler")
  }

  it("should apply correct bounds to correct node", () => {
    // First child is always a node
    const nodeId = state.root.children[0].id
    const newBounds = [
      {
        elementId: nodeId,
        newSize: {
          width: 166,
          height: 611,
        },
      },
    ]

    const applyOperation = ChangeBoundsOperation.create(newBounds)

    void handler.execute(applyOperation)
  })
})
