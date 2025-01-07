# Pulsar Language Extension

Adds Pulsar Language support for VSCode.

Syntax highlighting and LSP are supported.

## What's Pulsar?

Pulsar is a *stack-based* *dynamically-typed* *interpreted* scripting language written in C++.

It's open source on GitHub at [Marco4413/Pulsar](https://github.com/Marco4413/Pulsar).

## How do I install this extension?

Until I decide to release a pre-built version, you must package it yourself:

Install any dependency:

`$ npm install`

Install VSCE:

`$ npm install -g @vscode/vsce`

Package the extension:

`$ npx vsce package`

Install the extension to VSCode through the newly generated `.vsix` file.

### Enabling the Language Server

You should set `pulsarLanguage.lsp.path` to point to a valid `pulsar-lsp` executable.

## Screenshots

![](preview.png)
