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
  ActionHandlerConstructor,
  DiagramConfiguration,
  GModelFactory,
  GModelIndex,
  InstanceMultiBinding,
  LabelEditValidator,
  ModelState,
  OperationHandlerConstructor,
  SourceModelStorage,
  ToolPaletteItemProvider,
} from "@eclipse-glsp/server-node"
import { ComputedBoundsActionHandler, DiagramModule } from "@eclipse-glsp/server-node"
import type { BindingTarget } from "@eclipse-glsp/server-node/lib/di/binding-target"
import { injectable } from "inversify"
import { RejectNodeValidationsAction, ReturnNodeValidationsAction } from "language-diagrams-protocol"

import { RequestNodeValidationsActionHandler } from "../action-handlers/request-validations-handler"
import { UpdateElkLayoutOptionsActionHandler } from "../action-handlers/update-elk-layout-options-handler"
import { LDToolPaletteItemProvider } from "../features/ld-tool-palette-provider"
import { LDGModelFactory } from "../model/ld-gmodel-factory"
import { LDModelIndex } from "../model/ld-model-index"
import { LDModelState } from "../model/ld-model-state"
import { LDStorage } from "../model/ld-storage"
import { ApplyNodeValidationsHandler } from "../operation-handlers/apply-node-validations-handler"
import { CreateAssociationHandler } from "../operation-handlers/create-association-handler"
import { CreateFieldBooleanHandler } from "../operation-handlers/create-field-boolean-handler"
import { CreateFieldNumberHandler } from "../operation-handlers/create-field-number-handler"
import { CreateFieldStringHandler } from "../operation-handlers/create-field-string-handler"
import { CreateNodeHandler } from "../operation-handlers/create-node-handler"
import { DeleteElementHandler } from "../operation-handlers/delete-element-handler"
import { LayoutOperationHandler } from "../operation-handlers/layout-operation-handler"
import { LDApplyLabelEditHandler } from "../operation-handlers/ld-apply-label-edit-handler"
import { LDChangeBoundsHandler } from "../operation-handlers/ld-change-bounds-handler"
import { LDLabelEditValidator } from "../operation-handlers/ld-label-edit-validator"
import { UndoOperationsHandler } from "../operation-handlers/undo-redo-handler"
import { LDDiagramConfiguration } from "./ld-diagram-configuration"

/**
 * The main configuration module for the language diagrams server.
 */
@injectable()
export class LDDiagramModule extends DiagramModule {
  readonly diagramType = "ld-diagram"

  protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
    return LDDiagramConfiguration
  }

  protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
    return LDStorage
  }

  protected bindModelState(): BindingTarget<ModelState> {
    this.context.bind(LDModelState).toSelf().inSingletonScope()
    return { service: LDModelState }
  }

  protected bindGModelFactory(): BindingTarget<GModelFactory> {
    return LDGModelFactory
  }

  protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
    super.configureActionHandlers(binding)
    binding.add(ComputedBoundsActionHandler)
    binding.add(RequestNodeValidationsActionHandler)
    binding.add(UpdateElkLayoutOptionsActionHandler)
  }

  protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
    super.configureOperationHandlers(binding)
    binding.add(CreateNodeHandler)
    binding.add(LDChangeBoundsHandler)
    binding.add(LDApplyLabelEditHandler)
    binding.add(DeleteElementHandler)
    binding.add(CreateAssociationHandler)
    binding.add(ApplyNodeValidationsHandler)
    // Fields
    binding.add(CreateFieldBooleanHandler)
    binding.add(CreateFieldStringHandler)
    binding.add(CreateFieldNumberHandler)
    // Undo/Redo
    binding.add(UndoOperationsHandler)
    // Layout
    binding.add(LayoutOperationHandler)
  }

  protected override configureClientActions(binding: InstanceMultiBinding<string>): void {
    super.configureClientActions(binding)
    binding.add(ReturnNodeValidationsAction.KIND)
    binding.add(RejectNodeValidationsAction.KIND)
  }

  protected override bindGModelIndex(): BindingTarget<GModelIndex> {
    this.context.bind(LDModelIndex).toSelf().inSingletonScope()
    return { service: LDModelIndex }
  }

  protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
    return LDLabelEditValidator
  }

  /**
   * Responsible for providing edges, nodes and fields in the tool palette.
   */
  protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> | undefined {
    return LDToolPaletteItemProvider
  }
}
