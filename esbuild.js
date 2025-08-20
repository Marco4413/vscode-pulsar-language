const esbuild = require("esbuild");

(async () => {
    const isProduction = process.argv.includes("--production");
    const doWatch = process.argv.includes("--watch");

    const ctx = await esbuild.context({
        entryPoints: [ "src/extension.js" ],
        bundle: true,
        format: "cjs",
        minify: isProduction,
        sourcemap: !isProduction,
        sourcesContent: false,
        platform: "node",
        outdir: "dist",
        external: [ "vscode" ],
        logLevel: "warning",
    });

    if (doWatch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
