import type { IActionHandler, ICommand } from "@eclipse-glsp/client"
import {
  AbstractUIExtension,
  changeCodiconClass,
  createIcon,
  EditorContextService,
  GLSPActionDispatcher,
  RequestContextActions,
  SetUIExtensionVisibilityAction,
  TYPES,
} from "@eclipse-glsp/client"
import type { Action } from "@eclipse-glsp/protocol"
import { SetContextActions } from "@eclipse-glsp/protocol"
import { inject, injectable } from "inversify"

import { logActionError } from "../utils"
import { EnableEditorContainerAction } from "./actions"

const EDITOR_ICON_ID = "edit"
const CHEVRON_DOWN_ICON_ID = "chevron-right"
const EDITOR_HEIGHT = "500px"

/**
 * Container for the editor application.
 */
@injectable()
export class EditorContainer extends AbstractUIExtension implements IActionHandler {
  static readonly ID = "langium-editor-container"

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher

  @inject(EditorContextService) protected readonly editorContext: EditorContextService

  override id(): string {
    return EditorContainer.ID
  }

  override containerClass(): string {
    return EditorContainer.ID
  }

  protected override initializeContents(_containerElement: HTMLElement): void {
    this.createHeader()
    this.createBody()
  }

  protected createHeader(): void {
    this.addMinimizeEditorButton()
    const headerCompartment = document.createElement("div")
    headerCompartment.classList.add("editor-header")
    headerCompartment.append(this.createHeaderTitle())
    this.containerElement.appendChild(headerCompartment)
  }

  protected createHeaderTitle(): HTMLElement {
    const header = document.createElement("div")
    header.classList.add("header-icon")
    header.appendChild(createIcon(EDITOR_ICON_ID))
    header.insertAdjacentText("beforeend", "Editor")
    return header
  }

  protected addMinimizeEditorButton(): void {
    const baseDiv = document.getElementById(this.options.baseDiv)
    const minEditorDiv = document.createElement("div")
    minEditorDiv.classList.add("minimize-editor-button")
    this.containerElement.classList.add("collapsible-editor")

    if (baseDiv !== null) {
      const insertedDiv = baseDiv.insertBefore(minEditorDiv, baseDiv.firstChild)
      const minizeIcon = createIcon(CHEVRON_DOWN_ICON_ID)
      this.updateMinimizeEditorButtonTooltip(minEditorDiv)
      minizeIcon.onclick = _event => {
        if (this.isEditorMaximized()) {
          this.containerElement.style.maxHeight = "0px"
        } else {
          this.containerElement.style.maxHeight = EDITOR_HEIGHT
        }
        this.updateMinimizeEditorButtonTooltip(minEditorDiv)
        changeCodiconClass(minizeIcon, EDITOR_ICON_ID)
        changeCodiconClass(minizeIcon, CHEVRON_DOWN_ICON_ID)
      }
      insertedDiv.appendChild(minizeIcon)
    }
  }

  protected updateMinimizeEditorButtonTooltip(button: HTMLDivElement): void {
    button.title = this.isEditorMaximized() ? "Minimize editor" : "Maximize Editor"
  }

  protected isEditorMaximized(): boolean {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
    return this.containerElement && this.containerElement.style.maxHeight !== "0px"
  }

  protected createBody(): void {
    const bodyDiv = document.createElement("div")
    bodyDiv.classList.add("editor-body")

    const editorRoot = document.createElement("div")
    editorRoot.id = "monaco-editor-root"
    editorRoot.style.flexGrow = "1"

    bodyDiv.appendChild(editorRoot)
    this.containerElement.appendChild(bodyDiv)
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  handle(action: Action): void | Action | ICommand {
    switch (action.kind) {
      case EnableEditorContainerAction.KIND:
        return this.handleEnableLangiumEditorAction(action as EnableEditorContainerAction)
    }
  }

  /**
   * Upon receiving the EnableEditorContainerAction, request the editor context and set the editor container visible.
   */
  protected handleEnableLangiumEditorAction(_action: EnableEditorContainerAction): void {
    const requestAction = RequestContextActions.create({
      contextId: EditorContainer.ID,
      editorContext: {
        selectedElementIds: [],
      },
    })
    this.actionDispatcher
      .requestUntil(requestAction)
      .then(response => {
        if (SetContextActions.is(response)) {
          this.actionDispatcher
            .dispatch(
              SetUIExtensionVisibilityAction.create({
                extensionId: EditorContainer.ID,
                visible: !this.editorContext.isReadonly,
              })
            )
            .catch(error => {
              logActionError(error, SetUIExtensionVisibilityAction.KIND)
            })
        }
      })
      .catch(error => {
        logActionError(error, RequestContextActions.KIND)
      })
  }
}
