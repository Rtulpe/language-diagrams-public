import { EmptyFileSystem, startLanguageServer } from "langium"
import { BrowserMessageReader, BrowserMessageWriter, createConnection } from "vscode-languageserver/browser"

import { createLdvServices } from "./ldv-module"

/**
 * This file is the entry point for the language server when bundled with esbuild
 * and loaded to Monaco Editor
 */

declare const self: DedicatedWorkerGlobalScope

const messageReader = new BrowserMessageReader(self)
const messageWriter = new BrowserMessageWriter(self)

const connection = createConnection(messageReader, messageWriter)

const { shared } = createLdvServices({ connection, ...EmptyFileSystem })

startLanguageServer(shared)
