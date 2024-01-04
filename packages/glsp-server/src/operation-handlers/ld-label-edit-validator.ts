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
import type { GModelElement, LabelEditValidator } from "@eclipse-glsp/server-node"
import { DefaultTypes, ValidationStatus } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

import { LDModelState } from "../model/ld-model-state"

/**
 * A simple edit label validator that verifies that the given name label is not empty.
 */
@injectable()
export class LDLabelEditValidator implements LabelEditValidator {
  @inject(LDModelState)
  protected modelState: LDModelState

  validate(label: string, element: GModelElement | undefined): ValidationStatus {
    // Name should not be empty
    if (label.length < 1) {
      return { severity: ValidationStatus.Severity.ERROR, message: "Name must not be empty" }
    }

    // Name should be unique for nodes
    if (element?.parent.type === DefaultTypes.NODE) {
      const ldElement = this.modelState.index.findNodeByName(label)
      if (ldElement !== undefined) {
        return { severity: ValidationStatus.Severity.ERROR, message: "Name must be unique for nodes" }
      }
    }

    // Name should be unique for fields in the node
    if (element?.type.includes("field") ?? false) {
      const parent = element?.parent.parent

      if (parent !== undefined) {
        const ldElement = this.modelState.index.findFieldByName(label, parent.id)
        if (ldElement !== undefined) {
          return { severity: ValidationStatus.Severity.ERROR, message: "Name must be unique for fields" }
        }
      }
    }

    return { severity: ValidationStatus.Severity.OK }
  }
}
