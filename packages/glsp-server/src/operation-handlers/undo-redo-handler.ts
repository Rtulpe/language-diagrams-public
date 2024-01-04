import type { Operation, OperationHandler } from "@eclipse-glsp/server-node"
import { Logger, type MaybePromise, UndoOperation } from "@eclipse-glsp/server-node"
import { inject, injectable } from "inversify"

/**
 * This class is a temporary placeholder for the undo/redo action handler.
 * The GLSP server package v2.0.0 is set to release in 30.08.2023.
 * This release will have native support for undo/redo actions.
 * @see https://projects.eclipse.org/projects/ecd.glsp/releases/2.0.0
 *
 * As the first release of this project will happen prior to the release of GLSP server v2.0.0,
 * this functionality will be omitted from the first release.
 */
@injectable()
export class UndoOperationsHandler implements OperationHandler {
  @inject(Logger)
  protected logger: Logger

  readonly operationType = UndoOperation.KIND

  execute(_operation: Operation): MaybePromise<void> {
    this.logger.error("Undo operation is not supported, until GLSP server v2.0.0 is released")
  }
}
