/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Action, IActionHandler, ICommand } from "@eclipse-glsp/client"
import { EditorContextService } from "@eclipse-glsp/client"
import {
  AbstractUIExtension,
  changeCodiconClass,
  createIcon,
  GLSPActionDispatcher,
  RequestContextActions,
  SetContextActions,
  SetUIExtensionVisibilityAction,
  TYPES,
} from "@eclipse-glsp/client"
import { inject, injectable } from "inversify"
import type { AllLayoutOptions, LDLayoutOptions } from "language-diagrams-protocol"
import { defaultLayoutOptions, UpdateElkLayoutOptionsAction } from "language-diagrams-protocol"

import { logActionError } from "../utils/helpers"
import { EnableLayoutOptionsAction } from "./actions"

const LAYOUT_ICON_ID = "layout"
const CHEVRON_DOWN_ICON_ID = "chevron-left"
const OPTIONS_HEIGHT = "600px"

/**
 * Layout GUI, which used to set up the layout options,
 * and to call the layout algorithm.
 */
@injectable()
export class LayoutOptionsUI extends AbstractUIExtension implements IActionHandler {
  static readonly ID = "elk-layout-options"

  layoutOptions: AllLayoutOptions = defaultLayoutOptions

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher

  @inject(EditorContextService) protected readonly editorContext: EditorContextService

  protected optionToInputMap: Map<LDLayoutOptions, HTMLElement> = new Map()

  override id(): string {
    return LayoutOptionsUI.ID
  }

  override containerClass(): string {
    return LayoutOptionsUI.ID
  }

  protected override initializeContents(_containerElement: HTMLElement): void {
    this.containerElement.style.maxHeight = "0px"

    this.createHeader()
    this.createBody()
  }

  protected createHeader(): void {
    this.addMinimizeEditorButton()
    const headerCompartment = document.createElement("div")
    headerCompartment.classList.add("layout-options-header")
    headerCompartment.append(this.createHeaderTitle())
    headerCompartment.append(this.createHeaderTools())
    this.containerElement.appendChild(headerCompartment)
  }

  protected createHeaderTitle(): HTMLElement {
    const header = document.createElement("div")
    header.classList.add("header-icon")
    header.appendChild(createIcon(LAYOUT_ICON_ID))
    header.insertAdjacentText("beforeend", "Elk Layout Options")
    return header
  }

  protected createHeaderTools(): HTMLElement {
    const headerTools = document.createElement("div")
    headerTools.classList.add("layout-options-header-tools")

    const resetButton = this.createResetDefaultLayoutButton()
    headerTools.appendChild(resetButton)

    const setLayoutButton = this.createSetLayoutButton()
    headerTools.appendChild(setLayoutButton)

    return headerTools
  }

  protected createSetLayoutButton(): HTMLElement {
    const button = createIcon("check-all")
    button.id = "btn_default_tools"
    button.title = "Set layout"
    button.onclick = _event => {
      void this.actionDispatcher.dispatch(UpdateElkLayoutOptionsAction.create(this.layoutOptions))
    }
    return button
  }

  protected createResetDefaultLayoutButton(): HTMLElement {
    const button = createIcon("discard")
    button.id = "btn_default_tools"
    button.title = "Reset default layout"
    button.onclick = _event => {
      this.resetDefaultLayoutOptions()
    }
    return button
  }

  protected addMinimizeEditorButton(): void {
    const baseDiv = document.getElementById(this.options.baseDiv)
    const minEditorDiv = document.createElement("div")
    minEditorDiv.classList.add("minimize-layout-options-button")
    this.containerElement.classList.add("collapsible-layout-options")

    if (baseDiv !== null) {
      const insertedDiv = baseDiv.insertBefore(minEditorDiv, baseDiv.firstChild)
      const minizeIcon = createIcon(LAYOUT_ICON_ID)
      this.updateMinimizeEditorButtonTooltip(minEditorDiv)
      minizeIcon.onclick = _event => {
        if (this.isEditorMaximized()) {
          this.containerElement.style.maxHeight = "0px"
        } else {
          this.containerElement.style.maxHeight = OPTIONS_HEIGHT
        }
        this.updateMinimizeEditorButtonTooltip(minEditorDiv)
        changeCodiconClass(minizeIcon, LAYOUT_ICON_ID)
        changeCodiconClass(minizeIcon, CHEVRON_DOWN_ICON_ID)
      }
      insertedDiv.appendChild(minizeIcon)
    }
  }

