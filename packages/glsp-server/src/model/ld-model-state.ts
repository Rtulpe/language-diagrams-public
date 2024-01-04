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
import { DefaultModelState } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"
import { type AllLayoutOptions, defaultLayoutOptions } from "language-diagrams-protocol"

import type { LDFile } from "./ld-model"
import { LDModelIndex } from "./ld-model-index"

/**
 * Model state stores the file, index and layout options.
 */
@injectable()
export class LDModelState extends DefaultModelState {
  @inject(LDModelIndex)
  override readonly index: LDModelIndex

  protected _LDFile: LDFile

  // This should be placed in ld-layout-configurator,
  // however, it is not properly injected into the container
  // and acts almost standalone

  layoutOptions: AllLayoutOptions = defaultLayoutOptions

  get LDFile(): LDFile {
    return this._LDFile
  }

  set LDFile(file: LDFile) {
    this._LDFile = file
    this.index.indexLDElements(file)
  }
}
