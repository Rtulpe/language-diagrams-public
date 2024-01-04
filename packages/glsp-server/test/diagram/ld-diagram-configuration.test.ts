import "reflect-metadata"

import type { SetTypeHintsAction } from "@eclipse-glsp/server-node"
import { RequestTypeHintsAction, RequestTypeHintsActionHandler } from "@eclipse-glsp/server-node"

import { LDDiagramConfiguration } from "../../src/diagram/ld-diagram-configuration"
import { mainContainer } from "../inversify.config"

describe("LDDiagramConfiguration", () => {
  const handler = mainContainer.resolve<RequestTypeHintsActionHandler>(RequestTypeHintsActionHandler)
  const config = mainContainer.resolve<LDDiagramConfiguration>(LDDiagramConfiguration)

  if (!(handler instanceof RequestTypeHintsActionHandler)) {
    throw new Error("Handler is not of type RequestTypeHintsActionHandler")
  }

  it("should return SetTypeHintsAction", () => {
    const request = RequestTypeHintsAction.create()

    const retAction = handler.execute(request)[0] as SetTypeHintsAction

    expect(retAction).toBeDefined()
    expect(retAction.shapeHints).toEqual(config.shapeTypeHints)
    expect(retAction.edgeHints).toEqual(config.edgeTypeHints)
  })
})
