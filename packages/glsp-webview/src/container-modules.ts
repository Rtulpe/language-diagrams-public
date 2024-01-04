import {
  configureModelElement,
  ConsoleLogger,
  DefaultTypes,
  editLabelFeature,
  ExpandButtonView,
  ForeignObjectElement,
  ForeignObjectView,
  GIssueMarkerView,
  GLSPGraph,
  HtmlRoot,
  HtmlRootView,
  layoutableChildFeature,
  LogLevel,
  moveFeature,
  PreRenderedElement,
  PreRenderedView,
  SButton,
  selectFeature,
  SGraphView,
  ShapedPreRenderedElement,
  SIssueMarker,
  SLabel,
  SLabelView,
  SNode,
  SRoutingHandle,
  SRoutingHandleView,
  SvgViewportView,
  TYPES,
  ViewportRootElement,
} from "@eclipse-glsp/client"
import type { interfaces } from "inversify"
import { ContainerModule } from "inversify"
import { LDTypes } from "language-diagrams-protocol"

import editorApplicationModule from "./editor-application/di.config"
import editorContainerModule from "./editor-container/di.config"
import editorIndexerModule from "./editor-indexer/di.config"
import layoutOptionsModule from "./layout-options/di.config"
import { LDEdge } from "./model/model"
import { FieldView, LDEdgeView, LDNodeView } from "./views"

interface ContainerContext {
  bind: interfaces.Bind
  isBound: interfaces.IsBound
}

export function configureDefaultModelElements(context: ContainerContext): void {
  // HTML elements
  configureModelElement(context, DefaultTypes.HTML, HtmlRoot, HtmlRootView)

  // generic elements
  configureModelElement(context, DefaultTypes.FOREIGN_OBJECT, ForeignObjectElement, ForeignObjectView, {
    disable: [selectFeature, moveFeature],
  })
  configureModelElement(context, DefaultTypes.PRE_RENDERED, PreRenderedElement, PreRenderedView)
  configureModelElement(context, DefaultTypes.SHAPE_PRE_RENDERED, ShapedPreRenderedElement, PreRenderedView)

  // SVG elements
  configureModelElement(context, DefaultTypes.SVG, ViewportRootElement, SvgViewportView)

  // graph elements
  configureModelElement(context, DefaultTypes.GRAPH, GLSPGraph, SGraphView)
  configureModelElement(context, DefaultTypes.NODE, SNode, LDNodeView)
  configureModelElement(context, DefaultTypes.EDGE, LDEdge, LDEdgeView)
  configureModelElement(context, DefaultTypes.ROUTING_POINT, SRoutingHandle, SRoutingHandleView)
  configureModelElement(context, DefaultTypes.VOLATILE_ROUTING_POINT, SRoutingHandle, SRoutingHandleView)
  configureModelElement(context, DefaultTypes.LABEL, SLabel, SLabelView, { enable: [editLabelFeature] })
  configureModelElement(context, LDTypes.FIELD_BOOLEAN, SNode, FieldView, { enable: [layoutableChildFeature] })
  configureModelElement(context, LDTypes.FIELD_NUMBER, SNode, FieldView, { enable: [layoutableChildFeature] })
  configureModelElement(context, LDTypes.FIELD_STRING, SNode, FieldView, { enable: [layoutableChildFeature] })
  configureModelElement(context, LDTypes.LABEL_FIELD, SLabel, SLabelView, { enable: [editLabelFeature] })
  configureModelElement(context, LDTypes.LABEL_ASSOCIATION, SLabel, SLabelView, { enable: [editLabelFeature] })
  configureModelElement(context, LDTypes.LABEL_TYPE, SLabel, SLabelView)

  // UI elements
  configureModelElement(context, DefaultTypes.BUTTON_EXPAND, SButton, ExpandButtonView)
  configureModelElement(context, DefaultTypes.ISSUE_MARKER, SIssueMarker, GIssueMarkerView)
}

const LDDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope()
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn)
  const context = { bind, unbind, isBound, rebind }
  configureDefaultModelElements(context)
})

export const LD_MODULES = [
  LDDiagramModule,
  editorContainerModule,
  editorApplicationModule,
  editorIndexerModule,
  layoutOptionsModule,
]
