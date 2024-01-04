import { injectable } from "inversify"
import { LDTypes } from "language-diagrams-protocol"
import * as uuid from "uuid"

import type { LDField } from "../model/ld-model"
import { CreateFieldHandler } from "./create-field-handler"

@injectable()
export class CreateFieldNumberHandler extends CreateFieldHandler {
  readonly elementTypeIds = [LDTypes.FIELD_NUMBER]

  protected override createField(): LDField<number> {
    const fieldCounter = this.modelState.index.typeCount(LDTypes.FIELD_NUMBER)
    return {
      id: uuid.v4(),
      name: `NumberField${fieldCounter}`,
      type: "number",
    }
  }

  get label(): string {
    return "Number"
  }
}
