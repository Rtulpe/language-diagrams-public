import "reflect-metadata"

import { EnableEditorContainerAction } from "../../src/editor-container/actions"

describe("EnableEditorContainerAction", () => {
  it("should create an EnableEditorContainerAction", () => {
    const action = EnableEditorContainerAction.create()

    expect(action.kind).toBe(EnableEditorContainerAction.KIND)
  })
  it("should correctly identify an EnableEditorContainerAction", () => {
    const validAction = {
      kind: EnableEditorContainerAction.KIND,
    }

    const invalidAction = {
      kind: "other-action",
    }

    expect(EnableEditorContainerAction.is(validAction)).toBe(true)
    expect(EnableEditorContainerAction.is(invalidAction)).toBe(false)
  })
})
