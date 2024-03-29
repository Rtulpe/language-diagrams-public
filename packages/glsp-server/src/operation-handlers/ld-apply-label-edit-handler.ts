/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ApplyLabelEditOperation } from "@eclipse-glsp/protocol"
import type { OperationHandler } from "@eclipse-glsp/server-node"
import { GEdge, GLSPServerError, GNode, toTypeGuard } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

import { LDModelState } from "../model/ld-model-state"

/**
 * Simply handles the renaming of elements
 */
@injectable()
export class LDApplyLabelEditHandler implements OperationHandler {
  readonly operationType = ApplyLabelEditOperation.KIND

  @inject(LDModelState)
  protected readonly modelState: LDModelState

  execute(operation: ApplyLabelEditOperation): void {
    const index = this.modelState.index
    // Retrieve the parent node of the label that should be edited
    const element =
      index.findParentElement(operation.labelId, toTypeGuard(GNode)) ??
      index.findParentElement(operation.labelId, toTypeGuard(GEdge))
    if (element !== undefined) {
      const renamedElement = index.findElement(element.id)
      if (renamedElement === undefined) {
        throw new GLSPServerError(`Could not retrieve the parent node for the label with id ${operation.labelId}`)
      }
      renamedElement.name = operation.text
    }
  }
}
