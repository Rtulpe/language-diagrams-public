import type { AllLayoutOptions } from "./layout-options-structure"

/**
 * The default layout options for the ELK layout engine.
 * Also used as a reference for creating option GUI.
 * @see https://eclipse.dev/elk/reference.html
 */
export const defaultLayoutOptions: AllLayoutOptions = {
  graph: [
    {
      name: "elk.algorithm",
      type: "choice",
      default: "layered",
      choices: [
        "box",
        "disco",
        "force",
        "layered",
        "mrtree",
        "random",
        "rectpacking",
        "sporeCompaction",
        "sporeOverlap",
        "stress",
      ],
    },
    {
      name: "elk.direction",
      type: "choice",
      default: "RIGHT",
      choices: ["UNDEFINED", "RIGHT", "LEFT", "DOWN", "UP"],
    },
    {
      name: "elk.randomSeed",
      type: "number",
      default: "1",
    },
    {
      name: "elk.spacing.nodeNode",
      type: "number",
      default: "80",
    },
    {
      name: "elk.box.packingMode",
      type: "choice",
      default: "SIMPLE",
      choices: ["SIMPLE", "GROUP_DEC", "GROUP_MIXED", "GROUP_INC"],
    },
    {
      name: "spacing.componentComponent",
      type: "string",
      default: "20f",
    },
    {
      name: "elk.force.model",
      type: "choice",
      default: "FRUCHTERMAN_REINGOLD",
      choices: ["FRUCHTERMAN_REINGOLD", "EADES"],
    },
    {
      name: "elk.force.temperature",
      type: "number",
      default: "0.001",
    },
    {
      name: "elk.force.iterations",
      type: "number",
      default: "300",
    },
    {
      name: "elk.layered.nodePlacement.strategy",
      type: "choice",
      default: "BRANDES_KOEPF",
      choices: ["BRANDES_KOEPF", "LINEAR_SEGMENTS", "SIMPLE", "NETWORK_SIMPLEX"],
    },
    {
      name: "elk.processingOrder.spanningTreeCostFunction",
      type: "choice",
      default: "CIRCLE_UNDERLAP",
      choices: [
        "CENTER_DISTANCE",
        "CIRCLE_UNDERLAP",
        "RECTANGLE_UNDERLAP",
        "INVERTED_OVERLAP",
        "MINIMUM_ROOT_DISTANCE",
      ],
    },
    {
      name: "elk.stress.epsilon",
      type: "string",
      default: "10e-4",
    },
    {
      name: "elk.stress.desiredEdgeLength",
      type: "number",
      default: "100",
    },
  ],
}
