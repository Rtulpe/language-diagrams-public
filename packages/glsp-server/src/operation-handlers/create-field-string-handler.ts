import { injectable } from "inversify"
import { LDTypes } from "language-diagrams-protocol"
import * as uuid from "uuid"

import type { LDField } from "../model/ld-model"
import { CreateFieldHandler } from "./create-field-handler"

@injectable()
export class CreateFieldStringHandler extends CreateFieldHandler {
  readonly elementTypeIds = [LDTypes.FIELD_STRING]

  protected override createField(): LDField<string> {
    const fieldCounter = this.modelState.index.typeCount(LDTypes.FIELD_STRING)
    return {
      id: uuid.v4(),
      name: `StringField${fieldCounter}`,
      type: "string",
    }
  }

  get label(): string {
    return "String"
  }
}
