/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as path from "path"
import * as vscode from "vscode"
import type { LanguageClientOptions, ServerOptions } from "vscode-languageclient/node"
import { LanguageClient, TransportKind } from "vscode-languageclient/node"

let client: LanguageClient | undefined

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  const serverModule = context.asAbsolutePath(path.join("lib", "language", "main"))
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
  const debugOptions = {
    execArgv: ["--nolazy", `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${process.env.DEBUG_SOCKET || "6009"}`],
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
  }

  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/*.ldv")
  context.subscriptions.push(fileSystemWatcher)

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "ldv" }],
    synchronize: {
      // Notify the server about file changes to files contained in the workspace
      fileEvents: fileSystemWatcher,
    },
  }

  // Create the language client and start the client.
  client = new LanguageClient("ldv", "LDV", serverOptions, clientOptions)

  // Start the client. This will also launch the server
  client.start().catch(error => {
    console.error("LSP client cannot start", error)
  })
  return client
}

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
  client = startLanguageClient(context)
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
  if (client !== undefined) {
    return client.stop()
  }
  return undefined
}
