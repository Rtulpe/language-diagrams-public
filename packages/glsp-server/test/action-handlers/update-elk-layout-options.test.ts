import "reflect-metadata"

import { type AllLayoutOptions, UpdateElkLayoutOptionsAction } from "language-diagrams-protocol"

import { UpdateElkLayoutOptionsActionHandler } from "../../src/action-handlers/update-elk-layout-options-handler"
import { preloadStateWithHandler } from "../utils/model-utils"

describe("UpdateElkLayoutOptionsActionHandler", () => {
  const { state, handler } = preloadStateWithHandler(UpdateElkLayoutOptionsActionHandler)

  if (!(handler instanceof UpdateElkLayoutOptionsActionHandler)) {
    throw new Error("Handler is not of type UpdateElkLayoutOptionsActionHandler")
  }

  it("should update the layout options", () => {
    const layoutOptions: AllLayoutOptions = {
      graph: [
        {
          name: "elk.test",
          type: "number",
          default: "1",
        },
      ],
    }

    const action = UpdateElkLayoutOptionsAction.create(layoutOptions)
    void handler.execute(action)

    expect(state.layoutOptions).toEqual(layoutOptions)
  })
})
