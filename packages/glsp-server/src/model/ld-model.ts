/* eslint-disable @typescript-eslint/no-use-before-define */
import { AnyObject, hasArrayProp, hasObjectProp, hasStringProp } from "@eclipse-glsp/server-node"
import { LDTypes } from "language-diagrams-protocol"

/**
 * Model entry point.
 */
export interface LDFile {
  id: string
  nodes: LDNode[]
  associations: LDAssociation[]
}

export namespace LDFile {
  export function is(object: unknown): object is LDFile {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasArrayProp(object, "nodes") &&
      hasArrayProp(object, "associations")
    )
  }

  export function deleteElement(file: LDFile, element: LDElement): void {
    if (LDNode.is(element)) {
      file.nodes = file.nodes.filter(node => node.id !== element.id)
    } else if (LDAssociation.is(element)) {
      file.associations = file.associations.filter(assoc => assoc.id !== element.id)
    } else {
      file.nodes.forEach(node => {
        node.fields = node.fields.filter(field => field.id !== element.id)
      })
    }
  }
}

// Elements

export interface LDElement {
  id: string
  name: string
}

export interface LDNode extends LDElement {
  fields: Array<LDFieldType>
  validations: string[]
  position: { x: number; y: number }
}

export namespace LDNode {
  export function is(object: unknown): object is LDNode {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasStringProp(object, "name") &&
      hasArrayProp(object, "fields") &&
      hasArrayProp(object, "validations") &&
      hasObjectProp(object, "position")
    )
  }
}

export interface LDAssociation extends LDElement {
  source_id: string
  target_id: string
}

export namespace LDAssociation {
  export function is(object: unknown): object is LDAssociation {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasStringProp(object, "name") &&
      hasStringProp(object, "source_id") &&
      hasStringProp(object, "target_id")
    )
  }
}

export type LDFieldType = LDField<number> | LDField<string> | LDField<boolean>

export interface LDField<T extends string | number | boolean> extends LDElement {
  type: T extends string ? "string" : T extends number ? "number" : "boolean"
}

export namespace LDField {
  export function is(object: unknown): object is LDField<string | number | boolean> {
    return (
      AnyObject.is(object) &&
      hasStringProp(object, "id") &&
      hasStringProp(object, "name") &&
      hasObjectProp(object, "value")
    )
  }

  export function getType(field: LDFieldType): string {
    switch (field.type) {
      case "string":
        return LDTypes.FIELD_STRING
      case "number":
        return LDTypes.FIELD_NUMBER
      case "boolean":
        return LDTypes.FIELD_BOOLEAN
    }
  }
}
