import type { Environment } from "monaco-editor/esm/vs/editor/editor.api.js"

interface MonacoEnvironmentEnhanced extends Environment {
  workerOverrideGlobals: WorkerOverrideGlobals
}

type WorkerOverrideGlobals = {
  basePath: string
  workerPath: string
  workerOptions: WorkerOptions
}

/**
 * Loads a web worker from the given path.
 * Used as a workaround, as Monaco wrapper does not work well,
 * with webpack bundle, which is used as VSCode script.
 */
export function loadWorker(workerPath: string): Promise<Worker> {
  return new Promise<Worker>((resolve, reject) => {
    fetch(workerPath)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        const worker = new Worker(blobUrl)
        resolve(worker)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function buildWorkerDefinition(basePath: string, workerName: string): void {
  const monWin = self as Window
  // Editor and langium worker names are set here!
  const workerPath = basePath + workerName
  const workerOverrideGlobals: WorkerOverrideGlobals = {
    basePath: basePath,
    workerPath,
    workerOptions: {
      type: "classic",
    },
  }

  // eslint-disable-next-line eqeqeq
  if (monWin.MonacoEnvironment == null) {
    monWin.MonacoEnvironment = {
      workerOverrideGlobals: workerOverrideGlobals,
      createTrustedTypesPolicy: (_policyName: string) => {
        return undefined
      },
    } as MonacoEnvironmentEnhanced
  }
  const monEnv = monWin.MonacoEnvironment as MonacoEnvironmentEnhanced
  monEnv.workerOverrideGlobals = workerOverrideGlobals

  monEnv.getWorker = () => loadWorker(workerPath)
}
