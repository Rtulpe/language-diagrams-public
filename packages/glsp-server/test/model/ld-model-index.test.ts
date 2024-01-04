import "reflect-metadata"

import type { LDFile } from "../../src/model/ld-model"
import { LDModelIndex } from "../../src/model/ld-model-index"
import { returnCorrectLDFile } from "../utils/model-utils"

describe("LDModelIndex", () => {
  const index = new LDModelIndex()
  const files = Array.from({ length: 2 }, returnCorrectLDFile) as LDFile[]

  it("should find and return indexed nodes and associations", () => {
    for (const file of files) {
      index.indexLDElements(file)
      for (const node of file.nodes) {
        expect(index.findNode(node.id)).toEqual(node)
      }
      for (const association of file.associations) {
        expect(index.findAssociation(association.id)).toEqual(association)
      }
    }
  })

  it("should return undefined if no node or association is found", () => {
    expect(index.findNode("not-found")).toBeUndefined()
    expect(index.findAssociation("not-found")).toBeUndefined()
  })

  it("should return either element based on ID", () => {
    const node = files[0].nodes[0]
    const association = files[0].associations[0]
    expect(index.findElement(node.id)).toEqual(node)
    expect(index.findElement(association.id)).toEqual(association)
  })
})
