# Pulsar Language Extension

Adds Pulsar Language support for VSCode.

Syntax highlighting, LSP and the Debugger are supported.

**Both the LSP and Debugger are not bundled with the extension.
They need to be downloaded from the GitHub repository of
[Pulsar](https://github.com/Marco4413/Pulsar).**

## What's Pulsar?

Pulsar is a *stack-based* *dynamically-typed* *interpreted* scripting language written in C++.

It's open source on GitHub at [Marco4413/Pulsar](https://github.com/Marco4413/Pulsar).

## How do I install this extension?

### GitHub Actions

You can go to the [GitHub Actions](https://github.com/Marco4413/vscode-pulsar-language/actions)
page of the extension and download the artifact produced by the latest commit.

### Manual Package

```sh
# vsce is required to package VSCode extensions.
$ npm install -g @vscode/vsce
# Install all npm dependencies.
$ npm install
# The npm package script will bundle the extension's
#  source code into a single JavaScript file using
#  esbuild and package the extension with vsce.
$ npm run package
```

Install the extension to VSCode through the newly generated `.vsix` file.

### Enabling the Language Server

Set the `pulsarLanguage.lsp.path` setting to point to a valid `pulsar-lsp` executable.

### Enabling the Debugger

Set the `pulsarLanguage.debugger.path` setting to point to a valid `pulsar-debugger` executable.

## Screenshots

![](preview.png)
