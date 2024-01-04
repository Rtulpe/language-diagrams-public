/**
 * These data structures are passed from GLSP client to Langium
 * and used to provide diagram context information to the language server.
 */

export const GLSP_CONTEXT_NOTIFICATION = "glsp/context"

export type FieldContext = Map<string, string[]>

export type NodeContext = {
  asSource: string[]
  asTarget: string[]
  fields: FieldContext
}

export type NodeMap = Map<string, NodeContext>

export type GlspContextParams = {
  currentNode: string
  nodes: NodeMap
}
