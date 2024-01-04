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
import type { CreateNodeOperation } from "@eclipse-glsp/server-node"
import { CreateNodeOperationHandler, DefaultTypes, Point } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import * as uuid from "uuid"

import type { LDNode } from "../model/ld-model"
import { LDModelState } from "../model/ld-model-state"

/**
 * Handler for creating a node.
 */
@injectable()
export class CreateNodeHandler extends CreateNodeOperationHandler {
  readonly elementTypeIds = [DefaultTypes.NODE]

  @inject(LDModelState)
  protected override modelState: LDModelState

  execute(operation: CreateNodeOperation): void {
    const relativeLocation = this.getRelativeLocation(operation) ?? Point.ORIGIN
    const node = this.createNode(relativeLocation)
    const nodeList = this.modelState.LDFile
    nodeList.nodes.push(node)
  }

  protected createNode(position: Point): LDNode {
    const nodeCounter = this.modelState.index.typeCount(DefaultTypes.NODE)
    return {
      id: uuid.v4(),
      name: `NewNode${nodeCounter}`,
      fields: [],
      validations: [`//Enter validations here!`],
      position,
    }
  }

  get label(): string {
    return "Node"
  }
}
