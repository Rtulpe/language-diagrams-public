import "reflect-metadata"

import { LDGModelFactory } from "../../src/model/ld-gmodel-factory"
import { mainContainer } from "../inversify.config"
import { preloadState } from "../utils/model-utils"

describe("LDGModelFactory", () => {
  const state = preloadState()

  it("should create model without any issues", () => {
    const factory = mainContainer.resolve<LDGModelFactory>(LDGModelFactory)
    expect(state.root).toBeUndefined()
    factory.createModel()
    expect(state.root).toBeDefined()
  })
})
