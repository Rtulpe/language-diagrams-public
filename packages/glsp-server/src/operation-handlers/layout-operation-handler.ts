/********************************************************************************
 * Copyright (c) 2022 STMicroelectronics and others.
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
import type { Operation } from "@eclipse-glsp/protocol"
import { DefaultTypes, LayoutOperation } from "@eclipse-glsp/protocol"
import type { GModelRoot, GNode, OperationHandler } from "@eclipse-glsp/server-node"
import { DiagramConfiguration, LayoutEngine, Logger, ServerLayoutKind } from "@eclipse-glsp/server-node"
import { inject, injectable, optional } from "inversify"

import { LDModelIndex } from "../model/ld-model-index"

/**
 * Called by UpdateElkLayoutOptionsHandler,
 * which is called by the GLSP client.
 */
@injectable()
export class LayoutOperationHandler implements OperationHandler {
  @inject(Logger)
  protected logger: Logger

  @inject(LayoutEngine)
  @optional()
  protected layoutEngine?: LayoutEngine

  @inject(DiagramConfiguration)
  protected diagramConfiguration: DiagramConfiguration

  @inject(LDModelIndex)
  protected index: LDModelIndex

  readonly operationType = LayoutOperation.KIND

  async execute(operation: Operation): Promise<void> {
    if (operation.kind === LayoutOperation.KIND) {
      if (this.diagramConfiguration.layoutKind === ServerLayoutKind.MANUAL) {
        if (this.layoutEngine !== undefined) {
          // Received GModel, which has to be transformed into LDModel
          return this.applyLayout(await this.layoutEngine.layout()).catch(error => {
            this.logger.error("Could not execute layout operation.", error)
          })
        }
        this.logger.warn("Could not execute layout operation. No `LayoutEngine` is bound!")
      }
    }
  }

  async applyLayout(root: GModelRoot): Promise<void> {
    root.children
      .filter(child => child.type === DefaultTypes.NODE)
      .forEach(node => {
        const ldNode = this.index.findNode(node.id)
        if (ldNode === undefined) return
        ldNode.position = (node as GNode).position
      })
  }
}
