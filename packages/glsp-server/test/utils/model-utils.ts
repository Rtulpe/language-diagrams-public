/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ActionHandler, OperationHandler } from "@eclipse-glsp/server-node"
import { ModelState } from "@eclipse-glsp/server-node"

import type { LDField, LDFile } from "../../src/model/ld-model"
import { LDModelState } from "../../src/model/ld-model-state"
import { mainContainer } from "../inversify.config"

export function returnCorrectLDFile(): object {
  const nodes = Array.from({ length: 10 }, returnCorrectLDNode)
  const associations = Array.from({ length: 10 }, returnCorrectLDAssociation)
  return {
    id: "id",
    nodes: [...nodes],
    associations: [...associations],
  }
}

export function returnCorrectLDNode(): object {
  const validations = Array.from({ length: 10 }, () => Math.random().toString(36).slice(2))
  const fields = Array.from({ length: 10 }, () => returnCorrectLDField())
  return {
    id: Math.random().toString(36).slice(2),
    name: Math.random().toString(36).slice(2),
    fields: fields,
    validations,
    position: { x: Math.random(), y: Math.random() },
  }
}

export function returnCorrectLDAssociation(): object {
  return {
    id: Math.random().toString(36).slice(2),
    name: Math.random().toString(36).slice(2),
    source_id: Math.random().toString(36).slice(2),
    target_id: Math.random().toString(36).slice(2),
  }
}

export function returnCorrectLDField(): object {
  const field: LDField<string> = {
    type: "string",
    id: Math.random().toString(36).slice(2),
    name: Math.random().toString(36).slice(2),
  }
  return field
}

export function returnIncorrectObjects(): object[] {
  return [
    {
      id: "id",
      source_id: "source-id",
      target_id: "target-id",
    },
    {
      id: "id",
    },
    {
      test: "failed",
    },
    {
      id: "id",
      name: "node",
      position: null,
    },
    Object.create(null),
    null as unknown as object,
  ]
}

export function preloadState(): LDModelState {
  const state = mainContainer.resolve<LDModelState>(LDModelState)
  state.LDFile = returnCorrectLDFile() as LDFile
  mainContainer.rebind(LDModelState).toConstantValue(state)
  mainContainer.rebind(ModelState).toConstantValue(state)

  return state
}

export function preloadStateWithHandler<T extends OperationHandler | ActionHandler>(
  operationType: new () => T
): stateHandlerPair {
  const state = preloadState()

  const handler = mainContainer.resolve<T>(operationType)

  return {
    state,
    handler,
  }
}

export interface stateHandlerPair {
  state: LDModelState
  handler: OperationHandler | ActionHandler
}
