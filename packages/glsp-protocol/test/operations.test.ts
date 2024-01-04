import "reflect-metadata"

import { ApplyNodeValidationsOperation } from "../src"

describe("ApplyNodeValidationsOperation", () => {
  it("should create a valid ApplyNodeValidationsOperation", () => {
    const validations = ["validation1", "validation2"]
    const elementId = "some-element-id"
    const operation = ApplyNodeValidationsOperation.create(validations, elementId)

    expect(operation.kind).toBe(ApplyNodeValidationsOperation.KIND)
    expect(operation.validations).toEqual(validations)
    expect(operation.elementId).toBe(elementId)
  })

  it("should correctly identify a valid ApplyNodeValidationsOperation", () => {
    const validOperation = {
      kind: ApplyNodeValidationsOperation.KIND,
      validations: ["validation1", "validation2"],
      elementId: "some-element-id",
      isOperation: true,
    }

    const invalidOperation = {
      kind: "other-operation",
      validations: ["validation1", "validation2"],
      elementId: "some-element-id",
    }

    expect(ApplyNodeValidationsOperation.is(validOperation)).toBe(true)
    expect(ApplyNodeValidationsOperation.is(invalidOperation)).toBe(false)
  })
})
