/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/** @jsx svg */

import type {
  Hoverable,
  IViewArgs,
  Point,
  RenderingContext,
  RoundedCornerWrapper,
  SEdge,
  Selectable,
  SShapeElement,
} from "@eclipse-glsp/client"
import { GEdgeView, RectangularNodeView, RoundedCornerNodeView, SNode, svg, toDegrees } from "@eclipse-glsp/client"
import { injectable } from "inversify"
import type { VNode } from "snabbdom"

/**
 * Node view, with custom css classes
 */
@injectable()
export class LDNodeView extends RoundedCornerNodeView {
  protected override renderPathNode(wrapper: Readonly<RoundedCornerWrapper>, context: RenderingContext): VNode {
    return (
      <path
        d={this.renderPath(wrapper, context, 0)}
        class-node={wrapper.element instanceof SNode}
        class-mouseover={wrapper.element.hoverFeedback}
        class-selected={wrapper.element.selected}
        {...this.additionalClasses(wrapper.element, context)}
      />
    )
  }
}

/**
 * Field view, with custom css classes
 */
@injectable()
export class FieldView extends RectangularNodeView {
  override render(
    node: Readonly<SShapeElement & Hoverable & Selectable>,
    context: RenderingContext,
    _args?: IViewArgs
  ): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined
    }

    return (
      <g class-field class-mouseover={node.hoverFeedback} class-selected={node.selected}>
        <rect x="0" y="0" width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}></rect>
        {context.renderChildren(node)}
      </g>
    )
  }
}

/**
 * Edge (Association) view, with arrow
 */
@injectable()
export class LDEdgeView extends GEdgeView {
  protected override renderAdditionals(_edge: SEdge, segments: Point[], _context: RenderingContext): VNode[] {
    const p1 = segments[segments.length - 2]
    const p2 = segments[segments.length - 1]
    return [
      <path
        class-sprotty-edge-arrow={true}
        d="M 6,-3 L 0,0 L 6,3 Z"
        transform={`rotate(${this.angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
      />,
    ]
  }

  angle(x0: Point, x1: Point): number {
    return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x))
  }
}
