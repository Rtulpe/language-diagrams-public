/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Action, IActionHandler } from "@eclipse-glsp/client"
import { DeleteElementOperation, SelectAction } from "@eclipse-glsp/client"
import {
  EditorContextService,
  GLSPActionDispatcher,
  SetContextActions,
  SetUIExtensionVisibilityAction,
} from "@eclipse-glsp/client"
import { AbstractUIExtension, RequestContextActions, TYPES } from "@eclipse-glsp/client"
import { inject, injectable } from "inversify"
import {
  ApplyNodeValidationsOperation,
  GLSP_CONTEXT_NOTIFICATION,
  RequestNodeValidationsAction,
  ReturnNodeValidationsAction,
} from "language-diagrams-protocol"
import { KeyCode } from "monaco-editor"
import type { CodeEditorConfig, monaco } from "monaco-editor-wrapper/bundle"
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper/bundle"

import { LDIndexer } from "../editor-indexer"
import { buildWorkerDefinition, copyTextToClipboard, loadWorker, logActionError, monarchSyntax } from "../utils"
import { EnableEditorApplicationAction } from "./actions"

//Sets worker path to /packages/glsp-vscode/workers
const MONACO_WORKER_NAME = "monaco-worker.js"
const LANGIUM_WORKER_NAME = "langium-worker.js"

/**
 * This class is responsible for the Monaco editor Functionality
 */
@injectable()
export class EditorApplication extends AbstractUIExtension implements IActionHandler {
  static readonly ID = "langium-editor-application"

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher

  @inject(EditorContextService) protected readonly editorContext: EditorContextService

  @inject(LDIndexer) protected readonly editorIndex: LDIndexer

  protected monacoEditor: MonacoEditorLanguageClientWrapper

  protected codeEditor: monaco.editor.IStandaloneCodeEditor

  protected editorConfig: CodeEditorConfig

  protected currentNodeId: string | undefined

  /**
   * Selection state is used to avoid sending update model requests:
   *
   * - SELECTED: When the node is selected, the editor content changes
   * this triggers an update model request, which is not wanted
   *
   * - EDITED: Switches from SELECTED, eliminates the update model request
   *
   * - UNSELECTED: When the node is unselected or deleted, the editor is
   * cleared and locked.
   */
  protected selectionState: "SELECTED" | "EDITED" | "UNSELECTED" = "UNSELECTED"

  // Waits for the editor root to be created
  // Mutation observer does not work here
  rootPromise = new Promise<HTMLElement>(resolve => {
    const checkVariable = () => {
      const editorRoot = document.getElementById("monaco-editor-root")
      if (editorRoot !== null) {
        resolve(editorRoot)
      } else {
        setTimeout(checkVariable, 100)
      }
    }
    checkVariable()
  })

  constructor() {
    super()
    this.monacoEditor = new MonacoEditorLanguageClientWrapper()
    this.editorConfig = this.monacoEditor.getEditorConfig()

    this.editorConfig.setMainLanguageId("ldv")
    this.editorConfig.setMonarchTokensProvider(monarchSyntax)
    this.editorConfig.setUseLanguageClient(true)
    this.editorConfig.setUseWebSocket(false)
    this.editorConfig.setTheme("vs-dark")
  }

  override id(): string {
    return EditorApplication.ID
  }

  override containerClass(): string {
    return EditorApplication.ID
  }

  protected override initializeContents(_containerElement: HTMLElement): void {
    // Loads CSS styles
    MonacoEditorLanguageClientWrapper.addMonacoStyles("monaco-editor-styles")
  }

