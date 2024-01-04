/* eslint-disable jest/expect-expect */
import "reflect-metadata"

import { RequestModelAction, SaveModelAction } from "@eclipse-glsp/server-node"
import path from "path"

import { LDStorage } from "../../src/model/ld-storage"
import { mainContainer } from "../inversify.config"

describe("LDStorage and LDModelState", () => {
  const subdir = process.cwd()
  // Have to check, as npx gulp test and npm test have different working directories
  const directory = subdir.includes("packages")
    ? "file://" + path.join(subdir, "test", "source-files", "example.ld")
    : "file://" + path.join(subdir, "packages", "glsp-server", "test", "source-files", "example.ld")

  const storage = mainContainer.resolve<LDStorage>(LDStorage)

  it("should load a model without any issues", () => {
    const requestAction = RequestModelAction.create({
      requestId: "requestId",
      options: {
        needsClientLayout: false,
        needsServerLayout: false,
        sourceUri: directory,
        diagramType: "ld-diagram",
      },
    })

    void storage.loadSourceModel(requestAction)
  })

  it("should save a model without any issues", () => {
    const saveAction = SaveModelAction.create({
      fileUri: directory,
    })

    void storage.saveSourceModel(saveAction)
  })
})
