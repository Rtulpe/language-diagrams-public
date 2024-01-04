import { ManhattanEdgeRouter, SEdge } from "@eclipse-glsp/client"

/**
 * Sets routing kind to ManhattanEdgeRouter.
 * Default routing kind is PolylineEdgeRouter.
 */
export class LDEdge extends SEdge {
  override routerKind = ManhattanEdgeRouter.KIND

  override targetAnchorCorrection = Math.sqrt(5)
}
