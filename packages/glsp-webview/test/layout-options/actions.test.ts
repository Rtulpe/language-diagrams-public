import "reflect-metadata"

import { EnableLayoutOptionsAction } from "../../src/layout-options/actions"

describe("EnableLayoutOptionsAction", () => {
  it("should create an EnableLayoutOptionsAction", () => {
    const action = EnableLayoutOptionsAction.create()

    expect(action.kind).toBe(EnableLayoutOptionsAction.KIND)
  })
  it("should correctly identify an EnableLayoutOptionsAction", () => {
    const validAction = {
      kind: EnableLayoutOptionsAction.KIND,
    }

    const invalidAction = {
      kind: "other-action",
    }

    expect(EnableLayoutOptionsAction.is(validAction)).toBe(true)
    expect(EnableLayoutOptionsAction.is(invalidAction)).toBe(false)
  })
})
