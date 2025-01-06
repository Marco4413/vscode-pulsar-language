const vscode = require("vscode");

const {
    LanguageClient,
    TransportKind
} = require("vscode-languageclient/node");

const EXTENSION_ID = "pulsarLanguage";

let g_LSPOutputChannel;
/** @type {LanguageClient} */
let g_Client;

function GetLSPExecutablePath() {
    const config = vscode.workspace.getConfiguration(EXTENSION_ID);
    const execPath = config.get("lsp.path");
    return execPath;
}

function GetInitializationOptions() {
    const config = vscode.workspace.getConfiguration(`${EXTENSION_ID}.lsp`);
    return config.get("options");
}

function StopLSP() {
    if (g_Client) {
        g_Client.stop();
        g_Client = undefined;
    }
}

function StartLSP() {
    StopLSP();

    const lspPath = GetLSPExecutablePath();
    if (!lspPath) return;

    /** @type {import("vscode-languageclient/node").ServerOptions} */
    const serverOptions = {
        run: { command: lspPath, transport: TransportKind.stdio },
        debug: { command: lspPath, transport: TransportKind.stdio },
    };

    /** @type {import("vscode-languageclient").LanguageClientOptions} */
    const clientOptions = {
        outputChannel: g_LSPOutputChannel,
        initializationOptions: GetInitializationOptions(),
        documentSelector: [{ scheme: "file", language: "pulsar" }],
        diagnosticPullOptions: { onSave: true },
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher("**/*.pls")
        }
    };

    g_Client = new LanguageClient(
        "PulsarLSP",
        "Pulsar LSP",
        serverOptions,
        clientOptions
    );

    g_Client.start();
}

/** @param {import("vscode").ExtensionContext} context */
module.exports.activate = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(`${EXTENSION_ID}.lsp.start`, () => StartLSP()),
        vscode.commands.registerCommand(`${EXTENSION_ID}.lsp.stop`,  () => StopLSP())
    );

    g_LSPOutputChannel = vscode.window.createOutputChannel("Pulsar Language Server");
    StartLSP();
}

module.exports.deactivate = () => {
    StopLSP();
}