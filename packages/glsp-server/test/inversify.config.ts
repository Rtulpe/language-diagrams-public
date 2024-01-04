import {
  ClientId,
  DefaultGModelSerializer,
  DiagramConfiguration,
  GModelFactory,
  GModelIndex,
  GModelSerializer,
  Logger,
  ModelState,
  RequestTypeHintsActionHandler,
} from "@eclipse-glsp/server-node"
import { Container } from "inversify"

import { RequestNodeValidationsActionHandler } from "../src/action-handlers/request-validations-handler"
import { UpdateElkLayoutOptionsActionHandler } from "../src/action-handlers/update-elk-layout-options-handler"
import { LDDiagramConfiguration } from "../src/diagram/ld-diagram-configuration"
import { LDGModelFactory } from "../src/model/ld-gmodel-factory"
import { LDModelIndex } from "../src/model/ld-model-index"
import { LDModelState } from "../src/model/ld-model-state"
import { LDStorage } from "../src/model/ld-storage"
import { ApplyNodeValidationsHandler } from "../src/operation-handlers/apply-node-validations-handler"
import { CreateAssociationHandler } from "../src/operation-handlers/create-association-handler"
import { CreateNodeHandler } from "../src/operation-handlers/create-node-handler"
import { DeleteElementHandler } from "../src/operation-handlers/delete-element-handler"
import { LDApplyLabelEditHandler } from "../src/operation-handlers/ld-apply-label-edit-handler"
import { LDChangeBoundsHandler } from "../src/operation-handlers/ld-change-bounds-handler"
import { LDLabelEditValidator } from "../src/operation-handlers/ld-label-edit-validator"

const container = new Container()
container.bind<LDModelState>(LDModelState).toSelf().inSingletonScope()
container.bind<ModelState>(ModelState).to(LDModelState).inSingletonScope()
container.bind<LDStorage>(LDStorage).toSelf().inSingletonScope()
container.bind<LDModelIndex>(LDModelIndex).toSelf().inSingletonScope()
container.bind<GModelIndex>(GModelIndex).to(LDModelIndex).inSingletonScope()
container.bind<GModelSerializer>(GModelSerializer).to(DefaultGModelSerializer).inSingletonScope()
container.bind<DiagramConfiguration>(DiagramConfiguration).to(LDDiagramConfiguration).inSingletonScope()
container.bind(ClientId).toConstantValue("test-client")
container.bind<GModelFactory>(GModelFactory).to(LDGModelFactory).inSingletonScope()
container.bind<RequestNodeValidationsActionHandler>(RequestNodeValidationsActionHandler).toSelf().inSingletonScope()
container.bind<ApplyNodeValidationsHandler>(ApplyNodeValidationsHandler).toSelf().inSingletonScope()
container.bind<CreateAssociationHandler>(CreateAssociationHandler).toSelf().inSingletonScope()
container.bind<CreateNodeHandler>(CreateNodeHandler).toSelf().inSingletonScope()
container.bind<DeleteElementHandler>(DeleteElementHandler).toSelf().inSingletonScope()
container.bind<LDApplyLabelEditHandler>(LDApplyLabelEditHandler).toSelf().inSingletonScope()
container.bind<LDChangeBoundsHandler>(LDChangeBoundsHandler).toSelf().inSingletonScope()
container.bind<LDLabelEditValidator>(LDLabelEditValidator).toSelf().inSingletonScope()
container.bind<UpdateElkLayoutOptionsActionHandler>(UpdateElkLayoutOptionsActionHandler).toSelf().inSingletonScope()
container.bind<RequestTypeHintsActionHandler>(RequestTypeHintsActionHandler).toSelf().inSingletonScope()
container.bind<LDDiagramConfiguration>(LDDiagramConfiguration).toSelf().inSingletonScope()
container.bind<Logger>(Logger).toSelf().inSingletonScope()
export { container as mainContainer }