  protected updateMinimizeEditorButtonTooltip(button: HTMLDivElement): void {
    button.title = this.isEditorMaximized() ? "Minimize editor" : "Maximize Editor"
  }

  protected isEditorMaximized(): boolean {
    return this.containerElement && this.containerElement.style.maxHeight !== "0px"
  }

  protected createBody(): void {
    const bodyDiv = document.createElement("div")
    bodyDiv.classList.add("layout-options-body")

    for (const [key, value] of Object.entries(this.layoutOptions)) {
      const option = this.createOption(key, value)
      bodyDiv.appendChild(option)
    }

    this.containerElement.appendChild(bodyDiv)
  }

  protected createOption(category: string, options: LDLayoutOptions[]): HTMLElement {
    const layoutOptionsList = document.createElement("div")
    layoutOptionsList.classList.add("layout-options-list")

    layoutOptionsList.innerHTML = `<h3>${category.toUpperCase()}</h3>`
    options.forEach(option => {
      const listItem = document.createElement("div")
      listItem.innerHTML = `
        <br>
        <strong>${option.name.toUpperCase()}</strong><text>  Default:</text><strong> ${option.default}</strong>
        <br>
        <strong>Value: </strong>
        <br>`

      const inputElement = this.createInputElement(option)
      listItem.appendChild(inputElement)

      layoutOptionsList.appendChild(listItem)
    })

    return layoutOptionsList
  }

  /**
   * This creates a changeable option, which can be altered by the user.
   */
  protected createInputElement(option: LDLayoutOptions): HTMLElement {
    const inputElement = document.createElement("input")
    inputElement.name = option.name

    switch (option.type) {
      case "boolean":
        inputElement.type = "checkbox"
        inputElement.checked = option.value === "true"
        inputElement.addEventListener("change", () => {
          option.value = inputElement.checked.toString()
        })
        break

      case "number":
        inputElement.type = "number"
        inputElement.value = option.value ?? option.default ?? ""
        inputElement.maxLength = 5
        inputElement.addEventListener("change", () => {
          option.value = inputElement.value
        })
        break

      case "string":
        inputElement.type = "text"
        inputElement.value = option.value ?? option.default ?? ""
        inputElement.maxLength = 20
        inputElement.addEventListener("change", () => {
          option.value = inputElement.value
        })
        break

      case "choice":
        const selectElement = document.createElement("select")
        option.choices?.forEach(choice => {
          const optionElement = document.createElement("option")
          optionElement.value = choice
          optionElement.text = choice
          optionElement.selected = option.value !== undefined ? choice === option.value : choice === option.default
          selectElement.appendChild(optionElement)
        })
        selectElement.addEventListener("change", () => {
          option.value = selectElement.value
        })

        this.optionToInputMap.set(option, selectElement)
        return selectElement
    }

    this.optionToInputMap.set(option, inputElement)
    return inputElement
  }

  /**
   * This resets the layout options to their default values.
   */
  protected resetDefaultLayoutOptions(): void {
    this.optionToInputMap.forEach((inputElement, option) => {
      option.value = option.default
      switch (option.type) {
        case "boolean":
          ;(inputElement as HTMLInputElement).checked = option.default === "true"
          break

        case "number":
        case "string":
          ;(inputElement as HTMLInputElement).value = option.default || ""
          break

        case "choice":
          ;(inputElement as HTMLSelectElement).value = option.default || ""
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  handle(action: Action): void | Action | ICommand {
    switch (action.kind) {
      case EnableLayoutOptionsAction.KIND:
        return this.makeLayoutOptionsVisible()
    }
  }

  protected makeLayoutOptionsVisible(): void {
    const requestAction = RequestContextActions.create({
      contextId: LayoutOptionsUI.ID,
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
                extensionId: LayoutOptionsUI.ID,
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
