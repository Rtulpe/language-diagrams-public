import { GLSPVscodeDiagramWidget } from "@eclipse-glsp/vscode-integration-webview/lib/glsp-vscode-diagram-widget"
import { injectable, postConstruct } from "inversify"

import { EnableEditorApplicationAction } from "../editor-application"
import { EnableEditorContainerAction } from "../editor-container"
import { EnableLayoutOptionsAction } from "../layout-options"

@injectable()
export class LDDiagramWidget extends GLSPVscodeDiagramWidget {
  @postConstruct()
  override initialize(): void {
    super.initialize()

    this.dispatchInitialActions()
  }

  /**
   * Dispatch initial actions.
   * This is done to ensure UI Extention modules
   * could access the DOM elements.
   */
  protected dispatchInitialActions(): void {
    void this.actionDispatcher.dispatchAll([
      EnableEditorContainerAction.create(),
      EnableEditorApplicationAction.create(this.diagramIdentifier.uri),
      EnableLayoutOptionsAction.create(),
    ])
  }
}
