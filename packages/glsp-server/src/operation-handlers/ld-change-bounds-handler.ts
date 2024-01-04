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

import type { Dimension, MaybePromise, OperationHandler, Point } from "@eclipse-glsp/server-node"
import { ChangeBoundsOperation, GNode } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

import { LDModelState } from "../model/ld-model-state"

/**
 * Updates the element position in the model,
 * after it is moved in the viewer (client).
 */
@injectable()
export class LDChangeBoundsHandler implements OperationHandler {
  readonly operationType = ChangeBoundsOperation.KIND

  @inject(LDModelState)
  protected modelState: LDModelState

  execute(operation: ChangeBoundsOperation): MaybePromise<void> {
    for (const element of operation.newBounds) {
      this.changeElementBounds(element.elementId, element.newSize, element.newPosition)
    }
  }

  protected changeElementBounds(elementId: string, _newSize: Dimension, newPosition?: Point): void {
    const index = this.modelState.index
    const LDNode = index.findByClass(elementId, GNode)
    const node = LDNode !== undefined ? index.findNode(LDNode.id) : undefined
    if (node !== undefined) {
      if (newPosition !== undefined) {
        node.position = newPosition
      }
    }
  }
}