  /**
   * Let's the editor access Sprotty DOM
   * else, nothing would render
   */
  protected makeEditorVisible(): void {
    const requestAction = RequestContextActions.create({
      contextId: EditorApplication.ID,
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
                extensionId: EditorApplication.ID,
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

  /**
   * Attaches notification handler,
   * which upon editing the monaco code content,
   * sends an operation to the server to update the model
   */
  protected attachNotificationHandlers(): void {
    this.codeEditor.onDidChangeModelContent(() => {
      if (this.selectionState === "SELECTED") {
        this.selectionState = "EDITED"
        return
      }

      if (this.currentNodeId !== undefined) {
        const validations: string[] = this.codeEditor.getValue().split("\n")
        this.actionDispatcher
          .dispatch(ApplyNodeValidationsOperation.create(validations, this.currentNodeId))
          .catch(error => {
            logActionError(error, ApplyNodeValidationsOperation.KIND)
          })
      }
    })
  }

  /**
   * Loads workers for monaco editor and langium
   * starts the editor and attaches notification handlers
   *
   * @param workerPath String path to the worker
   */
  async connectToLSP(workerPath: string): Promise<void> {
    const root = await this.rootPromise
    // Launches web worker for monaco editor
    buildWorkerDefinition(workerPath, MONACO_WORKER_NAME)

    // Loads web worker for langium
    const worker = await loadWorker(`${workerPath}${LANGIUM_WORKER_NAME}`)
    this.monacoEditor.setWorker(worker)

    await this.monacoEditor.startEditor(root)

    // Gets the code editor, disables editing initially
    const codeEditor = this.monacoEditor.getEditor()
    if (codeEditor !== undefined) {
      this.codeEditor = codeEditor
      this.codeEditor.updateOptions({ readOnly: true, fixedOverflowWidgets: true })

      // Bugfix: Monaco editor cannot copy text to clipboard
      this.codeEditor.onKeyDown(e => {
        if (e.ctrlKey && e.keyCode === KeyCode.KeyC) {
          e.preventDefault()
          this.performCopy()
        }
      })
    } else {
      throw new Error("Code editor is undefined")
    }

    this.attachNotificationHandlers()
  }

  /**
   * Receives the general path of the extension,
   * which is used as a base for the worker path
   * @param action
   */
  protected handleEnableMonacoAction(action: EnableEditorApplicationAction): void {
    //Enable DOM generation for the module
    this.makeEditorVisible()

    const { path } = action
    //Sets worker path to /packages/glsp-vscode/workers
    const workerPath = path
      .replace(/^file:\/\/\//, "https://file%2B.vscode-resource.vscode-cdn.net/")
      .replace(/workspace[\s\S]*$/, "packages/glsp-vscode/workers/")

    console.log("Worker path received: " + workerPath)
    this.connectToLSP(workerPath).catch(error => {
      console.error("Error starting Langium editor: ", error)
    })
  }

  /**
   * Receives the selected node IDs from the Sprotty viewer
   */
  protected async handleSelectAction(action: SelectAction): Promise<void> {
    // If length is 0, nothing is selected
    // If it's above 1, marquee selection is used
    // In both cases, the editor is locked
    if (action.selectedElementsIDs.length === 1) {
      this.selectionState = "SELECTED"
      this.currentNodeId = action.selectedElementsIDs[0]
      const response = await this.actionDispatcher.request(
        RequestNodeValidationsAction.create(action.selectedElementsIDs[0])
      )
      if (ReturnNodeValidationsAction.is(response)) {
        // Get field validations from the server and display them in the editor
        // Sends the GLSP context to Langium
        // Also unlocks the editor

        const glspContext = this.editorIndex.getGLSPContext(action.selectedElementsIDs[0])

        if (glspContext !== undefined) {
          void this.monacoEditor.getLanguageClient()?.sendNotification(GLSP_CONTEXT_NOTIFICATION, {
            context: glspContext,
          })
        }

        this.codeEditor.setValue(response.validations.join("\n"))
        this.codeEditor.updateOptions({ readOnly: false })
        return
      }
    }
    // If nothing is selected or non-node is selected, the editor is cleared and locked
    this.currentNodeId = undefined
    this.selectionState = "UNSELECTED"
    this.codeEditor.setValue("")
    this.codeEditor.updateOptions({ readOnly: true })
  }

  /**
   * If the deleted elements contains the current node, the editor is cleared and locked
   *
   * @param action Delete operation containing the deleted element IDs
   */
  protected handleDeleteElementOperation(action: DeleteElementOperation): void {
    // Not concerned if nothing was selected
    if (this.currentNodeId === undefined) return
    const codeEditor = this.monacoEditor.getEditor()

    // If editor is not initialized, nothing to do
    if (codeEditor === undefined) return

    // If the deleted element contains the current node, clear the editor and lock it
    if (action.elementIds.includes(this.currentNodeId)) {
      this.currentNodeId = undefined
      this.selectionState = "UNSELECTED"
      codeEditor.setValue("")
      codeEditor.updateOptions({ readOnly: true })
    }
  }

  /**
   * Handles actions received from the GLSP Client or the Sprotty Viewer
   *
   * @param action Received action
   *
   */
  handle(action: Action): void {
    switch (action.kind) {
      case EnableEditorApplicationAction.KIND:
        return this.handleEnableMonacoAction(action as EnableEditorApplicationAction)

      case SelectAction.KIND:
        return void this.handleSelectAction(action as SelectAction)

      case DeleteElementOperation.KIND:
        return this.handleDeleteElementOperation(action as DeleteElementOperation)
    }
  }

  /**
   * Serves as a bugfix, as the editor can perform cut and paste operations,
   * yet not copy
   */
  private performCopy() {
    const selection = this.codeEditor.getSelection()
    if (selection === null) return
    const selectedText = this.codeEditor.getModel()?.getValueInRange(selection)

    // Copy to clipboard
    copyTextToClipboard(selectedText ?? "")
  }
}
