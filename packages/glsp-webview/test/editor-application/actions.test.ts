import "reflect-metadata"

import { EnableEditorApplicationAction } from "../../src/editor-application/actions"

describe("Editor Application Actions", () => {
  it("should create an EnableEditorApplicationAction", () => {
    const path = "some-path"
    const action = EnableEditorApplicationAction.create(path)

    expect(action.kind).toBe(EnableEditorApplicationAction.KIND)
    expect(action.path).toBe(path)
  })
  it("should correctly identify an EnableEditorApplicationAction", () => {
    const validAction = {
      kind: EnableEditorApplicationAction.KIND,
      path: "some-path",
    }

    const invalidAction = {
      kind: "other-action",
    }

    expect(EnableEditorApplicationAction.is(validAction)).toBe(true)
    expect(EnableEditorApplicationAction.is(invalidAction)).toBe(false)
  })
})
