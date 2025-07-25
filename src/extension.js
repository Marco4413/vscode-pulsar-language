const dap = require("./debugger/client");
const lsp = require("./lsp/client");

/** @param {import("vscode").ExtensionContext} context */
module.exports.activate = (context) => {
    dap.activate(context);
    lsp.activate(context);
}

module.exports.deactivate = () => {
    lsp.deactivate();
    dap.deactivate();
}