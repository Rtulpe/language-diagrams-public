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
import type { MaybePromise, OperationHandler } from "@eclipse-glsp/server-node"
import { DeleteElementOperation, GEdge, GNode, toTypeGuard } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

import { LDFile } from "../model/ld-model"
import { LDModelState } from "../model/ld-model-state"

/**
 * Common handler for deleting Nodes, Associations and Fields.
 * @throws {Error} if the element cannot be found
 */
@injectable()
export class DeleteElementHandler implements OperationHandler {
  readonly operationType = DeleteElementOperation.KIND

  @inject(LDModelState)
  protected modelState: LDModelState

  execute(operation: DeleteElementOperation): MaybePromise<void> {
    operation.elementIds.forEach(elementId => this.deleteElement(elementId))
  }

  protected deleteElement(elementId: string): void {
    const index = this.modelState.index
    let element = index.findElement(elementId)
    if (element === undefined) {
      const parentElement =
        index.findParentElement(elementId, toTypeGuard(GNode)) ?? index.findParentElement(elementId, toTypeGuard(GEdge))
      if (parentElement !== undefined) {
        element = index.findElement(parentElement.id)
      }
    }
    if (element !== undefined) {
      LDFile.deleteElement(this.modelState.LDFile, element)
      this.modelState.index.removeElementFromIndex(element.id)
    }
  }
}
