import { injectable } from "inversify"
import { LDTypes } from "language-diagrams-protocol"
import * as uuid from "uuid"

import type { LDField } from "../model/ld-model"
import { CreateFieldHandler } from "./create-field-handler"

@injectable()
export class CreateFieldBooleanHandler extends CreateFieldHandler {
  readonly elementTypeIds = [LDTypes.FIELD_BOOLEAN]

  protected override createField(): LDField<boolean> {
    const fieldCounter = this.modelState.index.typeCount(LDTypes.FIELD_BOOLEAN)
    return {
      id: uuid.v4(),
      name: `BooleanField${fieldCounter}`,
      type: "boolean",
    }
  }

  get label(): string {
    return "Boolean"
  }
}
