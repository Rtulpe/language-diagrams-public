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
import { GModelIndex } from "@eclipse-glsp/server-node"
import { injectable } from "inversify"

import type { LDAssociation, LDFieldType, LDFile, LDNode } from "./ld-model"

/**
 * Index is used to quickly find elements by id.
 * This is useful for example when updating the model.
 */
@injectable()
export class LDModelIndex extends GModelIndex {
  protected nodeIndex = new Map<string, LDNode>()

  protected assocIndex = new Map<string, LDAssociation>()

  protected fieldIndex = new Map<string, LDFieldType>()

  indexLDElements(file: LDFile): void {
    file.nodes.forEach(node => {
      this.nodeIndex.set(node.id, node)
      node.fields.forEach(field => this.fieldIndex.set(field.id, field))
    })
    file.associations.forEach(assoc => this.assocIndex.set(assoc.id, assoc))
  }

  findNode(id: string): LDNode | undefined {
    return this.nodeIndex.get(id)
  }

  findAssociation(id: string): LDAssociation | undefined {
    return this.assocIndex.get(id)
  }

  findField(id: string): LDFieldType | undefined {
    return this.fieldIndex.get(id)
  }

  findElement(id: string): LDNode | LDAssociation | LDFieldType | undefined {
    return this.findNode(id) ?? this.findAssociation(id) ?? this.findField(id)
  }

  removeElementFromIndex(id: string): void {
    this.nodeIndex.delete(id)
    this.assocIndex.delete(id)
    this.fieldIndex.delete(id)
  }

  findNodeByName(name: string): LDNode | undefined {
    return [...this.nodeIndex.values()].find(node => node.name === name)
  }

  findFieldByName(name: string, parentId: string): LDFieldType | undefined {
    return this.findNode(parentId)?.fields.find(field => field.name === name)
  }
}
