import type { LayoutOptions as ElkLayoutOptions } from "@eclipse-glsp/layout-elk"

/**
 * The layout options for the ELK layout engine.
 * @see https://www.eclipse.org/elk/reference/options.html
 */
export interface LDLayoutOptions {
  readonly name: string
  readonly type: LDLayoutTypes
  value?: string
  readonly default: string | undefined
  readonly choices?: string[]
}

export type LDLayoutTypes = "boolean" | "number" | "choice" | "string"

export namespace LayoutOptionUtils {
  /**
   * Convert LDLayoutOptions to ELK layout options.
   * @param options Layout options with extra context
   * @returns options mapped as key-value pairs
   */
  export function asLayoutOptions(options: LDLayoutOptions[]): ElkLayoutOptions {
    const result: ElkLayoutOptions = {}
    for (const option of options) {
      const value = option.value ?? option.default
      if (value !== undefined) result[option.name] = value.toString()
    }
    return result
  }
}

export type AllLayoutOptions = {
  graph: LDLayoutOptions[]
  node?: LDLayoutOptions[]
  port?: LDLayoutOptions[]
  edge?: LDLayoutOptions[]
  label?: LDLayoutOptions[]
}
