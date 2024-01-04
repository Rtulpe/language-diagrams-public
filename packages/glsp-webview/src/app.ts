/* eslint-disable simple-import-sort/imports */
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

// Import order matters here! Else CSS is not applied correctly.

import { GLSPStarter } from "@eclipse-glsp/vscode-integration-webview"
import "@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css"
import type { Container } from "inversify"
import type { SprottyDiagramIdentifier } from "sprotty-vscode-webview"
import createContainer from "./di.config"
import type { GLSPDiagramIdentifier } from "@eclipse-glsp/vscode-integration-webview/lib/diagram-identifer"
import { GLSPVscodeDiagramWidget } from "@eclipse-glsp/vscode-integration-webview/lib/glsp-vscode-diagram-widget"
import { LDDiagramWidget } from "./diagram-widget/ld-diagram-widget"

class LDStarter extends GLSPStarter {
  createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
    return createContainer(diagramIdentifier.clientId)
  }

  protected override addVscodeBindings(container: Container, diagramIdentifier: GLSPDiagramIdentifier): void {
    super.addVscodeBindings(container, diagramIdentifier)
    container.unbind(GLSPVscodeDiagramWidget)

    container.bind(LDDiagramWidget).toSelf().inSingletonScope()
    container.bind(GLSPVscodeDiagramWidget).toService(LDDiagramWidget)
  }
}

export function launch(): void {
  new LDStarter()
}
