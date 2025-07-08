const fs = require("node:fs")
const path = require("node:path")
const vscode = require("vscode");

const {
    LanguageClient,
    TransportKind,
    Trace
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

/**
 * Returns the interpreter include path specified by the user.
 * The returned path may be empty if an error occurred.
 * Moreover, it is not required that the returned path exists.
 * @returns string
 */
function GetInterpreterIncludePath() {
    const config = vscode.workspace.getConfiguration(EXTENSION_ID);
    const interpreterIncludePath = config.get("lsp.interpreterIncludePath");
    if (path.isAbsolute(interpreterIncludePath)) return interpreterIncludePath;
    // NOTE: This does not work for some reason: vscode.workspace.asRelativePath(interpreterIncludePath, true)
    //       If what is stated in the docs is true it should work...
    if (!vscode.workspace.workspaceFolders) return "";
    for (const workspace of vscode.workspace.workspaceFolders) {
        if (workspace.uri.scheme !== "file") continue;
        const absoluteInterpreterIncludePath = path.resolve(workspace.uri.fsPath, interpreterIncludePath);
        // Return the first existing path relative to an active workspace
        if (fs.existsSync(absoluteInterpreterIncludePath)) return absoluteInterpreterIncludePath;
    }
    // interpreterIncludePath cannot be returned because it would be relative to the extension's folder
    return "";
}

function GetInitializationOptions() {
    const config = vscode.workspace.getConfiguration(`${EXTENSION_ID}.lsp`);
    return config.get("options");
}

function IsRunning() {
    return g_Client && g_Client.isRunning();
}

function StopLSP() {
    if (g_Client) {
        g_Client.stop();
        g_Client = undefined;
    }
}

function StartLSP(verbose=false) {
    StopLSP();

    const lspPath = GetLSPExecutablePath();
    if (!lspPath) return;

    /** @type {import("vscode-languageclient/node").ServerOptions} */
    const serverOptions = {
        run: { command: lspPath, transport: TransportKind.stdio },
        debug: { command: lspPath, transport: TransportKind.stdio },
    };

    const initOptions = GetInitializationOptions();
    const interpreterIncludePath = GetInterpreterIncludePath();
    if (interpreterIncludePath.length > 0 && fs.existsSync(interpreterIncludePath)) {
        initOptions.includePaths = initOptions.includePaths ?? [];
        initOptions.includePaths.push(interpreterIncludePath);
    }

    /** @type {import("vscode-languageclient").LanguageClientOptions} */
    const clientOptions = {
        outputChannel: g_LSPOutputChannel,
        traceOutputChannel: g_LSPOutputChannel,
        initializationOptions: initOptions,
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

    g_Client.start().then(() => {
        g_Client.setTrace(verbose ? Trace.Verbose : Trace.Messages);
    });
}

/** @param {import("vscode").ExtensionContext} context */
module.exports.activate = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(`${EXTENSION_ID}.lsp.start`,        () => StartLSP()),
        vscode.commands.registerCommand(`${EXTENSION_ID}.lsp.startVerbose`, () => StartLSP(true)),
        vscode.commands.registerCommand(`${EXTENSION_ID}.lsp.stop`,         () => StopLSP()),
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(`${EXTENSION_ID}.lsp`) && IsRunning()) {
                StartLSP(); // Restart LSP
            }
        })
    );

    g_LSPOutputChannel = vscode.window.createOutputChannel("Pulsar Language Server");
    StartLSP();
}

module.exports.deactivate = () => {
    StopLSP();
}