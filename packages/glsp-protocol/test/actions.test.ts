import "reflect-metadata"

import {
  defaultLayoutOptions,
  LayoutOptionUtils,
  RejectNodeValidationsAction,
  RequestNodeValidationsAction,
  ReturnNodeValidationsAction,
  UpdateElkLayoutOptionsAction,
} from "../src"

describe("RequestNodeValidationsAction", () => {
  it("should create a valid RequestNodeValidationsAction", () => {
    const nodeID = "some-node-id"
    const action = RequestNodeValidationsAction.create(nodeID)

    expect(action.kind).toBe(RequestNodeValidationsAction.KIND)
    expect(action.nodeID).toBe(nodeID)
    expect(action.requestId).toBe("")
  })

  it("should correctly identify a valid RequestNodeValidationsAction", () => {
    const validAction = {
      kind: RequestNodeValidationsAction.KIND,
      nodeID: "some-node-id",
      requestId: "",
    }

    const invalidAction = {
      kind: "other-action",
      nodeID: "some-node-id",
      requestId: "",
    }

    expect(RequestNodeValidationsAction.is(validAction)).toBe(true)
    expect(RequestNodeValidationsAction.is(invalidAction)).toBe(false)
  })
})

describe("ReturnNodeValidationsAction", () => {
  it("should create a valid ReturnNodeValidationsAction", () => {
    const validations = ["validation1", "validation2"]
    const action = ReturnNodeValidationsAction.create(validations)

    expect(action.kind).toBe(ReturnNodeValidationsAction.KIND)
    expect(action.validations).toEqual(validations)
    expect(action.responseId).toBe("")
  })

  it("should correctly identify a valid ReturnNodeValidationsAction", () => {
    const validAction = {
      kind: ReturnNodeValidationsAction.KIND,
      validations: ["validation1", "validation2"],
      responseId: "",
    }

    const invalidAction = {
      kind: "other-action",
      validations: ["validation1", "validation2"],
      responseId: "",
    }

    expect(ReturnNodeValidationsAction.is(validAction)).toBe(true)
    expect(ReturnNodeValidationsAction.is(invalidAction)).toBe(false)
  })
})

describe("RejectNodeValidationsAction", () => {
  it("should create and identify valid RejectNodeValidationsAction", () => {
    const action = RejectNodeValidationsAction.create()

    expect(action.kind).toBe(RejectNodeValidationsAction.KIND)
  })

  it("should correctly identify a valid RejectNodeValidationsAction", () => {
    const validAction = {
      kind: RejectNodeValidationsAction.KIND,
      responseId: "",
    }

    const invalidAction = {
      kind: "other-action",
      responseId: "",
    }

    expect(RejectNodeValidationsAction.is(validAction)).toBe(true)
    expect(RejectNodeValidationsAction.is(invalidAction)).toBe(false)
  })
})

describe("UpdateElkLayoutOptionsAction", () => {
  it("should create a valid UpdateElkLayoutOptionsAction and not change their structure", () => {
    const options = defaultLayoutOptions
    const action = UpdateElkLayoutOptionsAction.create(options)

    const correctLayout = LayoutOptionUtils.asLayoutOptions(options.graph)
    const testedLayout = LayoutOptionUtils.asLayoutOptions(action.options.graph)

    expect(action.kind).toBe(UpdateElkLayoutOptionsAction.KIND)
    expect(action.options).toEqual(options)
    expect(correctLayout).toEqual(testedLayout)
  })

  it("should correctly identify a valid UpdateElkLayoutOptionsAction", () => {
    const validAction = {
      kind: UpdateElkLayoutOptionsAction.KIND,
      options: defaultLayoutOptions,
    }

    const invalidAction = {
      kind: "other-action",
      args: "some-args",
    }

    expect(UpdateElkLayoutOptionsAction.is(validAction)).toBe(true)
    expect(UpdateElkLayoutOptionsAction.is(invalidAction)).toBe(false)
  })
})
