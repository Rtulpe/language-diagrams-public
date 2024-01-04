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
import type {
  DiagramConfiguration,
  EdgeTypeHint,
  GModelElement,
  GModelElementConstructor,
  ShapeTypeHint,
} from "@eclipse-glsp/server-node"
import { DefaultTypes, getDefaultMapping, GLabel, GNode, ServerLayoutKind } from "@eclipse-glsp/server-node"
import { injectable } from "inversify"
import { LDTypes } from "language-diagrams-protocol"

/**
 * This class handles the type mapping and type hints for the diagram.
 */
@injectable()
export class LDDiagramConfiguration implements DiagramConfiguration {
  /**
   * Maps types to GShape (by extension SModel) elements.
   */
  get typeMapping(): Map<string, GModelElementConstructor<GModelElement>> {
    const mapping = getDefaultMapping()
    mapping.set(LDTypes.FIELD_BOOLEAN, GNode)
    mapping.set(LDTypes.FIELD_NUMBER, GNode)
    mapping.set(LDTypes.FIELD_STRING, GNode)
    mapping.set(LDTypes.LABEL_ASSOCIATION, GLabel)
    return mapping
  }

  /**
   * Type hints of the node-typed elements. Used while
   * interaction in the client
   */
  get shapeTypeHints(): ShapeTypeHint[] {
    return [
      this.getFieldTypeHinds(LDTypes.FIELD_BOOLEAN),
      this.getFieldTypeHinds(LDTypes.FIELD_NUMBER),
      this.getFieldTypeHinds(LDTypes.FIELD_STRING),
      {
        elementTypeId: DefaultTypes.NODE,
        deletable: true,
        reparentable: false,
        repositionable: true,
        resizable: false,
        containableElementTypeIds: [LDTypes.FIELD_BOOLEAN, LDTypes.FIELD_NUMBER, LDTypes.FIELD_STRING],
      },
    ]
  }

  get edgeTypeHints(): EdgeTypeHint[] {
    return [
      {
        elementTypeId: DefaultTypes.EDGE,
        deletable: true,
        repositionable: false,
        routable: false,
        sourceElementTypeIds: [DefaultTypes.NODE],
        targetElementTypeIds: [DefaultTypes.NODE],
      },
    ]
  }

  protected getFieldTypeHinds(elementId: string): ShapeTypeHint {
    return { elementTypeId: elementId, deletable: true, reparentable: true, repositionable: true, resizable: false }
  }

  // Auto-layouting is performed via button press,
  // rather than on every model change.
  layoutKind = ServerLayoutKind.MANUAL

  needsClientLayout = true

  animatedUpdate = true
}
