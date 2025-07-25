const { EXTENSION_ID } = require("../constants");
const vscode = require("vscode");

function GetDebuggerExecutablePath() {
    const config = vscode.workspace.getConfiguration(EXTENSION_ID);
    const execPath = config.get("debugger.path");
    return execPath;
}

/** @param {import("vscode").ExtensionContext} context */
module.exports.activate = (context) => {
    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory("pulsar", {
            /** @returns {vscode.DebugAdapterDescriptor|undefined} */
            createDebugAdapterDescriptor: (session) => {
                const debuggerPath = GetDebuggerExecutablePath();
                if (!debuggerPath) return undefined;
                return new vscode.DebugAdapterExecutable(debuggerPath, undefined, { cwd: session.workspaceFolder.uri.fsPath });
            }
        })
    );
}

module.exports.deactivate = () => {}
