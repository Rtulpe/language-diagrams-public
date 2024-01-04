import "reflect-metadata"

import { LDAssociation, LDFile, LDNode } from "../../src/model/ld-model"
import {
  returnCorrectLDAssociation,
  returnCorrectLDFile,
  returnCorrectLDNode,
  returnIncorrectObjects,
} from "../utils/model-utils"

describe("LDFile", () => {
  it("should identify valid and invalid LDFile", () => {
    const validLDFiles = Array.from({ length: 10 }, returnCorrectLDFile)
    for (const validLDFile of validLDFiles) {
      expect(LDFile.is(validLDFile)).toBe(true)
    }

    const invalidLDFiles = returnIncorrectObjects()
    for (const invalidLDFile of invalidLDFiles) {
      expect(LDFile.is(invalidLDFile)).toBe(false)
    }
  })

  it("should identify valid and invalid LDNodes", () => {
    const validLDNodes = Array.from({ length: 10 }, returnCorrectLDNode)
    for (const validNode of validLDNodes) {
      expect(LDNode.is(validNode)).toBe(true)
    }

    const invalidLDNodes = returnIncorrectObjects()
    for (const invalidNode of invalidLDNodes) {
      expect(LDNode.is(invalidNode)).toBe(false)
    }
  })

  it("should identify valid and invalid LDAssociations", () => {
    const validLDAssociations = Array.from({ length: 10 }, returnCorrectLDAssociation)
    for (const validAssociation of validLDAssociations) {
      expect(LDAssociation.is(validAssociation)).toBe(true)
    }

    const invalidLDAssociations = returnIncorrectObjects()
    for (const invalidAssociation of invalidLDAssociations) {
      expect(LDAssociation.is(invalidAssociation)).toBe(false)
    }
  })
})
