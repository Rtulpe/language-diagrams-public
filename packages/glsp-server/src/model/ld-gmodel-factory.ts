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
import type { GModelFactory } from "@eclipse-glsp/server-node"
import { ArgsUtil, GEdge } from "@eclipse-glsp/server-node"
import { GGraph, GLabel, GNode } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import { LDTypes } from "language-diagrams-protocol"

import { type LDAssociation, LDField, type LDFieldType, type LDNode } from "./ld-model"
import { LDModelState } from "./ld-model-state"

/**
 * Creates the GModel from the LDModel.
 * The GModel is later used to render the SVG-based diagram.
 */
@injectable()
export class LDGModelFactory implements GModelFactory {
  @inject(LDModelState)
  protected modelState: LDModelState

  createModel(): void {
    const file = this.modelState.LDFile
    this.modelState.index.indexLDElements(file)
    const childNodes = file.nodes.map(node => this.createLDNode(node))
    const childAssociations = file.associations.map(assoc => this.createLDAssociation(assoc))

    const newRoot = GGraph.builder()
      .id(file.id)
      .addChildren(...childNodes, ...childAssociations)
      .build()

    this.modelState.updateRoot(newRoot)
  }

  protected createLDNode(node: LDNode): GNode {
    const fields = node.fields.map(field => this.createLDField(field))

    return GNode.builder() //
      .id(node.id)
      .add(GLabel.builder().text(node.name).id(`${node.id}_label`).build())
      .addChildren(fields)
      .layout("vbox")
      .addLayoutOptions({
        paddingTop: 10.0,
        paddingBottom: 10.0,
        paddingLeft: 10.0,
        paddingRight: 10.0,
        resizeContainer: true,
        hGrab: true,
        vGap: 1.0,
        hAlign: "left",
      })
      .addArgs(ArgsUtil.cornerRadius(5.0))
      .position(node.position)
      .build()
  }

  protected createLDAssociation(assoc: LDAssociation): GEdge {
    return GEdge.builder() //
      .id(assoc.id)
      .add(
        GLabel.builder()
          .type(LDTypes.LABEL_ASSOCIATION)
          .text(assoc.name)
          .id(`${assoc.id}_label`)
          .edgePlacement({
            rotate: false,
            side: "top",
            position: 0.5,
            offset: 0.0,
          })
          .build()
      )
      .sourceId(assoc.source_id)
      .targetId(assoc.target_id)
      .build()
  }

  protected createLDField(field: LDFieldType): GNode {
    return GNode.builder() //
      .type(LDField.getType(field))
      .id(field.id)
      .add(GLabel.builder().type(LDTypes.LABEL_FIELD).text(field.name).id(`${field.id}_label`).build())
      .add(GLabel.builder().type(LDTypes.LABEL_TYPE).text(field.type).id(`${field.id}_type`).build())
      .layout("hbox")
      .addLayoutOptions({
        paddingTop: 8.0,
        paddingBottom: 8.0,
        paddingLeft: 10.0,
        paddingRight: 10.0,
        resizeContainer: true,
        hGrab: true,
        hGap: 8.0,
      })
      .build()
  }
}
